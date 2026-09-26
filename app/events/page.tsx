'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, Globe, MapPin, Monitor, ArrowUpRight } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { FALLBACK_EVENTS, fetchQuantumEventsServer, QuantumEvent } from '@/lib/api/events'

const typeTabs = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'webinar', label: 'Webinars' },
  { id: 'conference', label: 'Conferences' },
  { id: 'fellowship', label: 'Fellowships' },
]
const regionTabs = [
  { id: 'all', label: 'All' },
  { id: 'india', label: 'India' },
  { id: 'global', label: 'Global' },
]

function formatDateRange(event: QuantumEvent) {
  const format = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return event.endDate ? `${format(event.startDate)} – ${format(event.endDate)}` : format(event.startDate)
}

export default function QuantumEventsPage() {
  const [events, setEvents] = useState<QuantumEvent[]>(FALLBACK_EVENTS)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  useEffect(() => {
    fetchQuantumEventsServer().then(({ data }) => {
      if (data && data.length > 0) setEvents(data)
    })
  }, [])

  const filteredEvents = useMemo(() => events.filter((event) =>
    (selectedType === 'all' || event.eventType === selectedType) &&
    (selectedRegion === 'all' || event.region === selectedRegion)
  ), [events, selectedType, selectedRegion])

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 py-4">
        <div className="border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Globe className="h-3.5 w-3.5" />
            Quantum Opportunities
          </div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">Quantum Hub</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--q-muted)]">Discover curated hackathons, webinars, conferences and fellowships from India and around the world.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {typeTabs.map((tab) => (
              <button key={tab.id} onClick={() => setSelectedType(tab.id)} className={`rounded-2xl border px-4 py-2 transition-all ${selectedType === tab.id ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' : 'border-white/10 bg-white/5 text-[var(--q-muted)] hover:text-white'}`}>{tab.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {regionTabs.map((tab) => (
              <button key={tab.id} onClick={() => setSelectedRegion(tab.id)} className={`rounded-2xl border px-4 py-2 transition-all ${selectedRegion === tab.id ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' : 'border-white/10 bg-white/5 text-[var(--q-muted)] hover:text-white'}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <article key={event.id} className="flex flex-col rounded-3xl border p-5 backdrop-blur-xl" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">{event.eventType}</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300"><MapPin className="h-3 w-3" />{event.region}</span>
              </div>
              <h2 className="mt-4 font-heading text-lg font-bold text-white">{event.title}</h2>
              <p className="mt-1 text-xs font-semibold text-[var(--q-muted)]">{event.organiser || 'Quantum community'}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--q-muted)]">{event.description}</p>
              <div className="mt-5 space-y-2 text-xs text-[var(--q-muted)]">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-cyan-300" />{formatDateRange(event)}</div>
                <div className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5 text-cyan-300" />{event.isOnline ? 'Online' : 'In person'}</div>
              </div>
              {event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-black transition-transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}>Register <ArrowUpRight className="h-3.5 w-3.5" /></a>}
            </article>
          ))}
        </div>
        {filteredEvents.length === 0 && <div className="rounded-3xl border p-12 text-center text-sm text-[var(--q-muted)]" style={{ borderColor: 'var(--q-line)' }}>No opportunities match these filters.</div>}
      </div>
    </AppShell>
  )
}
