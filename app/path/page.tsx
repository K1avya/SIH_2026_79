'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import { fetchLearningPathServer, getFallbackLearningPath, LearningPathItem } from '@/lib/api/learning-path'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function LearningPathPage() {
  const { user } = useAuth()
  const [pathItems, setPathItems] = useState<LearningPathItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPath() {
      setLoading(true)
      try {
        const { data } = await fetchLearningPathServer(user.id, user.completedTopics, user.weakTopics)
        if (data && data.length > 0) {
          setPathItems(data)
        } else {
          setPathItems(getFallbackLearningPath(user.completedTopics, user.weakTopics))
        }
      } catch (err) {
        console.warn('Using fallback learning path topics:', err)
        setPathItems(getFallbackLearningPath(user.completedTopics, user.weakTopics))
      } finally {
        setLoading(false)
      }
    }

    loadPath()
  }, [user.id, user.completedTopics, user.level, user.weakTopics])

  const completedCount = pathItems.filter((i) => i.status === 'completed').length
  const totalCount = pathItems.length || 8

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl py-4 sm:py-6 space-y-8">
        {/* Roadmap Title Banner */}
        <div
          className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
          style={{
            borderColor: 'var(--q-line)',
            background: 'linear-gradient(135deg, color-mix(in oklch, var(--q-bg-deep) 90%, transparent), color-mix(in oklch, var(--q-violet) 15%, transparent))',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive Curriculum Roadmap
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Your Quantum Learning Path</h1>
              <p className="mt-1 text-sm text-[var(--q-muted)]">
                Curriculum tailored for level: <strong className="text-[var(--q-cyan)]">{user.level}</strong> based on diagnostic evaluation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border p-3 text-center" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <p className="text-xs text-[var(--q-muted)]">Completed</p>
                <p className="font-heading text-lg font-bold text-emerald-400">{completedCount} / {totalCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline Nodes */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
          {pathItems.map((item, index) => {
            const topic = item.topic
            const isCompleted = item.status === 'completed'
            const isAvailable = item.status === 'available' || item.status === 'in_progress'
            const isLocked = item.status === 'locked'

            return (
              <div key={item.id} className="relative group">
                {/* Node Milestone Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400'
                      : isAvailable
                      ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)]/20 text-[var(--q-cyan)] shadow-lg shadow-[var(--q-cyan)]/20'
                      : 'border-white/20 bg-slate-900 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : isAvailable ? (
                    <div className="h-2 w-2 rounded-full bg-[var(--q-cyan)] animate-ping" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>

                {/* Module Card */}
                <div
                  className={`rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
                    isAvailable
                      ? 'border-white/20 bg-[var(--q-bg-deep)] shadow-xl shadow-cyan-500/5 hover:border-[var(--q-cyan)]/50'
                      : isCompleted
                      ? 'border-white/10 bg-white/5 opacity-80'
                      : 'border-white/5 bg-black/40 opacity-50'
                  }`}
                  style={{ borderColor: isAvailable ? 'var(--q-line)' : undefined }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold">
                          {topic.category}
                        </span>
                        <span className="rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 text-[10px] font-semibold">
                          {topic.level}
                        </span>
                        {item.isWeakPriority && (
                          <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Priority Revision
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-white">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-[var(--q-muted)] max-w-xl leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-[var(--q-muted)] pt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-cyan-400" />
                          {topic.videoDuration || '25 mins'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 text-violet-400" />
                          {topic.practiceQuestionsCount || 5} Questions
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isLocked ? (
                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-500 bg-white/5">
                          <Lock className="h-4 w-4" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <Link
                          href={`/topic/${topic.id}`}
                          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-transform hover:scale-105 ${
                            isCompleted
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'text-black shadow-lg shadow-cyan-500/20'
                          }`}
                          style={{
                            background: isCompleted ? undefined : 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                          }}
                        >
                          <span>{isCompleted ? 'Review Topic' : 'Start Topic'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
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
