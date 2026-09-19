export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  align?: 'center' | 'left'
}) {
  const isCenter = align === 'center'

  return (
    <div className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--q-cyan)' }}
        >
          {eyebrow}
        </span>
      )}

      <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}{' '}
        {highlight && (
          <span
            style={{
              background:
                'linear-gradient(120deg, var(--q-cyan), var(--q-violet))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p
          className={`mt-4 text-pretty leading-relaxed ${isCenter ? 'mx-auto' : ''}`}
          style={{ color: 'var(--q-muted)' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
