'use client'

import React, { useState } from 'react'
import {
  Truck,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldCheck,
  Fuel,
  Pill,
  Wheat,
  Phone,
  Play,
  RotateCcw,
  CheckCircle2,
  Navigation,
  Send,
  Zap,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { TrackedVehicle, VehicleCargo, VehicleStatus } from '@/types/logistics'
import { Skeleton } from '@/components/ui/Skeleton'

export function VehicleTracking() {
  const {
    vehicles,
    simulateVehiclePulse,
    setActiveModule,
    t,
  } = useLogistics()

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cargoFilter, setCargoFilter] = useState<string>('all')
  const [pingingId, setPingingId] = useState<string | null>(null)
  const [dispatchedNotice, setDispatchedNotice] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handlePulse() {
    setIsLoading(true)
    simulateVehiclePulse()
    setTimeout(() => setIsLoading(false), 500)
  }

  function handleDispatchReroute(veh: TrackedVehicle) {
    setPingingId(veh.id)
    setTimeout(() => {
      setPingingId(null)
      setDispatchedNotice(
        `Automated SMS & In-Cabin Navigation Alert dispatched to Driver ${veh.driverName} (${veh.driverContact}): "Immediate detour via secondary ridge pass ordered. Proceed with caution."`
      )
      setTimeout(() => setDispatchedNotice(null), 6000)
    }, 900)
  }

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    if (cargoFilter !== 'all' && v.cargoType !== cargoFilter) return false
    return true
  })

  const atRiskCount = vehicles.filter((v) => v.isAtRisk).length
  const delayedCount = vehicles.filter((v) => v.status === 'delayed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.navFleetTracking}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
                border: '1px solid color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              }}
            >
              GPS Telemetry Radar (FR-4.1, FR-4.2)
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time GPS tracking and corridor risk warnings for supply convoys carrying oxygen, medications, PDS food grains, and fuels into remote NER districts.
          </p>
        </div>

        <button
          onClick={handlePulse}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-black transition-all hover:opacity-95"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            boxShadow: '0 0 20px color-mix(in oklch, var(--q-violet) 50%, transparent)',
          }}
        >
          <Play className="h-4 w-4" />
          <span>Trigger 60s GPS Pulse (FR-4.1)</span>
        </button>
      </div>

      {/* Dispatched SMS Notice Toast */}
      {dispatchedNotice && (
        <div
          className="rounded-2xl border p-4 backdrop-blur-md animate-fade-in flex items-start gap-3"
          style={{
            borderColor: 'rgba(56,189,248,0.5)',
            background: 'color-mix(in oklch, var(--q-cyan) 18%, transparent)',
          }}
        >
          <Send className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-100">{dispatchedNotice}</p>
        </div>
      )}

      {/* Fleet KPI Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Total Monitored Convoys</div>
          <div className="font-heading text-2xl font-bold text-white mt-1">{vehicles.length} Fleets</div>
          <div className="text-[11px] text-zinc-500 mt-1">Equipped with NavIC / GPS Transponders</div>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">In-Transit On Schedule</div>
          <div className="font-heading text-2xl font-bold text-emerald-400 mt-1">
            {vehicles.filter((v) => v.status === 'in_transit' && !v.isAtRisk).length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Normal cruising speed (40–55 km/h)</div>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Flagged "At Risk" (FR-4.3)</div>
          <div className="font-heading text-2xl font-bold text-rose-400 mt-1">
            {atRiskCount} Fleets
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">On or approaching blocked corridors</div>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
        >
          <div className="text-xs text-zinc-400">Total Supply Payload</div>
          <div className="font-heading text-2xl font-bold text-cyan-300 mt-1">
            {vehicles.reduce((acc, v) => acc + v.cargoWeightTons, 0).toFixed(1)} MT
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Life-saving medicines, diesel & rice</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 backdrop-blur-md"
        style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Status:</span>
          {['all', 'in_transit', 'delayed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'border border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}

          <span className="text-xs text-zinc-400 font-medium ml-4">Cargo:</span>
          {['all', 'medical', 'pds_rations', 'fuel_pol', 'disaster_relief'].map((c) => (
            <button
              key={c}
              onClick={() => setCargoFilter(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                cargoFilter === c
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'border border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Update frequency: 60s (FR-4.1)
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </>
        ) : (
          filteredVehicles.map((veh) => {
            const isAtRisk = veh.isAtRisk
            const isDelayed = veh.status === 'delayed'

          return (
            <div
              key={veh.id}
              className={`rounded-2xl border p-6 transition-all ${
                isAtRisk
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
                  : 'hover:border-zinc-700'
              }`}
              style={!isAtRisk ? {
                borderColor: 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
              } : undefined}
            >
              {/* Header of Vehicle Card */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {veh.plateNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        isDelayed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {veh.status.replace('_', ' ')}
                    </span>
                    {isAtRisk && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                        FLAGGED AT RISK (FR-4.3)
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-base font-bold text-white mt-1.5 flex items-center gap-2">
                    {veh.cargoType === 'medical' && <Pill className="h-4 w-4 text-cyan-400" />}
                    {veh.cargoType === 'pds_rations' && <Wheat className="h-4 w-4 text-amber-400" />}
                    {veh.cargoType === 'fuel_pol' && <Fuel className="h-4 w-4 text-violet-400" />}
                    {veh.cargoType === 'disaster_relief' && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                    {veh.cargoDescription}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300">{veh.cargoWeightTons} MT</span>
                </div>
              </div>

              {/* At-Risk Warning Box (FR-4.3) */}
              {isAtRisk && (
                <div className="mt-4 rounded-xl border border-rose-500/50 bg-rose-950/40 p-3.5 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    APPROACHING HIGH-RISK SECTOR HAZARD
                  </div>
                  <p className="text-zinc-200">{veh.riskReason}</p>
                  <div className="pt-2 flex justify-between items-center border-t border-rose-800/40 text-[11px]">
                    <span className="text-rose-300 font-semibold">Delay Incurred: +{veh.delayMinutes} mins</span>
                    <button
                      onClick={() => handleDispatchReroute(veh)}
                      disabled={pingingId === veh.id}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-500 transition-colors"
                    >
                      {pingingId === veh.id ? 'Sending Detour…' : 'Send Emergency Detour'}
                    </button>
                  </div>
                </div>
              )}

              {/* Transit Details */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">Current Road Sector</div>
                  <div className="font-mono font-semibold text-cyan-300 mt-0.5">{veh.currentRoadCode}</div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">GPS Coordinates (FR-4.1)</div>
                  <div className="font-mono font-semibold text-zinc-200 mt-0.5">[{veh.lat.toFixed(3)}, {veh.lng.toFixed(3)}]</div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">Telemetry Speed</div>
                  <div className="font-heading font-bold text-white mt-0.5">{veh.speedKmh} km/h</div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">ETA to Destination</div>
                  <div className="font-heading font-bold text-white mt-0.5">{Math.floor(veh.etaMinutes / 60)}h {veh.etaMinutes % 60}m</div>
                </div>
              </div>

              {/* Route & Driver Footer */}
              <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400" style={{ borderColor: 'var(--q-line)' }}>
                <div>
                  Origin: <strong>{veh.origin}</strong> &rarr; Dest: <strong>{veh.destination}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{veh.driverName} ({veh.driverContact})</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
