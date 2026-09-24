'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Share2, Cpu, ArrowRight, Copy, Check, Sparkles, Play } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { GATE_PALETTE, PRESET_CIRCUITS, PlacedGate, simulateCircuitClient, SimulationOutput } from '@/lib/api/circuits'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function SharedCircuitPage() {
  const params = useParams()
  const router = useRouter()
  const circuitId = (params?.id as string) || 'bell-state'

  const [copied, setCopied] = useState(false)
  const [qubitsCount, setQubitsCount] = useState(2)
  const [placedGates, setPlacedGates] = useState<PlacedGate[]>(PRESET_CIRCUITS[0].gates)
  const [circuitTitle, setCircuitTitle] = useState('Shared Bell State Circuit')
  const [results, setResults] = useState<SimulationOutput | null>(
    simulateCircuitClient(PRESET_CIRCUITS[0].gates, 2, 'Qiskit Aer', 1000)
  )

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleForkCircuit = () => {
    // Navigate to simulator with circuit state preserved
    router.push('/simulator')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 border mb-2 border-cyan-500/30 bg-cyan-500/10">
              <Share2 className="h-3.5 w-3.5" />
              Shared Quantum Circuit Workspace (Read-Only)
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{circuitTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/5"
              style={{ borderColor: 'var(--q-line)' }}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-cyan-400" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={handleForkCircuit}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Fork Circuit to My Workspace</span>
            </button>
          </div>
        </div>

        {/* Read-Only Grid & Simulation Output */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Timeline Grid (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border p-6 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <span className="text-xs font-semibold text-white block border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              Circuit Timeline Representation ({qubitsCount} Qubits)
            </span>

            <div className="space-y-6 py-2 overflow-x-auto">
              {Array.from({ length: qubitsCount }).map((_, qubitIdx) => (
                <div key={qubitIdx} className="flex items-center gap-4 min-w-[500px]">
                  <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-bold text-cyan-300">
                    |q{qubitIdx}⟩
                  </div>

                  <div className="relative flex flex-1 items-center justify-between">
                    <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/20 pointer-events-none" />
                    {Array.from({ length: 8 }).map((_, stepIdx) => {
                      const gateAt = placedGates.find(
                        (g) => g.qubitIndex === qubitIdx && g.stepIndex === stepIdx
                      )
                      const gDef = gateAt ? GATE_PALETTE.find((p) => p.type === gateAt.type) : null
                      return (
                        <div
                          key={stepIdx}
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-mono font-bold ${
                            gateAt ? 'border-white text-white shadow-lg' : 'border-dashed border-white/10 bg-black/40'
                          }`}
                          style={gDef ? { background: gDef.color } : {}}
                        >
                          {gateAt ? gateAt.type : ''}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Side (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border p-5 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <h3 className="font-heading text-sm font-bold text-white border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              Simulation Output
            </h3>

            {results && (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.probabilities}>
                    <XAxis dataKey="state" stroke="var(--q-muted)" fontSize={11} />
                    <YAxis stroke="var(--q-muted)" fontSize={10} unit="%" />
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                      {results.probabilities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--q-cyan)' : 'var(--q-violet)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
