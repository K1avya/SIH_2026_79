'use client'

import React, { useState, useEffect } from 'react'
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
import { supabase } from '@/backend/supabase-client'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AchievementsPage() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<Achievement[]>(ACHIEVEMENTS)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Fetch real master achievements and user unlock state from Supabase
  useEffect(() => {
    async function loadAchievements() {
      try {
        const [achieveRes, userAchieveRes] = await Promise.all([
          supabase.from('achievements').select('*'),
          supabase.from('user_achievements').select('*').eq('user_id', user.id),
        ])

        if (!achieveRes.error && achieveRes.data && achieveRes.data.length > 0) {
          const userEarnedMap = new Map<string, { isEarned: boolean; earnedAt?: string; progress?: number }>()
          if (userAchieveRes.data) {
            userAchieveRes.data.forEach((ua: any) => {
              userEarnedMap.set(ua.achievementId, {
                isEarned: ua.isEarned,
                earnedAt: ua.earnedAt ? new Date(ua.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
                progress: ua.progress,
              })
            })
          }

          const mapped: Achievement[] = achieveRes.data.map((b: any) => {
            const userEarned = userEarnedMap.get(b.id)
            const isUnlocked = userEarned?.isEarned || user.unlockedBadges.includes(b.id)
            return {
              id: b.id,
              title: b.title,
              description: b.description,
              iconName: b.icon,
              unlocked: isUnlocked,
              unlockedAt: userEarned?.earnedAt || (isUnlocked ? 'Earned' : undefined),
              category: b.category as any,
            }
          })
          setBadges(mapped)
        }
      } catch (err) {
        console.warn('Using mock achievements fallback:', err)
      }
    }

    loadAchievements()
  }, [user.id, user.unlockedBadges])

  const filteredBadges = badges.filter(
    (b) => activeCategory === 'All' || b.category === activeCategory
  )

  const unlockedCount = badges.filter((b) => b.unlocked).length

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
              Gamified Mastery Accolades
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Achievements & Honors</h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Earn badges for completing milestone diagnostic assessments, maintaining streaks, and executing algorithms.
            </p>
          </div>

          <div className="flex items-center gap-3 border rounded-2xl p-3 px-5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-[var(--q-muted)] uppercase tracking-wider font-semibold">Unlocked Badges</p>
              <p className="font-heading text-lg font-bold text-white">{unlockedCount} / {badges.length}</p>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {['All', 'Milestone', 'Simulator', 'Quiz', 'Streak'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-2xl border px-4 py-2 transition-all ${
                activeCategory === cat
                  ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)]/15 text-white'
                  : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.unlocked

            return (
              <div
                key={badge.id}
                className={`rounded-3xl border p-5 backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all ${
                  isUnlocked
                    ? 'border-white/20 bg-[var(--q-bg-deep)] shadow-xl shadow-cyan-500/5 hover:border-[var(--q-cyan)]/40'
                    : 'border-white/5 bg-black/40 opacity-60'
                }`}
                style={{ borderColor: isUnlocked ? 'var(--q-line)' : undefined }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {/* Badge Icon Medallion */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner ${
                        isUnlocked
                          ? 'border-cyan-400/40 shadow-cyan-500/20'
                          : 'border-white/10 bg-slate-900'
                      }`}
                      style={{
                        background: isUnlocked
                          ? 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))'
                          : undefined,
                      }}
                    >
                      {getBadgeIcon(badge.iconName, isUnlocked)}
                    </div>

                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--q-muted)]">
                      {badge.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {isUnlocked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-[var(--q-muted)] mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3 flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--q-line)' }}>
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {badge.unlockedAt ? `Unlocked on ${badge.unlockedAt}` : 'Unlocked'}
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
