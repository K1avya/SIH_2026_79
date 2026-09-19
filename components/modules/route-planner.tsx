'use client'

import React, { useState } from 'react'
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { PRECONFIGURED_ROUTES } from '@/lib/ner-data'
import { RouteOption } from '@/types/logistics'

export function RoutePlanner() {
  const { roads, t } = useLogistics()

  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('Guwahati to Kohima')
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0)
  const [recalculating, setRecalculating] = useState<boolean>(false)
  const [recalculationAlert, setRecalculationAlert] = useState<string | null>(null)

  const availablePairs = Object.keys(PRECONFIGURED_ROUTES)
  const currentOptions: RouteOption[] = PRECONFIGURED_ROUTES[selectedRouteKey] || PRECONFIGURED_ROUTES['Guwahati to Kohima']
  const activeOption = currentOptions[activeRouteIndex] || currentOptions[0]

  function handleSimulateReroute() {
    setRecalculating(true)
    setRecalculationAlert(null)
    setTimeout(() => {
      setRecalculating(false)
      setActiveRouteIndex(0) // switch to safest alternate
      setRecalculationAlert(
        'REROUTE NOTIFICATION (FR-3.3): Direct corridor NH-29 obstructed by landslide. Dynamic routing engine has automatically shifted navigation vector to Niuland Bypass (NH-29A). ETA adjusted by +35 mins.'
      )
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.routePlannerTitle}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
                border: '1px solid color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              }}
            >
              Dijkstra Risk-Weighted Graph (FR-3.1)
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Suggests the safest bypass route across landslide and flood-prone terrain by weighting road physical risk penalties against transit distance.
          </p>
        </div>

        <button
          onClick={handleSimulateReroute}
          disabled={recalculating}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-black transition-all hover:opacity-95"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            boxShadow: '0 0 20px color-mix(in oklch, var(--q-violet) 50%, transparent)',
          }}
        >
          <Zap className={`h-4 w-4 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Optimizing Corridor Weights…' : 'Trigger Dynamic Recalculation (FR-3.3)'}</span>
        </button>
      </div>

      {/* Reroute Alert Notification (FR-3.3) */}
      {recalculationAlert && (
        <div
          className="flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-md animate-fade-in"
          style={{
            borderColor: 'rgba(56,189,248,0.5)',
            background: 'color-mix(in oklch, var(--q-cyan) 15%, transparent)',
          }}
        >
          <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-cyan-200">ACTIVE DYNAMIC ROUTE RE-CALCULATION COMPLETED</div>
            <p className="text-zinc-200">{recalculationAlert}</p>
          </div>
        </div>
      )}

      {/* Origin & Destination Selector Bar */}
      <div
        className="rounded-2xl border p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400">Select NER Strategic Corridor:</span>
          {availablePairs.map((pair) => (
            <button
              key={pair}
              onClick={() => {
                setSelectedRouteKey(pair)
                setActiveRouteIndex(0)
                setRecalculationAlert(null)
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                selectedRouteKey === pair
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {pair}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>SLA Calculation: &lt; 5s (NFR-3)</span>
        </div>
      </div>

      {/* Route Comparison Grid (FR-3.1 & FR-3.2) */}
      <div className="grid gap-4 md:grid-cols-2">
        {currentOptions.map((opt, idx) => {
          const isSelected = activeRouteIndex === idx
          return (
            <div
              key={opt.id}
              onClick={() => setActiveRouteIndex(idx)}
              className={`cursor-pointer rounded-2xl border p-6 transition-all ${
                isSelected
                  ? 'border-[var(--q-cyan)] bg-[var(--q-bg-deep)] shadow-[0_0_25px_color-mix(in oklch,var(--q-cyan)20%,transparent)]'
                  : 'hover:border-zinc-700'
              }`}
              style={{
                borderColor: isSelected ? 'var(--q-cyan)' : 'var(--q-line)',
                background: isSelected
                  ? 'var(--q-bg-deep)'
                  : 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {opt.isSafestAI ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> AI RECOMMENDED SAFEST (FR-3.1)
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> DIRECT / HIGH DISRUPTION RISK
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mt-2">{opt.title}</h3>
                </div>

                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600">
                  {isSelected && <div className="h-3 w-3 rounded-full bg-cyan-400" />}
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                {opt.corridorDescription}
              </p>

              {/* Comparative Metrics (FR-3.2) */}
              <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border p-3 text-xs" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                <div>
                  <div className="text-[10px] text-zinc-400">Total Distance</div>
                  <div className="font-heading text-base font-bold text-white mt-0.5">{opt.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Estimated Duration</div>
                  <div className="font-heading text-base font-bold text-white mt-0.5">{opt.durationHours} hrs</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Hazard Delay (FR-3.2)</div>
                  <div className={`font-heading text-base font-bold mt-0.5 ${
                    opt.delayMinutes > 60 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    +{opt.delayMinutes} mins
                  </div>
                </div>
              </div>

              {/* Waypoints Sequence */}
              <div className="mt-4">
                <div className="text-[10px] uppercase font-semibold text-zinc-400 mb-2">Transit Corridor Waypoints</div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {opt.waypoints.map((wp, wIdx) => (
                    <React.Fragment key={wp}>
                      <span className={`rounded-md px-2 py-1 ${
                        wp.includes('BLOCKED')
                          ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                          : 'bg-white/5 text-zinc-300 border border-white/5'
                      }`}>
                        {wp}
                      </span>
                      {wIdx < opt.waypoints.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-zinc-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Segment Breakdown for Selected Route */}
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
              Corridor Segments Breakdown & Accessibility Validation
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time road physical status across all monitored highway legs for this selection.
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Total Segments: {activeOption.segments.length}
          </span>
        </div>

        <div className="space-y-3">
          {activeOption.segments.map((seg, sIdx) => {
            const isBlocked = seg.status === 'blocked'
            const isAtRisk = seg.status === 'at_risk'
            return (
              <div
                key={seg.roadCode}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 text-xs transition-colors"
                style={{
                  borderColor: isBlocked ? 'rgba(244,63,94,0.4)' : 'var(--q-line)',
                  background: isBlocked ? 'rgba(244,63,94,0.08)' : 'color-mix(in oklch, var(--q-bg) 80%, transparent)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-[10px] text-zinc-300">
                    {sIdx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{seg.name}</span>
                      <span className="font-mono text-[10px] text-cyan-300">({seg.roadCode})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Segment Distance: {seg.distanceKm} km • Risk Score: {seg.riskScore}/100
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      isBlocked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isAtRisk
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {isBlocked ? 'Blocked Segment' : isAtRisk ? 'Caution' : 'Open'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
