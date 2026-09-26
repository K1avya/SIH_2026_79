'use client'

import React, { useState } from 'react'
import { Loader2, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createReply } from '@/lib/api/replies'
import { useAuth } from '@/lib/auth-context'
import type { CreateReplyPayload } from '@/types/discussion'

interface ReplyComposerProps {
  discussionId: string
  parentReplyId?: string | null
  placeholder?: string
  onPosted: () => void
  compact?: boolean
}

export function ReplyComposer({
  discussionId,
  parentReplyId = null,
  placeholder = 'Share your quantum insight… (supports ```python code blocks```)',
  onPosted,
  compact = false,
}: ReplyComposerProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (content.trim().length < 1) {
      toast.error('Reply cannot be empty.')
      return
    }

    setLoading(true)
    const payload: CreateReplyPayload = {
      discussion_id: discussionId,
      parent_reply_id: parentReplyId,
      content: content.trim(),
    }
    const { error } = await createReply(payload, user.id)
    if (error) {
      toast.error('Unable to post reply. Please try again.')
    } else {
      toast.success('Reply posted!')
      setContent('')
      onPosted()
    }
    setLoading(false)
  }

  return (
    <div
      className={`rounded-3xl border ${compact ? 'p-4' : 'p-5'}`}
      style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
    >
      {!compact && (
        <h3 className="font-heading text-sm font-bold text-white mb-4">
          Post a Reply
        </h3>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-[11px] font-bold text-black"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            {initials}
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={compact ? 3 : 5}
            placeholder={placeholder}
            className="flex-1 rounded-2xl border px-3 py-2.5 text-sm font-mono leading-relaxed outline-none resize-y placeholder:text-slate-600"
            style={{
              borderColor: 'var(--q-line)',
              background: 'rgba(0,0,0,0.4)',
              color: 'white',
            }}
            aria-label="Reply content"
          />
        </div>

        <div className="flex items-center justify-between pl-11">
          {/* Code hint */}
          <p className="text-[10px] hidden sm:block" style={{ color: 'var(--q-muted)' }}>
            <AlertCircle className="h-3 w-3 inline mr-1" />
            Use <code className="text-[var(--q-cyan)]">```python … ```</code> for code blocks
          </p>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="ml-auto flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {loading ? 'Posting…' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
