'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Video,
  FileText,
  Search,
  Filter,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Layers,
  Code2,
  CheckCircle2,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { RESOURCE_LIBRARY_ITEMS } from '@/lib/quantify-data'
import { ResourceItem, UserLevel } from '@/types/quantify'

export function ResourceLibrary() {
  const { userLevel, weakCategories, setActiveTab } = useQuantify()

  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredItems = RESOURCE_LIBRARY_ITEMS.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    if (levelFilter !== 'all' && item.level !== levelFilter) return false
    if (
      searchQuery.trim() &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.topicName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
              Resource Library (Screen 4.8)
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
              Videos &bull; Notes &bull; Code &bull; Docs
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Browse our complete repository of verified educational materials, filtered by difficulty, format, and topic.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-xl border border-zinc-800 bg-black/40 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Filter Sidebar (3 cols) */}
        <div className="space-y-4 lg:col-span-3">
          <div
            className="rounded-3xl border p-5 backdrop-blur-xl space-y-5"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <div>
              <div className="text-[11px] uppercase font-bold text-zinc-400 mb-2">Resource Format</div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: 'video', label: 'Video Lectures' },
                  { id: 'notes', label: 'Lecture Notes' },
                  { id: 'practice', label: 'Practice Circuits' },
                  { id: 'article', label: 'In-Depth Articles' },
                  { id: 'documentation', label: 'API Documentation' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTypeFilter(f.id)}
                    className={`w-full rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-all ${
                      typeFilter === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'var(--q-line)' }}>
              <div className="text-[11px] uppercase font-bold text-zinc-400 mb-2">Difficulty Level</div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Levels' },
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'advanced', label: 'Advanced' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevelFilter(lvl.id)}
                    className={`w-full rounded-xl px-3 py-1.5 text-left text-xs font-semibold capitalize transition-all ${
                      levelFilter === lvl.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {filteredItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-zinc-800/80 bg-white/[0.02] p-5 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase font-bold text-zinc-400 border border-white/10">
                        {item.type} &bull; {item.level}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-300">
                        {item.durationOrPages}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-white mt-3">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 font-mono">Topic: {item.topicName}</p>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--q-line)' }}>
                    <span className="text-[11px] text-zinc-500">Verified Peer-Reviewed Resource</span>
                    <button
                      onClick={() => setActiveTab('topic_learning')}
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
                    >
                      <span>Open Lesson</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Message (FR-RESOURCE-004) */
            <div className="rounded-3xl border border-zinc-800 p-12 text-center text-zinc-400">
              <Layers className="h-10 w-10 mx-auto text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-zinc-300">
                Resources coming soon for this specific filter (FR-RESOURCE-004).
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Try selecting "All Formats" or clearing your search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
