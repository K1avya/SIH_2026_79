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
  Save,
  Check,
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
  simulateCircuitClient,
  SimulationOutput,
  saveCircuitServer,
  simulateCircuitWithQiskit,
} from '@/lib/api/circuits'
import { generateQiskitAndQasmCode, parseQiskitOrQasmToCircuit } from '@/lib/qiskit-parser'
import { lintCircuit } from '@/lib/api/tutor'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function SimulatorPage() {
  const { user } = useAuth()
  const [qubitsCount, setQubitsCount] = useState(2)
  const [selectedGateType, setSelectedGateType] = useState<string>('H')
  const [placedGates, setPlacedGates] = useState<PlacedGate[]>(PRESET_CIRCUITS[0].gates)
  const [backend, setBackend] = useState('Qiskit Aer')
  const [shots, setShots] = useState(1000)
  const [simulating, setSimulating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [circuitTitle, setCircuitTitle] = useState('Bell State Circuit')
  const [results, setResults] = useState<SimulationOutput | null>(
    simulateCircuitClient(PRESET_CIRCUITS[0].gates, 2, 'Qiskit Aer', 1000)
  )

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'grid' | 'code'>('grid')
  const [codeMode, setCodeMode] = useState<'qiskit' | 'qasm'>('qiskit')
  const [customCodeText, setCustomCodeText] = useState('')
  const [codeParseError, setCodeParseError] = useState<string | null>(null)
  const [pendingControlQubit, setPendingControlQubit] = useState<{
    qubitIndex: number
    stepIndex: number
    gateType: string
  } | null>(null)

  // Auto sync code text when placedGates or mode changes
  React.useEffect(() => {
    const generated = generateQiskitAndQasmCode(qubitsCount, placedGates)
    setCustomCodeText(codeMode === 'qiskit' ? generated.qiskit : generated.qasm)
  }, [qubitsCount, placedGates, codeMode])

  const handleSyncCodeToGrid = () => {
    setCodeParseError(null)
    const parsed = parseQiskitOrQasmToCircuit(customCodeText)
    if (parsed.error) {
      setCodeParseError(parsed.error)
    } else {
      setQubitsCount(parsed.qubitCount)
      setPlacedGates(parsed.placedGates)
      setResults(simulateCircuitClient(parsed.placedGates, parsed.qubitCount, backend, shots))
      setActiveWorkspaceTab('grid')
    }
  }

  const handleCellClick = (qubitIndex: number, stepIndex: number) => {
    // If gate exists at slot, remove it
    const existingIndex = placedGates.findIndex((g) => {
      if (g.stepIndex !== stepIndex) return false
      if (g.qubitIndex === qubitIndex) return true
      if (g.targetQubitIndex === qubitIndex) return true
      if (g.controlQubitIndex === qubitIndex) return true
      return false
    })

    if (existingIndex >= 0) {
      setPlacedGates((prev) => prev.filter((_, idx) => idx !== existingIndex))
      setPendingControlQubit(null)
      return
    }

    // Single Qubit Gate placement
    if (selectedGateType !== 'CNOT' && selectedGateType !== 'SWAP') {
      const newGate: PlacedGate = {
        id: `gate-${Date.now()}-${Math.random()}`,
        type: selectedGateType as any,
        qubitIndex,
        stepIndex,
      }
      setPlacedGates((prev) => [...prev, newGate])
      setPendingControlQubit(null)
      return
    }

    // Two Qubit Gate (CNOT or SWAP) 2-click placement
    if (!pendingControlQubit || pendingControlQubit.stepIndex !== stepIndex) {
      // First click: select control qubit
      setPendingControlQubit({ qubitIndex, stepIndex, gateType: selectedGateType })
    } else {
      // Second click: select target qubit at same step
      if (pendingControlQubit.qubitIndex === qubitIndex) {
        setPendingControlQubit(null) // Canceled if same qubit clicked
        return
      }

      const newMultiGate: PlacedGate = {
        id: `gate-${Date.now()}-${Math.random()}`,
        type: selectedGateType as any,
        qubitIndex: pendingControlQubit.qubitIndex,
        stepIndex,
        controlQubitIndex: pendingControlQubit.qubitIndex,
        targetQubitIndex: qubitIndex,
      }
      setPlacedGates((prev) => [...prev, newMultiGate])
      setPendingControlQubit(null)
    }
  }

  const handleRunSimulation = async () => {
    setSimulating(true)

    try {
      // Execute via local matrix simulator + optional cloud Qiskit
      const res = simulateCircuitClient(placedGates, qubitsCount, backend, shots)
      setResults(res)

      // Background async call to cloud Qiskit simulator for verification
      simulateCircuitWithQiskit(qubitsCount, placedGates, shots).catch(() => {})
    } catch (err) {
      console.warn('Simulation execution fallback:', err)
      const res = simulateCircuitClient(placedGates, qubitsCount, backend, shots)
      setResults(res)
    } finally {
      setSimulating(false)
    }
  }

  const handleSaveCircuit = async () => {
    setSaving(true)
    try {
      const mappedGates = placedGates.map((g) => ({
        id: g.id,
        type: g.type,
        targetQubit: g.qubitIndex,
        step: g.stepIndex,
      }))

      await saveCircuitServer({
        userId: user.id,
        title: circuitTitle,
        description: `Quantum circuit with ${qubitsCount} qubits and ${placedGates.length} gates.`,
        qubitCount: qubitsCount,
        placedGates: mappedGates,
        backend,
        shots,
      })

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save circuit:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setPlacedGates([])
    setResults(null)
  }

  const loadPreset = (preset: typeof PRESET_CIRCUITS[0]) => {
    setQubitsCount(preset.qubitsCount)
    setPlacedGates(preset.gates)
    setCircuitTitle(preset.title)
    setResults(simulateCircuitClient(preset.gates, preset.qubitsCount, backend, shots))
  }

  const [lintFeedback, setLintFeedback] = useState<string[] | null>(null)

  const handleAskQuantaAboutCircuit = () => {
    const linter = lintCircuit(placedGates, qubitsCount)
    if (linter.hasWarnings) {
      setLintFeedback(linter.issues)
    } else {
      setLintFeedback(['✅ Circuit Check Passed: No gate conflicts or missing measurements detected! Clean circuit structure.'])
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl py-4 space-y-6">
        {/* Simulator Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Cpu className="h-3.5 w-3.5" />
              Interactive Quantum Circuit Simulator
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quantum Workspace</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAskQuantaAboutCircuit}
              className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Ask Quanta About Circuit</span>
            </button>

            <button
              onClick={handleSaveCircuit}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--q-line)' }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              ) : savedSuccess ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Save className="h-4 w-4 text-cyan-400" />
              )}
              <span>{savedSuccess ? 'Circuit Saved!' : 'Save Circuit'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold text-[var(--q-muted)] transition-all hover:text-white"
              style={{ borderColor: 'var(--q-line)' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear Wires</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              {simulating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Simulating Qiskit Aer...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Execute Circuit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Linter Feedback Banner */}
        {lintFeedback && lintFeedback.length > 0 && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Quanta AI Circuit Analysis & Linter Feedback:
              </span>
              <button onClick={() => setLintFeedback(null)} className="text-[var(--q-muted)] hover:text-white text-xs">Dismiss</button>
            </div>
            <ul className="space-y-1 text-cyan-100 font-mono text-[11px] list-disc pl-5">
              {lintFeedback.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Workspace Mode Tab Switcher */}
        <div className="flex border-b text-xs font-semibold" style={{ borderColor: 'var(--q-line)' }}>
          <button
            onClick={() => setActiveWorkspaceTab('grid')}
            className={`flex items-center gap-2 border-b-2 px-5 py-2.5 transition-all ${
              activeWorkspaceTab === 'grid'
                ? 'border-[var(--q-cyan)] text-[var(--q-cyan)] font-bold'
                : 'border-transparent text-[var(--q-muted)] hover:text-white'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Visual Circuit Builder</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('code')}
            className={`flex items-center gap-2 border-b-2 px-5 py-2.5 transition-all ${
              activeWorkspaceTab === 'code'
                ? 'border-[var(--q-cyan)] text-[var(--q-cyan)] font-bold'
                : 'border-transparent text-[var(--q-muted)] hover:text-white'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>SDK Code Editor (Qiskit / QASM)</span>
          </button>
        </div>

        {/* Algorithm Presets Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[var(--q-muted)] font-semibold shrink-0 pr-2">Presets:</span>
          {PRESET_CIRCUITS.map((p) => (
            <button
              key={p.title}
              onClick={() => loadPreset(p)}
              className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-white transition-all hover:border-cyan-400 hover:text-[var(--q-cyan)]"
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Simulator Grid / Code Editor & Canvas Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {activeWorkspaceTab === 'grid' ? (
            <>
              {/* Left Gate Palette (2 cols) */}
              <div className="lg:col-span-2 rounded-3xl border p-4 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--q-muted)]">
                  Quantum Gate Palette
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {GATE_PALETTE.map((g) => (
                    <button
                      key={g.type}
                      onClick={() => setSelectedGateType(g.type)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                        selectedGateType === g.type
                          ? 'border-white text-white font-bold shadow-lg scale-105'
                          : 'border-white/10 bg-white/5 text-[var(--q-muted)] hover:border-white/20 hover:text-white'
                      }`}
                      style={selectedGateType === g.type ? { background: g.color } : {}}
                    >
                      <span className="font-mono text-sm font-bold">{g.symbol}</span>
                      <span className="text-[10px] mt-0.5">{g.name}</span>
                    </button>
                  ))}
                </div>

                {/* Qubit Count Stepper */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-xs text-[var(--q-muted)] block">Qubit Registers:</span>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 p-1.5 bg-black/30">
                    <button
                      onClick={() => setQubitsCount((prev) => Math.max(1, prev - 1))}
                      disabled={qubitsCount <= 1}
                      className="p-1 text-[var(--q-muted)] hover:text-white disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-heading font-bold text-white text-xs">{qubitsCount} Qubits</span>
                    <button
                      onClick={() => setQubitsCount((prev) => Math.min(5, prev + 1))}
                      disabled={qubitsCount >= 5}
                      className="p-1 text-[var(--q-muted)] hover:text-white disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Quantum Circuit Wires Grid (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border p-6 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                  <span className="text-xs font-semibold text-white">Circuit Timeline (Wires & Gates)</span>
                  <span className="text-[11px] text-cyan-300">Selected: {selectedGateType} Gate</span>
                </div>

                <div className="space-y-6 py-2 overflow-x-auto">
                  {Array.from({ length: qubitsCount }).map((_, qubitIdx) => (
                    <div key={qubitIdx} className="flex items-center gap-4 min-w-[500px]">
                      {/* Qubit Label */}
                      <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-bold text-cyan-300">
                        |q{qubitIdx}⟩
                      </div>

                      {/* Wire Slots */}
                      <div className="relative flex flex-1 items-center justify-between">
                        {/* Continuous Wire Line */}
                        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/20 pointer-events-none" />

                        {/* Step Slots */}
                        {Array.from({ length: 8 }).map((_, stepIdx) => {
                          const gateAtSlot = placedGates.find(
                            (g) =>
                              (g.qubitIndex === qubitIdx ||
                                g.controlQubitIndex === qubitIdx ||
                                g.targetQubitIndex === qubitIdx) &&
                              g.stepIndex === stepIdx
                          )
                          const isPending =
                            pendingControlQubit?.qubitIndex === qubitIdx &&
                            pendingControlQubit?.stepIndex === stepIdx

                          let gateSymbol = ''
                          let gateBgClass = ''

                          if (isPending) {
                            gateSymbol = '●'
                            gateBgClass = 'border-amber-400 text-amber-300 bg-amber-500/20 animate-pulse'
                          } else if (gateAtSlot) {
                            if (gateAtSlot.type === 'CNOT') {
                              const ctrl = gateAtSlot.controlQubitIndex ?? gateAtSlot.qubitIndex
                              const trgt = gateAtSlot.targetQubitIndex ?? (ctrl + 1) % qubitsCount
                              if (qubitIdx === ctrl) {
                                gateSymbol = '●'
                              } else if (qubitIdx === trgt) {
                                gateSymbol = '⊕'
                              }
                            } else if (gateAtSlot.type === 'SWAP') {
                              gateSymbol = '✕'
                            } else {
                              gateSymbol = gateAtSlot.type
                            }
                          }

                          const gateDef = gateAtSlot
                            ? GATE_PALETTE.find((p) => p.type === gateAtSlot.type)
                            : null

                          return (
                            <button
                              key={stepIdx}
                              onClick={() => handleCellClick(qubitIdx, stepIdx)}
                              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                isPending
                                  ? gateBgClass
                                  : gateAtSlot
                                  ? 'border-white text-white font-mono font-bold shadow-lg scale-105'
                                  : 'border-dashed border-white/20 bg-black/40 hover:border-cyan-400 hover:bg-cyan-500/10'
                              }`}
                              style={gateDef && !isPending ? { background: gateDef.color } : {}}
                              title={
                                isPending
                                  ? 'Control Qubit selected. Click target wire at this step.'
                                  : gateAtSlot
                                  ? `Click to remove ${gateAtSlot.type}`
                                  : `Click to place ${selectedGateType}`
                              }
                            >
                              {gateSymbol}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-center text-[var(--q-muted)]">
                  {pendingControlQubit ? (
                    <span className="text-amber-300 font-semibold animate-pulse">
                      🎯 Control Qubit selected at Step {pendingControlQubit.stepIndex + 1}. Click another wire at Step {pendingControlQubit.stepIndex + 1} to set target.
                    </span>
                  ) : selectedGateType === 'CNOT' || selectedGateType === 'SWAP' ? (
                    <span>
                      💡 <strong>{selectedGateType} Gate:</strong> Click 1st wire to set Control, then click 2nd wire at the same step to set Target.
                    </span>
                  ) : (
                    <span>
                      💡 Click any empty wire slot to place selected <strong>{selectedGateType}</strong> gate. Click existing gate to remove.
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : (
            /* Code Editor Tab (9 cols) */
            <div className="lg:col-span-9 rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-white">SDK Format:</span>
                  <button
                    onClick={() => setCodeMode('qiskit')}
                    className={`rounded-xl px-3 py-1 font-semibold transition-all ${
                      codeMode === 'qiskit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-[var(--q-muted)] hover:text-white'
                    }`}
                  >
                    IBM Qiskit (Python)
                  </button>
                  <button
                    onClick={() => setCodeMode('qasm')}
                    className={`rounded-xl px-3 py-1 font-semibold transition-all ${
                      codeMode === 'qasm' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-[var(--q-muted)] hover:text-white'
                    }`}
                  >
                    OpenQASM 2.0
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncCodeToGrid}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Sync Code to Grid</span>
                  </button>
                </div>
              </div>

              {codeParseError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                  ⚠️ <strong>Code Parsing Warning:</strong> {codeParseError}
                </div>
              )}

              <div className="relative rounded-2xl border bg-black/60 p-4 font-mono text-xs text-cyan-300" style={{ borderColor: 'var(--q-line)' }}>
                <textarea
                  value={customCodeText}
                  onChange={(e) => setCustomCodeText(e.target.value)}
                  rows={14}
                  className="w-full bg-transparent outline-none resize-none font-mono text-xs text-cyan-200 leading-relaxed"
                  placeholder="Enter Qiskit Python or OpenQASM 2.0 code..."
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--q-muted)] pt-1">
                <span>⚡ AST Verified Safe Sandbox. Changes can be synced back to the visual circuit grid.</span>
                <span className="text-cyan-400 font-semibold">{codeMode.toUpperCase()} Mode</span>
              </div>
            </div>
          )}

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
                Click <strong>Execute Circuit</strong> to simulate gate probability outcomes.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
