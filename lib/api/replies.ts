/**
 * Quantify — Replies API
 * Follows the same direct Supabase client pattern as lib/api/discussions.ts
 */

import { supabase } from '@/backend/supabase-client'
import type {
  DiscussionReply,
  CreateReplyPayload,
  UpdateReplyPayload,
} from '@/types/discussion'

function buildAuthor(profile: any) {
  return {
    id: profile?.id ?? 'unknown',
    name: profile?.name ?? 'Quantum Learner',
    email: profile?.email ?? '',
    level: profile?.level ?? 'Beginner',
    role: profile?.role ?? 'learner',
  }
}

// ---- Fetch Replies for a Discussion -------------------------

export async function fetchReplies(
  discussionId: string,
  currentUserId?: string
): Promise<{ data: DiscussionReply[]; error: Error | null }> {
  try {
    const { data: rows, error } = await supabase
      .from('discussion_replies')
      .select('id, discussion_id, user_id, parent_reply_id, content, is_accepted, created_at, updated_at')
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const authorIds = Array.from(new Set((rows ?? []).map((r: any) => r.user_id)))
    const replyIds = (rows ?? []).map((r: any) => r.id)

    const [profilesResult, votesResult, userVotesResult] = await Promise.all([
      supabase.from('profiles').select('id, name, email, level, role').in('id', authorIds),
      supabase.from('discussion_votes').select('reply_id').in('reply_id', replyIds),
      currentUserId
        ? supabase
            .from('discussion_votes')
            .select('reply_id')
            .eq('user_id', currentUserId)
            .in('reply_id', replyIds)
        : Promise.resolve({ data: [] }),
    ])

    const profileMap: Record<string, any> = {}
    for (const p of profilesResult.data ?? []) {
      profileMap[p.id] = p
    }

    const voteCounts: Record<string, number> = {}
    for (const v of votesResult.data ?? []) {
      if (v.reply_id) voteCounts[v.reply_id] = (voteCounts[v.reply_id] ?? 0) + 1
    }

    const userVotedSet = new Set<string>()
    for (const v of (userVotesResult as any).data ?? []) {
      if (v.reply_id) userVotedSet.add(v.reply_id)
    }

    const flat: DiscussionReply[] = (rows ?? []).map((row: any) => ({
      id: row.id,
      discussion_id: row.discussion_id,
      user_id: row.user_id,
      author: buildAuthor(profileMap[row.user_id]),
      parent_reply_id: row.parent_reply_id ?? null,
      content: row.content,
      is_accepted: row.is_accepted,
      vote_count: voteCounts[row.id] ?? 0,
      user_has_voted: userVotedSet.has(row.id),
      children: [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    // Build one-level threading
    const topLevel: DiscussionReply[] = []
    const replyMap: Record<string, DiscussionReply> = {}
    for (const r of flat) replyMap[r.id] = r
    for (const r of flat) {
      if (r.parent_reply_id && replyMap[r.parent_reply_id]) {
        replyMap[r.parent_reply_id].children!.push(r)
      } else {
        topLevel.push(r)
      }
    }

    return { data: topLevel, error: null }
  } catch (err: any) {
    return { data: [], error: err }
  }
}

// ---- Create Reply --------------------------------------------

export async function createReply(
  payload: CreateReplyPayload,
  userId: string
): Promise<{ data: { id: string } | null; error: Error | null }> {
  try {
    const { data: reply, error } = await supabase
      .from('discussion_replies')
      .insert({
        discussion_id: payload.discussion_id,
        user_id: userId,
        parent_reply_id: payload.parent_reply_id ?? null,
        content: payload.content.trim(),
      })
      .select('id')
      .maybeSingle()

    if (error) throw error
    if (!reply) throw new Error('Reply was not created')

    return { data: { id: reply.id }, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

// ---- Update Reply --------------------------------------------

export async function updateReply(
  id: string,
  payload: UpdateReplyPayload,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('discussion_replies')
      .update({ content: payload.content.trim() })
      .eq('id', id)
      .eq('user_id', userId) // enforce ownership at API level (RLS also handles this)

    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Delete Reply --------------------------------------------

export async function deleteReply(
  id: string,
  userId: string,
  isAdmin: boolean
): Promise<{ error: Error | null }> {
  try {
    let query = supabase.from('discussion_replies').delete().eq('id', id)
    if (!isAdmin) query = query.eq('user_id', userId)

    const { error } = await query
    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Vote on Reply ------------------------------------------

export async function voteReply(
  replyId: string,
  userId: string
): Promise<{ alreadyVoted: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('discussion_votes')
      .insert({ user_id: userId, reply_id: replyId })

    if (error) {
      if (error.code === '23505') return { alreadyVoted: true, error: null }
      throw error
    }
    return { alreadyVoted: false, error: null }
  } catch (err: any) {
    return { alreadyVoted: false, error: err }
  }
}

export async function removeReplyVote(
  replyId: string,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('discussion_votes')
      .delete()
      .eq('user_id', userId)
      .eq('reply_id', replyId)

    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}
