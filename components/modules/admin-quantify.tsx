'use client'

import React, { useState } from 'react'
import {
  Sliders,
  BarChart3,
  Users,
  BookOpen,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function AdminQuantify() {
  const {
    thresholds,
    updateThresholds,
    assessmentQuestions,
    books,
  } = useQuantify()

  const [bMax, setBMax] = useState(thresholds.beginnerMax)
  const [iMax, setIMax] = useState(thresholds.intermediateMax)
  const [savedNotice, setSavedNotice] = useState(false)

  function handleSaveThresholds(e: React.FormEvent) {
    e.preventDefault()
    updateThresholds({ beginnerMax: Number(bMax), intermediateMax: Number(iMax) })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 4000)
  }

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
              Administrator Control & Platform Analytics (Screen 4.15)
            </h1>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
              Admin Role (Section 4.2)
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Configure level classification thresholds, inspect learner score distributions, and manage questions and curriculum resources.
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Total Enrolled Learners</div>
          <div className="font-heading text-2xl font-bold text-white mt-1">1,248</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18% this month
          </div>
        </div>

        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Diagnostic Pass Rate</div>
          <div className="font-heading text-2xl font-bold text-cyan-300 mt-1">74.2%</div>
          <div className="text-[10px] text-zinc-500 mt-1">Average score: 6.4 / 10</div>
        </div>

        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Most Common Weak Area</div>
          <div className="font-heading text-2xl font-bold text-amber-400 mt-1">Quantum Gates</div>
          <div className="text-[10px] text-amber-300/80 mt-1">38% scored 0/2 on Gates</div>
        </div>

        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Simulations Executed</div>
          <div className="font-heading text-2xl font-bold text-purple-300 mt-1">8,420</div>
          <div className="text-[10px] text-zinc-500 mt-1">Bell State & Grover most popular</div>
        </div>
      </div>

      {/* Configurable Thresholds Form (FR-LEVEL-005) */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-2" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              <span>Diagnostic Level Cut-Off Threshold Configuration (FR-LEVEL-005)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Administrators can adjust classification boundaries without a code redeployment.
            </p>
          </div>
          {savedNotice && (
            <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
              Thresholds Updated Live!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 p-4 bg-white/[0.02]">
              <label className="text-xs font-bold text-white block mb-1">
                Beginner Score Ceiling (0 to N)
              </label>
              <p className="text-[11px] text-zinc-400 mb-3">Scores from 0 to this value are classified as Beginner.</p>
              <input
                type="number"
                min={1}
                max={5}
                value={bMax}
                onChange={(e) => setBMax(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div className="rounded-2xl border border-zinc-800 p-4 bg-white/[0.02]">
              <label className="text-xs font-bold text-white block mb-1">
                Intermediate Score Ceiling (N+1 to M)
              </label>
              <p className="text-[11px] text-zinc-400 mb-3">Scores above this value (up to 10) are classified as Advanced.</p>
              <input
                type="number"
                min={6}
                max={9}
                value={iMax}
                onChange={(e) => setIMax(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              <Save className="h-4 w-4" />
              <span>Save & Apply Thresholds (FR-LEVEL-005)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Assessment Questions Bank Table */}
      <div
        className="rounded-3xl border p-6 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <h3 className="font-heading text-base font-bold text-white mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>Active 10-Question Diagnostic Bank ({assessmentQuestions.length} Questions)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-zinc-400" style={{ borderColor: 'var(--q-line)' }}>
                <th className="pb-3 pl-2">ID</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">Question Text</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assessmentQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 pl-2 font-mono text-cyan-300">{q.id}</td>
                  <td className="py-2.5 font-semibold text-zinc-200 capitalize">{q.category}</td>
                  <td className="py-2.5 capitalize text-zinc-400">{q.difficulty}</td>
                  <td className="py-2.5 text-zinc-300 max-w-xl 2xl:max-w-3xl truncate">{q.questionText}</td>
                  <td className="py-2.5 pr-2 text-right">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
