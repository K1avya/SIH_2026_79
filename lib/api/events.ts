import { supabase } from '@/backend/supabase-client'

export interface QuantumEvent {
  id: string
  title: string
  organiser: string | null
  eventType: 'hackathon' | 'webinar' | 'conference' | 'fellowship'
  region: 'india' | 'global'
  description: string | null
  startDate: string
  endDate: string | null
  isOnline: boolean
  registrationUrl: string | null
  sourceUrl: string | null
  isFeatured: boolean
  createdBy: string | null
  createdAt: string
}

export const FALLBACK_EVENTS: QuantumEvent[] = [
  {
    id: 'fallback-ibm-challenge',
    title: 'IBM Quantum Challenge',
    organiser: 'IBM Quantum',
    eventType: 'hackathon',
    region: 'global',
    description: 'Build practical quantum programming skills through guided coding challenges.',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    isOnline: true,
    registrationUrl: 'https://quantum.ibm.com/challenges',
    sourceUrl: 'https://quantum.ibm.com',
    isFeatured: true,
    createdBy: null,
    createdAt: '2026-09-26T00:00:00.000Z',
  },
  {
    id: 'fallback-qiskit-school',
    title: 'Qiskit Global Summer School',
    organiser: 'IBM Quantum / Qiskit',
    eventType: 'fellowship',
    region: 'global',
    description: 'A global programme for learning quantum algorithms and applications.',
    startDate: '2027-07-12',
    endDate: '2027-07-23',
    isOnline: true,
    registrationUrl: 'https://qiskit.org/education',
    sourceUrl: 'https://qiskit.org',
    isFeatured: true,
    createdBy: null,
    createdAt: '2026-09-26T00:00:00.000Z',
  },
  {
    id: 'fallback-dst-webinar',
    title: 'DST-QuEST Quantum Computing Webinar',
    organiser: 'DST-QuEST',
    eventType: 'webinar',
    region: 'india',
    description: 'Explore India’s quantum technology research and education ecosystem.',
    startDate: '2026-10-22',
    endDate: null,
    isOnline: true,
    registrationUrl: 'https://dst.gov.in',
    sourceUrl: 'https://dst.gov.in',
    isFeatured: false,
    createdBy: null,
    createdAt: '2026-09-26T00:00:00.000Z',
  },
]

export async function fetchQuantumEventsServer(): Promise<{ data: QuantumEvent[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.from('quantum_events').select('*').order('start_date', { ascending: true })
    if (error) throw error
    return {
      data: (data || []).map((event) => ({
        id: event.id,
        title: event.title,
        organiser: event.organiser,
        eventType: event.event_type,
        region: event.region,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date,
        isOnline: event.is_online,
        registrationUrl: event.registration_url,
        sourceUrl: event.source_url,
        isFeatured: event.is_featured,
        createdBy: event.created_by,
        createdAt: event.created_at,
      })),
      error: null,
    }
  } catch (err: any) {
    console.warn('fetchQuantumEventsServer error, returning fallback:', err)
    return { data: FALLBACK_EVENTS, error: err instanceof Error ? err : new Error(String(err)) }
  }
}
