'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, Hash, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createDiscussion, fetchCategories, FALLBACK_CATEGORIES } from '@/lib/api/discussions'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import type { DiscussionCategory, DiscussionType, CreateDiscussionPayload } from '@/types/discussion'

interface CreateDiscussionModalProps {
  open: boolean
  onClose: () => void
}

const DISCUSSION_TYPES: { value: DiscussionType; label: string; description: string }[] = [
  { value: 'question',   label: '❓ Question',   description: 'Ask for help or explanation' },
  { value: 'discussion', label: '💬 Discussion', description: 'Open-ended topic exploration' },
  { value: 'research',   label: '📚 Research',   description: 'Share or discuss a paper' },
  { value: 'project',    label: '🚀 Project',    description: 'Show off your quantum work' },
  { value: 'help',       label: '🆘 Help',       description: 'Debug or troubleshoot' },
]

const PLACEHOLDER_CONTENT: Record<DiscussionType, string> = {
  question:
    'Describe your question clearly. Include:\n- What you already know\n- What you have tried\n- Your specific confusion\n\nCode example:\n```python\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\n```',
  discussion:
    'Share your thoughts on this topic. You can use code blocks:\n```python\n# Your quantum code here\n```\n\nOr mathematical notation:\n|ψ⟩ = α|0⟩ + β|1⟩',
  research:
    'Reference the paper and share your thoughts:\n\nPaper: [Title, Authors, Year]\nKey insight: ...\n\nDiscussion points:\n1. ...\n2. ...',
  project:
    'Describe your project:\n- Goal / motivation\n- What you built\n- Tech stack (Qiskit, PennyLane, etc.)\n- Results\n\n```python\n# Key code snippet\n```',
  help:
    'Describe the problem:\n- Expected behaviour\n- Actual behaviour\n- Code producing the issue:\n\n```python\nfrom qiskit import QuantumCircuit\n# your circuit code\n```\n\n- Error message if any',
}

export function CreateDiscussionModal({ open, onClose }: CreateDiscussionModalProps) {
  const { user } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<DiscussionCategory[]>(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<{
    type: DiscussionType
    category_id: string
    title: string
    content: string
    tagInput: string
    tags: string[]
  }>({
    type: 'question',
    category_id: '',
    title: '',
    content: PLACEHOLDER_CONTENT.question,
    tagInput: '',
    tags: [],
  })

  useEffect(() => {
    if (!open) return
    fetchCategories().then(({ data }) => {
      if (data.length > 0) setCategories(data)
    })
  }, [open])

  if (!open) return null

  const handleTypeChange = (type: DiscussionType) => {
    setForm((prev) => ({ ...prev, type, content: PLACEHOLDER_CONTENT[type] }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = form.tagInput.trim().replace(/,/g, '')
      if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }))
      }
    }
  }

  const removeTag = (t: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim() || form.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters.')
      return
    }
    if (!form.content.trim() || form.content.trim().length < 10) {
      toast.error('Content must be at least 10 characters.')
      return
    }

    setLoading(true)
    try {
      const payload: CreateDiscussionPayload = {
        type: form.type,
        category_id: form.category_id || null,
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags,
      }

      const { data, error } = await createDiscussion(payload, user.id)

      if (error) throw error
      if (!data) throw new Error('No discussion ID returned')

      toast.success('Discussion created successfully!')
      onClose()
      router.push(`/discussions/${data.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Unable to create discussion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    borderColor: 'var(--q-line)',
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create new discussion"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border my-8 shadow-2xl shadow-violet-900/30"
        style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--q-line)' }}
        >
          <h2 className="font-heading text-lg font-bold text-white">Start a Discussion</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 transition-colors hover:bg-white/10"
            style={{ color: 'var(--q-muted)' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Discussion Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Discussion Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DISCUSSION_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => handleTypeChange(dt.value)}
                  className="rounded-2xl border p-2 text-center text-[10px] font-semibold transition-all"
                  style={
                    form.type === dt.value
                      ? {
                          borderColor: 'color-mix(in oklch, var(--q-cyan) 60%, transparent)',
                          background: 'color-mix(in oklch, var(--q-cyan) 15%, transparent)',
                          color: 'var(--q-cyan)',
                        }
                      : { borderColor: 'var(--q-line)', color: 'var(--q-muted)' }
                  }
                  title={dt.description}
                >
                  {dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="disc-category" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Category
            </label>
            <select
              id="disc-category"
              value={form.category_id}
              onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
              className="w-full rounded-2xl border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              <option value="">Select a category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="disc-title" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Title *
            </label>
            <input
              id="disc-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. How does Grover's algorithm achieve quadratic speedup?"
              maxLength={300}
              className="w-full rounded-2xl border px-3 py-2.5 text-sm outline-none placeholder:text-slate-600"
              style={inputStyle}
              required
            />
            <p className="text-right text-[10px]" style={{ color: 'var(--q-muted)' }}>
              {form.title.length}/300
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="disc-content" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Content * <span className="normal-case font-normal">(supports code blocks: ```python … ```)</span>
            </label>
            <textarea
              id="disc-content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={10}
              className="w-full rounded-2xl border px-3 py-2.5 text-sm outline-none resize-y font-mono leading-relaxed placeholder:text-slate-600"
              style={inputStyle}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="disc-tags" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--q-muted)' }}>
              Tags <span className="normal-case font-normal">(press Enter or comma to add, max 5)</span>
            </label>
            <div
              className="flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2"
              style={inputStyle}
            >
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border"
                  style={{
                    borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)',
                    background: 'color-mix(in oklch, var(--q-cyan) 10%, transparent)',
                    color: 'var(--q-cyan)',
                  }}
                >
                  <Hash className="h-2.5 w-2.5" />
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="ml-0.5 opacity-60 hover:opacity-100"
                    aria-label={`Remove tag ${t}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {form.tags.length < 5 && (
                <input
                  id="disc-tags"
                  type="text"
                  value={form.tagInput}
                  onChange={(e) => setForm((prev) => ({ ...prev, tagInput: e.target.value }))}
                  onKeyDown={handleTagKeyDown}
                  placeholder={form.tags.length === 0 ? 'e.g. Grover, Qiskit, Algorithms…' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-slate-600"
                  style={{ color: 'white' }}
                />
              )}
            </div>
          </div>

          {/* Tip */}
          <div
            className="flex items-start gap-2 rounded-2xl border p-3 text-xs"
            style={{
              borderColor: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
              background: 'color-mix(in oklch, var(--q-cyan) 5%, transparent)',
              color: 'var(--q-muted)',
            }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-[var(--q-cyan)]" />
            <span>
              Use <code className="text-[var(--q-cyan)]">```python … ```</code> for code blocks.
              For quantum notation use plain text: <code className="text-[var(--q-cyan)]">|ψ⟩ = α|0⟩ + β|1⟩</code>
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--q-line)' }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 disabled:opacity-60 disabled:scale-100"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating…' : 'Post Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
