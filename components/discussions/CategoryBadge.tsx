'use client'

import React from 'react'
import type { DiscussionCategory } from '@/types/discussion'

interface CategoryBadgeProps {
  category: DiscussionCategory | null
  size?: 'sm' | 'xs'
}

export function CategoryBadge({ category, size = 'xs' }: CategoryBadgeProps) {
  if (!category) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-2 py-0.5 text-[10px]'
      }`}
      style={{
        borderColor: 'color-mix(in oklch, var(--q-violet) 30%, transparent)',
        background: 'color-mix(in oklch, var(--q-violet) 10%, transparent)',
        color: 'var(--q-muted)',
      }}
    >
      {category.icon && <span className="leading-none">{category.icon}</span>}
      <span>{category.name}</span>
    </span>
  )
}
