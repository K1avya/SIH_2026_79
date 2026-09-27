'use client'

import React from 'react'
import Link from 'next/link'
import { Trophy, CheckCircle, AlertTriangle, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AssessmentResultPage() {
  const { user } = useAuth()

  // Category scores mock breakdown for demo display
  const categories = [
    { name: 'Basics', score: 2, total: 2, status: 'Strong' },
    { name: 'Qubits & Superposition', score: 2, total: 2, status: 'Strong' },
    { name: 'Gates', score: 1, total: 2, status: 'Needs Revision' },
    { name: 'Circuits', score: 1, total: 2, status: 'Needs Revision' },
    { name: 'Algorithms', score: 2, total: 2, status: 'Strong' },
  ]

  const totalScore = 8

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl py-6 space-y-8">
        {/* Results Banner Header */}
        <div
          className="relative overflow-hidden rounded-3xl border p-8 backdrop-blur-2xl text-center"
          style={{
            borderColor: 'var(--q-line)',
            background: 'linear-gradient(135deg, color-mix(in oklch, var(--q-bg-deep) 90%, transparent), color-mix(in oklch, var(--q-violet) 20%, transparent))',
            boxShadow: '0 0 50px color-mix(in oklch, var(--q-violet) 20%, transparent)',
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-4" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Assessment Evaluation Complete
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">Your Quantum Knowledge Profile</h1>

          {/* Level Badge Display */}
          <div className="my-6 inline-flex flex-col items-center">
            <div
              className="flex items-center gap-3 rounded-full px-8 py-3.5 text-xl font-bold tracking-wide text-black shadow-2xl"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <Trophy className="h-6 w-6 text-black" />
              <span>LEVEL: {user.level.toUpperCase()}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--q-muted)]">
              Overall Diagnostic Score: <strong className="text-white text-base">{totalScore} / 10</strong> (80% Accuracy)
            </p>
          </div>

          <p className="mx-auto max-w-xl text-sm text-slate-300 leading-relaxed">
            Your personalized learning path has been constructed automatically based on your diagnostic strengths and priority revision areas.
          </p>
        </div>

        {/* Category Breakdown */}
        <div
          className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
          style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
        >
          <h2 className="font-heading text-xl font-bold text-white mb-6">Topic Breakdown by Category</h2>

          <div className="space-y-5">
            {categories.map((cat) => {
              const percentage = (cat.score / cat.total) * 100
              let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              let Icon = CheckCircle

              if (cat.status === 'Needs Revision') {
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                Icon = AlertTriangle
              } else if (cat.status === 'Weak') {
                badgeColor = 'bg-red-500/20 text-red-300 border-red-500/30'
                Icon = XCircle
              }

              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--q-muted)]">
                        {cat.score} / {cat.total} Correct
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold ${badgeColor}`}>
                        <Icon className="h-3 w-3" />
                        {cat.status}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        background:
                          cat.status === 'Strong'
                            ? 'var(--q-cyan)'
                            : cat.status === 'Needs Revision'
                            ? '#F59E0B'
                            : '#EF4444',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendation Starting Point */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.03)' }}>
            <h4 className="font-heading text-sm font-bold text-emerald-400 mb-2">💪 Strong Topics Identified</h4>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300">
                Basics & Qubit Notation
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300">
                Superposition Mechanics
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300">
                Quantum Algorithms
              </span>
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.03)' }}>
            <h4 className="font-heading text-sm font-bold text-amber-400 mb-2">⚡ Priority Revision Areas</h4>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-300">
                Single-Qubit Quantum Gates
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-300">
                Multi-Qubit Circuit Design
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/path"
            className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl px-8 py-4 font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            <span>View My Learning Path</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/assessment"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-semibold text-[var(--q-muted)] hover:text-white transition-colors"
            style={{ borderColor: 'var(--q-line)' }}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Assessment</span>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
