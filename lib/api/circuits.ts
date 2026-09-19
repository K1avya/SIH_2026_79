import { supabase } from '@/backend/supabase-client'
import { PlacedGate, SimulationResult } from '@/types/quantify'

export interface SavedCircuitItem {
  id: string
  user_id: string
  title: string
  description?: string
  qubitCount: number
  placedGates: PlacedGate[]
  simulationResult?: SimulationResult
  backend: string
  shots: number
  isPreset: boolean
  created_at: string
  updated_at: string
}

/**
 * Saves a quantum circuit to Supabase Edge Function ('save-circuit')
 * with fallback to direct table upsert.
 */
export async function saveCircuitServer(payload: {
  id?: string
  userId: string
  title?: string
  description?: string
  qubitCount: number
  placedGates: any[]
  simulationResult?: SimulationResult
  backend?: string
  shots?: number
}): Promise<{ data: SavedCircuitItem | null; error: Error | null }> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<{ success: boolean; circuit: SavedCircuitItem }>(
      'save-circuit',
      { body: payload }
    )

    if (!error && data?.circuit) {
      return { data: data.circuit, error: null }
    }

    // 2. Fallback to direct table upsert
    const circuitId = payload.id || crypto.randomUUID()
    const { data: directData, error: directErr } = await supabase
      .from('saved_circuits')
      .upsert(
        {
          id: circuitId,
          user_id: payload.userId,
          title: payload.title || 'Quantum Circuit',
          description: payload.description,
          qubitCount: payload.qubitCount,
          placedGates: payload.placedGates,
          simulationResult: payload.simulationResult,
          backend: payload.backend || 'Qiskit Aer',
          shots: payload.shots || 1000,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (directErr) throw directErr
    return { data: directData as SavedCircuitItem, error: null }
  } catch (err: any) {
    console.error('saveCircuitServer error:', err)
    return { data: null, error: err }
  }
}

/**
 * Fetches all saved circuits for the user along with global preset circuits.
 */
export async function getMyCircuitsServer(
  userId?: string
): Promise<{ data: SavedCircuitItem[] | null; error: Error | null }> {
  try {
    // 1. Try Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<SavedCircuitItem[]>('get-my-circuits', {
      body: { userId },
    })

    if (!error && Array.isArray(data)) {
      return { data, error: null }
    }

    // 2. Fallback to direct query
    let query = supabase.from('saved_circuits').select('*').order('updated_at', { ascending: false })
    if (userId) {
      query = query.or(`user_id.eq.${userId},isPreset.eq.true`)
    } else {
      query = query.eq('isPreset', true)
    }

    const { data: directData, error: directErr } = await query
    if (directErr) throw directErr

    return { data: directData as SavedCircuitItem[], error: null }
  } catch (err: any) {
    console.error('getMyCircuitsServer error:', err)
    return { data: null, error: err }
  }
}

/**
 * Cloud simulation backed by Qiskit Aer generator for higher qubit counts.
 */
export async function simulateCircuitServer(payload: {
  qubitCount: number
  placedGates: any[]
  shots?: number
}): Promise<{ data: (SimulationResult & { qiskitCode?: string; qasm?: string }) | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<SimulationResult & { qiskitCode?: string; qasm?: string }>(
      'simulate-circuit',
      { body: payload }
    )

    if (error) throw error
    return { data, error: null }
  } catch (err: any) {
    console.error('simulateCircuitServer error:', err)
    return { data: null, error: err }
  }
}

export const simulateCircuitWithQiskit = (
  qubitCount: number,
  placedGates: any[],
  shots?: number
) => simulateCircuitServer({ qubitCount, placedGates, shots })
