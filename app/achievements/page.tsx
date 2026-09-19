'use client'

import React, { useState } from 'react'
import {
  Trophy,
  Award,
  Flame,
  Atom,
  Cpu,
  Zap,
  GraduationCap,
  MessageSquare,
  Lock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { ACHIEVEMENTS, Achievement } from '@/lib/mock/achievements'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AchievementsPage() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filteredBadges = ACHIEVEMENTS.filter(
    (b) => activeCategory === 'All' || b.category === activeCategory
  )

  const unlockedCount = ACHIEVEMENTS.filter((b) => b.unlocked).length

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `h-7 w-7 ${unlocked ? 'text-black' : 'text-slate-500'}` }
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap {...props} />
      case 'Atom':
        return <Atom {...props} />
      case 'Cpu':
        return <Cpu {...props} />
      case 'Flame':
        return <Flame {...props} />
      case 'Award':
        return <Award {...props} />
      case 'Zap':
        return <Zap {...props} />
      case 'MessageSquare':
        return <MessageSquare {...props} />
      default:
        return <Trophy {...props} />
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Trophy className="h-3.5 w-3.5" />
              Gamification & Honors
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Achievements</h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Unlock badges as you complete topics, build quantum circuits, and maintain learning streaks.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <Award className="h-6 w-6 text-amber-400" />
            <div>
              <p className="text-xs text-[var(--q-muted)]">Badges Unlocked</p>
              <p className="font-heading text-lg font-bold text-white">{unlockedCount} / {ACHIEVEMENTS.length}</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 border-b pb-4 text-xs font-semibold" style={{ borderColor: 'var(--q-line)' }}>
          {['All', 'Milestone', 'Simulator', 'Quiz', 'Streak'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-1.5 font-semibold transition-all ${
                activeCategory === cat
                  ? 'border-[var(--q-cyan)] bg-cyan-500/20 text-cyan-300'
                  : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center text-center rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                badge.unlocked
                  ? 'border-[var(--q-cyan)] bg-cyan-500/10 shadow-2xl shadow-cyan-500/10 hover:scale-105'
                  : 'border-white/5 bg-white/2 opacity-60'
              }`}
            >
              {/* Badge Icon Shield */}
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-3xl shadow-xl transition-transform ${
                  badge.unlocked
                    ? 'bg-gradient-to-tr from-cyan-400 to-violet-500 scale-105'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                {getBadgeIcon(badge.iconName, badge.unlocked)}
              </div>

              <h3 className="font-heading text-base font-bold text-white mb-1">{badge.title}</h3>
              <p className="text-xs text-[var(--q-muted)] leading-relaxed mb-4">{badge.description}</p>

              {/* Status Indicator Footer */}
              <div className="mt-auto pt-3 border-t w-full flex items-center justify-center gap-1.5 text-[11px]" style={{ borderColor: 'var(--q-line)' }}>
                {badge.unlocked ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Unlocked ({badge.unlockedAt})</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-slate-500">Locked Challenge</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
