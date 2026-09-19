export interface GateDefinition {
  type: string
  name: string
  symbol: string
  description: string
  color: string
  isMultiQubit?: boolean
  requiresTarget?: boolean
}

export const GATE_PALETTE: GateDefinition[] = [
  {
    type: 'H',
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates equal superposition (|0⟩+|1⟩)/√2',
    color: '#06B6D4',
  },
  {
    type: 'X',
    name: 'Pauli-X',
    symbol: 'X',
    description: 'Quantum NOT gate (bit-flip)',
    color: '#7C3AED',
  },
  {
    type: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Bit and phase flip',
    color: '#3B82F6',
  },
  {
    type: 'Z',
    name: 'Pauli-Z',
    symbol: 'Z',
    description: 'Phase flip gate',
    color: '#F59E0B',
  },
  {
    type: 'S',
    name: 'Phase (S)',
    symbol: 'S',
    description: 'π/2 phase rotation around Z-axis',
    color: '#10B981',
  },
  {
    type: 'T',
    name: 'Phase (T)',
    symbol: 'T',
    description: 'π/4 phase rotation around Z-axis',
    color: '#EC4899',
  },
  {
    type: 'CNOT',
    name: 'Controlled-NOT',
    symbol: 'CX',
    description: '2-qubit entangling gate (Control + Target)',
    color: '#8B5CF6',
    isMultiQubit: true,
    requiresTarget: true,
  },
  {
    type: 'M',
    name: 'Measurement',
    symbol: 'M',
    description: 'Collapses qubit wavefunction into classical bit',
    color: '#EF4444',
  },
]

export interface PlacedGate {
  id: string
  type: string
  qubitIndex: number
  stepIndex: number
  targetQubitIndex?: number
}

export interface PresetCircuit {
  id: string
  title: string
  description: string
  qubitsCount: number
  gates: PlacedGate[]
}

export const PRESET_CIRCUITS: PresetCircuit[] = [
  {
    id: 'bell-state',
    title: 'Bell State (|Φ+⟩)',
    description: 'Generates maximum 2-qubit entanglement (|00⟩ + |11⟩)/√2',
    qubitsCount: 2,
    gates: [
      { id: 'g-1', type: 'H', qubitIndex: 0, stepIndex: 0 },
      { id: 'g-2', type: 'CNOT', qubitIndex: 0, stepIndex: 1, targetQubitIndex: 1 },
      { id: 'g-3', type: 'M', qubitIndex: 0, stepIndex: 2 },
      { id: 'g-4', type: 'M', qubitIndex: 1, stepIndex: 2 },
    ],
  },
  {
    id: 'ghz-state',
    title: '3-Qubit GHZ State',
    description: 'Maximally entangled 3-qubit state (|000⟩ + |111⟩)/√2',
    qubitsCount: 3,
    gates: [
      { id: 'g-1', type: 'H', qubitIndex: 0, stepIndex: 0 },
      { id: 'g-2', type: 'CNOT', qubitIndex: 0, stepIndex: 1, targetQubitIndex: 1 },
      { id: 'g-3', type: 'CNOT', qubitIndex: 1, stepIndex: 2, targetQubitIndex: 2 },
      { id: 'g-4', type: 'M', qubitIndex: 0, stepIndex: 3 },
      { id: 'g-5', type: 'M', qubitIndex: 1, stepIndex: 3 },
      { id: 'g-6', type: 'M', qubitIndex: 2, stepIndex: 3 },
    ],
  },
  {
    id: 'grover-2q',
    title: 'Grover Search (2-Qubit)',
    description: 'Searches for target state |11⟩ in a 4-element domain in 1 step.',
    qubitsCount: 2,
    gates: [
      { id: 'g-1', type: 'H', qubitIndex: 0, stepIndex: 0 },
      { id: 'g-2', type: 'H', qubitIndex: 1, stepIndex: 0 },
      { id: 'g-3', type: 'Z', qubitIndex: 0, stepIndex: 1 },
      { id: 'g-4', type: 'CNOT', qubitIndex: 0, stepIndex: 2, targetQubitIndex: 1 },
      { id: 'g-5', type: 'H', qubitIndex: 0, stepIndex: 3 },
      { id: 'g-6', type: 'H', qubitIndex: 1, stepIndex: 3 },
      { id: 'g-7', type: 'M', qubitIndex: 0, stepIndex: 4 },
      { id: 'g-8', type: 'M', qubitIndex: 1, stepIndex: 4 },
    ],
  },
]

export interface SimulationOutput {
  counts: Record<string, number>
  probabilities: { state: string; count: number; percentage: number }[]
  stateVector: { state: string; amplitude: string; magnitude: number }[]
  executionTimeMs: number
  backend: string
  shots: number
}

export function simulateCircuitMock(
  gates: PlacedGate[],
  qubitsCount: number,
  backend: string,
  shots: number
): SimulationOutput {
  // Generate realistic probability outcomes based on placed gates
  const hasH0 = gates.some((g) => g.qubitIndex === 0 && g.type === 'H')
  const hasCNOT = gates.some((g) => g.type === 'CNOT')
  
  let probs: Record<string, number> = {}

  if (qubitsCount === 2) {
    if (hasH0 && hasCNOT) {
      // Bell State ~ 50% |00⟩, 50% |11⟩ with realistic shot variance
      const count00 = Math.round(shots * (0.49 + Math.random() * 0.02))
      const count11 = shots - count00
      probs = { '|00⟩': count00, '|11⟩': count11 }
    } else if (hasH0) {
      // Superposition 50% |00⟩, 50% |01⟩
      const count00 = Math.round(shots * (0.48 + Math.random() * 0.04))
      const count01 = shots - count00
      probs = { '|00⟩': count00, '|01⟩': count01 }
    } else {
      probs = { '|00⟩': shots }
    }
  } else if (qubitsCount === 3) {
    if (hasH0 && hasCNOT) {
      const count000 = Math.round(shots * (0.495 + Math.random() * 0.01))
      const count111 = shots - count000
      probs = { '|000⟩': count000, '|111⟩': count111 }
    } else {
      probs = { '|000⟩': shots }
    }
  } else {
    probs = { '|0000⟩': shots }
  }

  const probabilities = Object.entries(probs).map(([state, count]) => ({
    state,
    count,
    percentage: Math.round((count / shots) * 1000) / 10,
  }))

  const stateVector = Object.entries(probs).map(([state, count]) => ({
    state,
    amplitude: count > 0 ? `1/√${Object.keys(probs).length}` : '0.0',
    magnitude: Math.sqrt(count / shots),
  }))

  return {
    counts: probs,
    probabilities,
    stateVector,
    executionTimeMs: Math.floor(45 + Math.random() * 30),
    backend,
    shots,
  }
}
