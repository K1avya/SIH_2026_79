// ==============================================================================
// QUANTIFY — Supabase Edge Function: get-learning-path
// ==============================================================================
// Computes and returns the personalized LearningPathItem[] for a learner.
// Determines topic status (locked, available, in_progress, completed) based on:
// 1. User's assessment assigned level (beginner, intermediate, advanced)
// 2. Sequence order of curriculum modules
// 3. User's completed topics list
// 4. Diagnostic weak area priority boosting
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export type TopicStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface Topic {
  id: string
  category: string
  name: string
  level: string
  sequenceOrder: number
  description: string
  theoryContent: string
  videoUrl: string
  videoDuration: string
  notesUrl: string
  practiceQuestionsCount: number
  keyFormulas: string[]
}

export interface LearningPathItem {
  id: string
  topicId: string
  topic: Topic
  status: TopicStatus
  sequenceOrder: number
  isWeakPriority: boolean
}

// Convert proficiency tier to numeric rank for comparison
function levelRank(level: string): number {
  const l = (level || '').toLowerCase()
  if (l === 'advanced') return 3
  if (l === 'intermediate') return 2
  return 1 // beginner default
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Extract userId from query string, body, or Bearer token
    const url = new URL(req.url)
    let userId = url.searchParams.get('userId')

    if (!userId && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      userId = body.userId
    }

    if (!userId) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user?.id) userId = user.id
      }
    }

    // 2. Fetch User Profile
    let userLevel = 'beginner'
    let completedTopics: string[] = []
    let weakTopics: string[] = []

    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('level, "completedTopics", "weakTopics"')
        .eq('id', userId)
        .maybeSingle()

      if (profile) {
        userLevel = profile.level || 'beginner'
        completedTopics = profile.completedTopics || []
        weakTopics = profile.weakTopics || []
      }
    }

    // 3. Fetch all curriculum topics ordered by sequenceOrder
    const { data: topics, error: topicsErr } = await supabase
      .from('topics')
      .select('*')
      .order('sequenceOrder', { ascending: true })

    if (topicsErr || !topics || topics.length === 0) {
      throw new Error(`Failed to load curriculum topics: ${topicsErr?.message || 'No topics'}`)
    }

    const userTier = levelRank(userLevel)
    let foundActiveTopic = false

    // Normalize user's weak topics to lowercase for flexible matching
    const weakKeywords = weakTopics.map((w) => w.toLowerCase())

    // 4. Compute status and priority for each topic
    const pathItems: LearningPathItem[] = topics.map((t: any, index: number) => {
      const isCompleted = completedTopics.includes(t.id)
      const topicTier = levelRank(t.level)

      // Check if topic matches user's weak diagnostic area
      const isWeak = weakKeywords.some((wk) => {
        return (
          t.category.toLowerCase().includes(wk) ||
          wk.includes(t.category.toLowerCase()) ||
          t.name.toLowerCase().includes(wk) ||
          wk.includes(t.name.toLowerCase())
        )
      })

      let status: TopicStatus = 'locked'

      if (isCompleted) {
        status = 'completed'
      } else if (!foundActiveTopic) {
        // The first uncompleted topic that the user is qualified for is active/in_progress
        status = 'in_progress'
        foundActiveTopic = true
      } else {
        // Evaluate accessibility based on assessment level and progression
        // Advanced users have all upcoming topics unlocked (available)
        // Intermediate users have beginner & intermediate topics unlocked
        // Beginner users unlock topics sequentially
        if (userTier >= topicTier || index <= completedTopics.length + 1) {
          status = 'available'
        } else {
          status = 'locked'
        }
      }

      return {
        id: `path-item-${t.id}`,
        topicId: t.id,
        topic: t,
        status,
        sequenceOrder: isWeak ? t.sequenceOrder - 100 : t.sequenceOrder,
        isWeakPriority: isWeak,
      }
    })

    // Sort weak priority topics first, while preserving sequence
    pathItems.sort((a, b) => a.sequenceOrder - b.sequenceOrder)

    return new Response(JSON.stringify(pathItems), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('get-learning-path error:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to compute learning path.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
