import { supabase } from '@/backend/supabase-client'
import { apiPost } from '@/lib/api/client'

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
  isHint?: boolean
  groundedTopic?: string
  codeSnippet?: string
  conceptCard?: {
    title: string
    summary: string
    relatedFormula?: string
  }
}

/**
 * Sends a message to the Quanta AI Tutor Edge Function ('tutor-chat').
 * Invokes Gemini API directly with student level, current topic, and conversation history.
 */
export async function sendTutorChatMessage(
  userId: string,
  message: string,
  currentTopic: string = 'General Quantum Computing',
  currentLevel: string = 'Intermediate',
  conversationId?: string
): Promise<{ data: ChatMessage | null; error: Error | null }> {
  try {
    const res = await apiPost<ChatMessage>('tutor-chat', {
      userId,
      conversationId,
      message,
      currentTopic,
      currentLevel,
    })

    if (res.status === 'error' || !res.data) {
      throw new Error(res.error || 'Failed to get response from AI tutor.')
    }

    return { data: res.data, error: null }
  } catch (err: any) {
    console.error('Failed to send tutor chat message to Edge Function:', err)
    return { data: null, error: err }
  }
}

/**
 * Loads historical messages for a given tutor conversation.
 */
export async function fetchTutorHistoryServer(
  conversationId: string
): Promise<{ data: ChatMessage[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('tutor_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
