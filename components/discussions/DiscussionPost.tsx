'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronUp,
  Edit3,
  Trash2,
  Flag,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  Check,
  X,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import {
  voteDiscussion,
  removeDiscussionVote,
  updateDiscussion,
  deleteDiscussion,
} from '@/lib/api/discussions'
import { RenderedContent } from './CodeBlock'
import { DiscussionTypeBadge } from './DiscussionTypeBadge'
import { CategoryBadge } from './CategoryBadge'
import { TagBadge } from './TagBadge'
import { ReportModal } from './ReportModal'
import type { Discussion } from '@/types/discussion'

interface DiscussionPostProps {
  discussion: Discussion
  onUpdated: () => void
  onDeleted: () => void
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

export function DiscussionPost({ discussion, onUpdated, onDeleted }: DiscussionPostProps) {
  const { user, isAdmin } = useAuth()
  const isOwner = user.id === discussion.user_id
  const isSolved = discussion.status === 'solved'

  const [hasVoted, setHasVoted] = useState(discussion.user_has_voted)
  const [voteCount, setVoteCount] = useState(discussion.vote_count)
  const [voteLoading, setVoteLoading] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(discussion.title)
  const [editContent, setEditContent] = useState(discussion.content)
  const [editLoading, setEditLoading] = useState(false)

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const initials = discussion.author.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  // Vote handler
  const handleVote = async () => {
    if (voteLoading) return
    setVoteLoading(true)
    if (hasVoted) {
      const { error } = await removeDiscussionVote(discussion.id, user.id)
      if (!error) { setHasVoted(false); setVoteCount((c) => c - 1) }
    } else {
      const { error } = await voteDiscussion(discussion.id, user.id)
      if (!error) { setHasVoted(true); setVoteCount((c) => c + 1) }
    }
    setVoteLoading(false)
  }

  // Edit submit
  const handleEditSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) return
    setEditLoading(true)
    const { error } = await updateDiscussion(discussion.id, { title: editTitle, content: editContent }, user.id)
    if (error) {
      toast.error('Unable to update discussion.')
    } else {
      toast.success('Discussion updated.')
      setEditing(false)
      onUpdated()
    }
    setEditLoading(false)
  }

  // Delete handler
  const handleDelete = async () => {
    if (!confirm('Delete this discussion? This action cannot be undone.')) return
    setDeleteLoading(true)
    const { error } = await deleteDiscussion(discussion.id, user.id, isAdmin)
    if (error) {
      toast.error('Unable to delete discussion.')
    } else {
      toast.success('Discussion deleted.')
      onDeleted()
    }
    setDeleteLoading(false)
  }

  const inputStyle: React.CSSProperties = { borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)', color: 'white' }

  return (
    <div
      className="rounded-3xl border p-6 backdrop-blur-xl"
      style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
    >
      {/* Header: badges + author */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <DiscussionTypeBadge type={discussion.type} size="sm" />
        <CategoryBadge category={discussion.category} size="sm" />
        {isSolved && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: 'color-mix(in oklch, #34D399 15%, transparent)', color: '#34D399' }}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Solved
          </span>
        )}
      </div>

      {editing ? (
        /* ---- Edit mode ---- */
        <div className="space-y-4">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-2xl border px-3 py-2.5 font-heading text-xl font-bold outline-none"
            style={inputStyle}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={12}
            className="w-full rounded-2xl border px-3 py-2.5 text-sm font-mono leading-relaxed outline-none resize-y"
            style={inputStyle}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-white/5" style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}>
              <X className="h-3.5 w-3.5 inline mr-1" />Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={editLoading}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-black"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {editLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Check className="h-3.5 w-3.5" />Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            {discussion.title}
          </h1>

          {/* Rendered content */}
          <RenderedContent content={discussion.content} />

          {/* Tags */}
          {discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {discussion.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--q-line)' }}>
        {/* Author + meta */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-black"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{discussion.author.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--q-muted)' }}>
                {discussion.author.level ?? 'Learner'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--q-muted)' }}>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{relativeTime(discussion.created_at)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{discussion.view_count} views</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{discussion.reply_count} replies</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Upvote */}
          <button
            onClick={handleVote}
            disabled={voteLoading}
            aria-label={hasVoted ? 'Remove upvote' : 'Upvote'}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
            style={
              hasVoted
                ? { borderColor: 'color-mix(in oklch, var(--q-cyan) 50%, transparent)', background: 'color-mix(in oklch, var(--q-cyan) 10%, transparent)', color: 'var(--q-cyan)' }
                : { borderColor: 'var(--q-line)', color: 'var(--q-muted)' }
            }
          >
            <ChevronUp className="h-3.5 w-3.5" />
            <span>{voteCount}</span>
          </button>

          {/* Edit (owner) */}
          {isOwner && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-xl border p-1.5 transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
              aria-label="Edit discussion"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Delete (owner or admin) */}
          {(isOwner || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="rounded-xl border p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-400"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
              aria-label="Delete discussion"
            >
              {deleteLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Report (non-owner) */}
          {!isOwner && (
            <button
              onClick={() => setReportOpen(true)}
              className="rounded-xl border p-1.5 transition-colors hover:bg-orange-500/10 hover:text-orange-400"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
              aria-label="Report discussion"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {reportOpen && (
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          discussionId={discussion.id}
        />
      )}
    </div>
  )
}
