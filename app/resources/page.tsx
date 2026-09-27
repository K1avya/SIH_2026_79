'use client'

import React, { useState, useEffect } from 'react'
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
  Sparkles,
} from 'lucide-react'
import { LearningResource, FALLBACK_RESOURCES, fetchResourcesServer } from '@/lib/api/resources'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ResourcesPage() {
  const { user, toggleBookmarkResource } = useAuth()
  const [resources, setResources] = useState<LearningResource[]>(FALLBACK_RESOURCES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null)

  // Fetch real resources from Supabase database API
  useEffect(() => {
    async function loadResources() {
      const { data } = await fetchResourcesServer()
      if (data && data.length > 0) {
        setResources(data)
      }
    }

    loadResources()
  }, [])

  const filteredResources = resources.filter((res) => {
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
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Sparkles className="h-3.5 w-3.5" />
              Resource Hub Active
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Resource Repository</h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Curated research papers, video lectures, and Jupyter notebooks aligned with your learning path.
            </p>
          </div>

          <div className="text-xs text-[var(--q-muted)] border rounded-xl p-2.5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <span>Bookmarked: <strong className="text-amber-400">{user?.bookmarkedResources?.length || 0}</strong></span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--q-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic, or author..."
              className="w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs text-white outline-none"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-2xl border p-2.5 text-xs text-white outline-none"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <option value="All">All Formats</option>
              <option value="Video">Videos</option>
              <option value="Paper">Papers</option>
              <option value="Course">Courses</option>
              <option value="Notebook">Notebooks</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-2xl border p-2.5 text-xs text-white outline-none"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <option value="All">All Tiers</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <EmptyState
            title="No Resources Found"
            description="No learning resources match your current filter parameters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('')
              setSelectedType('All')
              setSelectedLevel('All')
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((res) => {
              const isBookmarked = user?.bookmarkedResources?.includes(res.id) || false

              return (
                <div
                  key={res.id}
                  className="rounded-3xl border p-5 backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01]"
                  style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        {getResourceIcon(res.type)}
                        <span>{res.type}</span>
                      </span>
                      <span className="text-[10px] text-[var(--q-muted)]">{res.duration}</span>
                    </div>

                    <h3 className="font-heading text-sm font-bold text-white line-clamp-2 leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-xs text-[var(--q-muted)] line-clamp-3 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--q-line)' }}>
                    <button
                      onClick={() => toggleBookmarkResource(res.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        isBookmarked ? 'text-amber-400' : 'text-[var(--q-muted)] hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[var(--q-cyan)] transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
