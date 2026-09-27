export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface QuizData {
  topicId: string
  topicTitle: string
  questions: QuizQuestion[]
}

export const MOCK_QUIZZES: Record<string, QuizData> = {
  'qubits': {
    topicId: 'qubits',
    topicTitle: 'Qubits & Bloch Sphere',
    questions: [
      {
        id: 1,
        question: 'Which Bloch sphere polar angle θ corresponds to the computational basis state |1⟩?',
        options: ['θ = 0 (North Pole)', 'θ = π/2 (Equator)', 'θ = π (South Pole)', 'θ = 2π'],
        correctIndex: 2,
        explanation: 'The state |1⟩ corresponds to θ = π (South pole of the Bloch sphere), where cos(π/2)|0⟩ + sin(π/2)|1⟩ = |1⟩.',
      },
      {
        id: 2,
        question: 'What is the physical meaning of the relative phase angle φ in state cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩?',
        options: [
          'It changes the total measurement probability of state |0⟩.',
          'It dictates the azimuthal orientation on the X-Y plane of the Bloch sphere.',
          'It converts a pure state into a mixed thermal state.',
          'It increases the energy frequency of the qubit waveform.'
        ],
        correctIndex: 1,
        explanation: 'The relative phase φ determines the rotation angle around the Z-axis in the X-Y equatorial plane, enabling quantum interference.',
      },
      {
        id: 3,
        question: 'If a qubit is in state |+⟩ = (|0⟩ + |1⟩)/√2, what is the probability of measuring outcome 0 in the computational basis?',
        options: ['25%', '50%', '70.7%', '100%'],
        correctIndex: 1,
        explanation: 'Probability P(0) = |α|² = |1/√2|² = 1/2 = 50%.',
      },
    ],
  },
  'quantum-gates': {
    topicId: 'quantum-gates',
    topicTitle: 'Single-Qubit Quantum Gates',
    questions: [
      {
        id: 1,
        question: 'Which gate is its own Hermitean adjoint and inverse, transforming |0⟩ into (|0⟩+|1⟩)/√2?',
        options: ['Pauli-X Gate', 'Pauli-Z Gate', 'Hadamard Gate', 'Toffoli Gate'],
        correctIndex: 2,
        explanation: 'The Hadamard gate H is self-inverse (H = H†) and creates equal superposition from computational basis states.',
      },
      {
        id: 2,
        question: 'Applying the Pauli-Z gate to the state |1⟩ results in which output state?',
        options: ['|0⟩', '-|1⟩', 'i|1⟩', '(|0⟩ - |1⟩)/√2'],
        correctIndex: 1,
        explanation: 'Z = [[1,0],[0,-1]], so Z|1⟩ = -|1⟩ (introduces a π phase shift to state |1⟩).',
      },
      {
        id: 3,
        question: 'What phase angle shift does the T gate apply to the |1⟩ state component?',
        options: ['π (180°)', 'π/2 (90°)', 'π/4 (45°)', 'π/8 (22.5°)'],
        correctIndex: 2,
        explanation: 'The T gate is a π/4 (45°) phase gate, mapping |1⟩ → e^(iπ/4)|1⟩. Note T² = S gate.',
      },
    ],
  },
  'default': {
    topicId: 'default',
    topicTitle: 'Quantum Knowledge Quiz',
    questions: [
      {
        id: 1,
        question: 'What quantum gate serves as the fundamental control-target building block for two-qubit entanglement?',
        options: ['Pauli-Y', 'Hadamard', 'CNOT', 'Phase S'],
        correctIndex: 2,
        explanation: 'The CNOT gate flips the target qubit conditional on the control qubit state, creating entangled Bell states.',
      },
      {
        id: 2,
        question: 'What is the mathematical condition for a quantum state vector to be normalized?',
        options: ['|α| + |β| = 1', '|α|² + |β|² = 1', 'α · β = 0', '|α|² · |β|² = 0.5'],
        correctIndex: 1,
        explanation: 'Total probability across all orthogonal measurement basis states must sum to 1.',
      },
    ],
  },
}
