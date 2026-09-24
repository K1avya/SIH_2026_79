import { supabase } from '@/backend/supabase-client'

export interface AdminStatsResponse {
  summary: {
    totalLearners: number
    activeLearners: number
    avgDiagnosticScore: number
    curriculumCompletionRate: number
    totalAssessments: number
    totalQuizAttempts: number
    totalCircuits: number
    avgQuizScore: number
  }
  metrics: Array<{
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    description: string
  }>
  levelDistribution: {
    beginner: number
    intermediate: number
    advanced: number
  }
  categoryBreakdowns: Array<{
    category: string
    displayName: string
    avgScore: number
    maxPossible: number
    percentage: number
    weakCount: number
    strongCount: number
    sampleCount: number
  }>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    level: string
    progress: number
    streak: number
    quizAverage: number
    joinedDate: string
    status: 'Active' | 'Inactive'
  }>
}

export interface AdminMetric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  description: string
}

export interface AdminUserRecord {
  id: string
  name: string
  email: string
  role: string
  level: string
  progress: number
  streak: number
  quizAverage: number
  joinedDate: string
  status: 'Active' | 'Inactive'
}

export const FALLBACK_ADMIN_METRICS: AdminMetric[] = [
  {
    title: 'Total Learners',
    value: '1,248',
    change: '+14.2%',
    trend: 'up',
    description: 'Active platform accounts across universities',
  },
  {
    title: 'Avg. Diagnostic Score',
    value: '6.4 / 10',
    change: '+0.8',
    trend: 'up',
    description: 'Mean initial assessment accuracy across cohorts',
  },
  {
    title: 'Curriculum Completion',
    value: '68.5%',
    change: '+5.1%',
    trend: 'up',
    description: 'Learners reaching Level 2 (Intermediate) or higher',
  },
  {
    title: 'Circuits Simulated',
    value: '8,920',
    change: '+22.4%',
    trend: 'up',
    description: 'Quantum statevector and Qiskit executions',
  },
]

export interface AdminQuestionItem {
  id: number
  category: string
  question: string
  correctAnswer: string
}

export const FALLBACK_ADMIN_QUESTIONS: AdminQuestionItem[] = [
  { id: 1, category: 'Basics', question: 'What fundamental property distinguishes a qubit from a classical bit?', correctAnswer: 'Option B' },
  { id: 2, category: 'Basics', question: 'What happens to a qubit state upon measurement?', correctAnswer: 'Option C' },
  { id: 3, category: 'Qubits & Superposition', question: 'In the Bloch sphere representation, what state is (|0⟩+|1⟩)/√2?', correctAnswer: 'Option C' },
  { id: 4, category: 'Gates', question: 'Which gate acts as a quantum NOT gate?', correctAnswer: 'Option B' },
  { id: 5, category: 'Circuits', question: 'Which circuit sequence generates the Bell state?', correctAnswer: 'Option A' },
]

export interface AssessmentOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface AdminQuestionRecord {
  id: string
  category: string
  difficulty: string
  questionText: string
  options: AssessmentOption[]
  explanation: string
  sequenceOrder: number
  created_at?: string
}

export interface AdminCutoffsResponse {
  success: boolean
  beginnerMax: number
  intermediateMax: number
  ranges: {
    beginner: string
    intermediate: string
    advanced: string
  }
  updatedAt: string
  message?: string
}

/**
 * Invokes the 'admin-stats' Edge Function (admin role enforced).
 */
export async function fetchAdminStatsServer(): Promise<{ data: AdminStatsResponse | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<AdminStatsResponse>('admin-stats', {
      method: 'GET',
    })

    if (error) throw error
    return { data, error: null }
  } catch (err: any) {
    console.warn('Admin stats Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

/**
 * Lists assessment questions with optional category or difficulty filtering.
 */
export async function fetchAdminQuestionsServer(filters?: {
  category?: string
  difficulty?: string
}): Promise<{ data: AdminQuestionRecord[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; questions: AdminQuestionRecord[] }>('admin-questions-crud', {
      body: { action: 'list', ...(filters || {}) },
    })

    if (error) throw error
    return { data: data?.questions || [], error: null }
  } catch (err: any) {
    console.warn('Admin questions Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

/**
 * Creates a new assessment question via 'admin-questions-crud'.
 */
export async function createAdminQuestionServer(
  question: Omit<AdminQuestionRecord, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: AdminQuestionRecord | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; question: AdminQuestionRecord }>('admin-questions-crud', {
      body: { action: 'create', question },
    })

    if (error) throw error
    return { data: data?.question || null, error: null }
  } catch (err: any) {
    console.warn('Create admin question Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

/**
 * Updates an existing assessment question via 'admin-questions-crud'.
 */
export async function updateAdminQuestionServer(
  id: string,
  question: Partial<AdminQuestionRecord>
): Promise<{ data: AdminQuestionRecord | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; question: AdminQuestionRecord }>('admin-questions-crud', {
      body: { action: 'update', id, question },
    })

    if (error) throw error
    return { data: data?.question || null, error: null }
  } catch (err: any) {
    console.warn('Update admin question Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

/**
 * Deletes an assessment question via 'admin-questions-crud'.
 */
export async function deleteAdminQuestionServer(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; deletedId: string }>('admin-questions-crud', {
      body: { action: 'delete', id },
    })

    if (error) throw error
    return { success: data?.success ?? true, error: null }
  } catch (err: any) {
    console.warn('Delete admin question Edge Function fallback:', err?.message || err)
    return { success: false, error: err }
  }
}

/**
 * Retrieves current diagnostic level cutoff thresholds.
 */
export async function fetchAdminCutoffsServer(): Promise<{ data: AdminCutoffsResponse | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<AdminCutoffsResponse>('admin-cutoffs', {
      method: 'GET',
    })

    if (error) throw error
    return { data, error: null }
  } catch (err: any) {
    console.warn('Fetch admin cutoffs Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

/**
 * Updates diagnostic level cutoff thresholds (e.g., beginnerMax = 3, intermediateMax = 7).
 */
export async function updateAdminCutoffsServer(
  beginnerMax: number,
  intermediateMax: number
): Promise<{ data: AdminCutoffsResponse | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<AdminCutoffsResponse>('admin-cutoffs', {
      body: { beginnerMax, intermediateMax },
    })

    if (error) throw error
    return { data, error: null }
  } catch (err: any) {
    console.warn('Update admin cutoffs Edge Function fallback:', err?.message || err)
    return { data: null, error: err }
  }
}

export interface ClassroomRecord {
  id: string
  name: string
  code: string
  instructorName: string
  studentCount: number
  weakTopicsHeatmap: Array<{ category: string; weakPercentage: number }>
  students: Array<{
    id: string
    name: string
    email: string
    level: string
    progress: number
    quizAvg: number
  }>
}

export const FALLBACK_CLASSROOMS: ClassroomRecord[] = [
  {
    id: 'cls-1',
    name: 'CS-401 Quantum Information Science (Fall 2026)',
    code: 'QUANT-8921',
    instructorName: 'Dr. Evelyn Vance',
    studentCount: 38,
    weakTopicsHeatmap: [
      { category: 'Qubits & Superposition', weakPercentage: 15 },
      { category: 'Quantum Gates', weakPercentage: 42 },
      { category: 'Quantum Entanglement', weakPercentage: 68 },
      { category: 'Quantum Algorithms (Grover)', weakPercentage: 74 },
    ],
    students: [
      { id: 'st-1', name: 'Alex Rivera', email: 'alex.rivera@mit.edu', level: 'intermediate', progress: 78, quizAvg: 88.5 },
      { id: 'st-2', name: 'Sophia Chen', email: 'sophia.c@stanford.edu', level: 'advanced', progress: 92, quizAvg: 95.0 },
      { id: 'st-3', name: 'Marcus Johnson', email: 'mjohnson@berkeley.edu', level: 'beginner', progress: 45, quizAvg: 62.0 },
    ],
  },
]
