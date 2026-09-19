import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div
        className="relative overflow-hidden rounded-[2rem] border px-6 py-16 text-center sm:px-12"
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
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
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
              className="rounded-full border px-7 py-3 text-sm font-semibold transition-colors hover:border-[var(--q-cyan)]"
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
