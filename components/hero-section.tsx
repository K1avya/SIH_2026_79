import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { QuantumAtom } from '@/components/quantum-atom'

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/quantum-nebula.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 0%, transparent, var(--q-bg) 70%), linear-gradient(to bottom, transparent, var(--q-bg))',
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-20 pb-16 lg:grid-cols-2 lg:pt-28 lg:pb-24">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: 'var(--q-line)', color: 'var(--q-cyan)' }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Learn quantum science the modern way
          </span>

          <h1 className="font-heading mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Explore the{' '}
            <span
              style={{
                background:
                  'linear-gradient(120deg, var(--q-cyan), var(--q-violet))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Quantum Universe
            </span>
          </h1>

          <p
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--q-muted)' }}
          >
            A single platform for students to master quantum physics and computing
            — through curated video lectures, hands-on tutorials, documentation,
            research papers, notebooks, and reference books.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
              style={{
                background:
                  'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                color: 'var(--q-bg-deep)',
                boxShadow:
                  '0 0 30px color-mix(in oklch, var(--q-violet) 50%, transparent)',
              }}
            >
              Start Learning Free <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#resources"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:border-[var(--q-cyan)]"
              style={{ borderColor: 'var(--q-line)' }}
            >
              <Play className="h-4 w-4" /> Explore Resources
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="q-float relative aspect-square w-full max-w-md rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--q-violet) 22%, transparent), transparent 65%)',
            }}
          >
            <QuantumAtom className="absolute inset-6" />
          </div>
        </div>
      </div>
    </section>
  )
}
