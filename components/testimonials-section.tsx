'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useInView } from '@/hooks/useInView'

const TESTIMONIALS = [
  {
    name: 'Kristan Watson',
    role: 'Physics Undergraduate',
    initials: 'KW',
    rating: 5,
    quote:
      'The video lectures finally made superposition click for me. I went from confused to confident in a few weeks, and the notebooks let me test everything myself.',
  },
  {
    name: 'Vinicious Nerva',
    role: 'Quantum Dev',
    initials: 'VN',
    rating: 5,
    quote:
      'Having tutorials, docs, and research papers in one platform saved me hours. It is the resource I wish I had when I first started learning quantum computing.',
  },
  {
    name: 'John Verma',
    role: 'PhD Researcher',
    initials: 'JV',
    rating: 4,
    quote:
      'The research library is genuinely well curated. I use the reference books and notebooks with my own students — the structure keeps everyone on track.',
  },
]

export function TestimonialsSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} id="testimonials" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div
        className={`transition-all duration-400 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <SectionHeading
          eyebrow="Loved by learners"
          title="What our students say"
          highlight="about us"
          description="Thousands of learners rely on Quantica to make sense of the quantum world."
        />
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <figure
            key={t.name}
            className={`relative flex flex-col rounded-3xl border p-7 transition-all duration-400 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 55%, transparent)',
              transitionDelay: `${(idx + 1) * 80}ms`,
            }}
          >
            <Quote
              className="absolute right-6 top-6 h-8 w-8 opacity-15"
              style={{ color: 'var(--q-cyan)' }}
              aria-hidden="true"
            />
            <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  style={{
                    color: i < t.rating ? 'var(--q-cyan)' : 'var(--q-line)',
                    fill: i < t.rating ? 'var(--q-cyan)' : 'transparent',
                  }}
                />
              ))}
            </div>
            <blockquote
              className="mt-5 flex-1 text-sm leading-relaxed"
              style={{ color: 'var(--q-muted)' }}
            >
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                  color: 'var(--q-bg-deep)',
                }}
              >
                {t.initials}
              </span>
              <span>
                <span className="block font-heading text-sm font-semibold">
                  {t.name}
                </span>
                <span className="block text-xs" style={{ color: 'var(--q-muted)' }}>
                  {t.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
