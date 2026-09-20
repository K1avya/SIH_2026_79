'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Check, X, ArrowRight, RotateCcw, Award, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react'
import {
  QuizQuestion,
  FALLBACK_QUIZZES,
  fetchQuizQuestionsServer,
  submitQuizServer,
} from '@/lib/api/quiz'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user, markTopicCompleted } = useAuth()
  const topicId = (params?.id as string) || 'qubits'

  const fallbackQuiz = FALLBACK_QUIZZES[topicId] || FALLBACK_QUIZZES['default']
  const [topicTitle, setTopicTitle] = useState(fallbackQuiz.topicTitle)
  const [questions, setQuestions] = useState<QuizQuestion[]>(fallbackQuiz.questions)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [scorePercent, setScorePercent] = useState<number>(0)
  const [correctAnswersMap, setCorrectAnswersMap] = useState<Record<number, number>>({})

  // Fetch quiz questions from Supabase database API
  useEffect(() => {
    async function loadQuizQuestions() {
      const { data } = await fetchQuizQuestionsServer(topicId)
      if (data && data.length > 0) {
        setQuestions(data)
      }
    }

    loadQuizQuestions()
  }, [topicId])

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    // Compute answer map
    const answersMap: Record<string, string> = {}
    questions.forEach((q) => {
      const chosenIdx = selectedAnswers[q.id]
      if (chosenIdx !== undefined) {
        answersMap[`q-${q.id}`] = `opt-${chosenIdx + 1}`
      }
    })

    try {
      // Call Supabase submit-quiz Edge Function
      const { data, error } = await submitQuizServer(user.id, topicId, answersMap)

      if (error || !data) {
        throw error || new Error('Failed to grade quiz via Edge Function.')
      }

      setScorePercent(Math.round(data.scorePercent))
      if (data.passed) {
        markTopicCompleted(topicId)
      }
    } catch (err) {
      console.warn('Fallback to client grading:', err)

      // Client calculation fallback
      let correct = 0
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) correct++
      })
      const pct = Math.round((correct / questions.length) * 100)
      setScorePercent(pct)

      if (pct >= 70) {
        markTopicCompleted(topicId)
      }
    } finally {
      setSubmitted(true)
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setScorePercent(0)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-4 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              Knowledge Assessment Quiz
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{topicTitle} Quiz</h1>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 rounded-2xl border px-4 py-2 bg-emerald-500/10 border-emerald-500/30">
              <Award className="h-5 w-5 text-emerald-400" />
              <span className="font-heading font-bold text-emerald-300">Score: {scorePercent}%</span>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id]
            const isCorrect = userChoice === q.correctIndex

            return (
              <div
                key={q.id}
                className="rounded-3xl border p-6 backdrop-blur-xl space-y-4"
                style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
              >
                <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
                  <span className="font-mono">Question {idx + 1} of {questions.length}</span>
                  {submitted && (
                    <span className={`font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-base font-bold text-white leading-snug">
                  {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx
                    const isTheCorrectOne = q.correctIndex === optIdx

                    let borderClass = 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:border-white/20 hover:text-white'
                    if (isSelected && !submitted) {
                      borderClass = 'border-[var(--q-cyan)] bg-[var(--q-cyan)]/15 text-white'
                    }
                    if (submitted) {
                      if (isTheCorrectOne) {
                        borderClass = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                      } else if (isSelected && !isTheCorrectOne) {
                        borderClass = 'border-rose-500/50 bg-rose-500/15 text-rose-200'
                      } else {
                        borderClass = 'border-white/5 opacity-40'
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left text-xs font-medium transition-all ${borderClass}`}
                      >
                        <span>{opt}</span>
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${isSelected ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)] text-black font-bold' : 'border-white/20'}`}>
                          {isSelected ? '✓' : ''}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {submitted && (
                  <div className="rounded-2xl border p-4 bg-white/5 border-white/10 text-xs text-slate-300 leading-relaxed space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-[var(--q-cyan)]" />
                      Explanation
                    </p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
          <Link href="/path" className="text-xs font-semibold text-[var(--q-muted)] hover:text-white">
            Return to Learning Path
          </Link>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedAnswers).length === 0}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Grading Quiz...</span>
                </>
              ) : (
                <>
                  <span>Submit Quiz Answers</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/5"
                style={{ borderColor: 'var(--q-line)' }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>
              <Link
                href="/path"
                className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black shadow-xl shadow-cyan-500/20"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Continue Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
