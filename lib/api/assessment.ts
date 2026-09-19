import { supabase } from '@/backend/supabase-client'
import { AssessmentAttempt } from '@/types/quantify'

/**
 * Invokes the Supabase Edge Function 'submit-assessment' with zero client trust.
 * Passes the user's answers map and receives the server-verified AssessmentAttempt.
 */
export async function submitAssessmentServer(
  userId: string,
  answers: Record<string, string>
): Promise<{ data: AssessmentAttempt | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<AssessmentAttempt>('submit-assessment', {
      body: { userId, answers },
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (err: any) {
    console.error('Failed to submit assessment to Edge Function:', err)
    return { data: null, error: err }
  }
}
