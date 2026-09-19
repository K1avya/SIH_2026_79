import Link from 'next/link'
import { Atom } from 'lucide-react'

const LINKS = {
  Learn: ['Video Lectures', 'Tutorials', 'Notebooks', 'Documentation'],
  Library: ['Research Papers', 'Reference Books', 'Glossary', 'Roadmaps'],
  Company: ['About Us', 'Community', 'Careers', 'Contact'],
}

export function SiteFooter() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
    >
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="#home" className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                }}
              >
                <Atom className="h-5 w-5" style={{ color: 'var(--q-bg-deep)' }} />
              </span>
              <span className="font-heading text-lg font-bold">Quantica</span>
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: 'var(--q-muted)' }}
            >
              The learning platform for the next generation of quantum scientists,
              engineers, and researchers.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h3 className="font-heading text-sm font-semibold">{group}</h3>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="/login"
                      className="text-sm transition-colors hover:text-[var(--q-cyan)]"
                      style={{ color: 'var(--q-muted)' }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm sm:flex-row"
          style={{ borderColor: 'var(--q-line)', color: 'var(--q-muted)' }}
        >
          <p>© {new Date().getFullYear()} Quantica. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="transition-colors hover:text-[var(--q-cyan)]"
            >
              Privacy
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-[var(--q-cyan)]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
