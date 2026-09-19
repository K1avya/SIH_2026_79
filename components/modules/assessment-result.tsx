'use client'

import React from 'react'
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Cpu,
  BarChart3,
  ShieldCheck,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function AssessmentResult() {
  const {
    userLevel,
    categoryScores,
    weakCategories,
    strongCategories,
    retakeAssessment,
    setActiveTab,
    assessmentAttempts,
  } = useQuantify()

  const totalScore = categoryScores.reduce((acc, c) => acc + c.score, 0)
  const maxScore = categoryScores.length * 2

  return (
    <div className="w-full space-y-6">
      {/* Result Hero Header */}
      <div
        className="rounded-3xl border p-8 text-center backdrop-blur-xl relative overflow-hidden"
        style={{
          borderColor: 'var(--q-line)',
          background: 'radial-gradient(circle at 50% 20%, color-mix(in oklch, var(--q-violet) 25%, transparent), var(--q-bg-deep))',
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--q-cyan)]/20 text-[var(--q-cyan)] mb-4">
          <Trophy className="h-8 w-8" />
        </div>

        <span className="rounded-full bg-cyan-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
          Diagnostic Evaluation Complete (FR-LEVEL-001)
        </span>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-4">
          Assessed Level:{' '}
          <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)]">
            {userLevel}
          </span>
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-300">
          You scored <strong className="text-white">{totalScore} / {maxScore}</strong> across the 5 fundamental quantum categories. Your curriculum has been dynamically adapted to prioritize your detected knowledge gaps.
        </p>

        {/* Level Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className={`rounded-xl px-4 py-2 text-xs font-bold uppercase border ${
            userLevel === 'beginner'
              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'border-zinc-800 text-zinc-500 opacity-60'
          }`}>
            Beginner (0–3)
          </span>
          <span className={`rounded-xl px-4 py-2 text-xs font-bold uppercase border ${
            userLevel === 'intermediate'
              ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'border-zinc-800 text-zinc-500 opacity-60'
          }`}>
            Intermediate (4–7)
          </span>
          <span className={`rounded-xl px-4 py-2 text-xs font-bold uppercase border ${
            userLevel === 'advanced'
              ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'border-zinc-800 text-zinc-500 opacity-60'
          }`}>
            Advanced (8–10)
          </span>
        </div>
      </div>

      {/* Category Breakdown 5-Card Grid (FR-LEVEL-002 & FR-LEVEL-003) */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6 gap-2" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <span>Category-Wise Strength & Weakness Breakdown (FR-LEVEL-002)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Categories scoring 0/2 are marked <strong>Weak</strong> and re-inserted early in your path (FR-LEVEL-003, FR-PATH-002).
            </p>
          </div>
        </div>

        {/* 5-Column Responsive Category Grid across window */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoryScores.map((cat) => {
            const percent = (cat.score / cat.total) * 100
            return (
              <div
                key={cat.category}
                className={`rounded-2xl border p-4 backdrop-blur-md flex flex-col justify-between transition-all ${
                  cat.isWeak
                    ? 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_16px_rgba(245,158,11,0.15)]'
                    : cat.isStrong
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-zinc-800 bg-white/[0.02]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                      {cat.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        cat.isWeak
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : cat.isStrong
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {cat.isWeak ? 'Weak (0/2)' : cat.isStrong ? 'Strong (2/2)' : '1/2'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-2xl font-bold text-white">
                      {cat.score} <span className="text-xs text-zinc-500">/ {cat.total}</span>
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{Math.round(percent)}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        cat.isWeak ? 'bg-amber-400' : cat.isStrong ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6" style={{ borderColor: 'var(--q-line)' }}>
          <button
            onClick={retakeAssessment}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake 10-Q Assessment (FR-ASSESS-004)</span>
          </button>

          <button
            onClick={() => setActiveTab('learning_path')}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
            style={{
              background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            }}
          >
            <span>Proceed to Personalized Learning Path</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
