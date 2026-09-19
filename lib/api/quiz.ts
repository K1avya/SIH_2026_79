import { supabase } from '@/backend/supabase-client'

export interface QuizSubmissionResult {
  attemptId: string
  topicId: string
  scorePercent: number
  correctCount: number
  totalQuestions: number
  passed: boolean
  newQuizAverage: number
  newOverallProgress: number
  completedTopics: string[]
}

/**
 * Submits topic quiz answers for server-side grading and profile progression.
 * Tries the Supabase Edge Function 'submit-quiz', falling back to Postgres RPC 'submit_quiz'.
 */
export async function submitQuizServer(
  userId: string,
  topicId: string,
  answers: Record<string, string | number>
): Promise<{ data: QuizSubmissionResult | null; error: Error | null }> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<QuizSubmissionResult>('submit-quiz', {
      body: { userId, topicId, answers },
    })

    if (!error && data) {
      return { data, error: null }
    }

    // 2. Fallback to PostgreSQL RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_quiz', {
      p_user_id: userId,
      p_topic_id: topicId,
      p_answers: answers,
    })

    if (!rpcError && rpcData) {
      return { data: rpcData as QuizSubmissionResult, error: null }
    }

    return { data: null, error: error || rpcError || new Error('Failed to submit quiz') }
  } catch (err: any) {
    console.error('submitQuizServer error:', err)
    return { data: null, error: err }
  }
}
