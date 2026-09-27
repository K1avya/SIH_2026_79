import { QuantumAtom } from '@/components/quantum-atom'
import {
  Video,
  BookOpen,
  FileText,
  ScrollText,
  NotebookPen,
  Library,
} from 'lucide-react'

const features = [
  { icon: Video, label: 'Video Lectures' },
  { icon: BookOpen, label: 'Tutorials' },
  { icon: FileText, label: 'Documentation' },
  { icon: ScrollText, label: 'Research Papers' },
  { icon: NotebookPen, label: 'Notebooks' },
  { icon: Library, label: 'Reference Books' },
]

export function AuthShowcase() {
  return (
    <section
      className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, oklch(0.24 0.06 292 / 60%), transparent 45%), radial-gradient(circle at 80% 80%, oklch(0.24 0.07 200 / 55%), transparent 45%), var(--q-bg-deep)',
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              background: 'var(--q-text)',
              animation: `q-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
          }}
        >
          <span className="font-heading text-lg font-bold text-black">Q</span>
        </div>
        <span
          className="font-heading text-xl font-semibold"
          style={{ color: 'var(--q-text)' }}
        >
          Quantica
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <QuantumAtom className="q-float mb-8 h-56 w-56 xl:h-64 xl:w-64" />
        <h1
          className="font-heading text-3xl font-bold leading-tight xl:text-4xl"
          style={{ color: 'var(--q-text)' }}
        >
          Master quantum science, <br /> one concept at a time.
        </h1>
        <p className="mt-4 max-w-md text-pretty" style={{ color: 'var(--q-muted)' }}>
          A learning platform built for students to explore the quantum world
          through curated, high-quality resources.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg border px-3 py-2.5 backdrop-blur-sm"
            style={{
              borderColor: 'var(--q-line)',
              background: 'oklch(1 0 0 / 4%)',
            }}
          >
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--q-cyan)' }}
            />
            <span className="text-sm" style={{ color: 'var(--q-text)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

const STARS = [
  { top: '12%', left: '18%', size: '2px', dur: 3.2, delay: 0 },
  { top: '22%', left: '72%', size: '3px', dur: 4.1, delay: 0.6 },
  { top: '35%', left: '40%', size: '2px', dur: 2.8, delay: 1.2 },
  { top: '48%', left: '85%', size: '2px', dur: 3.6, delay: 0.3 },
  { top: '60%', left: '25%', size: '3px', dur: 4.4, delay: 0.9 },
  { top: '70%', left: '60%', size: '2px', dur: 3.0, delay: 1.5 },
  { top: '82%', left: '15%', size: '2px', dur: 3.8, delay: 0.4 },
  { top: '88%', left: '78%', size: '3px', dur: 4.2, delay: 1.0 },
  { top: '15%', left: '52%', size: '2px', dur: 2.6, delay: 1.8 },
  { top: '42%', left: '10%', size: '2px', dur: 3.4, delay: 0.7 },
]
