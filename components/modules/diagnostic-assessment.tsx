'use client'

import React, { useState } from 'react'
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function DiagnosticAssessment() {
  const {
    assessmentQuestions,
    assessmentAnswers,
    setAssessmentAnswer,
    submitAssessment,
    setActiveTab,
  } = useQuantify()

  const [currentIndex, setCurrentIndex] = useState(0)

  const currentQ = assessmentQuestions[currentIndex]
  const answeredCount = Object.keys(assessmentAnswers).length
  const isAllAnswered = answeredCount === assessmentQuestions.length
  const progressPercent = ((currentIndex + 1) / assessmentQuestions.length) * 100

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 rounded-2xl border p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between" style={{
        borderColor: 'var(--q-line)',
        background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
      }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
              10-Question Diagnostic Assessment (FR-ASSESS-001)
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              5 Categories &bull; 2 Questions Each
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Diagnoses your baseline knowledge across Basics, Qubits, Gates, Circuits, and Algorithms to generate your personalized path.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Self-Paced</span>
          </span>
          <span className="rounded-lg bg-white/10 px-2.5 py-1 text-cyan-300 font-bold">
            {answeredCount} / {assessmentQuestions.length} Answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Question {currentIndex + 1} of {assessmentQuestions.length}</span>
          <span className="font-mono">{Math.round(progressPercent)}% Completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2-Column Responsive Layout - Spreads gracefully across the window */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Navigator Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="rounded-3xl border p-5 backdrop-blur-xl"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-400" />
                <span>Question Matrix</span>
              </h3>
              <span className="font-mono text-xs font-bold text-cyan-300">
                {answeredCount}/{assessmentQuestions.length} Answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {assessmentQuestions.map((q, idx) => {
                const isAnswered = !!assessmentAnswers[q.id]
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'border-2 border-cyan-400 bg-cyan-400/20 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : isAnswered
                        ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                        : 'border border-zinc-800 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    <span className="text-[9px] font-normal uppercase opacity-70">{q.category.slice(0, 4)}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t space-y-2 text-[11px] text-zinc-400" style={{ borderColor: 'var(--q-line)' }}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Green: Answered & Recorded</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border border-cyan-400 bg-cyan-400/30" />
                <span>Cyan: Active Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span>Grey: Pending Answer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active Question Pane (8 cols) */}
        <div className="lg:col-span-8">
          <div
            className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl h-full flex flex-col justify-between"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: 'var(--q-line)' }}>
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300 border border-violet-500/30">
                  Category: {currentQ.category.toUpperCase()}
                </span>
                <span className="text-xs text-zinc-400 capitalize font-medium">
                  Target Difficulty: {currentQ.difficulty}
                </span>
              </div>

              <h2 className="font-heading text-lg sm:text-xl font-semibold text-white leading-relaxed mb-6">
                {currentQ.questionText}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = assessmentAnswers[currentQ.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAssessmentAnswer(currentQ.id, opt.id)}
                      className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)]/15 text-white shadow-[0_0_20px_color-mix(in oklch,var(--q-cyan)20%,transparent)]'
                          : 'border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                            isSelected
                              ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)] text-black'
                              : 'border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </div>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Navigation & Submit Buttons */}
            <div className="mt-8 flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--q-line)' }}>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < assessmentQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(assessmentQuestions.length - 1, prev + 1))}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                    }}
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={submitAssessment}
                    disabled={!isAllAnswered}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-all hover:scale-105 disabled:opacity-40 shadow-[0_0_20px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
                    style={{
                      background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Submit & Compute Level (FR-ASSESS-003)</span>
                  </button>
                )}
              </div>
            </div>

            {!isAllAnswered && currentIndex === assessmentQuestions.length - 1 && (
              <p className="mt-3 text-right text-[11px] text-amber-400">
                * Please answer all 10 questions before submitting ({answeredCount}/10 answered).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
