'use client'

import React from 'react'
import { Atom, Plus } from 'lucide-react'

interface DiscussionHeaderProps {
  onStartDiscussion: () => void
  isLoggedIn: boolean
}

export function DiscussionHeader({ onStartDiscussion, isLoggedIn }: DiscussionHeaderProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-6 sm:p-8"
      style={{
        borderColor: 'var(--q-line)',
        background:
          'linear-gradient(135deg, color-mix(in oklch, var(--q-bg-deep) 90%, transparent), color-mix(in oklch, var(--q-violet) 12%, transparent))',
      }}
    >
      {/* Decorative blur orb */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-30"
        style={{ background: 'var(--q-violet)' }}
        aria-hidden
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          {/* Label pill */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              color: 'var(--q-cyan)',
            }}
          >
            <Atom className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            Quantum Community
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Quantum Discussions
          </h1>

          <p className="text-sm max-w-xl" style={{ color: 'var(--q-muted)' }}>
            Ask questions, share ideas, discuss research papers, and connect with the
            Quantum Computing community.
          </p>
        </div>

        {isLoggedIn && (
          <button
            onClick={onStartDiscussion}
            id="start-discussion-btn"
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20 self-start sm:self-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            <Plus className="h-4 w-4" />
            Start Discussion
          </button>
        )}
      </div>
    </div>
  )
}
