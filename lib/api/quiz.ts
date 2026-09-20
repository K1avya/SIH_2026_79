import { supabase } from '@/backend/supabase-client'

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

export const FALLBACK_QUIZZES: Record<string, QuizData> = {
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

/**
 * Fetches topic quiz questions from Supabase database table `quiz_questions` with fallback.
 */
export async function fetchQuizQuestionsServer(topicId: string): Promise<{
  data: QuizQuestion[]
  error: Error | null
}> {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('topicId', topicId)

    if (!error && data && data.length > 0) {
      const mappedQuestions: QuizQuestion[] = data.map((q: any, idx: number) => {
        const opts = Array.isArray(q.options) ? q.options : []
        const correctIdx = opts.findIndex((o: any) => o.isCorrect)
        return {
          id: idx + 1,
          question: q.questionText,
          options: opts.map((o: any) => o.text),
          correctIndex: correctIdx >= 0 ? correctIdx : 0,
          explanation: q.explanation,
        }
      })
      return { data: mappedQuestions, error: null }
    }

    const fallback = FALLBACK_QUIZZES[topicId] || FALLBACK_QUIZZES['default']
    return { data: fallback.questions, error: null }
  } catch (err: any) {
    console.warn('fetchQuizQuestionsServer error, returning fallback:', err)
    const fallback = FALLBACK_QUIZZES[topicId] || FALLBACK_QUIZZES['default']
    return { data: fallback.questions, error: err }
  }
}

export interface QuizSubmissionResult {
  attemptId: string
  topicId: string
  scorePercent: number
  correctCount: number
  totalQuestions: number
  passed: boolean
  newQuizAverage: number
  newOverallProgress: number
  completedTopics: string[]
}

/**
 * Submits topic quiz answers for server-side grading and profile progression.
 * Tries the Supabase Edge Function 'submit-quiz', falling back to Postgres RPC 'submit_quiz'.
 */
export async function submitQuizServer(
  userId: string,
  topicId: string,
  answers: Record<string, string | number>
): Promise<{ data: QuizSubmissionResult | null; error: Error | null }> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<QuizSubmissionResult>('submit-quiz', {
      body: { userId, topicId, answers },
    })

    if (!error && data) {
      return { data, error: null }
    }

    // 2. Fallback to PostgreSQL RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_quiz', {
      p_user_id: userId,
      p_topic_id: topicId,
      p_answers: answers,
    })

    if (!rpcError && rpcData) {
      return { data: rpcData as QuizSubmissionResult, error: null }
    }

    return { data: null, error: error || rpcError || new Error('Failed to submit quiz') }
  } catch (err: any) {
    console.error('submitQuizServer error:', err)
    return { data: null, error: err }
  }
}
