'use client'

import React, { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'

interface BlochSphereProps {
  initialTheta?: number // 0 to Math.PI
  initialPhi?: number // 0 to 2*Math.PI
  qubitLabel?: string
  interactive?: boolean
}

export function BlochSphere({
  initialTheta = 0,
  initialPhi = 0,
  qubitLabel = '|q0⟩',
  interactive = true,
}: BlochSphereProps) {
  const [theta, setTheta] = useState(initialTheta) // 0 (top |0>) to PI (bottom |1>)
  const [phi, setPhi] = useState(initialPhi) // 0 to 2*PI

  // Calculate Bloch vector components
  const x = Math.sin(theta) * Math.cos(phi)
  const y = Math.sin(theta) * Math.sin(phi)
  const z = Math.cos(theta)

  // Probabilities
  const p0 = Math.cos(theta / 2) ** 2
  const p1 = Math.sin(theta / 2) ** 2

  // 3D Isometric Projection onto 2D Canvas space (center at 140, 140, radius R=90)
  const cx = 140
  const cy = 140
  const R = 90

  // Projection mapping
  // X axis: down-left at angle 210 deg
  // Y axis: down-right at angle -30 deg
  // Z axis: straight up at angle 90 deg
  const projX = (vx: number, vy: number, vz: number) => {
    const px = cx + R * (vy * Math.cos(-Math.PI / 6) + vx * Math.cos((7 * Math.PI) / 6))
    const py = cy - R * (vz + vy * Math.sin(-Math.PI / 6) + vx * Math.sin((7 * Math.PI) / 6))
    return { x: px, y: py }
  }

  const tip = projX(x, y, z)
  const origin = projX(0, 0, 0)
  const topZ = projX(0, 0, 1)
  const botZ = projX(0, 0, -1)
  const posX = projX(1, 0, 0)
  const posY = projX(0, 1, 0)

  const setPresetState = (preset: '0' | '1' | '+' | '-' | 'i' | '-i') => {
    switch (preset) {
      case '0':
        setTheta(0)
        setPhi(0)
        break
      case '1':
        setTheta(Math.PI)
        setPhi(0)
        break
      case '+':
        setTheta(Math.PI / 2)
        setPhi(0)
        break
      case '-':
        setTheta(Math.PI / 2)
        setPhi(Math.PI)
        break
      case 'i':
        setTheta(Math.PI / 2)
        setPhi(Math.PI / 2)
        break
      case '-i':
        setTheta(Math.PI / 2)
        setPhi((3 * Math.PI) / 2)
        break
    }
  }

  return (
    <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--q-cyan)]" />
          <h3 className="font-heading text-sm font-bold text-white">Bloch Sphere Visualizer ({qubitLabel})</h3>
        </div>
        <button
          onClick={() => setPresetState('0')}
          className="flex items-center gap-1.5 text-xs text-[var(--q-muted)] hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to |0⟩</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-center">
        {/* SVG 3D Isometric Bloch Sphere View */}
        <div className="flex justify-center relative">
          <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-2xl">
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
                <stop offset="70%" stopColor="rgba(15, 23, 42, 0.8)" />
                <stop offset="100%" stopColor="rgba(2, 6, 23, 0.95)" />
              </radialGradient>
              <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            {/* Outer Sphere Body */}
            <circle cx={cx} cy={cy} r={R} fill="url(#sphereGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Equatorial Ellipse (XY Plane) */}
            <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.35} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Z Axis Line */}
            <line x1={topZ.x} y1={topZ.y} x2={botZ.x} y2={botZ.y} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            {/* X Axis Line */}
            <line x1={origin.x} y1={origin.y} x2={posX.x} y2={posX.y} stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" />
            {/* Y Axis Line */}
            <line x1={origin.x} y1={origin.y} x2={posY.x} y2={posY.y} stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x={topZ.x} y={topZ.y - 10} fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">|0⟩ (+Z)</text>
            <text x={botZ.x} y={botZ.y + 16} fill="#A78BFA" fontSize="11" fontWeight="bold" textAnchor="middle">|1⟩ (-Z)</text>
            <text x={posX.x - 12} y={posX.y + 12} fill="rgba(255,255,255,0.7)" fontSize="10">|+⟩ (X)</text>
            <text x={posY.x + 12} y={posY.y + 12} fill="rgba(255,255,255,0.7)" fontSize="10">|i⟩ (Y)</text>

            {/* State Vector Arrow Line */}
            <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke="url(#vectorGrad)" strokeWidth="3.5" strokeLinecap="round" />
            {/* Vector Arrow Point */}
            <circle cx={tip.x} cy={tip.y} r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>

        {/* State Information & Presets */}
        <div className="space-y-4 text-xs">
          {/* State Formula Display */}
          <div className="rounded-2xl border p-4 font-mono space-y-2" style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}>
            <p className="text-[10px] text-[var(--q-muted)] uppercase tracking-wider font-sans">State Vector Representation</p>
            <p className="text-sm font-bold text-cyan-300">
              |ψ⟩ = {(Math.cos(theta / 2)).toFixed(3)}|0⟩ + {phi !== 0 ? `e^(${((phi / Math.PI)).toFixed(2)}πi)` : ''}{(Math.sin(theta / 2)).toFixed(3)}|1⟩
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-[var(--q-muted)]">
              <div>x: <span className="text-white font-bold">{x.toFixed(3)}</span></div>
              <div>y: <span className="text-white font-bold">{y.toFixed(3)}</span></div>
              <div>z: <span className="text-white font-bold">{z.toFixed(3)}</span></div>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-bold">P(|0⟩): {(p0 * 100).toFixed(1)}%</span>
              <span className="text-violet-300 font-bold">P(|1⟩): {(p1 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-black/50 overflow-hidden flex border border-white/10">
              <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${p0 * 100}%` }} />
              <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${p1 * 100}%` }} />
            </div>
          </div>

          {/* Presets Quick Buttons */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-[var(--q-muted)] block font-semibold">Basis State Presets:</span>
            <div className="grid grid-cols-6 gap-1.5 font-mono text-[11px]">
              {[
                { label: '|0⟩', key: '0' },
                { label: '|1⟩', key: '1' },
                { label: '|+⟩', key: '+' },
                { label: '|-⟩', key: '-' },
                { label: '|i⟩', key: 'i' },
                { label: '|-i⟩', key: '-i' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPresetState(p.key as any)}
                  className="rounded-xl border border-white/10 bg-white/5 py-1.5 text-center font-bold text-white transition-all hover:border-cyan-400 hover:text-cyan-300"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders */}
          {interactive && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div>
                <div className="flex justify-between text-[11px] text-[var(--q-muted)] mb-1">
                  <span>Polar Angle θ (Latitude):</span>
                  <span className="text-white font-bold">{((theta * 180) / Math.PI).toFixed(0)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.PI}
                  step="0.01"
                  value={theta}
                  onChange={(e) => setTheta(parseFloat(e.target.value))}
                  className="w-full accent-[var(--q-cyan)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[var(--q-muted)] mb-1">
                  <span>Azimuthal Angle φ (Longitude):</span>
                  <span className="text-white font-bold">{((phi * 180) / Math.PI).toFixed(0)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={2 * Math.PI}
                  step="0.01"
                  value={phi}
                  onChange={(e) => setPhi(parseFloat(e.target.value))}
                  className="w-full accent-[var(--q-violet)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
