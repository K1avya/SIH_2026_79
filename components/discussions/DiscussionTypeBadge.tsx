'use client'

import React from 'react'
import type { DiscussionType } from '@/types/discussion'

const TYPE_CONFIG: Record<
  DiscussionType,
  { label: string; bg: string; color: string }
> = {
  question:   { label: 'Question',   bg: 'color-mix(in oklch, var(--q-cyan) 15%, transparent)',   color: 'var(--q-cyan)'   },
  discussion: { label: 'Discussion', bg: 'color-mix(in oklch, var(--q-violet) 15%, transparent)', color: 'var(--q-violet)' },
  research:   { label: 'Research',   bg: 'color-mix(in oklch, #818CF8 15%, transparent)',          color: '#818CF8'         },
  project:    { label: 'Project',    bg: 'color-mix(in oklch, #34D399 15%, transparent)',          color: '#34D399'         },
  help:       { label: 'Help',       bg: 'color-mix(in oklch, #FB923C 15%, transparent)',          color: '#FB923C'         },
}

interface DiscussionTypeBadgeProps {
  type: DiscussionType
  size?: 'sm' | 'xs'
}

export function DiscussionTypeBadge({ type, size = 'xs' }: DiscussionTypeBadgeProps) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.discussion

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-2 py-0.5 text-[10px]'
      }`}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
