'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { DiscussionCard } from './DiscussionCard'
import { MessageSquare } from 'lucide-react'
import type { DiscussionSummary } from '@/types/discussion'

interface DiscussionListProps {
  discussions: DiscussionSummary[]
  loading: boolean
  onVote: (id: string, hasVoted: boolean) => void
  onTagClick: (tagSlug: string) => void
  onStartDiscussion: () => void
}

export function DiscussionList({
  discussions,
  loading,
  onVote,
  onTagClick,
  onStartDiscussion,
}: DiscussionListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-3xl" />
        ))}
      </div>
    )
  }

  if (discussions.length === 0) {
    return (
      <EmptyState
        title="No quantum discussions yet"
        description="Start the first conversation and help grow the Quantum Computing community."
        actionLabel="Start Discussion"
        onAction={onStartDiscussion}
      />
    )
  }

  return (
    <div className="space-y-3">
      {discussions.map((discussion) => (
        <DiscussionCard
          key={discussion.id}
          discussion={discussion}
          onVote={onVote}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  )
}
