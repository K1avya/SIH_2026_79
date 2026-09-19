'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, HelpCircle, Loader2, Sparkles } from 'lucide-react'
import { ASSESSMENT_QUESTIONS, AssessmentQuestion } from '@/lib/mock/assessment'
import { submitAssessmentServer } from '@/lib/api/assessment'
import { supabase } from '@/backend/supabase-client'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AssessmentPage() {
  const router = useRouter()
  const { user, setAssessmentResults } = useAuth()
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(ASSESSMENT_QUESTIONS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  // Fetch real diagnostic questions from database / Edge Function
  useEffect(() => {
    async function loadQuestions() {
      setLoadingQuestions(true)
      try {
        const { data, error } = await supabase
          .from('assessment_questions')
          .select('*')
          .order('sequenceOrder', { ascending: true })

        if (!error && data && data.length > 0) {
          const mapped: AssessmentQuestion[] = data.map((q: any, idx: number) => {
            const opts = Array.isArray(q.options) ? q.options : []
            const correctOpt = opts.find((o: any) => o.isCorrect)
            return {
              id: idx + 1,
              category: q.category.charAt(0).toUpperCase() + q.category.slice(1),
              difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as any,
              question: q.questionText,
              options: opts.map((o: any) => ({ id: o.id, text: o.text })),
              correctAnswer: correctOpt?.id || 'opt-1',
              explanation: q.explanation,
            }
          })
          setQuestions(mapped)
        }
      } catch (err) {
        console.warn('Using baseline diagnostic questions:', err)
      } finally {
        setLoadingQuestions(false)
      }
    }

    loadQuestions()
  }, [])

  const currentQ = questions[currentIndex] || questions[0]
  const totalQ = questions.length
  const isLast = currentIndex === totalQ - 1

  const selectAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [String(currentQ.id)]: optionId }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // 1. Submit answers to zero-trust Supabase Edge Function
      const { data, error } = await submitAssessmentServer(user.id, answers)

      if (error || !data) {
        throw error || new Error('Failed to evaluate assessment server-side.')
      }

      // 2. Extract weak & strong topics calculated by backend
      const weak: string[] = []
      const strong: string[] = []

      data.categoryScores.forEach((cs) => {
        if (cs.isWeak) weak.push(cs.categoryName)
        if (cs.isStrong) strong.push(cs.categoryName)
      })

      // 3. Update auth state
      const mappedLevel = (data.levelAssigned.charAt(0).toUpperCase() + data.levelAssigned.slice(1)) as any
      setAssessmentResults(mappedLevel, weak, strong, data.totalScore)

      router.push('/dashboard')
    } catch (err) {
      console.warn('Edge function submission fallback to client evaluation:', err)

      // Graceful offline fallback
      let totalCorrect = 0
      const categoryScores: Record<string, number> = {
        Basics: 0,
        'Qubits & Superposition': 0,
        Gates: 0,
        Circuits: 0,
        Algorithms: 0,
      }

      questions.forEach((q) => {
        const selected = answers[String(q.id)]
        if (selected === q.correctAnswer) {
          totalCorrect++
          categoryScores[q.category] = (categoryScores[q.category] || 0) + 1
        }
      })

      let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
      if (totalCorrect >= 8) level = 'Advanced'
      else if (totalCorrect >= 4) level = 'Intermediate'

      const weak: string[] = []
      const strong: string[] = []
      Object.entries(categoryScores).forEach(([cat, score]) => {
        if (score === 0) weak.push(cat)
        else if (score === 2) strong.push(cat)
      })

      setAssessmentResults(level, weak, strong, totalCorrect)
      router.push('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-4 sm:py-6 space-y-6">
        {/* Progress Bar & Counter */}
        <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--q-cyan)] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Diagnostic Evaluation
          </span>
          <span className="font-mono">
            Question {currentIndex + 1} of {totalQ}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${((currentIndex + 1) / totalQ) * 100}%`,
              background: 'linear-gradient(90deg, var(--q-cyan), var(--q-violet))',
            }}
          />
        </div>

        {/* Question Card */}
        <div
          className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          style={{
            borderColor: 'var(--q-line)',
            background: 'var(--q-bg-deep)',
          }}
        >
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-0.5 text-xs font-semibold">
              {currentQ.category}
            </span>
            {(currentQ as any).difficulty && (
              <span className="rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 text-xs font-semibold">
                {(currentQ as any).difficulty}
              </span>
            )}
          </div>

          <h2 className="font-heading text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = answers[String(currentQ.id)] === opt.id

              return (
                <button
                  key={opt.id}
                  onClick={() => selectAnswer(opt.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)]/15 text-white shadow-lg shadow-[var(--q-cyan)]/10 scale-[1.01]'
                      : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ml-3 ${
                      isSelected
                        ? 'border-[var(--q-cyan)] bg-[var(--q-cyan)] text-black'
                        : 'border-[var(--q-line)]'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0 || submitting}
            className="flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-semibold text-[var(--q-muted)] transition-all hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            style={{ borderColor: 'var(--q-line)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Grading Diagnostic...</span>
                </>
              ) : (
                <>
                  <span>Submit Diagnostic</span>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
              disabled={submitting}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
