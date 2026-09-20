import { supabase } from '@/backend/supabase-client'
import { AssessmentAttempt } from '@/types/quantify'

export interface QuestionOption {
  id: string
  text: string
}

export interface AssessmentQuestion {
  id: number
  category: 'Basics' | 'Qubits & Superposition' | 'Gates' | 'Circuits' | 'Algorithms' | string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  question: string
  options: QuestionOption[]
  correctAnswer: string
  explanation: string
}

export const FALLBACK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    category: 'Basics',
    difficulty: 'Beginner',
    question: 'What fundamental property distinguishes a quantum bit (qubit) from a classical bit?',
    options: [
      { id: 'a', text: 'A qubit can store infinite data persistently without loss.' },
      { id: 'b', text: 'A qubit can exist in a superposition of states |0⟩ and |1⟩ simultaneously.' },
      { id: 'c', text: 'A qubit transmits signals faster than the speed of light.' },
      { id: 'd', text: 'A qubit functions as a triple-state logic gate (0, 1, and 2).' },
    ],
    correctAnswer: 'b',
    explanation: 'Unlike classical bits that are strictly 0 or 1, qubits can exist in a linear combination α|0⟩ + β|1⟩ due to quantum superposition.',
  },
  {
    id: 2,
    category: 'Basics',
    difficulty: 'Beginner',
    question: 'What happens to a qubit state α|0⟩ + β|1⟩ upon measurement in the computational basis?',
    options: [
      { id: 'a', text: 'It remains unchanged in its superposition state.' },
      { id: 'b', text: 'It collapses deterministically into both 0 and 1.' },
      { id: 'c', text: 'It collapses probabilistically into either state |0⟩ or |1⟩ with probabilities |α|² and |β|².' },
      { id: 'd', text: 'It decays into heat energy and resets to state |0⟩.' },
    ],
    correctAnswer: 'c',
    explanation: 'Born rule dictates that measurement forces a quantum state to collapse to |0⟩ with probability |α|² or |1⟩ with probability |β|² where |α|² + |β|² = 1.',
  },
  {
    id: 3,
    category: 'Qubits & Superposition',
    difficulty: 'Beginner',
    question: 'In the Bloch sphere representation of a single qubit, what point corresponds to the state (|0⟩ + |1⟩)/√2?',
    options: [
      { id: 'a', text: 'North pole (+Z axis)' },
      { id: 'b', text: 'South pole (-Z axis)' },
      { id: 'c', text: 'Intersection with the positive X-axis (|x+⟩ state)' },
      { id: 'd', text: 'Intersection with the positive Y-axis (|y+⟩ state)' },
    ],
    correctAnswer: 'c',
    explanation: 'The state (|0⟩ + |1⟩)/√2 lies on the equator of the Bloch sphere along the positive X-axis, produced by applying a Hadamard gate to |0⟩.',
  },
  {
    id: 4,
    category: 'Qubits & Superposition',
    difficulty: 'Beginner',
    question: 'Given a single qubit in state ψ = (1/√3)|0⟩ + (√(2/3))|1⟩, what is the exact probability of measuring outcome 1?',
    options: [
      { id: 'a', text: '33.3% (1/3)' },
      { id: 'b', text: '66.7% (2/3)' },
      { id: 'c', text: '50% (1/2)' },
      { id: 'd', text: '81.6% (√(2/3))' },
    ],
    correctAnswer: 'b',
    explanation: 'The probability of measuring |1⟩ is the magnitude squared of its complex coefficient β. Here β = √(2/3), so |β|² = 2/3 ≈ 66.7%.',
  },
  {
    id: 5,
    category: 'Gates',
    difficulty: 'Intermediate',
    question: 'Which single-qubit quantum gate acts as a quantum NOT gate, mapping |0⟩ to |1⟩ and |1⟩ to |0⟩?',
    options: [
      { id: 'a', text: 'Hadamard (H) Gate' },
      { id: 'b', text: 'Pauli-X Gate' },
      { id: 'c', text: 'Pauli-Z Gate' },
      { id: 'd', text: 'Phase (S) Gate' },
    ],
    correctAnswer: 'b',
    explanation: 'The Pauli-X gate flips the computational basis states, converting |0⟩ to |1⟩ and vice versa.',
  },
  {
    id: 6,
    category: 'Gates',
    difficulty: 'Intermediate',
    question: 'What is the resulting state vector when a Hadamard gate (H) is applied to the state |1⟩?',
    options: [
      { id: 'a', text: '(|0⟩ + |1⟩) / √2' },
      { id: 'b', text: '(|0⟩ - |1⟩) / √2' },
      { id: 'c', text: '-|1⟩' },
      { id: 'd', text: '|0⟩' },
    ],
    correctAnswer: 'b',
    explanation: 'Applying H to |1⟩ yields H|1⟩ = (|0⟩ - |1⟩)/√2, known as the | - ⟩ state with a relative phase of π.',
  },
  {
    id: 7,
    category: 'Circuits',
    difficulty: 'Intermediate',
    question: 'In a 2-qubit CNOT (Controlled-NOT) gate, what occurs when the control qubit is in state |1⟩?',
    options: [
      { id: 'a', text: 'The target qubit remains unchanged.' },
      { id: 'b', text: 'The target qubit undergoes a bit-flip (Pauli-X).' },
      { id: 'c', text: 'The control qubit is measured and destroyed.' },
      { id: 'd', text: 'Both qubits swap their state vector coefficients.' },
    ],
    correctAnswer: 'b',
    explanation: 'The CNOT gate applies an X-flip to the target qubit if and only if the control qubit is in state |1⟩.',
  },
  {
    id: 8,
    category: 'Circuits',
    difficulty: 'Intermediate',
    question: 'Which circuit sequence generates the maximally entangled Bell state (|00⟩ + |11⟩)/√2 starting from |00⟩?',
    options: [
      { id: 'a', text: 'Apply H to q0, then CNOT with q0 as control and q1 as target.' },
      { id: 'b', text: 'Apply X to q0, then H to q1.' },
      { id: 'c', text: 'Apply CNOT to q0 and q1, then apply H to q0.' },
      { id: 'd', text: 'Apply Z to q0, followed by X to q1.' },
    ],
    correctAnswer: 'a',
    explanation: 'H on q0 creates (|0⟩+|1⟩)|0⟩ = (|00⟩+|10⟩)/√2. The CNOT flips q1 when q0=1, resulting in (|00⟩+|11⟩)/√2.',
  },
  {
    id: 9,
    category: 'Algorithms',
    difficulty: 'Advanced',
    question: 'What speedup does Grover’s search algorithm achieve over classical unstructured search algorithms?',
    options: [
      { id: 'a', text: 'Linear speedup O(N/2)' },
      { id: 'b', text: 'Quadratic speedup O(√N)' },
      { id: 'c', text: 'Exponential speedup O(log N)' },
      { id: 'd', text: 'Constant time speedup O(1)' },
    ],
    correctAnswer: 'b',
    explanation: 'Grover’s algorithm searches an unsorted database of N items in O(√N) quantum oracle iterations, providing a quadratic speedup over classical O(N).',
  },
  {
    id: 10,
    category: 'Algorithms',
    difficulty: 'Advanced',
    question: 'Which quantum algorithm solves prime factorization in polynomial time, posing a challenge to RSA cryptography?',
    options: [
      { id: 'a', text: 'Deutsch-Jozsa Algorithm' },
      { id: 'b', text: 'Bernstein-Vazirani Algorithm' },
      { id: 'c', text: 'Shor’s Algorithm' },
      { id: 'd', text: 'Variational Quantum Eigensolver (VQE)' },
    ],
    correctAnswer: 'c',
    explanation: 'Shor’s algorithm factors large integers in O((log N)³) time by utilizing Quantum Phase Estimation and Quantum Fourier Transform.',
  },
]

/**
 * Fetches diagnostic questions from Supabase database table `assessment_questions` with fallback.
 */
export async function fetchAssessmentQuestionsServer(): Promise<{
  data: AssessmentQuestion[]
  error: Error | null
}> {
  try {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .order('sequenceOrder', { ascending: true })

    if (!error && data && data.length > 0) {
      const mapped: AssessmentQuestion[] = data.map((q: any, idx: number) => {
        const opts = Array.isArray(q.options) ? q.options : []
        const correctOpt = opts.find((o: any) => o.isCorrect)
        return {
          id: idx + 1,
          category: q.category.charAt(0).toUpperCase() + q.category.slice(1),
          difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as any,
          question: q.questionText,
          options: opts.map((o: any) => ({ id: o.id, text: o.text })),
          correctAnswer: correctOpt?.id || 'opt-1',
          explanation: q.explanation,
        }
      })
      return { data: mapped, error: null }
    }

    return { data: FALLBACK_ASSESSMENT_QUESTIONS, error: null }
  } catch (err: any) {
    console.warn('fetchAssessmentQuestionsServer error, returning fallback:', err)
    return { data: FALLBACK_ASSESSMENT_QUESTIONS, error: err }
  }
}

/**
 * Invokes the Supabase Edge Function 'submit-assessment' with zero client trust.
 * Passes the user's answers map and receives the server-verified AssessmentAttempt.
 */
export async function submitAssessmentServer(
  userId: string,
  answers: Record<string, string>
): Promise<{ data: AssessmentAttempt | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<AssessmentAttempt>('submit-assessment', {
      body: { userId, answers },
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (err: any) {
    console.error('Failed to submit assessment to Edge Function:', err)
    return { data: null, error: err }
  }
}
