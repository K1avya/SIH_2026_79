const STATS = [
  { value: '120+', label: 'Video Lectures' },
  { value: '25+', label: 'Learning Tracks' },
  { value: '35K+', label: 'Active Students' },
  { value: '45K+', label: 'Notes & Papers' },
]

export function StatsBar() {
  return (
    <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-5">
      <div
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4"
        style={{
          borderColor: 'var(--q-line)',
          background:
            'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px -20px oklch(0 0 0 / 0.6)',
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 px-4 py-7 text-center"
          >
            <span
              className="font-heading text-3xl font-bold sm:text-4xl"
              style={{
                background:
                  'linear-gradient(120deg, var(--q-cyan), var(--q-violet))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {stat.value}
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
