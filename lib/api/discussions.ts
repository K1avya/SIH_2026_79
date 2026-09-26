/**
 * Quantify — Discussion Forum API
 * Follows the same direct Supabase client pattern as lib/api/resources.ts
 */

import { supabase } from '@/backend/supabase-client'
import type {
  Discussion,
  DiscussionSummary,
  DiscussionCategory,
  DiscussionTag,
  DiscussionFilters,
  PaginatedDiscussions,
  CreateDiscussionPayload,
  UpdateDiscussionPayload,
} from '@/types/discussion'

// ---- Helpers ------------------------------------------------

function buildAuthor(profile: any) {
  return {
    id: profile?.id ?? 'unknown',
    name: profile?.name ?? 'Quantum Learner',
    email: profile?.email ?? '',
    level: profile?.level ?? 'Beginner',
    role: profile?.role ?? 'learner',
  }
}

/** Safely pull the first 200 chars as a content preview */
function preview(content: string): string {
  return content.length > 200 ? content.slice(0, 200) + '…' : content
}

// ---- Categories --------------------------------------------

export async function fetchCategories(): Promise<{ data: DiscussionCategory[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('discussion_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err: any) {
    return { data: FALLBACK_CATEGORIES, error: err }
  }
}

// ---- Tags ---------------------------------------------------

export async function fetchTags(): Promise<{ data: DiscussionTag[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('discussion_tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err: any) {
    return { data: [], error: err }
  }
}

/** Find or create tags by name, returning their IDs */
async function resolveTagIds(tagNames: string[]): Promise<string[]> {
  const ids: string[] = []
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data: existing } = await supabase
      .from('discussion_tags')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      ids.push(existing.id)
    } else {
      const { data: created } = await supabase
        .from('discussion_tags')
        .insert({ name, slug })
        .select('id')
        .maybeSingle()
      if (created) ids.push(created.id)
    }
  }
  return ids
}

// ---- Fetch Discussions (paginated list) ---------------------

export async function fetchDiscussions(
  filters: DiscussionFilters = {},
  currentUserId?: string
): Promise<{ data: PaginatedDiscussions; error: Error | null }> {
  try {
    const { search, category_slug, type, sort = 'latest', page = 1, pageSize = 20 } = filters
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Base query — join with category
    let query = supabase
      .from('discussions')
      .select(
        `
        id, user_id, category_id, type, title, content, status, view_count, created_at, updated_at,
        category:discussion_categories(id, name, slug, description, icon, sort_order, created_at),
        tags:discussion_tag_map(tag:discussion_tags(id, name, slug))
        `,
        { count: 'exact' }
      )

    // Filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }
    if (category_slug && category_slug !== 'all') {
      query = query.eq('category.slug', category_slug)
    }
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    if (sort === 'solved') {
      query = query.eq('status', 'solved')
    } else if (sort === 'unanswered') {
      query = query.eq('status', 'open')
    }

    // Sorting
    switch (sort) {
      case 'latest':
        query = query.order('created_at', { ascending: false })
        break
      case 'most_voted':
        query = query.order('created_at', { ascending: false }) // votes counted separately
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    query = query.range(from, to)

    const { data: rows, error, count } = await query

    if (error) throw error

    // Fetch vote counts and reply counts in parallel
    const discussionIds = (rows ?? []).map((r: any) => r.id)

    const [votesResult, repliesResult, profilesResult, userVotesResult] = await Promise.all([
      supabase.from('discussion_votes').select('discussion_id').in('discussion_id', discussionIds),
      supabase.from('discussion_replies').select('discussion_id').in('discussion_id', discussionIds),
      // Fetch author profiles
      supabase.from('profiles').select('id, name, email, level, role').in(
        'id',
        (rows ?? []).map((r: any) => r.user_id)
      ),
      // Check which ones current user voted on
      currentUserId
        ? supabase
            .from('discussion_votes')
            .select('discussion_id')
            .eq('user_id', currentUserId)
            .in('discussion_id', discussionIds)
        : Promise.resolve({ data: [] }),
    ])

    const voteCounts: Record<string, number> = {}
    const replyCounts: Record<string, number> = {}
    const profileMap: Record<string, any> = {}
    const userVotedSet = new Set<string>()

    for (const v of votesResult.data ?? []) {
      voteCounts[v.discussion_id] = (voteCounts[v.discussion_id] ?? 0) + 1
    }
    for (const r of repliesResult.data ?? []) {
      replyCounts[r.discussion_id] = (replyCounts[r.discussion_id] ?? 0) + 1
    }
    for (const p of profilesResult.data ?? []) {
      profileMap[p.id] = p
    }
    for (const v of (userVotesResult as any).data ?? []) {
      if (v.discussion_id) userVotedSet.add(v.discussion_id)
    }

    const summaries: DiscussionSummary[] = (rows ?? []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      author: buildAuthor(profileMap[row.user_id]),
      category_id: row.category_id,
      category: row.category ?? null,
      type: row.type,
      title: row.title,
      content_preview: preview(row.content),
      status: row.status,
      view_count: row.view_count,
      reply_count: replyCounts[row.id] ?? 0,
      vote_count: voteCounts[row.id] ?? 0,
      user_has_voted: userVotedSet.has(row.id),
      tags: (row.tags ?? []).map((t: any) => t.tag).filter(Boolean),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    return {
      data: {
        data: summaries,
        total: count ?? summaries.length,
        page,
        pageSize,
        hasMore: (count ?? 0) > to + 1,
      },
      error: null,
    }
  } catch (err: any) {
    console.warn('fetchDiscussions error, returning empty:', err)
    return {
      data: { data: [], total: 0, page: 1, pageSize: 20, hasMore: false },
      error: err,
    }
  }
}

// ---- Fetch Single Discussion ---------------------------------

export async function fetchDiscussion(
  id: string,
  currentUserId?: string
): Promise<{ data: Discussion | null; error: Error | null }> {
  try {
    const { data: row, error } = await supabase
      .from('discussions')
      .select(
        `
        id, user_id, category_id, type, title, content, status, view_count, created_at, updated_at,
        category:discussion_categories(id, name, slug, description, icon, sort_order, created_at),
        tags:discussion_tag_map(tag:discussion_tags(id, name, slug))
        `
      )
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!row) return { data: null, error: null }

    // Increment view count (fire-and-forget)
    supabase
      .from('discussions')
      .update({ view_count: (row.view_count ?? 0) + 1 })
      .eq('id', id)
      .then(() => {})

    const [profileResult, votesResult, repliesResult, userVoteResult] = await Promise.all([
      supabase.from('profiles').select('id, name, email, level, role').eq('id', row.user_id).maybeSingle(),
      supabase.from('discussion_votes').select('id').eq('discussion_id', id),
      supabase.from('discussion_replies').select('id').eq('discussion_id', id),
      currentUserId
        ? supabase
            .from('discussion_votes')
            .select('id')
            .eq('user_id', currentUserId)
            .eq('discussion_id', id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    const discussion: Discussion = {
      id: row.id,
      user_id: row.user_id,
      author: buildAuthor(profileResult.data),
      category_id: row.category_id,
      category: (row.category ?? null) as unknown as import('@/types/discussion').DiscussionCategory | null,
      type: row.type,
      title: row.title,
      content: row.content,
      status: row.status,
      view_count: (row.view_count ?? 0) + 1,
      reply_count: (repliesResult.data ?? []).length,
      vote_count: (votesResult.data ?? []).length,
      user_has_voted: !!(userVoteResult as any).data,
      tags: (row.tags ?? []).map((t: any) => t.tag).filter(Boolean),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }

    return { data: discussion, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

// ---- Create Discussion ---------------------------------------

export async function createDiscussion(
  payload: CreateDiscussionPayload,
  userId: string
): Promise<{ data: { id: string } | null; error: Error | null }> {
  try {
    const { data: discussion, error } = await supabase
      .from('discussions')
      .insert({
        user_id: userId,
        category_id: payload.category_id || null,
        type: payload.type,
        title: payload.title.trim(),
        content: payload.content.trim(),
        status: 'open',
      })
      .select('id')
      .maybeSingle()

    if (error) throw error
    if (!discussion) throw new Error('Discussion was not created')

    // Attach tags
    if (payload.tags && payload.tags.length > 0) {
      const tagIds = await resolveTagIds(payload.tags)
      if (tagIds.length > 0) {
        await supabase.from('discussion_tag_map').insert(
          tagIds.map((tag_id) => ({ discussion_id: discussion.id, tag_id }))
        )
      }
    }

    return { data: { id: discussion.id }, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

// ---- Update Discussion ---------------------------------------

export async function updateDiscussion(
  id: string,
  payload: UpdateDiscussionPayload,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const updates: any = {}
    if (payload.title !== undefined) updates.title = payload.title.trim()
    if (payload.content !== undefined) updates.content = payload.content.trim()
    if (payload.category_id !== undefined) updates.category_id = payload.category_id
    if (payload.type !== undefined) updates.type = payload.type

    const { error } = await supabase
      .from('discussions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // enforce ownership

    if (error) throw error

    // Update tags if provided
    if (payload.tags !== undefined) {
      await supabase.from('discussion_tag_map').delete().eq('discussion_id', id)
      if (payload.tags.length > 0) {
        const tagIds = await resolveTagIds(payload.tags)
        if (tagIds.length > 0) {
          await supabase.from('discussion_tag_map').insert(
            tagIds.map((tag_id) => ({ discussion_id: id, tag_id }))
          )
        }
      }
    }

    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Delete Discussion ---------------------------------------

export async function deleteDiscussion(
  id: string,
  userId: string,
  isAdmin: boolean
): Promise<{ error: Error | null }> {
  try {
    let query = supabase.from('discussions').delete().eq('id', id)
    if (!isAdmin) query = query.eq('user_id', userId)

    const { error } = await query
    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Vote on Discussion -------------------------------------

export async function voteDiscussion(
  discussionId: string,
  userId: string
): Promise<{ alreadyVoted: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('discussion_votes')
      .insert({ user_id: userId, discussion_id: discussionId })

    if (error) {
      if (error.code === '23505') return { alreadyVoted: true, error: null } // duplicate
      throw error
    }
    return { alreadyVoted: false, error: null }
  } catch (err: any) {
    return { alreadyVoted: false, error: err }
  }
}

export async function removeDiscussionVote(
  discussionId: string,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('discussion_votes')
      .delete()
      .eq('user_id', userId)
      .eq('discussion_id', discussionId)

    if (error) throw error
    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Accept a Reply as Answer -------------------------------

export async function acceptReply(
  discussionId: string,
  replyId: string,
  userId: string,
  isAdmin: boolean
): Promise<{ error: Error | null }> {
  try {
    // Verify caller owns the discussion (or is admin)
    if (!isAdmin) {
      const { data: disc } = await supabase
        .from('discussions')
        .select('user_id')
        .eq('id', discussionId)
        .maybeSingle()
      if (disc?.user_id !== userId) {
        throw new Error('Only the discussion creator can accept an answer.')
      }
    }

    // Clear any existing accepted reply for this discussion
    await supabase
      .from('discussion_replies')
      .update({ is_accepted: false })
      .eq('discussion_id', discussionId)
      .eq('is_accepted', true)

    // Mark the selected reply as accepted
    const { error } = await supabase
      .from('discussion_replies')
      .update({ is_accepted: true })
      .eq('id', replyId)

    if (error) throw error

    // Update discussion status to solved
    await supabase
      .from('discussions')
      .update({ status: 'solved' })
      .eq('id', discussionId)

    return { error: null }
  } catch (err: any) {
    return { error: err }
  }
}

// ---- Fallback Categories (used when Supabase is unreachable) ------

export const FALLBACK_CATEGORIES: DiscussionCategory[] = [
  { id: 'cat-1',  name: 'Quantum Fundamentals',     slug: 'quantum-fundamentals',     description: 'Qubits, superposition, entanglement', icon: '⚛️',  sort_order: 1,  created_at: '' },
  { id: 'cat-2',  name: 'Quantum Mathematics',      slug: 'quantum-mathematics',      description: 'Linear algebra, Dirac notation',       icon: '🔢',  sort_order: 2,  created_at: '' },
  { id: 'cat-3',  name: 'Quantum Algorithms',       slug: 'quantum-algorithms',       description: 'Grover, Shor, VQE, QAOA…',             icon: '⚡',  sort_order: 3,  created_at: '' },
  { id: 'cat-4',  name: 'Quantum Programming',      slug: 'quantum-programming',      description: 'Qiskit, Q#, PennyLane, Cirq',          icon: '💻',  sort_order: 4,  created_at: '' },
  { id: 'cat-5',  name: 'Quantum Hardware',         slug: 'quantum-hardware',         description: 'Superconducting qubits, trapped ions',  icon: '🔬',  sort_order: 5,  created_at: '' },
  { id: 'cat-6',  name: 'Quantum Information',      slug: 'quantum-information',      description: 'Teleportation, superdense coding',      icon: '📡',  sort_order: 6,  created_at: '' },
  { id: 'cat-7',  name: 'Quantum Cryptography',     slug: 'quantum-cryptography',     description: 'QKD, BB84, post-quantum crypto',        icon: '🔐',  sort_order: 7,  created_at: '' },
  { id: 'cat-8',  name: 'Quantum Error Correction', slug: 'quantum-error-correction', description: 'Decoherence, surface codes',             icon: '🛡️',  sort_order: 8,  created_at: '' },
  { id: 'cat-9',  name: 'Quantum ML',               slug: 'quantum-ml',               description: 'QNNs, variational circuits, hybrid ML', icon: '🤖',  sort_order: 9,  created_at: '' },
  { id: 'cat-10', name: 'Quantum Research',         slug: 'quantum-research',         description: 'Papers, open problems, discoveries',    icon: '📚',  sort_order: 10, created_at: '' },
  { id: 'cat-11', name: 'Projects',                 slug: 'projects',                 description: 'Qiskit projects, student work',          icon: '🚀',  sort_order: 11, created_at: '' },
  { id: 'cat-12', name: 'Career & Learning',        slug: 'career-learning',          description: 'Roadmaps, internships, careers',         icon: '🎓',  sort_order: 12, created_at: '' },
]
