'use client'

import React from 'react'
import Link from 'next/link'
import { MessageSquare, ChevronUp, Clock, CheckCircle2 } from 'lucide-react'
import type { DiscussionSummary } from '@/types/discussion'
import { DiscussionTypeBadge } from './DiscussionTypeBadge'
import { CategoryBadge } from './CategoryBadge'
import { TagBadge } from './TagBadge'

interface DiscussionCardProps {
  discussion: DiscussionSummary
  onVote?: (id: string, hasVoted: boolean) => void
  onTagClick?: (tagSlug: string) => void
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export function DiscussionCard({ discussion, onVote, onTagClick }: DiscussionCardProps) {
  const isSolved = discussion.status === 'solved'
  const initials = discussion.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <article
      className="group rounded-3xl border p-5 backdrop-blur-xl flex gap-4 transition-all duration-200 hover:scale-[1.005] hover:border-[color-mix(in_oklch,var(--q-violet)_40%,transparent)] hover:shadow-lg hover:shadow-violet-900/20"
      style={{
        borderColor: isSolved
          ? 'color-mix(in oklch, #34D399 25%, transparent)'
          : 'var(--q-line)',
        background: isSolved
          ? 'color-mix(in oklch, #34D399 4%, var(--q-bg-deep))'
          : 'var(--q-bg-deep)',
      }}
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <button
          onClick={() => onVote?.(discussion.id, discussion.user_has_voted)}
          aria-label={discussion.user_has_voted ? 'Remove upvote' : 'Upvote'}
          className="group/btn flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition-colors hover:bg-white/5"
          style={{ color: discussion.user_has_voted ? 'var(--q-cyan)' : 'var(--q-muted)' }}
        >
          <ChevronUp
            className={`h-5 w-5 transition-transform group-hover/btn:-translate-y-0.5 ${
              discussion.user_has_voted ? 'drop-shadow-[0_0_6px_var(--q-cyan)]' : ''
            }`}
          />
          <span className="text-[11px] font-bold leading-none">{discussion.vote_count}</span>
        </button>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-3">
        {/* Top row: badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <DiscussionTypeBadge type={discussion.type} />
          <CategoryBadge category={discussion.category} />
          {isSolved && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: 'color-mix(in oklch, #34D399 15%, transparent)', color: '#34D399' }}>
              <CheckCircle2 className="h-3 w-3" />
              Solved
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/discussions/${discussion.id}`}
          className="block font-heading text-base font-bold text-white hover:text-[var(--q-cyan)] transition-colors line-clamp-2"
        >
          {discussion.title}
        </Link>

        {/* Preview */}
        <p className="text-xs text-[var(--q-muted)] line-clamp-2 leading-relaxed">
          {discussion.content_preview}
        </p>

        {/* Tags */}
        {discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {discussion.tags.slice(0, 5).map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={onTagClick ? () => onTagClick(tag.slug) : undefined}
              />
            ))}
            {discussion.tags.length > 5 && (
              <span className="text-[10px] text-[var(--q-muted)]">+{discussion.tags.length - 5}</span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex flex-wrap items-center gap-4 pt-1 border-t" style={{ borderColor: 'var(--q-line)' }}>
          {/* Author avatar */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {initials}
            </div>
            <span className="text-[11px] font-medium" style={{ color: 'var(--q-muted)' }}>
              {discussion.author.name}
            </span>
          </div>

          {/* Replies count */}
          <div className="flex items-center gap-1" style={{ color: 'var(--q-muted)' }}>
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">{discussion.reply_count} {discussion.reply_count === 1 ? 'reply' : 'replies'}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 ml-auto" style={{ color: 'var(--q-muted)' }}>
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px]">{relativeTime(discussion.created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
