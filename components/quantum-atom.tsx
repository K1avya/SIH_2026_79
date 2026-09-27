export function QuantumAtom({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative h-full w-full">
        <div className="q-orbit-1 absolute inset-0 flex items-center justify-center">
          <div
            className="relative rounded-full border"
            style={{
              width: '100%',
              height: '42%',
              borderColor: 'var(--q-cyan)',
              opacity: 0.55,
            }}
          >
            <span
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: 'var(--q-cyan)',
                boxShadow: '0 0 12px var(--q-cyan)',
              }}
            />
          </div>
        </div>
        <div className="q-orbit-2 absolute inset-0 flex items-center justify-center rotate-60">
          <div
            className="relative rounded-full border"
            style={{
              width: '100%',
              height: '42%',
              borderColor: 'var(--q-violet)',
              opacity: 0.55,
            }}
          >
            <span
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: 'var(--q-violet)',
                boxShadow: '0 0 12px var(--q-violet)',
              }}
            />
          </div>
        </div>
        <div className="q-orbit-3 absolute inset-0 flex items-center justify-center -rotate-60">
          <div
            className="relative rounded-full border"
            style={{
              width: '100%',
              height: '42%',
              borderColor: 'var(--q-blue)',
              opacity: 0.55,
            }}
          >
            <span
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: 'var(--q-blue)',
                boxShadow: '0 0 12px var(--q-blue)',
              }}
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="q-nucleus h-10 w-10 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, var(--q-text), var(--q-violet) 55%, var(--q-blue))',
              boxShadow:
                '0 0 30px var(--q-violet), 0 0 60px var(--q-blue)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
