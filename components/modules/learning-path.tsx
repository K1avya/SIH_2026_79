'use client'

import React from 'react'
import {
  Sparkles,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { Topic } from '@/types/quantify'

export function LearningPath() {
  const {
    learningPath,
    activeTopic,
    setActiveTopic,
    completedTopics,
    weakCategories,
    setActiveTab,
    userLevel,
  } = useQuantify()

  function handleSelectTopic(topic: Topic) {
    setActiveTopic(topic)
    setActiveTab('topic_learning')
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
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Personalized Adaptive Learning Path (FR-PATH-001)
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold uppercase text-cyan-300">
              {userLevel} Track
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-300">
            Dynamically sequenced for your assessed knowledge. Topics where diagnostic gaps were detected are automatically prioritized.
          </p>
        </div>

        {weakCategories.length > 0 && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Adaptive Re-Ordering Applied (FR-PATH-002)</span>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-300">
              <strong>{weakCategories.join(', ').toUpperCase()}</strong> prioritized in your roadmap.
            </p>
          </div>
        )}
      </div>

      {/* Timeline Roadmap */}
      <div className="space-y-4">
        {learningPath.map((item, index) => {
          const isCompleted = completedTopics.includes(item.topic.id)
          const isActive = activeTopic.id === item.topic.id
          const isWeak = item.isWeakPriority

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition-all ${
                isActive
                  ? 'border-[var(--q-cyan)] bg-[var(--q-bg-deep)] shadow-[0_0_25px_color-mix(in oklch,var(--q-cyan)20%,transparent)]'
                  : isWeak
                  ? 'border-amber-500/50 bg-amber-950/15'
                  : 'border-zinc-800/80 bg-white/[0.02] hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Status Circle */}
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    ) : isActive ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 animate-pulse border border-cyan-500/40">
                        {index + 1}
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 border border-white/10">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-base font-bold text-white">
                        {item.topic.name}
                      </span>
                      {isWeak && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300 border border-amber-500/40">
                          Weak Topic Priority (FR-PATH-002)
                        </span>
                      )}
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase font-semibold text-zinc-400">
                        {item.topic.level}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-300 max-w-4xl leading-relaxed">
                      {item.topic.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {item.topic.videoDuration} Video Lesson
                      </span>
                      <span>{item.topic.practiceQuestionsCount} Practice Problems</span>
                      <span>Category: {item.topic.category}</span>
                    </div>
                  </div>
                </div>

                {/* Topic CTA Button */}
                <div className="shrink-0 flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleSelectTopic(item.topic)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[var(--q-cyan)] text-black font-bold shadow-[0_0_15px_color-mix(in oklch,var(--q-cyan)35%,transparent)]'
                        : isCompleted
                        ? 'border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                        : 'border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Topic' : isActive ? 'Resume Learning' : 'Start Topic'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
