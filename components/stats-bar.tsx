'use client'

import React from 'react'
import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'

const STATS = [
  { value: '120+', num: 120, suffix: '+', label: 'Video Lectures' },
  { value: '25+', num: 25, suffix: '+', label: 'Learning Tracks' },
  { value: '35K+', num: 35, suffix: 'K+', label: 'Active Students' },
  { value: '45K+', num: 45, suffix: 'K+', label: 'Notes & Papers' },
]

function StatCounter({ num, suffix, start }: { num: number; suffix: string; start: boolean }) {
  const animatedCount = useCountUp(num, 1200, start)
  return (
    <>
      {animatedCount}
      {suffix}
    </>
  )
}

export function StatsBar() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="relative z-10 mx-auto -mt-10 max-w-5xl px-5">
      <div
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px -20px oklch(0 0 0 / 0.6)',
        }}
      >
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center gap-1 px-4 py-7 text-center transition-all duration-400 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <span
              className="font-heading text-3xl font-bold sm:text-4xl"
              style={{
                background: 'linear-gradient(120deg, var(--q-cyan), var(--q-violet))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              <StatCounter num={stat.num} suffix={stat.suffix} start={isInView} />
            </span>
            <span
              className="text-xs font-medium sm:text-sm"
              style={{ color: 'var(--q-muted)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
