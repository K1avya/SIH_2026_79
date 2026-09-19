'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Layers,
  Filter,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Sliders,
  CloudRain,
  Mountain,
  Droplets,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  Camera,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { RoadCategory, RoadSegment, RoadStatus } from '@/types/logistics'

export function GisMapView() {
  const {
    roads,
    bridges,
    vehicles,
    incidents,
    emergencyMode,
    updateRoadStatus,
    t,
  } = useLogistics()

  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(roads[1] || null)
  const [districtFilter, setDistrictFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showBridges, setShowBridges] = useState<boolean>(true)
  const [showVehicles, setShowVehicles] = useState<boolean>(true)
  const [showRainOverlay, setShowRainOverlay] = useState<boolean>(true)

  // Geographic bounds for NER in SVG viewbox (88.0 to 96.5 E, 22.8 to 28.5 N)
  // Mapping formula:
  // x = ((lng - 88.0) / (96.5 - 88.0)) * 800
  // y = ((28.5 - lat) / (28.5 - 22.8)) * 550
  function geoToSvg(lat: number, lng: number): [number, number] {
    const minLng = 88.0
    const maxLng = 96.5
    const minLat = 22.8
    const maxLat = 28.5
    const x = ((lng - minLng) / (maxLng - minLng)) * 800
    const y = ((maxLat - lat) / (maxLat - minLat)) * 550
    return [Math.round(x), Math.round(y)]
  }

  // Filter roads
  const filteredRoads = roads.filter((r) => {
    if (districtFilter !== 'all' && r.district.toLowerCase() !== districtFilter.toLowerCase()) {
      return false
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) {
      return false
    }
    if (categoryFilter !== 'all' && r.category !== categoryFilter) {
      return false
    }
    if (emergencyMode && r.status === 'blocked') {
      return true // in emergency mode, highlight blocked vs lifeline
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls (FR-1.3) */}
      <div className="flex flex-col gap-3 rounded-2xl border p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between" style={{
        borderColor: 'var(--q-line)',
        background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
      }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
              {t.navGISMap}
            </h1>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
              GIS Vector Grid • NER
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time road accessibility & bridge structural health across Assam, Meghalaya, Nagaland, Sikkim, Manipur, Mizoram, Arunachal & Tripura.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="rounded-lg border px-2.5 py-1.5 text-xs outline-none transition-colors"
              style={{
                borderColor: 'var(--q-line)',
                background: 'var(--q-bg)',
                color: 'var(--q-text)',
              }}
            >
              <option value="all">All Districts (NER)</option>
              <option value="Kamrup Metro">Kamrup Metro (Assam)</option>
              <option value="Kohima">Kohima (Nagaland)</option>
              <option value="East Khasi Hills">East Khasi Hills (Meghalaya)</option>
              <option value="East Sikkim">East Sikkim (Gangtok)</option>
              <option value="Tawang">Tawang (Arunachal)</option>
              <option value="Imphal West">Imphal West (Manipur)</option>
              <option value="Aizawl">Aizawl (Mizoram)</option>
              <option value="West Tripura">West Tripura (Tripura)</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-2.5 py-1.5 text-xs outline-none transition-colors"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg)',
              color: 'var(--q-text)',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="open">🟢 Open & Passable</option>
            <option value="at_risk">🟡 At Risk (Caution)</option>
            <option value="blocked">🔴 Blocked / Severed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border px-2.5 py-1.5 text-xs outline-none transition-colors"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg)',
              color: 'var(--q-text)',
            }}
          >
            <option value="all">All Road Classes</option>
            <option value="national_highway">National Highways (NH)</option>
            <option value="border_road">Border Strategic Roads (BRO)</option>
            <option value="major_district">Major District Roads (MDR)</option>
          </select>

          {/* Layer toggles */}
          <div className="flex items-center gap-1 border-l pl-2 ml-1" style={{ borderColor: 'var(--q-line)' }}>
            <button
              onClick={() => setShowBridges(!showBridges)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium border transition-colors ${
                showBridges ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-zinc-400 border-transparent'
              }`}
            >
              Bridges
            </button>
            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium border transition-colors ${
                showVehicles ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' : 'text-zinc-400 border-transparent'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setShowRainOverlay(!showRainOverlay)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium border transition-colors ${
                showRainOverlay ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'text-zinc-400 border-transparent'
              }`}
            >
              Rain Radar
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* SVG GIS Map Canvas (8 Cols) */}
        <div
          className="relative overflow-hidden rounded-2xl border backdrop-blur-md lg:col-span-8 min-h-[560px] flex flex-col justify-between"
          style={{
            borderColor: 'var(--q-line)',
            background: 'radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--q-bg) 85%, transparent), var(--q-bg-deep))',
          }}
        >
          {/* Map Top Status Bar */}
          <div className="relative z-10 flex items-center justify-between border-b p-3 px-4 text-xs backdrop-blur-md" style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 80%, transparent)',
          }}>
            <div className="flex items-center gap-4 text-zinc-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Open ({roads.filter((r) => r.status === 'open').length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                At Risk ({roads.filter((r) => r.status === 'at_risk').length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
                Blocked ({roads.filter((r) => r.status === 'blocked').length})
              </span>
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <CloudRain className="h-3.5 w-3.5 text-blue-400" />
              <span>IMD Live Radar Sync: OK</span>
            </div>
          </div>

          {/* Interactive GIS SVG Viewport */}
          <div className="relative flex-1 w-full h-full p-2 flex items-center justify-center">
            <svg
              viewBox="0 0 800 550"
              className="w-full h-full max-h-[520px] select-none"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
            >
              <defs>
                {/* Glow Filters */}
                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Rain Radar Gradient */}
                <radialGradient id="rain-storm-barail" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="rain-storm-teesta" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="80%" stopColor="#0284c7" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Geo Contours / Simplified Regional Shape */}
              <g opacity="0.25" stroke="var(--q-line)" strokeWidth="1" fill="none">
                {/* Brahmaputra river path */}
                <path
                  d="M 120 230 Q 250 220 380 210 T 540 180 T 710 110"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 4"
                  opacity="0.6"
                />
                <text x="320" y="200" fill="#38bdf8" fontSize="9" fontWeight="600" opacity="0.7">
                  Brahmaputra Valley Corridor
                </text>
                <text x="60" y="110" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  SIKKIM
                </text>
                <text x="280" y="130" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  ASSAM
                </text>
                <text x="500" y="80" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  ARUNACHAL PRADESH
                </text>
                <text x="240" y="320" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  MEGHALAYA
                </text>
                <text x="560" y="270" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  NAGALAND
                </text>
                <text x="540" y="380" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  MANIPUR
                </text>
                <text x="430" y="470" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  MIZORAM
                </text>
                <text x="290" y="440" fill="#a1a1aa" fontSize="11" fontWeight="700" letterSpacing="1">
                  TRIPURA
                </text>
              </g>

              {/* Simulated Rainfall Overlay Clouds (FR-2.1) */}
              {showRainOverlay && (
                <g className="animate-pulse">
                  {/* Monsoon Cell over Barail / Nagaland */}
                  <circle cx="560" cy="270" r="75" fill="url(#rain-storm-barail)" />
                  <text x="525" y="240" fill="#93c5fd" fontSize="8" fontWeight="600">
                    🌧️ 48 mm/h Downpour
                  </text>

                  {/* Cell over Teesta Valley */}
                  <circle cx="95" cy="115" r="55" fill="url(#rain-storm-teesta)" />
                  <text x="65" y="90" fill="#67e8f9" fontSize="8" fontWeight="600">
                    🌧️ 38 mm/h Downpour
                  </text>
                </g>
              )}

              {/* Road Segments (FR-1.1) */}
              {filteredRoads.map((road) => {
                if (!road.coordinates || road.coordinates.length < 2) return null
                const points = road.coordinates.map((c) => geoToSvg(c[0], c[1]))
                const pathD = points.reduce(
                  (acc, pt, idx) => (idx === 0 ? `M ${pt[0]} ${pt[1]}` : `${acc} L ${pt[0]} ${pt[1]}`),
                  ''
                )

                const isSelected = selectedRoad?.id === road.id
                let strokeColor = '#10b981' // open
                let filterId = 'glow-green'
                let strokeWidth = isSelected ? 6 : 4

                if (road.status === 'at_risk') {
                  strokeColor = '#f59e0b'
                  filterId = 'glow-amber'
                  strokeWidth = isSelected ? 7 : 5
                } else if (road.status === 'blocked') {
                  strokeColor = '#f43f5e'
                  filterId = 'glow-red'
                  strokeWidth = isSelected ? 8 : 6
                }

                return (
                  <g
                    key={road.id}
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => setSelectedRoad(road)}
                  >
                    {/* Shadow/Backdrop path for click tolerance */}
                    <path
                      d={pathD}
                      stroke="transparent"
                      strokeWidth={18}
                      fill="none"
                    />
                    {/* Visual road line */}
                    <path
                      d={pathD}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#${filterId})`}
                      strokeDasharray={road.status === 'blocked' ? '8 4' : road.status === 'at_risk' ? '12 4' : undefined}
                      fill="none"
                      className={road.status === 'blocked' ? 'animate-pulse' : undefined}
                    />

                    {/* Road Code Tag at midpoint */}
                    {points.length > 1 && (
                      <g
                        transform={`translate(${points[Math.floor(points.length / 2)][0]}, ${
                          points[Math.floor(points.length / 2)][1] - 8
                        })`}
                      >
                        <rect
                          x="-28"
                          y="-8"
                          width="56"
                          height="14"
                          rx="4"
                          fill="var(--q-bg-deep)"
                          stroke={strokeColor}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="700"
                        >
                          {road.code.slice(0, 8)}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Bridges Layer */}
              {showBridges &&
                bridges.map((br) => {
                  const pt = geoToSvg(br.coordinates[0], br.coordinates[1])
                  const isBlocked = br.status === 'blocked'
                  const isAtRisk = br.status === 'at_risk'
                  return (
                    <g key={br.id} transform={`translate(${pt[0]}, ${pt[1]})`}>
                      <circle
                        r={isBlocked ? 9 : 7}
                        fill={isBlocked ? '#f43f5e' : isAtRisk ? '#f59e0b' : '#06b6d4'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className={isBlocked ? 'animate-ping' : undefined}
                        opacity={isBlocked ? 0.8 : 1}
                      />
                      <circle
                        r={isBlocked ? 7 : 5}
                        fill={isBlocked ? '#e11d48' : isAtRisk ? '#d97706' : '#0891b2'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        x="9"
                        y="3"
                        fill="#cbd5e1"
                        fontSize="8"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        🌉 {br.name.split(' ')[0]}
                      </text>
                    </g>
                  )
                })}

              {/* Active Vehicles Layer (FR-4.1) */}
              {showVehicles &&
                vehicles.map((v) => {
                  const pt = geoToSvg(v.lat, v.lng)
                  return (
                    <g
                      key={v.id}
                      transform={`translate(${pt[0]}, ${pt[1]})`}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {v.isAtRisk && (
                        <circle
                          r="12"
                          fill="rgba(244,63,94,0.3)"
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        r="6"
                        fill={v.isAtRisk ? '#f43f5e' : '#a855f7'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x="8"
                        y="-4"
                        fill={v.isAtRisk ? '#fda4af' : '#d8b4fe'}
                        fontSize="8"
                        fontWeight="700"
                      >
                        🚚 {v.plateNumber.split('-')[0]}-{v.plateNumber.split('-')[1]}
                      </text>
                    </g>
                  )
                })}

              {/* Active Incident Warning Icons */}
              {incidents
                .filter((i) => i.status !== 'resolved')
                .map((inc) => {
                  const pt = geoToSvg(inc.lat, inc.lng)
                  return (
                    <g key={inc.id} transform={`translate(${pt[0]}, ${pt[1]})`}>
                      <rect
                        x="-7"
                        y="-7"
                        width="14"
                        height="14"
                        rx="3"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1"
                        className="animate-bounce"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        !
                      </text>
                    </g>
                  )
                })}
            </svg>
          </div>

          {/* Map Bottom Legend Panel */}
          <div className="relative z-10 flex flex-wrap items-center justify-between border-t p-3 px-4 text-xs backdrop-blur-md" style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
          }}>
            <div className="flex items-center gap-4 text-[11px] text-zinc-300">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-5 bg-emerald-400 rounded-full" /> Normal Transit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-5 bg-amber-400 rounded-full" /> Hazard Caution (40 km/h)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-5 bg-rose-500 rounded-full" /> Impassable Blockage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Bridge Span
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Essential Fleet
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              Projection: WGS84 • PostGIS NER Engine
            </span>
          </div>
        </div>

        {/* Road Segment Inspector Drawer (FR-1.2, 4 Cols) */}
        <div
          className="rounded-2xl border p-5 backdrop-blur-md lg:col-span-4 flex flex-col justify-between"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
          }}
        >
          {selectedRoad ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{selectedRoad.code}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        selectedRoad.status === 'open'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : selectedRoad.status === 'at_risk'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300 animate-pulse'
                      }`}
                    >
                      {selectedRoad.status === 'open' ? 'Open' : selectedRoad.status === 'at_risk' ? 'At Risk' : 'Blocked'}
                    </span>
                  </div>
                  <h2 className="font-heading text-base font-bold text-white mt-1">
                    {selectedRoad.name}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {selectedRoad.district}, {selectedRoad.state}
                  </p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">Total Length</div>
                  <div className="font-heading text-sm font-bold text-white mt-0.5">{selectedRoad.lengthKm} KM</div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400">Risk Score</div>
                  <div className={`font-heading text-sm font-bold mt-0.5 ${
                    selectedRoad.riskScore >= 75 ? 'text-rose-400' : selectedRoad.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedRoad.riskScore} / 100 ({selectedRoad.riskLevel.toUpperCase()})
                  </div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-400" /> Rainfall
                  </div>
                  <div className="font-heading text-sm font-bold text-white mt-0.5">{selectedRoad.rainfallMmPerHour} mm/h</div>
                </div>
                <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Mountain className="h-3 w-3 text-amber-400" /> Slope Gradient
                  </div>
                  <div className="font-heading text-sm font-bold text-white mt-0.5">{selectedRoad.slopeDeg}° Inclination</div>
                </div>
              </div>

              {/* Waypoints */}
              <div className="rounded-xl border p-3 text-xs space-y-1" style={{ borderColor: 'var(--q-line)' }}>
                <div className="text-[10px] uppercase font-semibold text-zinc-400">Terminus Points</div>
                <div className="text-zinc-200">From: <strong>{selectedRoad.from}</strong></div>
                <div className="text-zinc-200">To: <strong>{selectedRoad.to}</strong></div>
                <div className="text-[11px] text-zinc-400 pt-1">
                  Last Inspection: {selectedRoad.lastInspection}
                </div>
              </div>

              {/* Ground Incidents Attached */}
              {selectedRoad.activeIncidentsCount > 0 && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    Active Field Obstructions ({selectedRoad.activeIncidentsCount})
                  </div>
                  {incidents
                    .filter((i) => i.roadCode === selectedRoad.code && i.status !== 'resolved')
                    .map((inc) => (
                      <div key={inc.id} className="border-t border-rose-800/40 pt-1.5 text-[11px] text-zinc-300">
                        <div className="flex justify-between font-semibold text-rose-200">
                          <span>{inc.incidentType.toUpperCase()} ({inc.severity})</span>
                          <span>{inc.timestamp.slice(11, 16)} hrs</span>
                        </div>
                        <p className="mt-0.5 text-zinc-300">{inc.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                          <span>Elev: {inc.elevationMeters}m</span>
                          <span>By: {inc.reporterName}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Administrative Status Override (FR-1.2) */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-zinc-400 block mb-2">
                  Administrative Status Override (FR-1.2)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateRoadStatus(selectedRoad.code, 'open')}
                    className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all ${
                      selectedRoad.status === 'open'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'border-zinc-800 text-zinc-400 hover:border-emerald-500/40'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => updateRoadStatus(selectedRoad.code, 'at_risk')}
                    className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all ${
                      selectedRoad.status === 'at_risk'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'border-zinc-800 text-zinc-400 hover:border-amber-500/40'
                    }`}
                  >
                    At Risk
                  </button>
                  <button
                    onClick={() => updateRoadStatus(selectedRoad.code, 'blocked')}
                    className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all ${
                      selectedRoad.status === 'blocked'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'border-zinc-800 text-zinc-400 hover:border-rose-500/40'
                    }`}
                  >
                    Blocked
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 text-zinc-400">
              <Layers className="h-10 w-10 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">Select any Road Segment</p>
              <p className="text-xs text-zinc-500 mt-1">
                Click on any vector corridor on the GIS map to inspect soil moisture, precipitation radar, elevation gradient, and live obstructions.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t text-[11px] text-zinc-500 flex justify-between" style={{ borderColor: 'var(--q-line)' }}>
            <span>Auto-refresh: 15s WebSocket</span>
            <span>IEEE 830 FR-1.1 compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
