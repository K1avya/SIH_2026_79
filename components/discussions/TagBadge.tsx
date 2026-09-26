'use client'

import React from 'react'
import { Hash } from 'lucide-react'
import type { DiscussionTag } from '@/types/discussion'

interface TagBadgeProps {
  tag: DiscussionTag
  onClick?: (tag: DiscussionTag) => void
}

export function TagBadge({ tag, onClick }: TagBadgeProps) {
  const El = onClick ? 'button' : 'span'

  return (
    <El
      onClick={onClick ? () => onClick(tag) : undefined}
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium border transition-colors ${
        onClick ? 'cursor-pointer hover:text-white hover:border-white/20' : ''
      }`}
      style={{
        borderColor: 'var(--q-line)',
        color: 'var(--q-muted)',
        background: 'color-mix(in oklch, var(--q-bg-deep) 80%, transparent)',
      }}
      title={tag.name}
    >
      <Hash className="h-2.5 w-2.5" />
      {tag.name}
    </El>
  )
}
