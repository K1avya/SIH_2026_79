'use client'

import React from 'react'
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Truck,
  TrendingDown,
  TrendingUp,
  Fuel,
  Pill,
  Wheat,
  Layers,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { Skeleton } from '@/components/ui/Skeleton'

export function AdminDashboard() {
  const {
    roads,
    bridges,
    districts,
    vehicles,
    incidents,
    emergencyMode,
    toggleEmergencyMode,
    setActiveModule,
    t,
  } = useLogistics()

  const [isLoading, setIsLoading] = React.useState(false)

  // Helper function to pick single highest severity item
  function getTopSeverity<T extends { id?: string; severity?: string; status?: string; isAtRisk?: boolean }>(
    items: T[]
  ): T | null {
    if (!items || items.length === 0) return null
    let top: T | null = null
    let maxScore = -1

    items.forEach((item) => {
      let score = 0
      if (item.severity === 'critical') score = 100
      else if (item.status === 'blocked') score = 90
      else if (item.isAtRisk) score = 80
      else if (item.severity === 'high') score = 70
      else if (item.status === 'at_risk') score = 50
      else if (item.severity === 'medium') score = 30
      else score = 10

      if (score > maxScore) {
        maxScore = score
        top = item
      }
    })

    return top
  }

  // Cap simultaneous urgent animations per view to single highest severity item
  const topUrgentAdminId = React.useMemo(() => {
    if (emergencyMode) return 'emergency'
    const topInc = getTopSeverity(incidents.filter((i) => i.status !== 'resolved'))
    if (topInc && topInc.severity === 'critical') return `inc-${topInc.id}`
    const topVeh = getTopSeverity(vehicles.filter((v) => v.isAtRisk))
    if (topVeh) return `veh-${topVeh.id}`
    return null
  }, [emergencyMode, incidents, vehicles])

  const totalRoadsKm = roads.reduce((acc, r) => acc + r.lengthKm, 0)
  const openRoadsKm = roads.filter((r) => r.status === 'open').reduce((acc, r) => acc + r.lengthKm, 0)
  const blockedRoadsKm = roads.filter((r) => r.status === 'blocked').reduce((acc, r) => acc + r.lengthKm, 0)
  const atRiskRoadsKm = roads.filter((r) => r.status === 'at_risk').reduce((acc, r) => acc + r.lengthKm, 0)
  const avgConnectivity = Math.round(
    districts.reduce((acc, d) => acc + d.connectivityIndexPercent, 0) / districts.length
  )

  const delayedVehicles = vehicles.filter((v) => v.status === 'delayed')
  const criticalDistricts = districts.filter(
    (d) => d.connectivityIndexPercent < 75 || d.isCriticalDisasterZone
  )

  return (
    <div className="space-y-6">
      {/* Top Executive Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.navAdmin}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
                border: '1px solid color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              }}
            >
              MDoNER SIH26002 Live
            </span>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--q-muted)' }}>
            Centralized strategic command for road accessibility, disaster response, and supply-chain logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModule('gis_map')}
            className="flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors hover:border-[var(--q-cyan)]"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <span>Open GIS Spatial Map</span>
            <ArrowUpRight className="h-3.5 w-3.5" style={{ color: 'var(--q-cyan)' }} />
          </button>

          <button
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              emergencyMode
                ? `bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] ${topUrgentAdminId === 'emergency' ? 'animate-pulse' : ''}`
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{emergencyMode ? 'Emergency Active' : 'Trigger Emergency View'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Mode Banner (FR-7.3) */}
      {emergencyMode && (
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: 'rgba(244,63,94,0.5)',
            background: 'linear-gradient(135deg, rgba(225,29,72,0.18), color-mix(in oklch, var(--q-bg-deep) 90%, transparent))',
            boxShadow: '0 0 35px rgba(244,63,94,0.15)',
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`flex h-3 w-3 rounded-full bg-rose-500 ${topUrgentAdminId === 'emergency' ? 'animate-ping' : ''}`} />
                <span className="font-heading text-base font-bold text-rose-300">
                  DISASTER LIFELINE ROUTE PRIORITY ACTIVATED (FR-7.3)
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Prioritizing military, SDRF, and civil relief corridors into high-risk districts: <strong>Kohima (Nagaland)</strong>, <strong>East Sikkim (Gangtok)</strong>, and <strong>Tawang (Arunachal Pradesh)</strong>. Secondary traffic is actively being diverted.
              </p>
            </div>
            <button
              onClick={() => setActiveModule('route_planner')}
              className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105"
            >
              Plan Lifeline Dispatch
            </button>
          </div>
        </div>
      )}

      {/* High-Level KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            {/* KPI 1 */}
        <div
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:border-[var(--q-cyan)]"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--q-muted)' }}>
              Regional Connectivity Index
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
              }}
            >
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-white">
              {avgConnectivity}%
            </span>
            <span className="flex items-center text-xs font-medium text-emerald-400">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              Stable
            </span>
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--q-muted)' }}>
            Across 8 NER states ({districts.length} core monitored districts)
          </p>
        </div>

        {/* KPI 2 */}
        <div
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:border-[var(--q-cyan)]"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--q-muted)' }}>
              Accessible Corridors
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400"
            >
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-emerald-400">
              {openRoadsKm} <span className="text-sm font-normal text-zinc-400">/ {totalRoadsKm} km</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
            <span>At Risk: <strong className="text-amber-400">{atRiskRoadsKm} km</strong></span>
            <span>Blocked: <strong className="text-rose-400">{blockedRoadsKm} km</strong></span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:border-[var(--q-violet)]"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--q-muted)' }}>
              Active Ground Incidents
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400"
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-white">
              {incidents.filter((i) => i.status !== 'resolved').length}
            </span>
            <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
              {incidents.filter((i) => i.severity === 'critical').length} Critical
            </span>
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--q-muted)' }}>
            Landslides (Barail Pass) & Flash Floods (Teesta Valley)
          </p>
        </div>

        {/* KPI 4 */}
        <div
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:border-[var(--q-cyan)]"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--q-muted)' }}>
              Essential Fleets Tracked
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: 'linear-gradient(135deg, color-mix(in oklch, var(--q-cyan) 25%, transparent), color-mix(in oklch, var(--q-violet) 25%, transparent))',
                color: 'var(--q-cyan)',
              }}
            >
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-white">
              {vehicles.length}
            </span>
            <span className="text-xs font-semibold text-amber-400">
              {delayedVehicles.length} Delayed / At Risk
            </span>
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--q-muted)' }}>
            Carrying Oxygen, PDS rations, POL Fuel & Relief
          </p>
        </div>
      </>
    )}
  </div>

      {/* Active Logistics Bottlenecks & Supply-Chain Gaps (FR-7.2) */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-md"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-white">
                Active Logistics Bottlenecks & Supply-Chain Gaps (FR-7.2)
              </span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                {criticalDistricts.length} High Priority Districts
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time monitoring of essential medical supplies, food grain (PDS), and fuel buffer days in remote NER valleys.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> &lt; 7 Days (Critical)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> 7–14 Days (Warning)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> &gt; 14 Days (Safe)</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {criticalDistricts.map((d) => {
            const medDays = d.essentialSuppliesBufferDays.medical
            const foodDays = d.essentialSuppliesBufferDays.foodGrain
            const fuelDays = d.essentialSuppliesBufferDays.fuelPol
            return (
              <div
                key={d.district}
                className="rounded-xl border p-4 transition-colors"
                style={{
                  borderColor: 'var(--q-line)',
                  background: 'color-mix(in oklch, var(--q-bg) 80%, transparent)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white">{d.district}</h3>
                    <p className="text-[11px] text-zinc-400">{d.state} • Pop: {(d.populationServed / 1000).toFixed(0)}k</p>
                  </div>
                  <span className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-bold text-rose-400">
                    {d.connectivityIndexPercent}% Link
                  </span>
                </div>

                {/* Buffer bars */}
                <div className="mt-3 space-y-2.5">
                  {/* Medical */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Pill className="h-3 w-3 text-cyan-400" /> Medical & Oxygen
                      </span>
                      <span className={`font-semibold ${medDays <= 7 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {medDays} days left
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${medDays <= 7 ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(100, (medDays / 30) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Food */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Wheat className="h-3 w-3 text-amber-400" /> PDS Food Grain
                      </span>
                      <span className={`font-semibold ${foodDays <= 7 ? 'text-rose-400' : foodDays <= 14 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {foodDays} days left
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${foodDays <= 7 ? 'bg-rose-500' : foodDays <= 14 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, (foodDays / 30) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Fuel */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Fuel className="h-3 w-3 text-violet-400" /> POL (Diesel / LPG)
                      </span>
                      <span className={`font-semibold ${fuelDays <= 7 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {fuelDays} days left
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${fuelDays <= 7 ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(100, (fuelDays / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs" style={{ borderColor: 'var(--q-line)' }}>
                  <span className="text-[11px] text-zinc-400">Blocked: {d.blockedRoadsKm} km</span>
                  <button
                    onClick={() => setActiveModule('route_planner')}
                    className="text-[11px] font-semibold text-[var(--q-cyan)] hover:underline flex items-center gap-1"
                  >
                    Reroute Supply Fleet &rarr;
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* District-Wise Connectivity Table (FR-7.1) */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-md overflow-hidden"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">
              District-Wise Connectivity Status Matrix (FR-7.1)
            </h2>
            <p className="text-xs text-zinc-400">
              Real-time audit of total network length, passable segments, and active bottlenecks.
            </p>
          </div>
          <span className="text-xs text-zinc-400">
            Updated live from field sensors & patrol checkpoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-zinc-400 font-medium" style={{ borderColor: 'var(--q-line)' }}>
                <th className="pb-3 pl-2">District</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Total Road Network</th>
                <th className="pb-3">Open / Accessible</th>
                <th className="pb-3">Caution / At Risk</th>
                <th className="pb-3">Severed / Blocked</th>
                <th className="pb-3">Accessibility Index</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {districts.map((d) => (
                <tr key={d.district} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-2 font-semibold text-white">
                    {d.district}
                    {d.isCriticalDisasterZone && (
                      <span className="ml-2 rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">
                        Disaster Zone
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-zinc-300">{d.state}</td>
                  <td className="py-3 text-zinc-300">{d.totalRoadsKm} km</td>
                  <td className="py-3 text-emerald-400 font-medium">{d.openRoadsKm} km</td>
                  <td className="py-3 text-amber-400 font-medium">{d.atRiskRoadsKm} km</td>
                  <td className="py-3 font-semibold">
                    {d.blockedRoadsKm > 0 ? (
                      <span className="text-rose-400">{d.blockedRoadsKm} km</span>
                    ) : (
                      <span className="text-zinc-500">0 km</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.connectivityIndexPercent >= 85
                              ? 'bg-emerald-400'
                              : d.connectivityIndexPercent >= 70
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${d.connectivityIndexPercent}%` }}
                        />
                      </div>
                      <span className="font-semibold text-white">{d.connectivityIndexPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => setActiveModule('gis_map')}
                      className="rounded-md border px-2.5 py-1 text-[11px] font-medium text-[var(--q-cyan)] hover:bg-[var(--q-cyan)]/10 transition-colors"
                      style={{ borderColor: 'var(--q-line)' }}
                    >
                      Inspect Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Fleet Delivery Status (FR-7.4) */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-md"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">
              Live Delivery Status of Essential Goods Fleets (FR-7.4)
            </h2>
            <p className="text-xs text-zinc-400">
              GPS tracked convoys transporting medical, food grain, petroleum, and disaster relief.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('vehicle_tracking')}
            className="text-xs font-semibold text-[var(--q-cyan)] hover:underline flex items-center gap-1"
          >
            Open Fleet Radar &rarr;
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl border p-4 transition-all ${
                v.isAtRisk
                  ? 'border-rose-500/50 bg-rose-950/20'
                  : 'hover:border-[var(--q-cyan)]'
              }`}
              style={!v.isAtRisk ? {
                borderColor: 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg) 80%, transparent)',
              } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{v.plateNumber}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    v.status === 'in_transit'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {v.status === 'in_transit' ? 'In-Transit' : 'Delayed'}
                </span>
              </div>

              <div className="mt-2.5 text-xs text-zinc-300 font-medium truncate">
                {v.cargoDescription}
              </div>

              <div className="mt-2 text-[11px] text-zinc-400 space-y-0.5">
                <div>Route: {v.origin} &rarr; {v.destination}</div>
                <div>Sector: <span className="font-mono text-cyan-300">{v.currentRoadCode}</span></div>
                <div>Driver: {v.driverName}</div>
              </div>

              {v.isAtRisk && (
                <div className="mt-3 rounded-lg bg-rose-500/20 p-2 text-[11px] text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5 inline mr-1 text-rose-400" />
                  <strong>AT RISK:</strong> {v.riskReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
