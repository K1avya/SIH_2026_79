'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

export function CtaSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-5 pb-24">
      <div
        className={`relative overflow-hidden rounded-[2rem] border px-6 py-16 text-center sm:px-12 transition-all duration-400 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ borderColor: 'var(--q-line)' }}
      >
        <Image
          src="/images/quantum-nebula.png"
          alt=""
          fill
          className="object-cover opacity-30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 120% at 50% 0%, color-mix(in oklch, var(--q-violet) 30%, transparent), var(--q-bg-deep) 80%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Begin your quantum journey today
          </h2>
          <p
            className="mt-4 text-pretty leading-relaxed"
            style={{ color: 'var(--q-muted)' }}
          >
            Create a free account and unlock videos, tutorials, notebooks, and a
            full research library — everything you need to learn quantum, in one
            place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-150 hover:scale-[1.03] active:scale-95"
              style={{
                background:
                  'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                color: 'var(--q-bg-deep)',
                boxShadow:
                  '0 0 30px color-mix(in oklch, var(--q-violet) 55%, transparent)',
              }}
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="rounded-full border px-7 py-3 text-sm font-semibold transition-all duration-150 hover:border-[var(--q-cyan)] active:scale-95"
              style={{ borderColor: 'var(--q-line)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
