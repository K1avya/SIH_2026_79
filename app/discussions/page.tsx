'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DiscussionHeader } from '@/components/discussions/DiscussionHeader'
import { DiscussionFilters } from '@/components/discussions/DiscussionFilters'
import { DiscussionList } from '@/components/discussions/DiscussionList'
import { CreateDiscussionModal } from '@/components/discussions/CreateDiscussionModal'
import {
  fetchDiscussions,
  fetchCategories,
  voteDiscussion,
  removeDiscussionVote,
  FALLBACK_CATEGORIES,
} from '@/lib/api/discussions'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import type {
  DiscussionSummary,
  DiscussionCategory,
  DiscussionFilters as Filters,
} from '@/types/discussion'

export default function DiscussionsPage() {
  const { user } = useAuth()

  const [discussions, setDiscussions] = useState<DiscussionSummary[]>([])
  const [categories, setCategories] = useState<DiscussionCategory[]>(FALLBACK_CATEGORIES)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    sort: 'latest',
    type: 'all',
    page: 1,
    pageSize: 20,
  })

  // Load categories once
  useEffect(() => {
    fetchCategories().then(({ data }) => {
      if (data.length > 0) setCategories(data)
    })
  }, [])

  // Load discussions whenever filters change
  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await fetchDiscussions(filters, user.id)
    setDiscussions(data.data)
    setTotal(data.total)
    setLoading(false)
  }, [filters, user.id])

  useEffect(() => {
    load()
  }, [load])

  const handleFiltersChange = (partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const handleVote = async (id: string, hasVoted: boolean) => {
    // Optimistic update
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, user_has_voted: !hasVoted, vote_count: d.vote_count + (hasVoted ? -1 : 1) }
          : d
      )
    )

    const { error } = hasVoted
      ? await removeDiscussionVote(id, user.id)
      : await voteDiscussion(id, user.id)

    if (error) {
      // Revert on error
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, user_has_voted: hasVoted, vote_count: d.vote_count + (hasVoted ? 1 : -1) }
            : d
        )
      )
      toast.error('Unable to register vote.')
    }
  }

  const handleTagClick = (tagSlug: string) => {
    setFilters((prev) => ({ ...prev, search: tagSlug, page: 1 }))
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl py-4 space-y-6">
        {/* Header */}
        <DiscussionHeader
          onStartDiscussion={() => setCreateOpen(true)}
          isLoggedIn={!!user.id}
        />

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--q-muted)' }}>
          <span>
            <strong className="text-white">{total}</strong> discussions
          </span>
          <span>
            <strong className="text-white">{categories.length}</strong> categories
          </span>
        </div>

        {/* Filters */}
        <DiscussionFilters
          filters={filters}
          categories={categories}
          onChange={handleFiltersChange}
        />

        {/* List */}
        <DiscussionList
          discussions={discussions}
          loading={loading}
          onVote={handleVote}
          onTagClick={handleTagClick}
          onStartDiscussion={() => setCreateOpen(true)}
        />

        {/* Pagination */}
        {!loading && total > (filters.pageSize ?? 20) && (
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              className="rounded-xl border px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
            >
              ← Previous
            </button>
            <span className="text-xs" style={{ color: 'var(--q-muted)' }}>
              Page {filters.page ?? 1} of {Math.ceil(total / (filters.pageSize ?? 20))}
            </span>
            <button
              disabled={(filters.page ?? 1) >= Math.ceil(total / (filters.pageSize ?? 20))}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="rounded-xl border px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Create Discussion Modal */}
      <CreateDiscussionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </AppShell>
  )
}
