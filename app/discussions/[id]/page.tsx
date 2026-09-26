'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { DiscussionPost } from '@/components/discussions/DiscussionPost'
import { ReplyComposer } from '@/components/discussions/ReplyComposer'
import { ReplyList } from '@/components/discussions/ReplyList'
import { ErrorState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchDiscussion } from '@/lib/api/discussions'
import { fetchReplies } from '@/lib/api/replies'
import { useAuth } from '@/lib/auth-context'
import type { Discussion, DiscussionReply } from '@/types/discussion'

export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [replies, setReplies] = useState<DiscussionReply[]>([])
  const [loadingDisc, setLoadingDisc] = useState(true)
  const [loadingReplies, setLoadingReplies] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDiscussion = useCallback(async () => {
    if (!id) return
    setLoadingDisc(true)
    const { data, error: err } = await fetchDiscussion(id, user.id)
    if (err || !data) {
      setError('Unable to load this discussion.')
    } else {
      setDiscussion(data)
      setError(null)
    }
    setLoadingDisc(false)
  }, [id, user.id])

  const loadReplies = useCallback(async () => {
    if (!id) return
    setLoadingReplies(true)
    const { data } = await fetchReplies(id, user.id)
    setReplies(data)
    setLoadingReplies(false)
  }, [id, user.id])

  useEffect(() => {
    loadDiscussion()
    loadReplies()
  }, [loadDiscussion, loadReplies])

  const handleUpdated = () => {
    loadDiscussion()
  }

  const handleDeleted = () => {
    router.push('/discussions')
  }

  const handleRepliesRefresh = () => {
    loadReplies()
    loadDiscussion() // refresh reply count and solved status
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-4 space-y-6">
        {/* Back link */}
        <div>
          <Link
            href="/discussions"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'var(--q-muted)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Discussions
          </Link>
        </div>

        {/* Discussion post */}
        {loadingDisc ? (
          <div className="space-y-3">
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadDiscussion} />
        ) : discussion ? (
          <DiscussionPost
            discussion={discussion}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ) : null}

        {/* Replies section */}
        {!loadingDisc && !error && discussion && (
          <>
            {/* Replies heading */}
            <div
              className="flex items-center gap-2 border-b pb-3"
              style={{ borderColor: 'var(--q-line)' }}
            >
              <MessageSquare className="h-4 w-4" style={{ color: 'var(--q-cyan)' }} />
              <h2 className="font-heading text-base font-bold text-white">
                {discussion.reply_count} {discussion.reply_count === 1 ? 'Reply' : 'Replies'}
              </h2>
              {discussion.status === 'solved' && (
                <span
                  className="ml-auto text-xs font-semibold rounded-full px-2.5 py-0.5"
                  style={{
                    background: 'color-mix(in oklch, #34D399 15%, transparent)',
                    color: '#34D399',
                  }}
                >
                  ✓ Solved
                </span>
              )}
            </div>

            {/* Replies list */}
            <ReplyList
              replies={replies}
              loading={loadingReplies}
              discussionId={discussion.id}
              discussionOwnerId={discussion.user_id}
              discussionType={discussion.type}
              onRefresh={handleRepliesRefresh}
            />

            {/* Reply composer */}
            <ReplyComposer
              discussionId={discussion.id}
              onPosted={handleRepliesRefresh}
            />
          </>
        )}
      </div>
    </AppShell>
  )
}
