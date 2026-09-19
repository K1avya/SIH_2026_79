'use client'

import React, { useState } from 'react'
import { BookMarked, Bookmark, BookmarkCheck, Star, ExternalLink, Sparkles, X, Info } from 'lucide-react'
import { RECOMMENDED_BOOKS, RecommendedBook } from '@/lib/mock/books'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function BooksPage() {
  const { user, toggleBookmarkBook } = useAuth()
  const [activeBook, setActiveBook] = useState<RecommendedBook | null>(null)

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-8">
        {/* Books Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Sparkles className="h-3.5 w-3.5" />
              AI Personalization Active
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Book Recommendations</h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Curated textbooks and guides tailored to your diagnostic assessment scores and current level.
            </p>
          </div>

          <div className="text-xs text-[var(--q-muted)] border rounded-xl p-2.5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <span>Bookmarked Books: <strong className="text-amber-400">{user.bookmarkedBooks.length}</strong></span>
          </div>
        </div>

        {/* Books Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {RECOMMENDED_BOOKS.map((book) => {
            const isBookmarked = user.bookmarkedBooks.includes(book.id)

            return (
              <div
                key={book.id}
                className="flex flex-col sm:flex-row rounded-3xl border overflow-hidden backdrop-blur-xl transition-all hover:scale-[1.01]"
                style={{
                  borderColor: 'var(--q-line)',
                  background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
                }}
              >
                {/* Book Cover Banner */}
                <div
                  className="flex h-48 sm:h-auto sm:w-44 shrink-0 flex-col justify-between p-5 text-white"
                  style={{ background: book.coverGradient }}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/30 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {book.level}
                    </span>
                    <BookMarked className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-heading text-xs font-bold leading-tight drop-shadow">{book.title}</p>
                    <p className="text-[10px] text-white/80 mt-1">{book.author}</p>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-base font-bold text-white leading-snug">{book.title}</h3>
                      <button
                        onClick={() => toggleBookmarkBook(book.id)}
                        className="text-[var(--q-muted)] hover:text-amber-400 transition-colors"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark book'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* SRS Mandatory Recommendation Rationale */}
                    <div className="rounded-2xl border p-3 flex items-start gap-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)', background: 'color-mix(in oklch, var(--q-cyan) 8%, transparent)' }}>
                      <Info className="h-4 w-4 text-[var(--q-cyan)] shrink-0 mt-0.5" />
                      <p className="text-xs text-cyan-200 leading-tight">
                        <strong>Why Recommended:</strong> {book.whyRecommended}
                      </p>
                    </div>

                    <p className="text-xs text-[var(--q-muted)] line-clamp-2">{book.description}</p>
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: 'var(--q-line)' }}>
                    <div className="flex items-center gap-3 text-xs text-[var(--q-muted)]">
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        {book.rating}
                      </span>
                      <span>{book.pages} pages</span>
                    </div>

                    <button
                      onClick={() => setActiveBook(book)}
                      className="flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      style={{ borderColor: 'var(--q-line)' }}
                    >
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Book Details Modal */}
        {activeBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setActiveBook(null)}>
            <div
              className="w-full max-w-xl rounded-3xl border p-6 space-y-5"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <span className="font-heading text-sm font-bold text-white">Book Overview</span>
                <button onClick={() => setActiveBook(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-xl font-bold text-white">{activeBook.title}</h2>
                <p className="text-xs text-cyan-300">By {activeBook.author}</p>

                <div className="rounded-2xl border p-3.5 text-xs text-amber-200" style={{ borderColor: 'color-mix(in oklch, #F59E0B 30%, transparent)', background: 'color-mix(in oklch, #F59E0B 8%, transparent)' }}>
                  <strong>Personalized Recommendation Rationale:</strong>
                  <p className="mt-1">{activeBook.whyRecommended}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{activeBook.description}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button
                  onClick={() => setActiveBook(null)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold text-[var(--q-muted)]"
                  style={{ borderColor: 'var(--q-line)' }}
                >
                  Close
                </button>
                <a
                  href={activeBook.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  <span>Publisher Link</span>
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
