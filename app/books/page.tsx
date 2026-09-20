'use client'

import React, { useState, useEffect } from 'react'
import { BookMarked, Bookmark, BookmarkCheck, Star, ExternalLink, Sparkles, X, Info } from 'lucide-react'
import { RecommendedBook, FALLBACK_BOOKS, fetchBooksServer } from '@/lib/api/books'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function BooksPage() {
  const { user, toggleBookmarkBook } = useAuth()
  const [books, setBooks] = useState<RecommendedBook[]>(FALLBACK_BOOKS)
  const [activeBook, setActiveBook] = useState<RecommendedBook | null>(null)

  // Fetch curated book recommendations from database API
  useEffect(() => {
    async function loadBooks() {
      const { data } = await fetchBooksServer()
      if (data && data.length > 0) {
        setBooks(data)
      }
    }

    loadBooks()
  }, [])

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
          {books.map((book) => {
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
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold">
                        {book.relatedTopic}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="font-bold">{book.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-heading text-base font-bold text-white leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[var(--q-muted)] line-clamp-2">
                      {book.description}
                    </p>

                    {/* AI Recommendation Reason */}
                    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-[11px] text-cyan-200/90 leading-relaxed">
                      <span className="font-bold text-cyan-300 block mb-0.5">Why recommended for you:</span>
                      {book.whyRecommended}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--q-line)' }}>
                    <button
                      onClick={() => toggleBookmarkBook(book.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        isBookmarked ? 'text-amber-400' : 'text-[var(--q-muted)] hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>

                    <a
                      href={book.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[var(--q-cyan)] transition-colors"
                    >
                      <span>Preview Book</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
