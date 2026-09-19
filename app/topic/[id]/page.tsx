'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Download,
  Video,
  Code2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { TOPICS, Topic } from '@/lib/mock/topics'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function TopicLearningPage() {
  const params = useParams()
  const router = useRouter()
  const { markTopicCompleted, user } = useAuth()
  const topicId = (params?.id as string) || 'qubits'

  const currentTopic = TOPICS.find((t) => t.id === topicId) || TOPICS[1] // fallback to qubits
  const [activeTab, setActiveTab] = useState<'theory' | 'visual' | 'video' | 'practice'>('theory')
  const [showHint, setShowHint] = useState<Record<number, boolean>>({})

  const isCompleted = user.completedTopics.includes(currentTopic.id)

  const handleMarkComplete = () => {
    markTopicCompleted(currentTopic.id)
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <Link href="/path" className="flex items-center gap-2 text-xs font-medium text-[var(--q-muted)] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Learning Path</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkComplete}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                isCompleted
                  ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                  : 'border border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            <Link
              href={`/quiz/${currentTopic.id}`}
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-black transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <FileQuestion className="h-4 w-4" />
              <span>Take Topic Quiz</span>
            </Link>
          </div>
        </div>

        {/* Title Hero */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border px-2.5 py-0.5 text-xs font-semibold text-[var(--q-cyan)]" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              {currentTopic.category}
            </span>
            <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-xs font-medium text-[var(--q-muted)]">
              {currentTopic.difficulty}
            </span>
            <span className="text-xs text-[var(--q-muted)]">Est. {currentTopic.estimatedTime}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{currentTopic.title}</h1>
          <p className="text-sm text-[var(--q-muted)] max-w-3xl">{currentTopic.description}</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left/Main Column: Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Tabs Switcher */}
            <div className="flex border-b text-sm font-semibold" style={{ borderColor: 'var(--q-line)' }}>
              {[
                { id: 'theory', label: 'Theory & Math', icon: <BookOpen className="h-4 w-4" /> },
                { id: 'visual', label: 'Visual Diagram', icon: <Layers className="h-4 w-4" /> },
                { id: 'video', label: 'Video Lecture', icon: <Video className="h-4 w-4" /> },
                { id: 'practice', label: 'Practice Problems', icon: <HelpCircle className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'border-[var(--q-cyan)] text-[var(--q-cyan)]'
                      : 'border-transparent text-[var(--q-muted)] hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Theory */}
            {activeTab === 'theory' && (
              <div className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">Overview</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentTopic.content.overview}</p>
                </div>

                <div className="rounded-2xl border p-5 bg-white/2" style={{ borderColor: 'var(--q-line)' }}>
                  <h4 className="font-heading text-sm font-bold text-[var(--q-cyan)] mb-3">🎯 Learning Objectives</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {currentTopic.content.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--q-cyan)] mt-1.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-3">Mathematical Formulation</h3>
                  <div className="rounded-2xl border p-5 font-mono text-sm leading-relaxed text-cyan-300" style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}>
                    {currentTopic.content.theory}
                  </div>
                </div>

                {/* PDF Download Link */}
                {currentTopic.content.notesUrl && (
                  <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-[var(--q-cyan)]" />
                      <div>
                        <p className="text-xs font-bold text-white">Download Lecture Notes PDF</p>
                        <p className="text-[10px] text-[var(--q-muted)]">Includes handwritten quantum circuit derivations</p>
                      </div>
                    </div>
                    <a
                      href={currentTopic.content.notesUrl}
                      download
                      className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      style={{ borderColor: 'var(--q-line)' }}
                    >
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Visual Concept */}
            {activeTab === 'visual' && (
              <div className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-4 text-center" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <h3 className="font-heading text-lg font-bold text-white">{currentTopic.content.visualExplanation.title}</h3>
                
                {/* Visual Bloch Sphere Canvas SVG Placeholder */}
                <div className="relative my-6 mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full border border-dashed border-violet-400/50 animate-spin" style={{ animationDuration: '25s' }} />
                  </div>
                  <div className="absolute h-px w-full bg-cyan-500/40" />
                  <div className="absolute w-px h-full bg-cyan-500/40" />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="font-mono text-xs font-bold text-cyan-300">|Ψ⟩ = α|0⟩ + β|1⟩</span>
                    <span className="text-[10px] text-slate-400 mt-1">Bloch Sphere Representation</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 max-w-lg mx-auto">{currentTopic.content.visualExplanation.details}</p>
              </div>
            )}

            {/* Tab 3: Video */}
            {activeTab === 'video' && (
              <div className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-[var(--q-cyan)]" />
                  Video Explanation
                </h3>
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
                    className="h-full w-full"
                    src={currentTopic.content.videoUrl || 'https://www.youtube.com/embed/QuR969uMICM'}
                    title={currentTopic.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Practice Problems */}
            {activeTab === 'practice' && (
              <div className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <h3 className="font-heading text-lg font-bold text-white mb-4">Practice Concept Problems</h3>

                {currentTopic.content.practiceQuestions.map((q, idx) => (
                  <div key={idx} className="rounded-2xl border p-5 space-y-3" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.03)' }}>
                    <p className="font-semibold text-white text-sm">
                      Q{idx + 1}. {q.question}
                    </p>
                    {showHint[idx] ? (
                      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-200">
                        💡 <strong>Hint:</strong> {q.hint}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint((prev) => ({ ...prev, [idx]: true }))}
                        className="text-xs font-semibold text-[var(--q-cyan)] hover:underline"
                      >
                        Show Hint
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Topic Sidebar Progress */}
          <div className="space-y-6">
            <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              <h4 className="font-heading text-base font-bold text-white">Topic Navigation</h4>

              <div className="space-y-2 text-xs">
                {TOPICS.map((t) => (
                  <Link
                    key={t.id}
                    href={`/topic/${t.id}`}
                    className={`flex items-center justify-between rounded-xl p-2.5 transition-colors ${
                      t.id === currentTopic.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-[var(--q-muted)] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate max-w-[170px]">{t.title}</span>
                    {user.completedTopics.includes(t.id) && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Tutor Card Shortcut */}
            <div className="rounded-3xl border p-6 text-center space-y-3" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)', background: 'color-mix(in oklch, var(--q-cyan) 8%, transparent)' }}>
              <Sparkles className="h-8 w-8 text-[var(--q-cyan)] mx-auto animate-pulse" />
              <h4 className="font-heading text-base font-bold text-white">Stuck on {currentTopic.title}?</h4>
              <p className="text-xs text-[var(--q-muted)]">Ask Quanta AI Tutor for personalized math step breakdowns.</p>
              <Link
                href="/tutor"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-black shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                Ask Quanta AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
