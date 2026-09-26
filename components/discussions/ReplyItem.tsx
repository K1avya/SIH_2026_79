'use client'

import React, { useState } from 'react'
import {
  ChevronUp,
  Check,
  CheckCircle2,
  Edit3,
  Trash2,
  Flag,
  MessageSquare,
  X,
  Loader2,
  CornerDownRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { voteReply, removeReplyVote, updateReply, deleteReply } from '@/lib/api/replies'
import { acceptReply } from '@/lib/api/discussions'
import { RenderedContent } from './CodeBlock'
import { ReplyComposer } from './ReplyComposer'
import { ReportModal } from './ReportModal'
import type { DiscussionReply } from '@/types/discussion'

interface ReplyItemProps {
  reply: DiscussionReply
  discussionId: string
  discussionOwnerId: string
  discussionType: string
  onRefresh: () => void
  depth?: number
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

export function ReplyItem({
  reply,
  discussionId,
  discussionOwnerId,
  discussionType,
  onRefresh,
  depth = 0,
}: ReplyItemProps) {
  const { user, isAdmin } = useAuth()
  const isOwner = user.id === reply.user_id
  const isDiscussionOwner = user.id === discussionOwnerId
  const canAccept =
    (isDiscussionOwner || isAdmin) &&
    (discussionType === 'question' || discussionType === 'help')

  const [hasVoted, setHasVoted] = useState(reply.user_has_voted)
  const [voteCount, setVoteCount] = useState(reply.vote_count)
  const [voteLoading, setVoteLoading] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [editLoading, setEditLoading] = useState(false)

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [replying, setReplying] = useState(false)

  const initials = reply.author.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleVote = async () => {
    if (voteLoading) return
    setVoteLoading(true)
    if (hasVoted) {
      const { error } = await removeReplyVote(reply.id, user.id)
      if (!error) { setHasVoted(false); setVoteCount((c) => c - 1) }
    } else {
      const { error } = await voteReply(reply.id, user.id)
      if (!error) { setHasVoted(true); setVoteCount((c) => c + 1) }
    }
    setVoteLoading(false)
  }

  const handleEditSave = async () => {
    if (!editContent.trim()) return
    setEditLoading(true)
    const { error } = await updateReply(reply.id, { content: editContent }, user.id)
    if (error) {
      toast.error('Unable to update reply.')
    } else {
      toast.success('Reply updated.')
      setEditing(false)
      onRefresh()
    }
    setEditLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this reply?')) return
    setDeleteLoading(true)
    const { error } = await deleteReply(reply.id, user.id, isAdmin)
    if (error) {
      toast.error('Unable to delete reply.')
    } else {
      toast.success('Reply deleted.')
      onRefresh()
    }
    setDeleteLoading(false)
  }

  const handleAccept = async () => {
    if (!canAccept) return
    setAcceptLoading(true)
    const { error } = await acceptReply(discussionId, reply.id, user.id, isAdmin)
    if (error) {
      toast.error(error.message || 'Unable to accept answer.')
    } else {
      toast.success(reply.is_accepted ? 'Acceptance removed.' : 'Answer accepted! ✓')
      onRefresh()
    }
    setAcceptLoading(false)
  }

  const inputStyle: React.CSSProperties = { borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)', color: 'white' }

  return (
    <div className={`${depth > 0 ? 'ml-6 sm:ml-10 border-l pl-4' : ''}`}
      style={{ borderColor: depth > 0 ? 'var(--q-line)' : undefined }}>
      <div
        className={`rounded-3xl border p-4 sm:p-5 ${reply.is_accepted ? 'shadow-lg shadow-emerald-900/20' : ''}`}
        style={{
          borderColor: reply.is_accepted
            ? 'color-mix(in oklch, #34D399 35%, transparent)'
            : 'var(--q-line)',
          background: reply.is_accepted
            ? 'color-mix(in oklch, #34D399 5%, var(--q-bg-deep))'
            : 'var(--q-bg-deep)',
        }}
      >
        {/* Accepted badge */}
        {reply.is_accepted && (
          <div className="flex items-center gap-1.5 mb-3 text-xs font-bold" style={{ color: '#34D399' }}>
            <CheckCircle2 className="h-4 w-4" />
            Accepted Answer
          </div>
        )}

        {/* Author */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-black"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Author name + time */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-white">{reply.author.name}</span>
              <span className="text-[10px] rounded-full px-1.5 py-0.5"
                style={{ background: 'color-mix(in oklch, var(--q-violet) 15%, transparent)', color: 'var(--q-muted)' }}>
                {reply.author.level ?? 'Learner'}
              </span>
              <span className="text-[11px] ml-auto" style={{ color: 'var(--q-muted)' }}>
                {relativeTime(reply.created_at)}
                {reply.updated_at !== reply.created_at && ' · edited'}
              </span>
            </div>

            {/* Content */}
            {editing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border px-3 py-2.5 text-sm font-mono outline-none resize-y"
                  style={inputStyle}
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-white/5" style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}>
                    <X className="h-3 w-3 inline mr-1" />Cancel
                  </button>
                  <button onClick={handleEditSave} disabled={editLoading} className="flex items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}>
                    {editLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    <Check className="h-3 w-3" />Save
                  </button>
                </div>
              </div>
            ) : (
              <RenderedContent content={reply.content} />
            )}

            {/* Actions row */}
            {!editing && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {/* Upvote */}
                <button
                  onClick={handleVote}
                  disabled={voteLoading}
                  className="flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors"
                  style={
                    hasVoted
                      ? { borderColor: 'color-mix(in oklch, var(--q-cyan) 50%, transparent)', background: 'color-mix(in oklch, var(--q-cyan) 10%, transparent)', color: 'var(--q-cyan)' }
                      : { borderColor: 'var(--q-line)', color: 'var(--q-muted)' }
                  }
                  aria-label={hasVoted ? 'Remove upvote' : 'Upvote'}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  {voteCount}
                </button>

                {/* Accept answer (only for question/help, only discussion owner/admin) */}
                {canAccept && (
                  <button
                    onClick={handleAccept}
                    disabled={acceptLoading}
                    className="flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors"
                    style={
                      reply.is_accepted
                        ? { borderColor: '#34D399', background: 'color-mix(in oklch, #34D399 15%, transparent)', color: '#34D399' }
                        : { borderColor: 'var(--q-line)', color: 'var(--q-muted)' }
                    }
                    aria-label={reply.is_accepted ? 'Unaccept answer' : 'Accept as answer'}
                  >
                    {acceptLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    {reply.is_accepted ? 'Accepted' : 'Accept'}
                  </button>
                )}

                {/* Reply (only one level deep) */}
                {depth === 0 && (
                  <button
                    onClick={() => setReplying((v) => !v)}
                    className="flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
                    aria-label="Reply to this comment"
                  >
                    <CornerDownRight className="h-3.5 w-3.5" />
                    Reply
                  </button>
                )}

                {/* Edit */}
                {isOwner && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-xl border p-1.5 transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
                    aria-label="Edit reply"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}

                {/* Delete */}
                {(isOwner || isAdmin) && (
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="rounded-xl border p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
                    aria-label="Delete reply"
                  >
                    {deleteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </button>
                )}

                {/* Report */}
                {!isOwner && (
                  <button
                    onClick={() => setReportOpen(true)}
                    className="ml-auto rounded-xl border p-1.5 transition-colors hover:bg-orange-500/10 hover:text-orange-400"
                    style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
                    aria-label="Report reply"
                  >
                    <Flag className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline reply composer */}
      {replying && depth === 0 && (
        <div className="mt-2 ml-6 sm:ml-10">
          <ReplyComposer
            discussionId={discussionId}
            parentReplyId={reply.id}
            placeholder={`Reply to ${reply.author.name}…`}
            onPosted={() => { setReplying(false); onRefresh() }}
            compact
          />
        </div>
      )}

      {/* Nested children (one level deep) */}
      {reply.children && reply.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {reply.children.map((child) => (
            <ReplyItem
              key={child.id}
              reply={child}
              discussionId={discussionId}
              discussionOwnerId={discussionOwnerId}
              discussionType={discussionType}
              onRefresh={onRefresh}
              depth={1}
            />
          ))}
        </div>
      )}

      {reportOpen && (
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          replyId={reply.id}
        />
      )}
    </div>
  )
}
