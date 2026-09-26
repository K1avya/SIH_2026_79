// ============================================================
// Quantify — Discussion Forum Type Definitions
// ============================================================

// ---- Primitive types ----------------------------------------

export type DiscussionType = 'question' | 'discussion' | 'research' | 'project' | 'help'
export type DiscussionStatus = 'open' | 'solved' | 'closed'
export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'misleading' | 'off-topic' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed'

// ---- Category -----------------------------------------------

export interface DiscussionCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

// ---- Tag ----------------------------------------------------

export interface DiscussionTag {
  id: string
  name: string
  slug: string
}

// ---- Author (lightweight profile join) ----------------------

export interface DiscussionAuthor {
  id: string
  name: string
  email: string
  level?: string
  role?: string
}

// ---- Discussion (list view — no full content) ---------------

export interface DiscussionSummary {
  id: string
  user_id: string
  author: DiscussionAuthor
  category_id: string | null
  category: DiscussionCategory | null
  type: DiscussionType
  title: string
  content_preview: string        // first 200 chars of content
  status: DiscussionStatus
  view_count: number
  reply_count: number
  vote_count: number
  user_has_voted: boolean
  tags: DiscussionTag[]
  created_at: string
  updated_at: string
}

// ---- Discussion (detail view — full content) ----------------

export interface Discussion {
  id: string
  user_id: string
  author: DiscussionAuthor
  category_id: string | null
  category: DiscussionCategory | null
  type: DiscussionType
  title: string
  content: string
  status: DiscussionStatus
  view_count: number
  reply_count: number
  vote_count: number
  user_has_voted: boolean
  tags: DiscussionTag[]
  created_at: string
  updated_at: string
}

// ---- Reply --------------------------------------------------

export interface DiscussionReply {
  id: string
  discussion_id: string
  user_id: string
  author: DiscussionAuthor
  parent_reply_id: string | null
  content: string
  is_accepted: boolean
  vote_count: number
  user_has_voted: boolean
  children?: DiscussionReply[]   // populated on client for one-level threading
  created_at: string
  updated_at: string
}

// ---- Vote ---------------------------------------------------

export interface DiscussionVote {
  id: string
  user_id: string
  discussion_id: string | null
  reply_id: string | null
  created_at: string
}

// ---- Report -------------------------------------------------

export interface DiscussionReport {
  id: string
  user_id: string
  discussion_id: string | null
  reply_id: string | null
  reason: ReportReason
  description: string | null
  status: ReportStatus
  created_at: string
}

// ---- Create / Update payloads --------------------------------

export interface CreateDiscussionPayload {
  category_id: string | null
  type: DiscussionType
  title: string
  content: string
  tags: string[]   // tag names — resolved to IDs in the API layer
}

export interface UpdateDiscussionPayload {
  title?: string
  content?: string
  category_id?: string | null
  type?: DiscussionType
  tags?: string[]
}

export interface CreateReplyPayload {
  discussion_id: string
  parent_reply_id?: string | null
  content: string
}

export interface UpdateReplyPayload {
  content: string
}

export interface CreateReportPayload {
  discussion_id?: string | null
  reply_id?: string | null
  reason: ReportReason
  description?: string
}

// ---- Filters ------------------------------------------------

export type DiscussionSortBy = 'latest' | 'most_active' | 'most_voted' | 'unanswered' | 'solved'

export interface DiscussionFilters {
  search?: string
  category_slug?: string
  type?: DiscussionType | 'all'
  sort?: DiscussionSortBy
  page?: number
  pageSize?: number
}

// ---- Pagination result --------------------------------------

export interface PaginatedDiscussions {
  data: DiscussionSummary[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
