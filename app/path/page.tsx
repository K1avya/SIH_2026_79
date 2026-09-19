'use client'

import React from 'react'
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
} from 'lucide-react'
import { TOPICS, Topic } from '@/lib/mock/topics'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function LearningPathPage() {
  const { user } = useAuth()

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
                <p className="font-heading text-lg font-bold text-emerald-400">4 / 8</p>
              </div>
              <div className="rounded-2xl border p-3 text-center" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <p className="text-xs text-[var(--q-muted)]">Overall</p>
                <p className="font-heading text-lg font-bold text-[var(--q-cyan)]">{user.overallProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Weak Area Callout */}
        <div className="rounded-2xl border p-4 flex items-center gap-3" style={{ borderColor: 'color-mix(in oklch, #F59E0B 40%, transparent)', background: 'color-mix(in oklch, #F59E0B 8%, transparent)' }}>
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200">
            <strong>Personalized Priority Tag:</strong> <em>Single-Qubit Quantum Gates</em> has been prioritized earlier in your path to address diagnostic test recommendations.
          </p>
        </div>

        {/* Vertical Learning Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
          {TOPICS.map((topic, idx) => {
            const isCompleted = topic.status === 'Completed'
            const isInProgress = topic.status === 'In Progress'
            const isLocked = topic.status === 'Locked'
            const isWeakTarget = user.weakTopics.includes(topic.category) || topic.id === 'quantum-gates'

            return (
              <div key={topic.id} className="relative group">
                {/* Node Icon Circle */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-6 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                      : isInProgress
                      ? 'bg-[var(--q-cyan)] border-[var(--q-cyan)] text-black shadow-lg shadow-cyan-500/30 animate-pulse'
                      : isLocked
                      ? 'bg-slate-900 border-slate-700 text-slate-500'
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : isInProgress ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Topic Card */}
                <div
                  className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                    isInProgress
                      ? 'border-[var(--q-cyan)] bg-cyan-500/10 shadow-2xl shadow-cyan-500/10'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : isLocked
                      ? 'border-white/5 bg-white/2 opacity-60'
                      : 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border px-2 py-0.5 text-[11px] font-semibold text-[var(--q-cyan)]" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
                          {topic.category}
                        </span>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[var(--q-muted)]">
                          {topic.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[var(--q-muted)]">
                          <Clock className="h-3 w-3" />
                          {topic.estimatedTime}
                        </span>
                        {isWeakTarget && (
                          <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                            Priority Focus
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-[var(--q-cyan)] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[var(--q-muted)] max-w-xl">{topic.description}</p>
                    </div>

                    {/* Topic Action Button */}
                    <div className="shrink-0">
                      {isLocked ? (
                        <button disabled className="flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Locked</span>
                        </button>
                      ) : isCompleted ? (
                        <Link
                          href={`/topic/${topic.id}`}
                          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Review Topic</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/topic/${topic.id}`}
                          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                          style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                        >
                          <span>{isInProgress ? 'Continue Learning' : 'Start Topic'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
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
