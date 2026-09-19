'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Check, X, ArrowRight, RotateCcw, Award, CheckCircle2, HelpCircle } from 'lucide-react'
import { MOCK_QUIZZES, QuizQuestion } from '@/lib/mock/quiz'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.id as string) || 'qubits'
  const quiz = MOCK_QUIZZES[topicId] || MOCK_QUIZZES['default']

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  // Calculate score
  let correctCount = 0
  quiz.questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctIndex) correctCount++
  })

  const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100)

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-4 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              Knowledge Assessment Quiz
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{quiz.topicTitle} Quiz</h1>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 rounded-2xl border px-4 py-2 bg-emerald-500/10 border-emerald-500/30">
              <Award className="h-5 w-5 text-emerald-400" />
              <span className="font-heading font-bold text-emerald-300">Score: {scorePercentage}%</span>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id]
            const isCorrect = userChoice === q.correctIndex

            return (
              <div
                key={q.id}
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-4 transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-red-500/40 bg-red-500/5'
                    : 'border-[var(--q-line)] bg-var(--q-bg-deep)'
                }`}
                style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                    Q{idx + 1}
                  </span>
                  <h3 className="font-heading text-base font-bold text-white leading-snug">{q.question}</h3>
                </div>

                {/* Option Buttons */}
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const selected = userChoice === optIdx
                    const isRightOption = optIdx === q.correctIndex

                    let optionStyle = 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'

                    if (submitted) {
                      if (isRightOption) {
                        optionStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                      } else if (selected && !isRightOption) {
                        optionStyle = 'border-red-500 bg-red-500/20 text-red-300'
                      }
                    } else if (selected) {
                      optionStyle = 'border-[var(--q-cyan)] bg-cyan-500/20 text-cyan-300 font-bold'
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        disabled={submitted}
                        className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-medium transition-all ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && isRightOption && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                        {submitted && selected && !isRightOption && <X className="h-4 w-4 text-red-400 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* SRS Requirement: Detailed Post-Submission Explanation */}
                {submitted && (
                  <div
                    className="mt-4 rounded-2xl border p-4 text-xs space-y-1"
                    style={{
                      borderColor: isCorrect
                        ? 'color-mix(in oklch, #10B981 30%, transparent)'
                        : 'color-mix(in oklch, #EF4444 30%, transparent)',
                      background: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <p className="font-bold text-white flex items-center gap-1.5">
                      💡 Explanation:
                    </p>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submit or Result Actions Footer */}
        <div className="flex items-center justify-between pt-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
              className="flex items-center gap-2 rounded-2xl px-8 py-3.5 font-bold text-black transition-transform hover:scale-105 disabled:opacity-40 shadow-xl shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <span>Submit Answers</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setSelectedAnswers({})
                }}
                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold text-[var(--q-muted)] hover:text-white"
                style={{ borderColor: 'var(--q-line)' }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry Quiz</span>
              </button>

              <Link
                href="/path"
                className="flex items-center gap-2 rounded-2xl px-7 py-3 font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Continue Learning Path</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
