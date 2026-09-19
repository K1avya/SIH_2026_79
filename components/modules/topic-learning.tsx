'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Play,
  CheckCircle2,
  FileText,
  Cpu,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Bot,
  ExternalLink,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function TopicLearning() {
  const {
    activeTopic,
    markTopicCompleted,
    completedTopics,
    setActiveTab,
    askQuantaAI,
  } = useQuantify()

  const [marked, setMarked] = useState(false)
  const isCompleted = completedTopics.includes(activeTopic.id) || marked

  function handleMarkComplete() {
    markTopicCompleted(activeTopic.id)
    setMarked(true)
  }

  function handleAskAboutTopic() {
    askQuantaAI(`Can you explain the key intuition behind ${activeTopic.name}?`)
    setActiveTab('ai_tutor')
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
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 border border-violet-500/30">
              {activeTopic.category.toUpperCase()} &bull; {activeTopic.level.toUpperCase()}
            </span>
            {isCompleted && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl mt-2">
            {activeTopic.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-300">
            {activeTopic.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAskAboutTopic}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <Bot className="h-4 w-4" />
            <span>Ask Quanta AI</span>
          </button>

          <button
            onClick={() => setActiveTab('circuit_simulator')}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
          >
            <Cpu className="h-4 w-4" />
            <span>Open in Simulator</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Embedded Video Lecture */}
          <div
            className="rounded-3xl border overflow-hidden backdrop-blur-xl"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg-deep)',
            }}
          >
            <div className="aspect-video w-full">
              <iframe
                src={activeTopic.videoUrl}
                title={activeTopic.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-zinc-400 border-t" style={{ borderColor: 'var(--q-line)' }}>
              <span>Curated Video Lecture &bull; {activeTopic.videoDuration}</span>
              <span className="font-mono text-cyan-300">HD 1080p Interactive Stream</span>
            </div>
          </div>

          {/* Theory Text Block (FR-RESOURCE-001) */}
          <div
            className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-4"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span>Core Theoretical Foundations</span>
            </h2>

            <div className="text-sm text-zinc-300 leading-relaxed space-y-3 font-normal">
              <p>{activeTopic.theoryContent}</p>
              <p>
                In quantum algorithm design, maintaining phase coherence and harnessing constructive interference is essential. As you progress to multi-qubit systems, entanglement serves as the foundational resource enabling exponential quantum speedups in algorithms such as Shor's and Grover's search.
              </p>
            </div>

            {/* Key Formulas */}
            <div className="rounded-2xl border p-4 bg-white/[0.02]" style={{ borderColor: 'var(--q-line)' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                Mathematical Identities & Key Formulas
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeTopic.keyFormulas.map((form, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-800 bg-black/30 p-2.5 font-mono text-xs text-zinc-200">
                    {form}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Mark Complete & Quiz */}
            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--q-line)' }}>
              <button
                onClick={handleMarkComplete}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{isCompleted ? 'Topic Marked as Completed' : 'Mark Topic Complete (FR-RESOURCE-001)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                }}
              >
                <span>Take Topic Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Resources & Notes (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div
            className="rounded-3xl border p-5 backdrop-blur-xl space-y-4"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Supplementary Materials</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href="#"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-3 hover:border-cyan-500/40 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">Lecture Slide Deck (PDF)</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Formal proofs & gate matrices &bull; 2.4 MB</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              </a>

              <a
                href="#"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-3 hover:border-cyan-500/40 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">Jupyter Notebook (.ipynb)</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Runnable Qiskit code examples &bull; 180 KB</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              </a>

              <a
                href="#"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-3 hover:border-cyan-500/40 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">Practice Problem Sheet</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">5 circuit derivation exercises &bull; With hints</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Quick Book Match */}
          <div
            className="rounded-3xl border p-5 backdrop-blur-xl space-y-3"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Recommended Reading for this Topic
            </div>
            <h4 className="font-heading text-sm font-bold text-white">
              Quantum Computation and Quantum Information
            </h4>
            <p className="text-[11px] text-zinc-400">
              By Michael A. Nielsen & Isaac L. Chuang &bull; Chapter 4: Quantum Circuits.
            </p>
            <button
              onClick={() => setActiveTab('books')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 pt-1"
            >
              View Book Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
