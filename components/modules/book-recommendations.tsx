'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function BookRecommendations() {
  const {
    books,
    toggleBookmarkBook,
    userLevel,
    weakCategories,
  } = useQuantify()

  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false)

  const filteredBooks = books.filter((b) => {
    if (onlyBookmarked && !b.bookmarked) return false
    if (filterLevel !== 'all' && b.levelTag !== filterLevel) return false
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
              Curated Book Recommendations (FR-BOOK-001..004)
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
              Curated Real Publications
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Selected textbooks with explicit diagnostic reasoning tags mapped to your assessed level and weak topic categories.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-white outline-none"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-semibold transition-all ${
              onlyBookmarked
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarked Only</span>
          </button>
        </div>
      </div>

      {/* Books Grid - Spreads fluidly across window */}
      {filteredBooks.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {filteredBooks.map((book) => {
            const isTargetedToWeakness = weakCategories.includes(book.relatedCategory)
            return (
              <div
                key={book.id}
                className={`rounded-3xl border p-5 backdrop-blur-xl flex flex-col justify-between transition-all ${
                  isTargetedToWeakness
                    ? 'border-amber-500/50 bg-amber-950/15 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'border-zinc-800/80 bg-white/[0.02] hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Category & Bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase font-bold text-zinc-400 border border-white/10">
                      {book.levelTag} &bull; {book.relatedCategory}
                    </span>

                    <button
                      onClick={() => toggleBookmarkBook(book.id)}
                      className="text-zinc-400 hover:text-cyan-300 transition-colors p-1"
                      title={book.bookmarked ? 'Remove bookmark' : 'Bookmark this book'}
                    >
                      {book.bookmarked ? (
                        <BookmarkCheck className="h-5 w-5 text-cyan-400 fill-cyan-400" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-heading text-base font-bold text-white mt-3 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">By {book.author}</p>

                  {/* "Why Recommended" Box (FR-BOOK-002) */}
                  <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-xs text-cyan-200 leading-relaxed">
                    <span className="font-bold block text-cyan-300 mb-0.5">Why Recommended:</span>
                    {book.whyRecommended}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t flex items-center justify-between text-[11px] text-zinc-500 font-mono" style={{ borderColor: 'var(--q-line)' }}>
                  <span>ISBN: {book.isbn}</span>
                  <span className="text-zinc-400">{book.bookmarked ? 'Saved' : 'Reading List'}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 p-12 text-center text-zinc-400">
          <BookOpen className="h-10 w-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-300">No books found matching the current filters.</p>
          <p className="text-xs text-zinc-500 mt-1">Try toggling the bookmarked filter or selecting all difficulty levels.</p>
        </div>
      )}
    </div>
  )
}
