/**
 * Quantify — Discussion Reports API
 */

import { supabase } from '@/backend/supabase-client'
import type { CreateReportPayload } from '@/types/discussion'

export async function submitReport(
  payload: CreateReportPayload,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    if (!payload.discussion_id && !payload.reply_id) {
      throw new Error('Either discussion_id or reply_id must be provided.')
    }

    const { error } = await supabase.from('discussion_reports').insert({
      user_id: userId,
      discussion_id: payload.discussion_id ?? null,
      reply_id: payload.reply_id ?? null,
      reason: payload.reason,
      description: payload.description?.trim() ?? null,
      status: 'pending',
    })

    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}
