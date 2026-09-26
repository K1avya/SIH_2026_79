'use client'

import React from 'react'
import { X, Cpu, MousePointerClick, BookOpen, Zap } from 'lucide-react'

interface SimulatorIntroProps {
  onClose: () => void
  onLoadDemo: () => void
}

const CARDS = [
  {
    icon: <Cpu className="h-5 w-5 text-[var(--q-cyan)]" />,
    title: 'What is this?',
    body: 'A real quantum circuit simulator that runs the same linear-algebra math as actual quantum hardware. You drag gates onto qubit wires, hit Execute, and see exact probability amplitudes — no approximations.',
    accent: 'var(--q-cyan)',
  },
  {
    icon: <MousePointerClick className="h-5 w-5 text-[var(--q-violet)]" />,
    title: 'How to use it',
    body: (
      <ol className="list-decimal pl-4 space-y-1 text-[var(--q-muted)]">
        <li>Pick a gate from the <strong className="text-white">Gate Palette</strong> on the left.</li>
        <li>Click any empty wire slot to place it.</li>
        <li>For <strong className="text-white">CNOT / SWAP</strong>: click the control wire first, then the target wire at the same step.</li>
        <li>Press <strong className="text-white">Execute Circuit</strong> to run the simulation.</li>
        <li>Read probability outputs in the <strong className="text-white">Results Panel</strong> on the right.</li>
      </ol>
    ),
    accent: 'var(--q-violet)',
  },
  {
    icon: <BookOpen className="h-5 w-5 text-[var(--q-cyan)]" />,
    title: 'What you\'re learning',
    body: (
      <ul className="space-y-1 text-[var(--q-muted)]">
        <li><strong className="text-[var(--q-cyan)] font-mono">H</strong> — Hadamard gate: puts a qubit into <strong className="text-white">superposition</strong> (50 / 50 chance of |0⟩ or |1⟩).</li>
        <li><strong className="text-[var(--q-violet)] font-mono">CNOT</strong> — Controlled-NOT: creates <strong className="text-white">entanglement</strong> between two qubits.</li>
        <li><strong className="text-[var(--q-cyan)] font-mono">M</strong> — Measurement: <strong className="text-white">collapses</strong> the quantum state into a classical 0 or 1.</li>
      </ul>
    ),
    accent: 'var(--q-cyan)',
  },
  {
    icon: <Zap className="h-5 w-5 text-[var(--q-violet)]" />,
    title: 'Why simulate instead of reading',
    body: 'Textbook equations describe quantum gates statically. Here, every gate placement immediately updates the probability chart. That instant visual cause-and-effect loop builds intuition that no static equation can match.',
    accent: 'var(--q-violet)',
  },
]

export function SimulatorIntro({ onClose, onLoadDemo }: SimulatorIntroProps) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Simulator introduction"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh]"
        style={{
          borderColor: 'color-mix(in oklch, var(--q-cyan) 25%, transparent)',
          background: 'var(--q-bg-deep)',
          boxShadow: '0 0 80px -10px color-mix(in oklch, var(--q-cyan) 30%, transparent)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] mb-2"
              style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}
            >
              <Cpu className="h-3.5 w-3.5" />
              Quantum Circuit Simulator
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">Welcome to the Workspace</h2>
            <p className="text-sm text-[var(--q-muted)] mt-1">
              Everything you need to know to get started — in 60 seconds.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close introduction"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-[var(--q-muted)] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Four Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border p-5 space-y-2 backdrop-blur-xl"
              style={{
                borderColor: `color-mix(in oklch, ${card.accent} 20%, transparent)`,
                background: `color-mix(in oklch, ${card.accent} 5%, transparent)`,
              }}
            >
              <div className="flex items-center gap-2">
                {card.icon}
                <h3 className="font-heading text-sm font-bold text-white">{card.title}</h3>
              </div>
              <div className="text-xs leading-relaxed">
                {typeof card.body === 'string' ? (
                  <p className="text-[var(--q-muted)]">{card.body}</p>
                ) : (
                  card.body
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onLoadDemo()
              onClose()
            }}
            className="w-full sm:w-auto rounded-2xl border border-[var(--q-cyan)]/30 bg-[var(--q-cyan)]/10 px-6 py-2.5 text-sm font-semibold text-[var(--q-cyan)] hover:bg-[var(--q-cyan)]/20 transition-all"
          >
            ⚡ Try it: Guided Demo
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-2xl px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            Start Building →
          </button>
        </div>
      </div>
    </div>
  )
}
