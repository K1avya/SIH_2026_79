import { PlacedGate, simulateCircuitClient } from '@/lib/api/circuits'

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface QuantumChallenge {
  id: string
  title: string
  category: string
  difficulty: ChallengeDifficulty
  description: string
  qubitCount: number
  maxGates?: number
  allowedGates?: string[]
  targetStateDescription: string
  targetProbabilities: Record<string, number> // e.g. { '|00⟩': 0.5, '|11⟩': 0.5 }
  hint: string
}

export interface ChallengeSubmissionResult {
  passed: boolean
  tvd: number // Total Variation Distance (0.0 to 1.0)
  scorePercent: number
  gateCountUsed: number
  withinGateLimit: boolean
  feedback: string
}

export const SEED_CHALLENGES: QuantumChallenge[] = [
  {
    id: 'ch-superposition',
    title: 'Equal Superposition State',
    category: 'Superposition',
    difficulty: 'beginner',
    description: 'Create an equal superposition state (|0⟩ + |1⟩)/√2 on a single qubit using the minimal gate depth.',
    qubitCount: 1,
    maxGates: 2,
    targetStateDescription: '|+⟩ state with 50% |0⟩ and 50% |1⟩',
    targetProbabilities: { '|0⟩': 0.5, '|1⟩': 0.5 },
    hint: 'Apply a single Hadamard (H) gate to qubit 0.',
  },
  {
    id: 'ch-bell-phi-plus',
    title: 'Bell State |Φ+⟩ Creation',
    category: 'Entanglement',
    difficulty: 'beginner',
    description: 'Construct the maximally entangled 2-qubit Bell state (|00⟩ + |11⟩)/√2.',
    qubitCount: 2,
    maxGates: 3,
    targetStateDescription: '50% probability of |00⟩ and 50% probability of |11⟩',
    targetProbabilities: { '|00⟩': 0.5, '|11⟩': 0.5 },
    hint: 'Place a Hadamard gate on qubit 0, followed by a CNOT gate with control=0 and target=1.',
  },
  {
    id: 'ch-ghz-state',
    title: '3-Qubit GHZ State',
    category: 'Entanglement',
    difficulty: 'intermediate',
    description: 'Create a 3-qubit GHZ state (|000⟩ + |111⟩)/√2.',
    qubitCount: 3,
    maxGates: 4,
    targetStateDescription: '50% probability of |000⟩ and 50% probability of |111⟩',
    targetProbabilities: { '|000⟩': 0.5, '|111⟩': 0.5 },
    hint: 'Start with H on qubit 0, then cascade CNOT(0->1) and CNOT(1->2).',
  },
  {
    id: 'ch-bit-flip',
    title: 'Qubit State Inversion',
    category: 'Gates',
    difficulty: 'beginner',
    description: 'Invert an initial |0⟩ qubit into state |1⟩ with 100% probability.',
    qubitCount: 1,
    maxGates: 1,
    targetStateDescription: '100% probability of |1⟩',
    targetProbabilities: { '|1⟩': 1.0 },
    hint: 'Use the Pauli-X (quantum NOT) gate.',
  },
  {
    id: 'ch-grover-2q',
    title: 'Grover Search (|11⟩ Target)',
    category: 'Algorithms',
    difficulty: 'advanced',
    description: 'Design a 2-qubit Grover search circuit that amplifies the target state |11⟩ to >90% probability.',
    qubitCount: 2,
    maxGates: 8,
    targetStateDescription: 'Near 100% probability of measuring |11⟩',
    targetProbabilities: { '|11⟩': 1.0 },
    hint: 'Prepare superposition (H on q0, q1), apply Z on q0, CNOT(0->1), and Hadamard diffusion.',
  },
]

/**
 * Computes Total Variation Distance (TVD) between output probabilities P and target Q:
 * TVD(P, Q) = 0.5 * sum(|P(x) - Q(x)|)
 */
export function gradeChallengeSubmission(
  challenge: QuantumChallenge,
  userGates: PlacedGate[]
): ChallengeSubmissionResult {
  const gateCountUsed = userGates.length
  const withinGateLimit = challenge.maxGates ? gateCountUsed <= challenge.maxGates : true

  // Simulate user's circuit
  const sim = simulateCircuitClient(userGates, challenge.qubitCount, 'Qiskit Aer', 1000)

  // Map simulated counts to probabilities (0.0 to 1.0)
  const userProbs: Record<string, number> = {}
  sim.probabilities.forEach((p) => {
    userProbs[p.state] = p.percentage / 100
  })

  // All possible states
  const allStates = new Set<string>([
    ...Object.keys(challenge.targetProbabilities),
    ...Object.keys(userProbs),
  ])

  let tvdSum = 0
  allStates.forEach((st) => {
    const pVal = userProbs[st] || 0
    const qVal = challenge.targetProbabilities[st] || 0
    tvdSum += Math.abs(pVal - qVal)
  })

  const tvd = Number((0.5 * tvdSum).toFixed(4))
  const scorePercent = Math.max(0, Math.round((1 - tvd) * 100))
  const passed = tvd <= 0.05 && withinGateLimit

  let feedback = ''
  if (passed) {
    feedback = `🎉 Perfect! Your circuit correctly generated the target state with ${scorePercent}% fidelity using ${gateCountUsed} gates.`
  } else if (!withinGateLimit) {
    feedback = `⚠️ Gate Limit Exceeded: Used ${gateCountUsed} gates (max allowed: ${challenge.maxGates}). Try optimizing your circuit depth.`
  } else {
    feedback = `Almost there! State fidelity is ${scorePercent}% (TVD = ${tvd}). Review the target state distribution and try again.`
  }

  return {
    passed,
    tvd,
    scorePercent,
    gateCountUsed,
    withinGateLimit,
    feedback,
  }
}
