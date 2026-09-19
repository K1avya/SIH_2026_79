import { BasisStateProbability, GateType, PlacedGate, SimulationResult } from '@/types/quantify'

interface Complex {
  r: number // real
  i: number // imag
}

function cAdd(a: Complex, b: Complex): Complex {
  return { r: a.r + b.r, i: a.i + b.i }
}

function cMul(a: Complex, b: Complex): Complex {
  return { r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r }
}

function cAbsSq(a: Complex): number {
  return a.r * a.r + a.i * a.i
}

// 2x2 Unitary Gate Matrices [ [u00, u01], [u10, u11] ]
const GATES_1Q: Record<string, [[Complex, Complex], [Complex, Complex]]> = {
  X: [
    [{ r: 0, i: 0 }, { r: 1, i: 0 }],
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
  ],
  Y: [
    [{ r: 0, i: 0 }, { r: 0, i: -1 }],
    [{ r: 0, i: 1 }, { r: 0, i: 0 }],
  ],
  Z: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: -1, i: 0 }],
  ],
  H: [
    [{ r: 1 / Math.SQRT2, i: 0 }, { r: 1 / Math.SQRT2, i: 0 }],
    [{ r: 1 / Math.SQRT2, i: 0 }, { r: -1 / Math.SQRT2, i: 0 }],
  ],
  S: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: 0, i: 1 }],
  ],
  T: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: Math.SQRT1_2, i: Math.SQRT1_2 }],
  ],
}

/**
 * Simulates an N-qubit quantum circuit classically using full state-vector evolution.
 * Supports up to 5 qubits (dimension 32), X, Y, Z, H, S, T, and CNOT.
 */
export function simulateQuantumCircuit(
  qubitCount: number,
  gates: PlacedGate[]
): SimulationResult {
  const startTime = performance.now()
  const dim = 1 << qubitCount

  // Initial state |0...0> = [1, 0, 0, ... 0]
  let state: Complex[] = Array.from({ length: dim }, (_, idx) =>
    idx === 0 ? { r: 1, i: 0 } : { r: 0, i: 0 }
  )

  // Sort gates sequentially by step column (0 to 7)
  const sortedGates = [...gates].sort((a, b) => a.step - b.step)

  for (const gate of sortedGates) {
    if (gate.type === 'CNOT') {
      const control = gate.controlQubit ?? 0
      const target = gate.targetQubit

      if (control === target || control >= qubitCount || target >= qubitCount) {
        continue // invalid CNOT
      }

      const nextState: Complex[] = [...state]
      for (let i = 0; i < dim; i++) {
        const controlBit = (i >> control) & 1
        if (controlBit === 1) {
          // Flip target bit
          const flippedIndex = i ^ (1 << target)
          nextState[flippedIndex] = state[i]
        } else {
          nextState[i] = state[i]
        }
      }
      state = nextState
    } else {
      // 1-Qubit Gate
      const mat = GATES_1Q[gate.type]
      if (!mat || gate.targetQubit >= qubitCount) continue

      const target = gate.targetQubit
      const nextState: Complex[] = Array.from({ length: dim }, () => ({ r: 0, i: 0 }))

      for (let i = 0; i < dim; i++) {
        const bit = (i >> target) & 1
        const i0 = i & ~(1 << target) // index with target bit = 0
        const i1 = i | (1 << target) // index with target bit = 1

        if (bit === 0) {
          // nextState[i0] = mat[0][0]*state[i0] + mat[0][1]*state[i1]
          nextState[i] = cAdd(
            cMul(mat[0][0], state[i0]),
            cMul(mat[0][1], state[i1])
          )
        } else {
          // nextState[i1] = mat[1][0]*state[i0] + mat[1][1]*state[i1]
          nextState[i] = cAdd(
            cMul(mat[1][0], state[i0]),
            cMul(mat[1][1], state[i1])
          )
        }
      }
      state = nextState
    }
  }

  // Calculate measurement probabilities
  const basisStates: BasisStateProbability[] = state.map((amp, idx) => {
    // Format binary string with qubit 0 on the right: |q_(n-1)...q_0>
    const binary = idx.toString(2).padStart(qubitCount, '0')
    const prob = cAbsSq(amp)
    return {
      state: `|${binary}⟩`,
      probability: Number(prob.toFixed(4)),
      percentage: Number((prob * 100).toFixed(1)),
      amplitudeReal: Number(amp.r.toFixed(3)),
      amplitudeImag: Number(amp.i.toFixed(3)),
    }
  })

  // Detect entanglement heuristic (multiple non-zero states with correlations)
  const nonZero = basisStates.filter((s) => s.probability > 0.01)
  const hasCnot = gates.some((g) => g.type === 'CNOT')
  const isEntangled = hasCnot && nonZero.length > 1 && nonZero.every((s) => s.probability > 0.3)

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2))

  return {
    qubitCount,
    basisStates,
    executionTimeMs,
    isEntangled,
  }
}
