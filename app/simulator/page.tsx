'use client'

import React, { useState } from 'react'
import {
  Play,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Share2,
  Code,
  Sliders,
  Cpu,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  GATE_PALETTE,
  PRESET_CIRCUITS,
  PlacedGate,
  simulateCircuitMock,
  SimulationOutput,
} from '@/lib/mock/simulator'
import { AppShell } from '@/components/layout/AppShell'

export default function SimulatorPage() {
  const [qubitsCount, setQubitsCount] = useState(2)
  const [selectedGateType, setSelectedGateType] = useState<string>('H')
  const [placedGates, setPlacedGates] = useState<PlacedGate[]>(PRESET_CIRCUITS[0].gates)
  const [backend, setBackend] = useState('Qiskit Aer')
  const [shots, setShots] = useState(1000)
  const [simulating, setSimulating] = useState(false)
  const [results, setResults] = useState<SimulationOutput | null>(
    simulateCircuitMock(PRESET_CIRCUITS[0].gates, 2, 'Qiskit Aer', 1000)
  )

  const handleCellClick = (qubitIndex: number, stepIndex: number) => {
    // Check if gate exists at this slot
    const existingIndex = placedGates.findIndex(
      (g) => g.qubitIndex === qubitIndex && g.stepIndex === stepIndex
    )

    if (existingIndex >= 0) {
      // Remove gate
      setPlacedGates((prev) => prev.filter((_, idx) => idx !== existingIndex))
    } else {
      // Place selected gate
      const newGate: PlacedGate = {
        id: `gate-${Date.now()}-${Math.random()}`,
        type: selectedGateType,
        qubitIndex,
        stepIndex,
      }

      if (selectedGateType === 'CNOT') {
        newGate.targetQubitIndex = (qubitIndex + 1) % qubitsCount
      }

      setPlacedGates((prev) => [...prev, newGate])
    }
  }

  const handleRun = () => {
    setSimulating(true)
    setTimeout(() => {
      const output = simulateCircuitMock(placedGates, qubitsCount, backend, shots)
      setResults(output)
      setSimulating(false)
    }, 900)
  }

  const loadPreset = (presetId: string) => {
    const preset = PRESET_CIRCUITS.find((p) => p.id === presetId)
    if (preset) {
      setQubitsCount(preset.qubitsCount)
      setPlacedGates(preset.gates)
      const output = simulateCircuitMock(preset.gates, preset.qubitsCount, backend, shots)
      setResults(output)
    }
  }

  const clearCircuit = () => {
    setPlacedGates([])
    setResults(null)
  }

  // Render max 6 step columns
  const maxSteps = 6

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl py-4 space-y-6">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Cpu className="h-3.5 w-3.5" />
              Quantum Circuit Workbench
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Circuit Simulator</h1>
          </div>

          {/* Quick Toolbar Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              onChange={(e) => loadPreset(e.target.value)}
              defaultValue="bell-state"
              className="rounded-xl border py-2 px-3 text-xs font-semibold text-white outline-none"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <option value="" disabled>Load Preset Circuit...</option>
              {PRESET_CIRCUITS.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            <button
              onClick={clearCircuit}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold text-[var(--q-muted)] hover:text-red-400 hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--q-line)' }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>

            <button
              onClick={handleRun}
              disabled={simulating}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-50 shadow-xl shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {simulating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black" />
                  <span>Run Circuit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Simulator Workbench Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Palette (3 cols) */}
          <div className="lg:col-span-3 rounded-3xl border p-5 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[var(--q-cyan)]" />
              Quantum Gate Palette
            </h3>
            <p className="text-[11px] text-[var(--q-muted)]">Select a gate to place onto qubit wires below:</p>

            <div className="grid grid-cols-2 gap-2">
              {GATE_PALETTE.map((gate) => {
                const selected = selectedGateType === gate.type
                return (
                  <button
                    key={gate.type}
                    onClick={() => setSelectedGateType(gate.type)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all ${
                      selected
                        ? 'border-[var(--q-cyan)] bg-cyan-500/20 shadow-lg shadow-cyan-500/10 scale-105'
                        : 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-bold text-white mb-1"
                      style={{ background: gate.color }}
                    >
                      {gate.symbol}
                    </span>
                    <span className="text-[11px] font-semibold text-white">{gate.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center Canvas (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border p-6 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              <div className="flex items-center gap-3">
                <span className="font-heading text-sm font-bold text-white">Circuit Grid Canvas</span>
                <span className="text-xs text-[var(--q-muted)]">{qubitsCount} Qubits • {placedGates.length} Gates</span>
              </div>

              {/* Add/Remove Qubits Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQubitsCount((q) => Math.max(1, q - 1))}
                  disabled={qubitsCount <= 1}
                  className="rounded-lg border p-1 text-[var(--q-muted)] hover:text-white disabled:opacity-30"
                  style={{ borderColor: 'var(--q-line)' }}
                  title="Remove Qubit"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-2 text-xs font-bold text-cyan-300">q0..q{qubitsCount - 1}</span>
                <button
                  onClick={() => setQubitsCount((q) => Math.min(4, q + 1))}
                  disabled={qubitsCount >= 4}
                  className="rounded-lg border p-1 text-[var(--q-muted)] hover:text-white disabled:opacity-30"
                  style={{ borderColor: 'var(--q-line)' }}
                  title="Add Qubit"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Qubit Wire Canvas */}
            <div className="space-y-6 py-4 overflow-x-auto">
              {Array.from({ length: qubitsCount }).map((_, qubitIdx) => (
                <div key={qubitIdx} className="flex items-center gap-4 min-w-[420px]">
                  {/* Qubit Wire Label */}
                  <div className="w-12 font-mono text-xs font-bold text-cyan-300 shrink-0">
                    q[{qubitIdx}] |0⟩
                  </div>

                  {/* Wire Line with Slots */}
                  <div className="relative flex-1 flex items-center justify-between before:absolute before:inset-x-0 before:h-0.5 before:bg-white/20">
                    {Array.from({ length: maxSteps }).map((_, stepIdx) => {
                      const gateAtSlot = placedGates.find(
                        (g) => g.qubitIndex === qubitIdx && g.stepIndex === stepIdx
                      )
                      const gateDef = gateAtSlot
                        ? GATE_PALETTE.find((def) => def.type === gateAtSlot.type)
                        : null

                      return (
                        <button
                          key={stepIdx}
                          onClick={() => handleCellClick(qubitIdx, stepIdx)}
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                            gateAtSlot
                              ? 'border-white text-white font-mono font-bold shadow-lg scale-105'
                              : 'border-dashed border-white/20 bg-black/40 hover:border-cyan-400 hover:bg-cyan-500/10'
                          }`}
                          style={gateDef ? { background: gateDef.color } : {}}
                          title={gateAtSlot ? `Click to remove ${gateAtSlot.type}` : `Click to place ${selectedGateType}`}
                        >
                          {gateAtSlot ? gateAtSlot.type : ''}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-center text-[var(--q-muted)]">
              💡 Click any empty wire slot to place selected <strong>{selectedGateType}</strong> gate. Click existing gate to remove.
            </p>
          </div>

          {/* Right Simulation Results Panel (3 cols) */}
          <div className="lg:col-span-3 rounded-3xl border p-5 backdrop-blur-xl space-y-5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              <Zap className="h-4 w-4 text-[var(--q-cyan)]" />
              Simulation Results
            </h3>

            {/* Backend & Shots Config */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--q-muted)] block mb-1">Execution Backend:</label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  className="w-full rounded-xl border p-2 text-xs font-semibold text-white outline-none"
                  style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                >
                  <option value="Qiskit Aer">Qiskit Aer (IBM Quantum)</option>
                  <option value="PennyLane">PennyLane Simulator</option>
                  <option value="Cirq">Google Cirq Engine</option>
                  <option value="qBraid">qBraid Lab Cluster</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--q-muted)] flex justify-between mb-1">
                  <span>Shots Count:</span>
                  <span className="text-cyan-300 font-bold">{shots}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={shots}
                  onChange={(e) => setShots(Number(e.target.value))}
                  className="w-full accent-[var(--q-cyan)]"
                />
              </div>
            </div>

            {/* Probability Output Chart */}
            {results ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Measurement Probabilities</span>
                  <span className="text-[10px] text-[var(--q-muted)]">{results.executionTimeMs}ms</span>
                </div>

                <div className="h-40 w-full">
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

                {/* State Vector Breakdown */}
                <div className="rounded-2xl border p-3 space-y-1.5 text-xs font-mono" style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}>
                  <p className="text-[10px] text-[var(--q-muted)] uppercase tracking-wider font-sans">State vector amplitudes</p>
                  {results.stateVector.map((sv) => (
                    <div key={sv.state} className="flex justify-between text-cyan-300">
                      <span>{sv.state}:</span>
                      <span>{sv.amplitude}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[var(--q-muted)] border rounded-2xl" style={{ borderColor: 'var(--q-line)' }}>
                Click <strong>Run Circuit</strong> to simulate gate probability outcomes.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
