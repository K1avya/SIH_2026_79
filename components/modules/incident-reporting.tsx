'use client'

import React, { useState } from 'react'
import {
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  CloudUpload,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  Mountain,
  Droplets,
  Construction,
  Sparkles,
  Send,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { IncidentType, RoadSegment } from '@/types/logistics'

export function IncidentReporting() {
  const {
    roads,
    submitIncidentReport,
    syncOfflineReports,
    offlineMode,
    pendingOfflineReports,
    incidents,
    activeRole,
    t,
  } = useLogistics()

  // 3-Tap State
  // Tap 1: GPS Auto-Capture
  const [gpsCaptured, setGpsCaptured] = useState<{
    lat: number
    lng: number
    elevation: number
    roadCode: string
    district: string
  }>({
    lat: 25.7512,
    lng: 93.8945,
    elevation: 1430,
    roadCode: 'NH-29-Barail',
    district: 'Kohima',
  })
  const [isLocating, setIsLocating] = useState(false)

  // Tap 2: Incident Type Selection
  const [selectedType, setSelectedType] = useState<IncidentType>('landslide')

  // Optional: Photo & Description
  const [photoPreview, setPhotoPreview] = useState<string | null>('/images/quantum-nebula.png')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('critical')
  const [description, setDescription] = useState<string>(
    'Severe slope rupture. Debris blocking both corridors at KM-42. Earthmovers requested.'
  )
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null)

  function handleCaptureGps() {
    setIsLocating(true)
    setTimeout(() => {
      // Pick or simulate realistic NER coordinate
      const randomRoad = roads[Math.floor(Math.random() * roads.length)]
      setGpsCaptured({
        lat: randomRoad.coordinates[0][0] + (Math.random() * 0.02 - 0.01),
        lng: randomRoad.coordinates[0][1] + (Math.random() * 0.02 - 0.01),
        elevation: Math.floor(600 + Math.random() * 1200),
        roadCode: randomRoad.code,
        district: randomRoad.district,
      })
      setIsLocating(false)
    }, 600)
  }

  function handleSubmitReport(e?: React.FormEvent) {
    if (e) e.preventDefault()

    const res = submitIncidentReport({
      reporterId: 'field-officer-99',
      reporterName: 'Ground Officer T. Jamir',
      reporterRole: activeRole,
      district: gpsCaptured.district,
      roadCode: gpsCaptured.roadCode,
      incidentType: selectedType,
      severity,
      lat: gpsCaptured.lat,
      lng: gpsCaptured.lng,
      elevationMeters: gpsCaptured.elevation,
      photoUrl: photoPreview || undefined,
      description,
    })

    if (res.queuedOffline) {
      setSubmittedFeedback(
        `OFFLINE REPORT SAVED LOCALLY (FR-6.4): Report for ${gpsCaptured.roadCode} queued in secure offline storage. Will automatically synchronize when network is restored.`
      )
    } else {
      setSubmittedFeedback(
        `INCIDENT SUBMITTED TO CLOUD (FR-6.1): Corridor ${gpsCaptured.roadCode} updated immediately! Public warning dispatched and GIS map marked.`
      )
    }

    setTimeout(() => setSubmittedFeedback(null), 7000)
  }

  const INCIDENT_TYPES: { type: IncidentType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { type: 'landslide', label: 'Landslide / Rockfall', icon: Mountain, color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
    { type: 'flood', label: 'Flash Flood / Breach', icon: Droplets, color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { type: 'road_damage', label: 'Road Subsidence / Crack', icon: Construction, color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
    { type: 'bridge_collapse', label: 'Bridge Failure', icon: AlertTriangle, color: 'border-rose-600 text-rose-300 bg-rose-600/10' },
    { type: 'cleared', label: 'Cleared / Reopened', icon: ShieldCheck, color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.reportTitle}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
                border: '1px solid color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              }}
            >
              NFR-9: &le; 3 Taps Submission
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Rapid geo-tagged field reporting engine optimized for rugged terrain, low-bandwidth, and offline connectivity across North Eastern districts.
          </p>
        </div>

        {/* Offline Queue Indicator & Sync Button (FR-6.4, FR-8.3) */}
        {pendingOfflineReports.length > 0 && (
          <button
            onClick={syncOfflineReports}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            <CloudUpload className="h-4 w-4" />
            <span>Sync {pendingOfflineReports.length} Queued Reports</span>
          </button>
        )}
      </div>

      {/* Submission Feedback Alert */}
      {submittedFeedback && (
        <div
          className="rounded-2xl border p-4 backdrop-blur-md animate-fade-in flex items-start gap-3"
          style={{
            borderColor: offlineMode ? 'rgba(245,158,11,0.6)' : 'rgba(56,189,248,0.6)',
            background: offlineMode ? 'rgba(245,158,11,0.15)' : 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
          }}
        >
          {offlineMode ? (
            <WifiOff className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-zinc-100 font-medium">{submittedFeedback}</p>
        </div>
      )}

      {/* Main 3-Tap Fast Reporting Card */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-2" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--q-cyan)]/20 text-cyan-300 text-xs font-bold">
                3T
              </span>
              <span>Fast 3-Tap Field Verification Workflow (NFR-9)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tap 1: Fix GPS &bull; Tap 2: Select Hazard Type &bull; Tap 3: One-Click Transmit
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
              offlineMode ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {offlineMode ? <WifiOff className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
              {offlineMode ? 'Offline Local Storage Active' : 'Cloud Direct Link Active'}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* STEP 1: TAP 1 - GPS & Road Sector */}
          <div className="space-y-3 rounded-2xl border p-5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                {t.tapGPS}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-xs text-cyan-400">
                1
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg)' }}>
                <div className="text-[10px] text-zinc-400">Nearest Monitored Corridor</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">{gpsCaptured.roadCode}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{gpsCaptured.district} District</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg)' }}>
                  <div className="text-[10px] text-zinc-400">Latitude / Longitude</div>
                  <div className="font-mono font-bold text-zinc-200 mt-0.5">
                    {gpsCaptured.lat.toFixed(4)}, {gpsCaptured.lng.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg)' }}>
                  <div className="text-[10px] text-zinc-400">Elevation</div>
                  <div className="font-mono font-bold text-zinc-200 mt-0.5">{gpsCaptured.elevation} m MSL</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCaptureGps}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <MapPin className={`h-4 w-4 ${isLocating ? 'animate-bounce' : ''}`} />
              <span>{isLocating ? 'Acquiring NavIC / GPS Lock…' : 'Re-acquire GPS Fix (FR-6.1)'}</span>
            </button>
          </div>

          {/* STEP 2: TAP 2 - Incident Type Selection */}
          <div className="space-y-3 rounded-2xl border p-5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                {t.tapType}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 font-bold text-xs text-violet-400">
                2
              </span>
            </div>

            <div className="space-y-2">
              {INCIDENT_TYPES.map((item) => {
                const Icon = item.icon
                const isSelected = selectedType === item.type
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? `${item.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.02]`
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 3: TAP 3 - Photo Evidence & One-Click Transmit */}
          <div className="space-y-3 rounded-2xl border p-5 flex flex-col justify-between" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {t.tapSubmit}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 font-bold text-xs text-emerald-400">
                  3
                </span>
              </div>

              {/* Photo Attachment (FR-6.2) */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Photo Attachment (FR-6.2)</span>
                  <span className="text-zinc-500 text-[10px]">Geo-tagged metadata</span>
                </label>
                <div
                  className="relative h-28 w-full rounded-xl border border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors"
                  style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg)' }}
                >
                  {photoPreview ? (
                    <div className="relative h-full w-full">
                      <img
                        src={photoPreview}
                        alt="Incident Evidence"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPhotoPreview(null)}
                          className="rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPhotoPreview('/images/quantum-nebula.png')}
                      className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-cyan-300 text-xs font-medium"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Capture / Upload Evidence</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Severity & Notes */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Severity:</span>
                  <div className="flex items-center gap-1">
                    {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${
                          severity === sev
                            ? 'bg-rose-500 text-white'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional field notes..."
                  className="w-full rounded-lg border px-3 py-1.5 text-xs outline-none text-white transition-colors focus:border-[var(--q-cyan)]"
                  style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg)' }}
                />
              </div>
            </div>

            {/* Tap 3 Submit CTA Button */}
            <button
              onClick={() => handleSubmitReport()}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-black transition-all hover:scale-[1.02] shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              <Send className="h-4 w-4" />
              <span>
                {offlineMode ? 'Save to Offline Queue (FR-6.4)' : 'Submit Report (1-Tap Broadcast)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical Field Incidents Audit Stream */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-md"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
        }}
      >
        <div className="flex items-center justify-between mb-4 border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Live Field Incidents Feed ({incidents.length})
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time ground truth reports filed by field officers across NER states.
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Encrypted TLS 1.3 Transmission (NFR-8)
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="rounded-xl border p-4 transition-colors"
              style={{
                borderColor: inc.severity === 'critical' ? 'rgba(244,63,94,0.5)' : 'var(--q-line)',
                background: inc.severity === 'critical' ? 'rgba(244,63,94,0.08)' : 'color-mix(in oklch, var(--q-bg) 80%, transparent)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-300">{inc.roadCode}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    inc.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {inc.incidentType} ({inc.severity})
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-200 line-clamp-2">{inc.description}</p>

              <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] text-zinc-400" style={{ borderColor: 'var(--q-line)' }}>
                <span>{inc.district} • {inc.elevationMeters}m</span>
                <span className="font-mono">{inc.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
