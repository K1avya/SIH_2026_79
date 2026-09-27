'use client'

import React from 'react'
import {
  Video,
  GraduationCap,
  FileText,
  FlaskConical,
  NotebookPen,
  Library,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useInView } from '@/hooks/useInView'

const RESOURCES = [
  {
    icon: Video,
    title: 'Video Lectures',
    desc: 'Structured, bite-sized video courses from superposition basics to quantum algorithms.',
  },
  {
    icon: GraduationCap,
    title: 'Interactive Tutorials',
    desc: 'Guided, hands-on tutorials that let you build and simulate circuits as you learn.',
  },
  {
    icon: FileText,
    title: 'Documentation',
    desc: 'Clear, searchable docs covering concepts, frameworks, and quantum toolkits.',
  },
  {
    icon: FlaskConical,
    title: 'Research Papers',
    desc: 'A curated, peer-reviewed library of foundational and cutting-edge quantum research.',
  },
  {
    icon: NotebookPen,
    title: 'Notebooks',
    desc: 'Runnable Jupyter-style notebooks to experiment with real quantum code and math.',
  },
  {
    icon: Library,
    title: 'Reference Books',
    desc: 'A shelf of classic and modern textbooks, organized by topic and difficulty.',
  },
]

export function ResourcesSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section
      ref={ref}
      id="resources"
      className="relative py-20 sm:py-28"
      style={{ background: 'var(--q-bg-deep)' }}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div
          className={`transition-all duration-400 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <SectionHeading
            eyebrow="Everything in one place"
            title="Six ways to master"
            highlight="quantum"
            description="Pick the format that fits how you learn best — or combine them all into your own path."
          />
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((item, idx) => (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-400 ease-out hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                borderColor: 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg) 60%, transparent)',
                transitionDelay: `${(idx + 1) * 80}ms`,
              }}
            >
              <div
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'var(--q-violet)' }}
                aria-hidden="true"
              />
              <span
                className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                  boxShadow: '0 0 24px color-mix(in oklch, var(--q-violet) 45%, transparent)',
                }}
              >
                <item.icon className="h-6 w-6" style={{ color: 'var(--q-bg-deep)' }} />
              </span>
              <h3 className="font-heading relative mt-5 text-lg font-semibold">
                {item.title}
              </h3>
              <p
                className="relative mt-2 text-sm leading-relaxed"
                style={{ color: 'var(--q-muted)' }}
              >
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
