'use client'

import React, { useState } from 'react'
import {
  Trophy,
  Flame,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  BarChart2,
  Lock,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { TOPIC_QUIZZES } from '@/lib/quantify-data'

export function ProgressDashboard() {
  const {
    userLevel,
    streakDays,
    completedTopics,
    quizAveragePercent,
    achievements,
    activeTopic,
    setActiveTab,
    recordQuizScore,
  } = useQuantify()

  const currentQuiz = TOPIC_QUIZZES[activeTopic.id] || TOPIC_QUIZZES['topic-intro']
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null)

  const overallProgress = Math.min(100, Math.round((completedTopics.length / 10) * 100))

  function handleQuizSubmit(e: React.FormEvent) {
    e.preventDefault()
    let correctCount = 0
    currentQuiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id]
      const correctOpt = q.options.find((o) => o.isCorrect)?.id
      if (selected && selected === correctOpt) correctCount += 1
    })

    const scorePercent = Math.round((correctCount / currentQuiz.questions.length) * 100)
    recordQuizScore(activeTopic.id, scorePercent)
    setIsSubmitted(true)
    setQuizFeedback(`You scored ${scorePercent}% (${correctCount}/${currentQuiz.questions.length} correct)!`)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
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
              Progress, Topic Quizzes & Gamification (FR-QUIZ-001..006)
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Track your topic completions, daily quantum study streak, quiz mastery scores, and unlocked milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>{streakDays}-Day Learning Streak</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - 4 Columns spreading across window */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Progress % */}
        <div
          className="rounded-3xl border p-5 backdrop-blur-xl"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Curriculum Progress</div>
          <div className="font-heading text-3xl font-bold text-cyan-300 mt-2">{overallProgress}%</div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-2">{completedTopics.length} of 10 modules completed</div>
        </div>

        {/* Quiz Average */}
        <div
          className="rounded-3xl border p-5 backdrop-blur-xl"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Quiz Average Score</div>
          <div className="font-heading text-3xl font-bold text-emerald-400 mt-2">{quizAveragePercent}%</div>
          <p className="text-[11px] text-zinc-400 mt-3">Calculated across verified topic end-of-unit tests</p>
        </div>

        {/* Assessed Level */}
        <div
          className="rounded-3xl border p-5 backdrop-blur-xl"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Current Knowledge Level</div>
          <div className="font-heading text-3xl font-bold text-white capitalize mt-2">{userLevel}</div>
          <button
            onClick={() => setActiveTab('assessment')}
            className="text-[11px] font-semibold text-cyan-400 hover:underline mt-3 block"
          >
            Retake Diagnostic Test &rarr;
          </button>
        </div>

        {/* Learning Streak */}
        <div
          className="rounded-3xl border p-5 backdrop-blur-xl"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Current Daily Streak</div>
          <div className="font-heading text-3xl font-bold text-amber-400 mt-2 flex items-center gap-2">
            <Flame className="h-7 w-7 fill-amber-400 text-amber-400" />
            <span>{streakDays} Days</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-3">Active daily quantum learning habit</p>
        </div>
      </div>

      {/* Topic Quiz Module (FR-QUIZ-001 & FR-QUIZ-002) */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-2" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
              Topic Quiz: {currentQuiz.topicName}
            </span>
            <h2 className="font-heading text-lg font-bold text-white mt-1.5">
              Knowledge Verification MCQ (FR-QUIZ-001)
            </h2>
          </div>
          {quizFeedback && (
            <span className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              {quizFeedback}
            </span>
          )}
        </div>

        <form onSubmit={handleQuizSubmit} className="space-y-6">
          {currentQuiz.questions.map((q, idx) => (
            <div key={q.id} className="space-y-3 rounded-2xl border border-zinc-800/80 p-4 bg-white/[0.02]">
              <div className="text-sm font-semibold text-white">
                {idx + 1}. {q.questionText}
              </div>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id
                  const showCorrect = isSubmitted && opt.isCorrect
                  const showWrong = isSubmitted && isSelected && !opt.isCorrect

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs font-medium cursor-pointer transition-colors ${
                        showCorrect
                          ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
                          : showWrong
                          ? 'border-rose-500/60 bg-rose-950/30 text-rose-300'
                          : isSelected
                          ? 'border-cyan-400 bg-cyan-500/10 text-white'
                          : 'border-zinc-800 text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.id}
                          disabled={isSubmitted}
                          checked={isSelected}
                          onChange={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                          className="accent-cyan-400"
                        />
                        <span>{opt.text}</span>
                      </div>
                      {showCorrect && <span className="font-bold text-emerald-400">Correct Answer</span>}
                    </label>
                  )
                })}
              </div>

              {isSubmitted && (
                <div className="mt-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-200">
                  <span className="font-bold block text-cyan-300 mb-0.5">Explanation (FR-QUIZ-002):</span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!isSubmitted && (
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              <span>Submit Topic Quiz (FR-QUIZ-003)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Achievements & Milestones (FR-QUIZ-005 & Screen 4.14) */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Earned Achievements & Badges (FR-QUIZ-005)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Unlockable milestone rewards based on quiz mastery, circuit builds, and streaks.
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {achievements.filter((a) => a.isEarned).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 backdrop-blur-md transition-all ${
                ach.isEarned
                  ? 'border-amber-500/40 bg-amber-950/15'
                  : 'border-zinc-800 bg-white/[0.01] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{ach.icon}</div>
                <div>
                  <div className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {!ach.isEarned && <Lock className="h-3 w-3 text-zinc-500" />}
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">{ach.description}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                  <span>{ach.isEarned ? 'Unlocked' : 'In Progress'}</span>
                  <span>{ach.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ach.isEarned ? 'bg-amber-400' : 'bg-cyan-500'}`}
                    style={{ width: `${ach.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
