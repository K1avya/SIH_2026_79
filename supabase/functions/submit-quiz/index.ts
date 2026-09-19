// ==============================================================================
// QUANTIFY — Supabase Edge Function: submit-quiz
// ==============================================================================
// Evaluates checkpoint quiz submissions server-side with zero client trust.
// Grades answers against canonical options in public.quiz_questions,
// inserts an attempt into public.quiz_attempts, updates profiles.quizAverage,
// and marks the topic completed with recalculated overall progress if passed.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SubmitQuizPayload {
  userId?: string
  topicId: string
  answers: Record<string, string | number> // questionId -> optionId or optionIndex
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Parse payload
    const body: SubmitQuizPayload = await req.json().catch(() => ({} as any))
    const { topicId, answers } = body
    let userId = body.userId

    // If userId not provided in body, extract from Authorization Bearer token
    if (!userId) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user?.id) userId = user.id
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in payload or valid Authorization token.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!topicId) {
      return new Response(
        JSON.stringify({ error: 'Missing topicId in payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!answers || typeof answers !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid answers object (expected Record<questionId, optionId>).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Fetch quiz questions for this topic server-side (with fallback to default)
    let { data: questions, error: fetchErr } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('topicId', topicId)

    if (!questions || questions.length === 0) {
      // Fallback to default questions if specific topic quiz isn't seeded separately
      const fallback = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('topicId', 'default')
      questions = fallback.data || []
    }

    if (!questions || questions.length === 0) {
      throw new Error(`No quiz questions found for topic '${topicId}'.`)
    }

    // 3. Grade answers server-side
    let correctCount = 0
    const totalQuestions = questions.length

    for (const q of questions) {
      const options: any[] = Array.isArray(q.options) ? q.options : []
      const correctOptionIndex = options.findIndex((opt) => opt && opt.isCorrect === true)
      const correctOption = options[correctOptionIndex]
      const correctOptionId = correctOption?.id ? String(correctOption.id).toLowerCase() : null

      const userAnswer = answers[q.id] ?? answers[String(q.id)]

      if (userAnswer !== undefined && userAnswer !== null) {
        // Match by option id (e.g. 'opt-1') or option numeric index (e.g. 1 or 2)
        const userStr = String(userAnswer).toLowerCase()
        const isMatchById = correctOptionId && userStr === correctOptionId
        const isMatchByIndex =
          correctOptionIndex >= 0 &&
          (userAnswer === correctOptionIndex || userStr === String(correctOptionIndex))

        if (isMatchById || isMatchByIndex) {
          correctCount += 1
        }
      }
    }

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const passed = scorePercent >= 70 // Passing benchmark is 70%

    // 4. Insert attempt into public.quiz_attempts
    const attemptId = crypto.randomUUID()
    const now = new Date()

    const { error: insertAttemptErr } = await supabase
      .from('quiz_attempts')
      .insert({
        id: attemptId,
        user_id: userId,
        topicId: topicId,
        scorePercent: scorePercent,
        totalQuestions: totalQuestions,
        correctCount: correctCount,
        answers: answers,
        created_at: now.toISOString(),
      })

    if (insertAttemptErr) {
      console.error('Warning: Failed to insert quiz_attempts row:', insertAttemptErr.message)
    }

    // 5. Recalculate User's cumulative quiz average across all attempts
    const { data: userAttempts } = await supabase
      .from('quiz_attempts')
      .select('scorePercent')
      .eq('user_id', userId)

    let newQuizAverage = scorePercent
    if (userAttempts && userAttempts.length > 0) {
      const totalScoreSum = userAttempts.reduce((acc: number, curr: any) => acc + Number(curr.scorePercent || 0), 0)
      newQuizAverage = Math.round((totalScoreSum / userAttempts.length) * 100) / 100
    }

    // 6. Fetch user profile to update completedTopics and overallProgress if passed
    const { data: profile } = await supabase
      .from('profiles')
      .select('"completedTopics", "overallProgress"')
      .eq('id', userId)
      .maybeSingle()

    let updatedCompletedTopics = profile?.completedTopics || []
    let newProgress = profile?.overallProgress || 0

    if (passed && topicId !== 'default') {
      if (!updatedCompletedTopics.includes(topicId)) {
        updatedCompletedTopics = [...updatedCompletedTopics, topicId]
      }

      // Count total available curriculum topics
      const { count: totalTopicsCount } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true })

      const maxTopics = totalTopicsCount && totalTopicsCount > 0 ? totalTopicsCount : 12
      newProgress = Math.min(100, Math.round((updatedCompletedTopics.length / maxTopics) * 100))
    }

    // 7. Update profiles table
    const profileUpdates: any = {
      quizAverage: newQuizAverage,
      updated_at: now.toISOString(),
    }

    if (passed) {
      profileUpdates.completedTopics = updatedCompletedTopics
      profileUpdates.overallProgress = newProgress
    }

    const { error: updateProfileErr } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)

    if (updateProfileErr) {
      console.error('Warning: Failed to update profile with quiz completion:', updateProfileErr.message)
    }

    // 8. Return response
    return new Response(
      JSON.stringify({
        attemptId,
        topicId,
        scorePercent,
        correctCount,
        totalQuestions,
        passed,
        newQuizAverage,
        newOverallProgress: newProgress,
        completedTopics: updatedCompletedTopics,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('submit-quiz error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to grade and submit quiz.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
