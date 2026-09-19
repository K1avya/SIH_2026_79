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
    console.error('Failed to fetch admin statistics:', err)
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
    console.error('Failed to list assessment questions:', err)
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
    console.error('Failed to create assessment question:', err)
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
    console.error('Failed to update assessment question:', err)
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
    console.error('Failed to delete assessment question:', err)
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
    console.error('Failed to fetch admin cutoffs:', err)
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
    console.error('Failed to update admin cutoffs:', err)
    return { data: null, error: err }
  }
}
