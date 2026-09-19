'use client'

import React, { useState } from 'react'
import {
  Cpu,
  Play,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { GateType } from '@/types/quantify'

export function CircuitSimulator() {
  const {
    qubitCount,
    setQubitCount,
    placedGates,
    addGate,
    removeGate,
    clearCircuit,
    loadPresetCircuit,
    simulationResult,
    runSimulation,
    simulatorError,
  } = useQuantify()

  const [selectedGateType, setSelectedGateType] = useState<GateType>('H')
  const [cnotControl, setCnotControl] = useState<number>(0)

  const STEPS_COUNT = 8
  const GATE_PALETTE: { type: GateType; label: string; desc: string; color: string }[] = [
    { type: 'H', label: 'H', desc: 'Hadamard (Superposition)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30' },
    { type: 'X', label: 'X', desc: 'Pauli-X (NOT Bit-flip)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' },
    { type: 'Y', label: 'Y', desc: 'Pauli-Y (Bit & Phase flip)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
    { type: 'Z', label: 'Z', desc: 'Pauli-Z (Phase-flip)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30' },
    { type: 'S', label: 'S', desc: 'Phase Gate (π/2 phase)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30' },
    { type: 'T', label: 'T', desc: 'π/8 Gate (π/4 phase)', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40 hover:bg-violet-500/30' },
    { type: 'CNOT', label: '⊕', desc: 'Controlled-NOT (Entangler)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' },
  ]

  function handleSlotClick(qubitIdx: number, stepIdx: number) {
    const existing = placedGates.find((g) => g.targetQubit === qubitIdx && g.step === stepIdx)
    if (existing) {
      removeGate(existing.id)
    } else {
      if (selectedGateType === 'CNOT') {
        addGate('CNOT', qubitIdx, stepIdx, cnotControl)
      } else {
        addGate(selectedGateType, qubitIdx, stepIdx)
      }
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Presets */}
      <div
        className="rounded-3xl border p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
              Quantum Circuit Builder & Simulator (FR-SIM-001..004)
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
              Classical State-Vector Engine
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300">
            Build circuits with up to 5 qubits, place unitary & 2-qubit entangling gates, and inspect exact measurement probability distributions.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Templates:</span>
          <button
            onClick={() => loadPresetCircuit('superposition')}
            className="rounded-lg border border-zinc-800 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:border-cyan-400 transition-colors"
          >
            H (Superposition)
          </button>
          <button
            onClick={() => loadPresetCircuit('bell_state')}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            Bell State (H + CNOT)
          </button>
          <button
            onClick={() => loadPresetCircuit('ghz_state')}
            className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-2.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            GHZ State (3-Qubit)
          </button>
        </div>
      </div>

      {/* Simulator Error Notice */}
      {simulatorError && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-950/30 p-4 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{simulatorError}</span>
        </div>
      )}

      {/* Gate Palette Toolbar */}
      <div
        className="rounded-3xl border p-4 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Select Gate:</span>
          {GATE_PALETTE.map((g) => {
            const isSelected = selectedGateType === g.type
            return (
              <button
                key={g.type}
                onClick={() => setSelectedGateType(g.type)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold transition-all ${g.color} ${
                  isSelected ? 'ring-2 ring-cyan-400 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : ''
                }`}
              >
                <span>{g.label}</span>
                <span className="text-[10px] font-sans font-normal opacity-80 hidden sm:inline">({g.type})</span>
              </button>
            )
          })}
        </div>

        {/* CNOT Control Selector (when CNOT selected) */}
        {selectedGateType === 'CNOT' && (
          <div className="flex items-center gap-2 text-xs bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-3 py-1 text-emerald-300">
            <span>CNOT Control Qubit:</span>
            <select
              value={cnotControl}
              onChange={(e) => setCnotControl(Number(e.target.value))}
              className="rounded bg-black border border-emerald-500/40 text-white px-2 py-0.5 font-mono text-xs outline-none"
            >
              {Array.from({ length: qubitCount }, (_, idx) => (
                <option key={idx} value={idx}>
                  q[{idx}]
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Qubit Wire Count Controls */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400 font-medium">Qubits: {qubitCount}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQubitCount(Math.max(1, qubitCount - 1))}
              disabled={qubitCount <= 1}
              className="rounded-lg border border-zinc-800 p-1 text-zinc-400 hover:text-white disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setQubitCount(Math.min(5, qubitCount + 1))}
              disabled={qubitCount >= 5}
              className="rounded-lg border border-zinc-800 p-1 text-zinc-400 hover:text-white disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={clearCircuit}
            className="flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors ml-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Circuit Interactive Grid (Canvas Representation) */}
      <div
        className="rounded-3xl border p-6 backdrop-blur-xl overflow-x-auto"
        style={{
          borderColor: 'var(--q-line)',
          background: 'var(--q-bg-deep)',
        }}
      >
        <div className="min-w-[640px] space-y-4">
          {/* Time Steps Header */}
          <div className="grid grid-cols-9 gap-2 text-center text-[10px] font-mono text-zinc-500 border-b pb-2" style={{ borderColor: 'var(--q-line)' }}>
            <div className="text-left font-sans text-zinc-400 font-bold">Register</div>
            {Array.from({ length: STEPS_COUNT }, (_, s) => (
              <div key={s}>Step {s + 1}</div>
            ))}
          </div>

          {/* Qubit Wires */}
          {Array.from({ length: qubitCount }, (_, qIdx) => (
            <div key={qIdx} className="grid grid-cols-9 gap-2 items-center relative py-2">
              {/* Horizontal Wire Line behind slots */}
              <div
                className="absolute left-16 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-zinc-800 pointer-events-none"
              />

              {/* Qubit Label */}
              <div className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5 z-10">
                <span className="rounded bg-white/5 px-2 py-1 border border-white/10">
                  q[{qIdx}] &bull; |0⟩
                </span>
              </div>

              {/* Step Slots */}
              {Array.from({ length: STEPS_COUNT }, (_, sIdx) => {
                const gate = placedGates.find((g) => g.targetQubit === qIdx && g.step === sIdx)
                const isControlForCnot = placedGates.find(
                  (g) => g.type === 'CNOT' && g.controlQubit === qIdx && g.step === sIdx
                )

                return (
                  <div key={sIdx} className="relative z-10 flex justify-center">
                    <button
                      onClick={() => handleSlotClick(qIdx, sIdx)}
                      className={`h-11 w-11 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        gate
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-105'
                          : isControlForCnot
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                          : 'border-zinc-800 bg-black/40 text-transparent hover:border-zinc-600 hover:text-zinc-600'
                      }`}
                    >
                      {gate ? (
                        gate.type === 'CNOT' ? '⊕' : gate.type
                      ) : isControlForCnot ? (
                        '●'
                      ) : (
                        '+'
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Run Simulation CTA */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--q-line)' }}>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>Click any slot to place/remove active gate &bull; Total Gates: {placedGates.length}</span>
          </div>

          <button
            onClick={runSimulation}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-all hover:scale-105 shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
            style={{
              background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            }}
          >
            <Play className="h-4 w-4" />
            <span>Run Simulation (FR-SIM-002)</span>
          </button>
        </div>
      </div>

      {/* Measurement Probability Distribution Results (FR-SIM-003) */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-2" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Measurement Probabilities per Basis State (FR-SIM-003)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Exact state-vector amplitudes calculated in {simulationResult.executionTimeMs} ms across {simulationResult.basisStates.length} computational basis states.
            </p>
          </div>

          {simulationResult.isEntangled && (
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 border border-purple-500/40 animate-pulse">
              🔗 Entangled State Detected
            </span>
          )}
        </div>

        {/* Probability Bars - Expansive 8-col grid on wide displays */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {simulationResult.basisStates
            .filter((s) => s.probability > 0.0001 || simulationResult.qubitCount <= 3)
            .map((state) => (
              <div
                key={state.state}
                className={`rounded-2xl border p-4 transition-colors ${
                  state.percentage > 0
                    ? 'border-cyan-500/40 bg-cyan-950/20'
                    : 'border-zinc-800/80 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white tracking-wider">
                    {state.state}
                  </span>
                  <span className="font-mono text-sm font-bold text-cyan-300">
                    {state.percentage}%
                  </span>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)] transition-all duration-500"
                    style={{ width: `${state.percentage}%` }}
                  />
                </div>

                <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                  Amplitude: {state.amplitudeReal} + {state.amplitudeImag}i
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
