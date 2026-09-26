'use client'

import React, { useState } from 'react'

interface GateTooltipProps {
  caption: string
  children: React.ReactNode
}

export function GateTooltip({ caption, children }: GateTooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-1/2 rounded-xl border px-3 py-2 text-center text-[10px] leading-snug shadow-lg"
          style={{
            borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)',
            background: 'var(--q-bg-deep)',
            color: 'var(--q-cyan)',
          }}
          role="tooltip"
        >
          <span className="font-semibold">You just learned:</span>
          <br />
          <span className="text-white/80">{caption}</span>
        </div>
      )}
    </div>
  )
}
