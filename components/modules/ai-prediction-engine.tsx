'use client'

import React, { useState } from 'react'
import {
  BrainCircuit,
  CloudRain,
  Mountain,
  Droplets,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Database,
  Sliders,
  TrendingUp,
  Cpu,
  RefreshCw,
  History,
  ShieldCheck,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'

export function AiPredictionEngine() {
  const {
    predictions,
    recomputeAIPredictions,
    t,
  } = useLogistics()

  const [isInferencing, setIsInferencing] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState(predictions[0] || null)

  function handleRecompute() {
    setIsInferencing(true)
    setTimeout(() => {
      recomputeAIPredictions()
      setIsInferencing(false)
    }, 1200)
  }

  // Historical logging table for model retraining (FR-2.4)
  const RETRAINING_LOGS = [
    {
      id: 'log-301',
      date: '2026-09-18 09:00',
      roadCode: 'NH-29-Barail',
      predicted: 'Landslide (High 94%)',
      groundTruth: 'Landslide (Confirmed 65m slope failure)',
      result: 'True Positive',
      accuracy: '96.2%',
    },
    {
      id: 'log-302',
      date: '2026-09-18 07:30',
      roadCode: 'NH-10-Teesta',
      predicted: 'Flood (High 81%)',
      groundTruth: 'River breach near Singtam',
      result: 'True Positive',
      accuracy: '91.8%',
    },
    {
      id: 'log-303',
      date: '2026-09-17 18:00',
      roadCode: 'NH-27-SecA',
      predicted: 'Cleared (Low 14%)',
      groundTruth: 'Dry road, normal transit',
      result: 'True Negative',
      accuracy: '98.5%',
    },
    {
      id: 'log-304',
      date: '2026-09-17 14:20',
      roadCode: 'NH-306-Vairangte',
      predicted: 'Caution (Medium 48%)',
      groundTruth: 'Minor runoff, passable',
      result: 'Acceptable Margin',
      accuracy: '89.0%',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.aiTitle}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-violet) 25%, transparent)',
                color: 'var(--q-violet)',
                border: '1px solid color-mix(in oklch, var(--q-violet) 40%, transparent)',
              }}
            >
              XGBoost + LSTM Terrain Engine (FR-2.2)
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Estimates real-time disruption hazards (landslides, flash floods, road slump) by synthesizing Doppler radar, slope angle, and historical soil saturation.
          </p>
        </div>

        {/* Action Button: Recompute Model (FR-2.3) */}
        <button
          onClick={handleRecompute}
          disabled={isInferencing}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-black transition-all hover:opacity-95 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            boxShadow: '0 0 20px color-mix(in oklch, var(--q-violet) 50%, transparent)',
          }}
        >
          <RefreshCw className={`h-4 w-4 ${isInferencing ? 'animate-spin' : ''}`} />
          <span>{isInferencing ? 'Ingesting Feeds & Computing…' : 'Recompute Segment Risk Scores'}</span>
        </button>
      </div>

      {/* Weather Ingestion Status Bar (FR-2.1) */}
      <div
        className="rounded-2xl border p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>IMD Doppler & Satellite Ingestion (6-Hour Sync Cycle)</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-zinc-400">
              Active precipitation radar covering North East India (Guwahati, Agartala, Mohanbari radar stations)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-300">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase">Last Sync</div>
            <div className="font-mono font-semibold text-cyan-300">09:30 IST Today</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase">Monsoon Alert Level</div>
            <div className="font-semibold text-amber-400">Orange Warning (Severe)</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase">Corridors Scanned</div>
            <div className="font-semibold text-white">8 Highways • 5 Bridges</div>
          </div>
        </div>
      </div>

      {/* Corridor Prediction Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((p) => {
          const isHigh = p.riskLevel === 'high'
          const isMed = p.riskLevel === 'medium'
          const isSelected = selectedPrediction?.segmentId === p.segmentId

          return (
            <div
              key={p.segmentId}
              onClick={() => setSelectedPrediction(p)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                isSelected
                  ? 'border-[var(--q-cyan)] shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)25%,transparent)]'
                  : 'hover:border-zinc-700'
              }`}
              style={{
                borderColor: isSelected ? 'var(--q-cyan)' : 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{p.roadCode}</span>
                  <h3 className="font-heading text-sm font-bold text-white mt-1">{p.roadName}</h3>
                  <p className="text-[11px] text-zinc-400">{p.district}, {p.state}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : isMed
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {p.riskLevel} Risk ({(p.riskProbability * 100).toFixed(0)}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Disruption Probability</span>
                  <span className="font-mono font-bold text-white">{(p.riskProbability * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${p.riskProbability * 100}%` }}
                  />
                </div>
              </div>

              {/* Contributing Factors (FR-2.2) */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border p-2" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-400" /> Rain Rate
                  </div>
                  <div className="font-bold text-white mt-0.5">{p.rainfallIntensityMm} mm/h</div>
                </div>
                <div className="rounded-lg border p-2" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Mountain className="h-3 w-3 text-amber-400" /> Slope Gradient
                  </div>
                  <div className="font-bold text-white mt-0.5">{p.slopeAngleDeg}° Grade</div>
                </div>
                <div className="rounded-lg border p-2" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-cyan-400" /> Soil Saturation
                  </div>
                  <div className="font-bold text-white mt-0.5">{p.soilSaturationPercent}%</div>
                </div>
                <div className="rounded-lg border p-2" style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 2%)' }}>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <History className="h-3 w-3 text-purple-400" /> Past Events
                  </div>
                  <div className="font-bold text-white mt-0.5">{p.historicalLandslideIncidents} Recorded</div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t flex justify-between items-center text-[10px] text-zinc-400" style={{ borderColor: 'var(--q-line)' }}>
                <span>Hazard: <strong className="text-zinc-200 capitalize">{p.predictedDisruptionType.replace('_', ' ')}</strong></span>
                <span>Confidence: {(p.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Model Retraining & Historical Prediction Audit Table (FR-2.4, NFR-12) */}
      <div
        className="rounded-2xl border p-6 backdrop-blur-md"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[var(--q-cyan)]" />
              <h2 className="font-heading text-lg font-bold text-white">
                ML Model Prediction vs Ground Truth Audit Log (FR-2.4)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Logs AI disruption forecasts against actual field incident reports to continuously retrain weights and minimize false alarms.
            </p>
          </div>
          <div className="rounded-lg border px-3 py-1.5 text-xs text-zinc-300" style={{ borderColor: 'var(--q-line)' }}>
            Overall Precision: <strong className="text-emerald-400">93.8%</strong> | F1-Score: <strong className="text-cyan-400">0.91</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-zinc-400 font-medium" style={{ borderColor: 'var(--q-line)' }}>
                <th className="pb-3 pl-2">Audit ID</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Corridor</th>
                <th className="pb-3">Model Prediction</th>
                <th className="pb-3">Field Ground Truth</th>
                <th className="pb-3">Validation Result</th>
                <th className="pb-3 pr-2 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {RETRAINING_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-2 font-mono text-zinc-400">{log.id}</td>
                  <td className="py-3 text-zinc-300">{log.date}</td>
                  <td className="py-3 font-semibold text-white">{log.roadCode}</td>
                  <td className="py-3 text-amber-300">{log.predicted}</td>
                  <td className="py-3 text-zinc-200">{log.groundTruth}</td>
                  <td className="py-3">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right font-mono text-cyan-300 font-semibold">{log.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
