'use client'

import React, { useState } from 'react'
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Video,
  FileText,
  BookOpen,
  Code,
  GraduationCap,
  Filter,
  X,
} from 'lucide-react'
import { RESOURCES, LearningResource } from '@/lib/mock/resources'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ResourcesPage() {
  const { user, toggleBookmarkResource } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null)

  const filteredResources = RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === 'All' || res.type === selectedType
    const matchesLevel = selectedLevel === 'All' || res.level === selectedLevel

    return matchesSearch && matchesType && matchesLevel
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="h-4 w-4 text-cyan-400" />
      case 'Paper':
        return <FileText className="h-4 w-4 text-violet-400" />
      case 'Course':
        return <GraduationCap className="h-4 w-4 text-emerald-400" />
      case 'Notebook':
        return <Code className="h-4 w-4 text-amber-400" />
      default:
        return <BookOpen className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Resource Library</h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Curated quantum computing papers, video tutorials, notebooks, and reference materials.
            </p>
          </div>

          <div className="text-xs text-[var(--q-muted)] border rounded-xl p-2.5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <span>Bookmarked Resources: <strong className="text-cyan-300">{user.bookmarkedResources.length}</strong></span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-3xl border p-4 sm:p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--q-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title, topic, author, or keyword..."
              className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-[var(--q-cyan)] focus:ring-2 focus:ring-[var(--q-cyan)]/20"
              style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}
            />
          </div>

          {/* Type & Level Pill Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1 mr-1">
                <Filter className="h-3.5 w-3.5 text-[var(--q-cyan)]" /> Type:
              </span>
              {['All', 'Video', 'Paper', 'Course', 'Documentation', 'Notebook'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`rounded-full border px-3 py-1 font-semibold transition-all ${
                    selectedType === t
                      ? 'border-[var(--q-cyan)] bg-cyan-500/20 text-cyan-300'
                      : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-white mr-1">Level:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-full border px-3 py-1 font-semibold transition-all ${
                    selectedLevel === lvl
                      ? 'border-[var(--q-violet)] bg-violet-500/20 text-violet-300'
                      : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Cards Grid */}
        {filteredResources.length === 0 ? (
          <EmptyState
            title="No resources match your filters"
            description="Try clearing search query or adjusting filter tags."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('')
              setSelectedType('All')
              setSelectedLevel('All')
            }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((res) => {
              const isBookmarked = user.bookmarkedResources.includes(res.id)
              return (
                <div
                  key={res.id}
                  className="flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: 'var(--q-line)',
                    background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(res.type)}
                        <span className="text-xs font-semibold text-white">{res.type}</span>
                      </div>

                      <button
                        onClick={() => toggleBookmarkResource(res.id)}
                        className="text-[var(--q-muted)] hover:text-amber-400 transition-colors"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <h3 className="font-heading text-base font-bold text-white leading-snug">{res.title}</h3>
                    <p className="text-xs text-[var(--q-muted)] line-clamp-3 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="mt-6 border-t pt-4 space-y-3" style={{ borderColor: 'var(--q-line)' }}>
                    <div className="flex items-center justify-between text-[11px] text-[var(--q-muted)]">
                      <span>Author: {res.author}</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 font-semibold text-cyan-300">
                        {res.level}
                      </span>
                    </div>

                    <button
                      onClick={() => setPreviewResource(res)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                      style={{ borderColor: 'var(--q-line)' }}
                    >
                      <span>Open Resource</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal Resource Preview */}
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewResource(null)}>
            <div
              className="w-full max-w-xl rounded-3xl border p-6 space-y-5"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <div className="flex items-center gap-2">
                  {getResourceIcon(previewResource.type)}
                  <span className="font-heading text-sm font-bold text-white">{previewResource.type} Preview</span>
                </div>
                <button onClick={() => setPreviewResource(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-white">{previewResource.title}</h2>
                <p className="mt-1 text-xs text-cyan-300">Author: {previewResource.author} • {previewResource.duration}</p>
                <p className="mt-4 text-xs text-slate-300 leading-relaxed">{previewResource.description}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold text-[var(--q-muted)]"
                  style={{ borderColor: 'var(--q-line)' }}
                >
                  Close
                </button>
                <a
                  href={previewResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  <span>Launch External Resource</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
