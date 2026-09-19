'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, HelpCircle, Loader2 } from 'lucide-react'
import { ASSESSMENT_QUESTIONS } from '@/lib/mock/assessment'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AssessmentPage() {
  const router = useRouter()
  const { setAssessmentResults } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex]
  const totalQ = ASSESSMENT_QUESTIONS.length
  const isLast = currentIndex === totalQ - 1

  const selectAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }))
  }

  const handleSubmit = () => {
    setSubmitting(true)

    // Calculate performance per category
    const categoryScores: Record<string, number> = {
      Basics: 0,
      'Qubits & Superposition': 0,
      Gates: 0,
      Circuits: 0,
      Algorithms: 0,
    }

    let totalCorrect = 0
    ASSESSMENT_QUESTIONS.forEach((q) => {
      const selected = answers[q.id]
      if (selected === q.correctAnswer) {
        totalCorrect++
        categoryScores[q.category] = (categoryScores[q.category] || 0) + 1
      }
    })

    // Level determination: 0-3 Beginner, 4-7 Intermediate, 8-10 Advanced
    let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
    if (totalCorrect >= 8) level = 'Advanced'
    else if (totalCorrect >= 4) level = 'Intermediate'

    // Identify weak and strong topics
    const weak: string[] = []
    const strong: string[] = []

    Object.entries(categoryScores).forEach(([cat, score]) => {
      if (score === 0) weak.push(cat)
      else if (score === 2) strong.push(cat)
    })

    setTimeout(() => {
      setAssessmentResults(totalCorrect, level, weak, strong)
      router.push('/result')
    }, 1200)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-4 sm:py-6">
        {/* Assessment Title Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border"
              style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}
            >
              Diagnostic Assessment
            </span>
            <h1 className="font-heading mt-2 text-2xl font-bold text-white">Quantum Knowledge Assessment</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl border px-3 py-1.5 text-xs font-bold text-[var(--q-cyan)]" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              Category: {currentQ.category}
            </span>
            <span className="text-sm font-semibold text-white">
              Question <span className="text-[var(--q-cyan)]">{currentIndex + 1}</span> / {totalQ}
            </span>
          </div>
        </div>

        {/* Question Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalQ) * 100}%`,
                background: 'linear-gradient(90deg, var(--q-cyan), var(--q-violet))',
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
            boxShadow: '0 0 30px color-mix(in oklch, var(--q-violet) 15%, transparent)',
          }}
        >
          <div className="flex items-start gap-3 mb-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-sm">
              {currentIndex + 1}
            </span>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.id] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => selectAnswer(opt.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-[var(--q-cyan)] bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                      : 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs ${
                        selected
                          ? 'bg-[var(--q-cyan)] text-black'
                          : 'border border-[var(--q-line)] text-[var(--q-muted)]'
                      }`}
                    >
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-white">{opt.text}</span>
                  </div>
                  {selected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--q-cyan)] text-black">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Assessment Navigation Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-[var(--q-muted)] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            style={{ borderColor: 'var(--q-line)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < totalQ}
              className="flex items-center gap-2 rounded-xl px-7 py-3 font-bold text-black transition-transform hover:scale-105 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Evaluating Results...</span>
                </>
              ) : (
                <>
                  <span>Submit Assessment</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
              disabled={!answers[currentQ.id]}
              className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <span>Next Question</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
