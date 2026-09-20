import { supabase } from '@/backend/supabase-client'
import { LearningPathItem } from '@/types/quantify'
import { FALLBACK_TOPICS } from '@/lib/api/topics'

export type { LearningPathItem }

export function getFallbackLearningPath(
  completedTopics: string[] = [],
  weakTopics: string[] = []
): LearningPathItem[] {
  return FALLBACK_TOPICS.map((t: any, idx: number) => ({
    id: `path-${t.id}`,
    topicId: t.id,
    topic: {
      id: t.id,
      category: t.category.toLowerCase() as any,
      name: t.title,
      level: t.difficulty.toLowerCase() as any,
      sequenceOrder: t.order,
      description: t.description,
      theoryContent: t.content?.theory || '',
      videoUrl: t.content?.videoUrl || '',
      videoDuration: t.estimatedTime || '25 mins',
      notesUrl: t.content?.notesUrl || '',
      practiceQuestionsCount: t.content?.practiceQuestions?.length || 5,
      keyFormulas: [],
    },
    status: completedTopics.includes(t.id)
      ? 'completed'
      : idx <= completedTopics.length
      ? 'in_progress'
      : 'locked',
    sequenceOrder: t.order,
    isWeakPriority: weakTopics.some((w) => t.category.toLowerCase().includes(w.toLowerCase())),
  }))
}

/**
 * Retrieves the personalized LearningPathItem[] for a user.
 * Tries the Supabase Edge Function first, then falls back to Postgres RPC get_learning_path.
 */
export async function getLearningPathServer(
  userId?: string,
  completedTopics: string[] = [],
  weakTopics: string[] = []
): Promise<{
  data: LearningPathItem[] | null
  error: Error | null
}> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<LearningPathItem[]>('get-learning-path', {
      body: { userId },
    })

    if (!error && data && Array.isArray(data) && data.length > 0) {
      return { data, error: null }
    }

    // 2. Fallback to RPC function if Edge Function is offline
    if (userId) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_learning_path', {
        p_user_id: userId,
      })

      if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
        return { data: rpcData as LearningPathItem[], error: null }
      }
    }

    return { data: getFallbackLearningPath(completedTopics, weakTopics), error: null }
  } catch (err: any) {
    console.error('getLearningPathServer error, returning fallback path:', err)
    return { data: getFallbackLearningPath(completedTopics, weakTopics), error: err }
  }
}

export const fetchLearningPathServer = getLearningPathServer
