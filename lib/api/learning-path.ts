import { supabase } from '@/backend/supabase-client'
import { LearningPathItem } from '@/types/quantify'

export type { LearningPathItem }

/**
 * Retrieves the personalized LearningPathItem[] for a user.
 * Tries the Supabase Edge Function first, then falls back to Postgres RPC get_learning_path.
 */
export async function getLearningPathServer(userId?: string): Promise<{
  data: LearningPathItem[] | null
  error: Error | null
}> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<LearningPathItem[]>('get-learning-path', {
      body: { userId },
    })

    if (!error && data && Array.isArray(data)) {
      return { data, error: null }
    }

    // 2. Fallback to RPC function if Edge Function is offline
    if (userId) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_learning_path', {
        p_user_id: userId,
      })

      if (!rpcError && rpcData) {
        return { data: rpcData as LearningPathItem[], error: null }
      }
    }

    return { data: null, error: error || new Error('Failed to fetch learning path') }
  } catch (err: any) {
    console.error('getLearningPathServer error:', err)
    return { data: null, error: err }
  }
}

export const fetchLearningPathServer = getLearningPathServer
