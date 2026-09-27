'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReplyItem } from './ReplyItem'
import type { DiscussionReply } from '@/types/discussion'

interface ReplyListProps {
  replies: DiscussionReply[]
  loading: boolean
  discussionId: string
  discussionOwnerId: string
  discussionType: string
  onRefresh: () => void
}

export function ReplyList({
  replies,
  loading,
  discussionId,
  discussionOwnerId,
  discussionType,
  onRefresh,
}: ReplyListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
    )
  }

  if (replies.length === 0) {
    return (
      <EmptyState
        title="No replies yet"
        description="Be the first to contribute to this quantum discussion."
      />
    )
  }

  // Surface accepted reply to top
  const sorted = [...replies].sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1
    if (!a.is_accepted && b.is_accepted) return 1
    return 0
  })

  return (
    <div className="space-y-3">
      {sorted.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          discussionId={discussionId}
          discussionOwnerId={discussionOwnerId}
          discussionType={discussionType}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}
