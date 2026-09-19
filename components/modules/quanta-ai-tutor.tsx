'use client'

import React, { useState } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Info,
  User,
  RotateCcw,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function QuantaAiTutor() {
  const {
    aiMessages,
    askQuantaAI,
    isAILoading,
    userLevel,
    activeTopic,
    weakCategories,
  } = useQuantify()

  const [inputPrompt, setInputPrompt] = useState('')
  const [isHintMode, setIsHintMode] = useState(false)

  const SUGGESTED_CHIPS = [
    'Explain quantum superposition with an intuitive analogy',
    'How does the Hadamard gate create a 50/50 measurement split?',
    'Why does CNOT entangle two qubits into a Bell state?',
    'Give me a hint on normalized state amplitudes',
  ]

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!inputPrompt.trim() || isAILoading) return
    askQuantaAI(inputPrompt.trim(), isHintMode)
    setInputPrompt('')
  }

  function handleChipClick(chip: string) {
    askQuantaAI(chip, chip.toLowerCase().includes('hint'))
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div
        className="rounded-3xl border p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--q-cyan)]/20 text-cyan-300">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
              Quanta AI Quantum Tutor (FR-AI-001..005)
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Level-aware AI tutor answering questions grounded in your assessed level (<strong>{userLevel.toUpperCase()}</strong>), active topic (<strong>{activeTopic.name}</strong>), and diagnosed priority areas.
          </p>
        </div>

        {/* Context Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="rounded-lg bg-white/5 px-2.5 py-1 text-cyan-300 border border-white/10">
            Level: {userLevel}
          </span>
          {weakCategories.length > 0 && (
            <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-amber-300 border border-amber-500/30">
              Focus: {weakCategories[0]}
            </span>
          )}
        </div>
      </div>

      {/* Mandatory Accuracy Disclaimer Banner (FR-AI-004) */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Academic Disclaimer (FR-AI-004):</strong> Quanta AI explanations are generated algorithmically and may occasionally contain approximations or inaccuracies. Always cross-check formal theorems with provided textbooks and reference lecture notes for exam-critical evaluations.
        </p>
      </div>

      {/* 2-Column Responsive Layout - Full Window Workstation */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Tutor Context & Prompts Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="rounded-3xl border p-5 backdrop-blur-xl"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <h3 className="font-heading text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Grounding Context</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Current Study Topic</div>
                <div className="font-semibold text-white mt-0.5">{activeTopic.name}</div>
                <div className="text-[11px] text-zinc-400 mt-1">{activeTopic.category.toUpperCase()} &bull; {activeTopic.level}</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Adaptive Hint Mode</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-zinc-300 text-xs">Guided Clues Only</span>
                  <button
                    onClick={() => setIsHintMode(!isHintMode)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all ${
                      isHintMode
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {isHintMode ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Suggested Inquiries */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
              <div className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Recommended Prompts</div>
              <div className="space-y-1.5">
                {SUGGESTED_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip)}
                    className="w-full text-left rounded-xl border border-zinc-800/80 bg-white/[0.02] px-3 py-2 text-xs text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
                  >
                    &bull; {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Chat Messages Container (8 cols) */}
        <div className="lg:col-span-8">
          <div
            className="rounded-3xl border backdrop-blur-xl flex flex-col h-[580px] overflow-hidden"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg-deep)',
            }}
          >
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {aiMessages.map((msg) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[var(--q-cyan)] text-black font-medium'
                          : 'border border-zinc-800 bg-white/[0.03] text-zinc-200'
                      }`}
                    >
                      {msg.isHint && (
                        <div className="text-[10px] uppercase font-bold text-amber-300 mb-1 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" /> Hint Mode (FR-AI-003)
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`mt-2 text-[10px] ${
                          isUser ? 'text-black/60' : 'text-zinc-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )
              })}

              {isAILoading && (
                <div className="flex gap-3 items-center text-xs text-zinc-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-2 font-mono text-[11px]">Quanta formulating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--q-line)' }}>
              <button
                type="button"
                onClick={() => setIsHintMode(!isHintMode)}
                className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                  isHintMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                title="Toggle Hint Mode: Gives hints instead of direct answers (FR-AI-003)"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hint Mode</span>
              </button>

              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Quanta AI about circuits, superposition, gates, Shor's..."
                className="flex-1 rounded-xl border px-4 py-2.5 text-xs text-white outline-none transition-colors focus:border-[var(--q-cyan)]"
                style={{
                  borderColor: 'var(--q-line)',
                  background: 'color-mix(in oklch, var(--q-bg) 75%, transparent)',
                }}
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isAILoading}
                className="flex items-center justify-center rounded-xl p-2.5 text-black font-bold transition-transform hover:scale-105 disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
