import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Lock, Cpu } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const HIGHLIGHTS = [
  { icon: Cpu, label: 'Beginner to advanced tracks' },
  { icon: ShieldCheck, label: 'Peer-reviewed research library' },
  { icon: Lock, label: 'Verified certificates on completion' },
]

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="About Quantica"
        title="Where curious minds meet"
        highlight="quantum science"
        description="We bring together the best learning formats in one place so students can go from their first qubit to publishing original research — at their own pace."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <div
          className="group relative overflow-hidden rounded-3xl border"
          style={{ borderColor: 'var(--q-line)' }}
        >
          <Image
            src="/images/student-cosmos.png"
            alt="A student gazing up at a glowing galaxy"
            width={500}
            height={640}
            className="h-full min-h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--q-bg-deep), transparent 55%)',
            }}
          />
          <Link
            href="/login"
            className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-semibold backdrop-blur-md"
            style={{
              background:
                'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
            }}
          >
            More About Us{' '}
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                background:
                  'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              }}
            >
              <ArrowRight
                className="h-4 w-4"
                style={{ color: 'var(--q-bg-deep)' }}
              />
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="rounded-3xl p-6"
            style={{
              background:
                'linear-gradient(150deg, var(--q-blue), var(--q-violet))',
              boxShadow:
                '0 20px 50px -20px color-mix(in oklch, var(--q-violet) 70%, transparent)',
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: 'oklch(0.92 0.02 260)' }}
            >
              Lessons Completed
            </p>
            <p className="font-heading mt-1 text-4xl font-bold text-white">
              500K+
            </p>
          </div>

          <div
            className="rounded-3xl border p-6"
            style={{
              borderColor: 'var(--q-line)',
              background:
                'color-mix(in oklch, var(--q-bg-deep) 60%, transparent)',
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--q-cyan)' }}>
              Happy Learners
            </p>
            <p className="font-heading mt-1 text-4xl font-bold">12,540+</p>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: 'var(--q-muted)' }}
            >
              From high-school students to PhD researchers, our community learns,
              shares notebooks, and grows together every single day.
            </p>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl border"
          style={{ borderColor: 'var(--q-line)' }}
        >
          <Image
            src="/images/quantum-orb.png"
            alt="Glowing quantum particle visualization"
            fill
            className="object-cover opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--q-bg-deep) 20%, transparent)',
            }}
          />
          <div className="relative flex h-full min-h-72 flex-col justify-end gap-3 p-6">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background:
                      'color-mix(in oklch, var(--q-cyan) 18%, transparent)',
                  }}
                >
                  <item.icon
                    className="h-4 w-4"
                    style={{ color: 'var(--q-cyan)' }}
                  />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
