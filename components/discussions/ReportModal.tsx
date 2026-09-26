'use client'

import React, { useState } from 'react'
import { X, Flag, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { submitReport } from '@/lib/api/discussion-reports'
import { useAuth } from '@/lib/auth-context'
import type { ReportReason } from '@/types/discussion'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  discussionId?: string
  replyId?: string
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam',          label: 'Spam' },
  { value: 'harassment',    label: 'Harassment' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'misleading',    label: 'Misleading Information' },
  { value: 'off-topic',     label: 'Off-topic' },
  { value: 'other',         label: 'Other' },
]

export function ReportModal({ open, onClose, discussionId, replyId }: ReportModalProps) {
  const { user } = useAuth()
  const [reason, setReason] = useState<ReportReason>('spam')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await submitReport(
      { discussion_id: discussionId, reply_id: replyId, reason, description },
      user.id
    )
    if (error) {
      toast.error('Unable to submit report. Please try again.')
    } else {
      toast.success('Report submitted. Our team will review it.')
      onClose()
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Report content"
    >
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl shadow-orange-900/20"
        style={{ borderColor: 'color-mix(in oklch, #F97316 30%, transparent)', background: 'var(--q-bg-deep)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--q-line)' }}>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-orange-400" />
            <h3 className="font-heading text-sm font-bold text-white">Report Content</h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-white/10 transition-colors" style={{ color: 'var(--q-muted)' }} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Reason */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Reason *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className="rounded-xl border p-2 text-xs font-medium text-left transition-colors"
                  style={
                    reason === r.value
                      ? { borderColor: 'color-mix(in oklch, #F97316 60%, transparent)', background: 'color-mix(in oklch, #F97316 15%, transparent)', color: '#FB923C' }
                      : { borderColor: 'var(--q-line)', color: 'var(--q-muted)' }
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="report-desc" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Additional Details
            </label>
            <textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional: briefly describe the issue…"
              className="w-full rounded-2xl border px-3 py-2.5 text-sm outline-none resize-none placeholder:text-slate-600"
              style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)', color: 'white' }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white transition-colors"
              style={{ background: '#DC2626' }}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
