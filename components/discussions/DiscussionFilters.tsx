'use client'

import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { DiscussionCategory, DiscussionFilters, DiscussionSortBy, DiscussionType } from '@/types/discussion'

interface DiscussionFiltersProps {
  filters: DiscussionFilters
  categories: DiscussionCategory[]
  onChange: (filters: Partial<DiscussionFilters>) => void
}

const SORT_OPTIONS: { value: DiscussionSortBy; label: string }[] = [
  { value: 'latest',      label: 'Latest' },
  { value: 'most_active', label: 'Most Active' },
  { value: 'most_voted',  label: 'Most Voted' },
  { value: 'unanswered',  label: 'Unanswered' },
  { value: 'solved',      label: 'Solved' },
]

const TYPE_OPTIONS: { value: DiscussionType | 'all'; label: string }[] = [
  { value: 'all',        label: 'All Types' },
  { value: 'question',   label: 'Questions' },
  { value: 'discussion', label: 'Discussions' },
  { value: 'research',   label: 'Research' },
  { value: 'project',    label: 'Projects' },
  { value: 'help',       label: 'Help' },
]

const selectStyle: React.CSSProperties = {
  borderColor: 'var(--q-line)',
  background: 'var(--q-bg-deep)',
  color: 'white',
}

export function DiscussionFilters({ filters, categories, onChange }: DiscussionFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: 'var(--q-muted)' }}
        />
        <input
          id="discussions-search"
          type="text"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Search discussions, concepts, tags…"
          className="w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors"
          style={{ ...selectStyle }}
          aria-label="Search discussions"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--q-muted)' }} />

        {/* Category */}
        <select
          id="discussions-category-filter"
          value={filters.category_slug ?? 'all'}
          onChange={(e) => onChange({ category_slug: e.target.value, page: 1 })}
          className="rounded-2xl border px-3 py-2 text-xs outline-none"
          style={selectStyle}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          id="discussions-type-filter"
          value={filters.type ?? 'all'}
          onChange={(e) => onChange({ type: e.target.value as any, page: 1 })}
          className="rounded-2xl border px-3 py-2 text-xs outline-none"
          style={selectStyle}
          aria-label="Filter by type"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          id="discussions-sort"
          value={filters.sort ?? 'latest'}
          onChange={(e) => onChange({ sort: e.target.value as DiscussionSortBy, page: 1 })}
          className="rounded-2xl border px-3 py-2 text-xs outline-none"
          style={selectStyle}
          aria-label="Sort discussions"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {(filters.search || filters.category_slug || filters.type || filters.sort !== 'latest') && (
          <button
            onClick={() => onChange({ search: '', category_slug: undefined, type: 'all', sort: 'latest', page: 1 })}
            className="rounded-2xl border px-3 py-2 text-xs font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
