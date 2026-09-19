'use client'

import React from 'react'
import {
  GraduationCap,
  Sparkles,
  Cpu,
  Bot,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Atom,
  Flame,
  Award,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function QuantifyOverview() {
  const {
    setActiveTab,
    userLevel,
    streakDays,
    completedTopics,
    weakCategories,
  } = useQuantify()

  return (
    <div className="w-full space-y-8">
      {/* Hero Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border p-8 sm:p-12 text-center backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background:
            'radial-gradient(circle at 50% 20%, color-mix(in oklch, var(--q-violet) 30%, transparent), var(--q-bg-deep))',
        }}
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            boxShadow: '0 0 35px color-mix(in oklch, var(--q-violet) 70%, transparent)',
          }}
        >
          <Atom className="h-8 w-8 text-black" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-3">
          <span>Smart India Hackathon 2026 &bull; Problem Statement SIH26140</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          AI-Based Interactive Quantum <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)]">
            Algorithm Learning Platform
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-4xl text-sm sm:text-base text-zinc-300 leading-relaxed">
          Diagnose your starting knowledge through a 10-question assessment, unlock an adaptive topic roadmap that targets your diagnosed gaps, simulate multi-qubit circuits, and learn with Quanta AI.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('assessment')}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-black transition-transform hover:scale-105 shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)40%,transparent)]"
            style={{
              background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            }}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Take 10-Question Diagnostic</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab('circuit_simulator')}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:border-cyan-400 hover:bg-white/10 transition-colors"
          >
            <Cpu className="h-4 w-4 text-cyan-300" />
            <span>Launch Circuit Simulator</span>
          </button>
        </div>
      </div>

      {/* Feature Navigation Cards Grid - Spreads fluidly across window */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Diagnostic */}
        <div
          onClick={() => setActiveTab('assessment')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 2
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-cyan-300 transition-colors">
            10-Question Diagnostic Test
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Evaluates your foundation across Basics, Qubits, Gates, Circuits, and Algorithms. Scored 1/0 with no partial credit.
          </p>
        </div>

        {/* Card 2: Adaptive Path */}
        <div
          onClick={() => setActiveTab('learning_path')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 4
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-purple-300 transition-colors">
            Adaptive Learning Path
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Dynamically re-orders your curriculum. Topics where diagnostic gaps were detected (0/2) are prioritized first.
          </p>
        </div>

        {/* Card 3: Simulator */}
        <div
          onClick={() => setActiveTab('circuit_simulator')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <Cpu className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 7
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
            Quantum Circuit Simulator
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Visual multi-qubit grid supporting X, Y, Z, H, S, T, and CNOT gates. Instant state-vector probability bar charts.
          </p>
        </div>

        {/* Card 4: Quanta AI */}
        <div
          onClick={() => setActiveTab('ai_tutor')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
              <Bot className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 8
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-cyan-300 transition-colors">
            Quanta AI Quantum Tutor
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Level-aware tutor grounded in your current topic, level, and weak areas. Includes hint mode and accuracy disclaimer.
          </p>
        </div>

        {/* Card 5: Curated Books */}
        <div
          onClick={() => setActiveTab('books')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
              <BookOpen className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 6
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-amber-300 transition-colors">
            Book Recommendations
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Curated, real publications (Nielsen & Chuang, etc.) tagged with explainable "Why recommended" diagnostic reasons.
          </p>
        </div>

        {/* Card 6: Progress & Quizzes */}
        <div
          onClick={() => setActiveTab('progress')}
          className="cursor-pointer group rounded-3xl border p-6 backdrop-blur-xl transition-all hover:border-[var(--q-cyan)] hover:-translate-y-1"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
              <Award className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
              Module 9
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-4 group-hover:text-rose-300 transition-colors">
            Progress, Streaks & Badges
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            MCQ topic quizzes, daily learning streak counters, and milestone badges celebrating your quantum breakthroughs.
          </p>
        </div>
      </div>
    </div>
  )
}
