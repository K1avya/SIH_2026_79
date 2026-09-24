'use client'

import React, { useState } from 'react'
import {
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import {
  SEED_CHALLENGES,
  QuantumChallenge,
  gradeChallengeSubmission,
  ChallengeSubmissionResult,
} from '@/lib/api/challenges'
import { GATE_PALETTE, PlacedGate, simulateCircuitClient } from '@/lib/api/circuits'

export default function QuantumChallengesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [activeChallenge, setActiveChallenge] = useState<QuantumChallenge | null>(null)
  
  // Workspace solver state for active challenge
  const [solverGates, setSolverGates] = useState<PlacedGate[]>([])
  const [selectedGateType, setSelectedGateType] = useState<string>('H')
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmissionResult | null>(null)
  const [showHint, setShowHint] = useState(false)

  const filteredChallenges = SEED_CHALLENGES.filter(
    (c) => selectedDifficulty === 'all' || c.difficulty === selectedDifficulty
  )

  const handleOpenSolver = (challenge: QuantumChallenge) => {
    setActiveChallenge(challenge)
    setSolverGates([])
    setSubmissionResult(null)
    setShowHint(false)
  }

  const handleCellClick = (qubitIndex: number, stepIndex: number) => {
    const existingIndex = solverGates.findIndex(
      (g) => g.qubitIndex === qubitIndex && g.stepIndex === stepIndex
    )

    if (existingIndex >= 0) {
      setSolverGates((prev) => prev.filter((_, idx) => idx !== existingIndex))
    } else {
      setSolverGates((prev) => [
        ...prev,
        {
          id: `gate-ch-${Date.now()}-${Math.random()}`,
          type: selectedGateType as any,
          qubitIndex,
          stepIndex,
        },
      ])
    }
  }

  const handleSubmitSolution = () => {
    if (!activeChallenge) return
    const result = gradeChallengeSubmission(activeChallenge, solverGates)
    setSubmissionResult(result)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl py-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 border mb-2 border-amber-500/30 bg-amber-500/10">
              <Trophy className="h-3.5 w-3.5" />
              Auto-Graded Quantum Circuit Challenges
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Challenges Hub</h1>
          </div>
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'beginner', label: 'Beginner Tier' },
            { id: 'intermediate', label: 'Intermediate Tier' },
            { id: 'advanced', label: 'Advanced Tier' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDifficulty(tab.id)}
              className={`rounded-2xl border px-4 py-2 transition-all ${
                selectedDifficulty === tab.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'border-white/10 bg-white/5 text-[var(--q-muted)] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((ch) => (
            <div
              key={ch.id}
              className="rounded-3xl border p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between transition-all hover:border-cyan-500/40"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-0.5 text-[10px] font-semibold">
                    {ch.category}
                  </span>
                  <span className="rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 text-[10px] font-semibold uppercase">
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white">{ch.title}</h3>
                <p className="text-xs text-[var(--q-muted)] leading-relaxed">{ch.description}</p>
              </div>

              <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--q-line)' }}>
                <div className="flex justify-between text-[11px] text-[var(--q-muted)]">
                  <span>Qubits: <strong className="text-white">{ch.qubitCount}</strong></span>
                  <span>Max Gates: <strong className="text-white">{ch.maxGates || 'Unlimited'}</strong></span>
                </div>

                <button
                  onClick={() => handleOpenSolver(ch)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  <Target className="h-4 w-4" />
                  <span>Solve Challenge</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Challenge Solver Drawer Modal */}
        {activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div
              className="w-full max-w-4xl rounded-3xl border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
                <div>
                  <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Challenge Task</span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">{activeChallenge.title}</h2>
                </div>
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="rounded-xl border px-3 py-1.5 text-xs text-[var(--q-muted)] hover:text-white"
                  style={{ borderColor: 'var(--q-line)' }}
                >
                  Close
                </button>
              </div>

              {/* Target Goal Summary */}
              <div className="rounded-2xl border p-4 bg-cyan-500/10 border-cyan-500/30 space-y-2 text-xs">
                <p className="text-cyan-200"><strong>Objective:</strong> {activeChallenge.description}</p>
                <p className="text-cyan-300 font-mono">🎯 Target Distribution: {activeChallenge.targetStateDescription}</p>
              </div>

              {/* Circuit Grid Sandbox Solver */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Construct Your Circuit:</span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    {GATE_PALETTE.slice(0, 7).map((g) => (
                      <button
                        key={g.type}
                        onClick={() => setSelectedGateType(g.type)}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-bold transition-all ${
                          selectedGateType === g.type ? 'border-white text-white scale-105' : 'border-white/10 text-[var(--q-muted)]'
                        }`}
                        style={selectedGateType === g.type ? { background: g.color } : {}}
                      >
                        {g.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 py-2 border rounded-2xl p-4 bg-black/40 overflow-x-auto" style={{ borderColor: 'var(--q-line)' }}>
                  {Array.from({ length: activeChallenge.qubitCount }).map((_, qIdx) => (
                    <div key={qIdx} className="flex items-center gap-4 min-w-[450px]">
                      <div className="font-mono text-xs font-bold text-cyan-300 w-10 text-center">|q{qIdx}⟩</div>
                      <div className="relative flex flex-1 items-center justify-between">
                        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/20 pointer-events-none" />
                        {Array.from({ length: 8 }).map((_, stepIdx) => {
                          const gateAt = solverGates.find(
                            (g) => g.qubitIndex === qIdx && g.stepIndex === stepIdx
                          )
                          const gDef = gateAt ? GATE_PALETTE.find((p) => p.type === gateAt.type) : null
                          return (
                            <button
                              key={stepIdx}
                              onClick={() => handleCellClick(qIdx, stepIdx)}
                              className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-mono font-bold transition-all ${
                                gateAt ? 'border-white text-white shadow-lg' : 'border-dashed border-white/20 bg-black/60 hover:border-cyan-400'
                              }`}
                              style={gDef ? { background: gDef.color } : {}}
                            >
                              {gateAt ? gateAt.type : ''}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Result Feedback */}
              {submissionResult && (
                <div
                  className={`rounded-2xl border p-4 space-y-2 text-xs ${
                    submissionResult.passed
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {submissionResult.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-amber-400" />}
                    <span>{submissionResult.passed ? 'Challenge Passed!' : 'Challenge Not Passed'}</span>
                  </div>
                  <p>{submissionResult.feedback}</p>
                  <div className="font-mono text-[11px] pt-1 flex gap-4">
                    <span>Fidelity Score: <strong>{submissionResult.scorePercent}%</strong></span>
                    <span>TVD Metric: <strong>{submissionResult.tvd}</strong></span>
                    <span>Gates Used: <strong>{submissionResult.gateCountUsed}</strong></span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{showHint ? activeChallenge.hint : 'Show Hint'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSolverGates([])}
                    className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs text-[var(--q-muted)] hover:text-white"
                    style={{ borderColor: 'var(--q-line)' }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Submit & Grade Solution</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
