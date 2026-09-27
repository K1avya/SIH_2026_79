// ==============================================================================
// QUANTIFY — Supabase Edge Function: submit-assessment
// ==============================================================================
// Evaluates diagnostic assessment submissions server-side with zero client trust.
// Computes category scores, assigns proficiency tier, logs attempt history,
// and updates the learner's profile with weak and strong focus areas.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

// Standard CORS headers for cross-origin frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// 5 core quantum computing curriculum categories
export type AssessmentCategory =
  | 'basics'
  | 'qubits'
  | 'gates'
  | 'circuits'
  | 'algorithms'

export type UserLevel = 'beginner' | 'intermediate' | 'advanced'

export interface CategoryScore {
  category: AssessmentCategory
  categoryName: string
  score: number     // 0, 1, or 2
  total: number     // Total questions evaluated in this category
  isWeak: boolean   // 0 correct (0/2 requires revision)
  isStrong: boolean // All correct (2/2 mastery demonstrated)
}

export interface AssessmentAttempt {
  id: string
  timestamp: string
  totalScore: number
  levelAssigned: UserLevel
  categoryScores: CategoryScore[]
  answers: Record<string, string> // questionId -> optionId
}

interface SubmitAssessmentPayload {
  userId?: string
  answers: Record<string, string>
}

// Map database category strings to standardized category slugs and human labels
function normalizeCategory(cat: string): { slug: AssessmentCategory; name: string } {
  const lower = (cat || '').toLowerCase()
  if (lower.includes('basic')) {
    return { slug: 'basics', name: 'Basics' }
  }
  if (lower.includes('qubit') || lower.includes('superposition')) {
    return { slug: 'qubits', name: 'Qubits & Superposition' }
  }
  if (lower.includes('gate')) {
    return { slug: 'gates', name: 'Quantum Gates' }
  }
  if (lower.includes('circuit')) {
    return { slug: 'circuits', name: 'Circuit Design' }
  }
  if (lower.includes('algorithm')) {
    return { slug: 'algorithms', name: 'Quantum Algorithms' }
  }
  return { slug: 'basics', name: 'Basics' }
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Validate HTTP method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are missing.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 4. Parse payload
    const body: SubmitAssessmentPayload = await req.json().catch(() => ({} as any))
    const { answers } = body
    let userId = body.userId

    // If userId not provided in body, extract from Authorization Bearer token
    if (!userId) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user?.id) {
          userId = user.id
        }
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in payload or valid Authorization token.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "answers" map (expected Record<questionId, optionId>).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Fetch all diagnostic questions server-side (Zero Trust)
    const { data: allQuestions, error: fetchQuestionsErr } = await supabase
      .from('assessment_questions')
      .select('*')
      .order('sequenceOrder', { ascending: true })

    if (fetchQuestionsErr || !allQuestions || allQuestions.length === 0) {
      throw new Error(`Failed to load assessment questions from database: ${fetchQuestionsErr?.message || 'No questions found'}`)
    }

    // Filter questions to only those corresponding to the active assessment attempt
    const answeredKeys = new Set(Object.keys(answers).map((k) => String(k).toLowerCase()))
    let questionsToGrade = allQuestions.filter((q) => answeredKeys.has(String(q.id).toLowerCase()))

    // If answers map couldn't match IDs directly, fallback to all questions
    if (questionsToGrade.length === 0) {
      questionsToGrade = allQuestions
    }

    // 6. Grade each question server-side
    // Questions have options stored as JSONB array: [{ id: "a", text: "...", isCorrect: boolean }]
    const categoryTracking: Record<
      AssessmentCategory,
      { categoryName: string; score: number; total: number }
    > = {
      basics: { categoryName: 'Basics', score: 0, total: 0 },
      qubits: { categoryName: 'Qubits & Superposition', score: 0, total: 0 },
      gates: { categoryName: 'Quantum Gates', score: 0, total: 0 },
      circuits: { categoryName: 'Circuit Design', score: 0, total: 0 },
      algorithms: { categoryName: 'Quantum Algorithms', score: 0, total: 0 },
    }

    let totalScore = 0

    for (const q of questionsToGrade) {
      const { slug: catSlug, name: catName } = normalizeCategory(q.category)
      
      categoryTracking[catSlug].categoryName = catName
      categoryTracking[catSlug].total += 1

      // Find the server-verified correct option ID
      const correctOption = Array.isArray(q.options)
        ? q.options.find((opt: any) => opt && opt.isCorrect === true)
        : null
      const correctOptionId = correctOption?.id ? String(correctOption.id).toLowerCase() : null

      // Check the user's submitted answer (supporting both raw and stringified question id)
      const rawUserAnswer = answers[q.id] ?? answers[String(q.id)]
      const userAnswerId = rawUserAnswer ? String(rawUserAnswer).toLowerCase() : null

      if (correctOptionId && userAnswerId && correctOptionId === userAnswerId) {
        totalScore += 1
        categoryTracking[catSlug].score += 1
      }
    }

    // 7. Format CategoryScore[] array
    const categoryScores: CategoryScore[] = (Object.keys(categoryTracking) as AssessmentCategory[]).map(
      (catSlug) => {
        const item = categoryTracking[catSlug]
        const score = item.score
        const total = item.total
        return {
          category: catSlug,
          categoryName: item.categoryName,
          score,
          total,
          isWeak: score === 0,
          isStrong: score === total && total > 0,
        }
      }
    )

    // 8. Determine assigned level based on admin settings (with default thresholds 3 / 7)
    let beginnerMax = 3
    let intermediateMax = 7

    const { data: settings } = await supabase
      .from('platform_settings')
      .select('"beginnerMax", "intermediateMax"')
      .eq('id', 'default')
      .maybeSingle()

    if (settings) {
      if (typeof settings.beginnerMax === 'number') beginnerMax = settings.beginnerMax
      if (typeof settings.intermediateMax === 'number') intermediateMax = settings.intermediateMax
    }

    let levelAssigned: UserLevel = 'beginner'
    if (totalScore > intermediateMax) {
      levelAssigned = 'advanced'
    } else if (totalScore > beginnerMax) {
      levelAssigned = 'intermediate'
    } else {
      levelAssigned = 'beginner'
    }

    // Extract weak & strong topic names for curriculum path personalization
    const weakTopics = categoryScores.filter((c) => c.isWeak).map((c) => c.categoryName)
    const strongTopics = categoryScores.filter((c) => c.isStrong).map((c) => c.categoryName)

    // 9. Insert attempt history into public.assessment_attempts
    const attemptId = crypto.randomUUID()
    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 16)

    const { error: insertAttemptErr } = await supabase
      .from('assessment_attempts')
      .insert({
        id: attemptId,
        user_id: userId,
        timestamp: timestampStr,
        totalScore,
        levelAssigned,
        categoryScores,
        answers,
        created_at: now.toISOString(),
      })

    if (insertAttemptErr) {
      console.error('Warning: Failed to insert assessment_attempt row:', insertAttemptErr.message)
    }

    // 10. Update public.profiles with new level, focus areas, and completion status
    const { error: updateProfileErr } = await supabase
      .from('profiles')
      .update({
        level: levelAssigned,
        weakTopics,
        strongTopics,
        assessmentCompleted: true,
        updated_at: now.toISOString(),
      })
      .eq('id', userId)

    if (updateProfileErr) {
      console.error('Warning: Failed to update user profile:', updateProfileErr.message)
    }

    // 11. Construct response object strictly matching AssessmentAttempt type
    const responsePayload: AssessmentAttempt = {
      id: attemptId,
      timestamp: timestampStr,
      totalScore,
      levelAssigned,
      categoryScores,
      answers,
    }

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Submit assessment error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error while processing assessment.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
