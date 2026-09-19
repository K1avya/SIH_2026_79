import React from 'react'

export function LoadingState({ message = 'Loading quantum state...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor: 'var(--q-cyan)',
            borderTopColor: 'transparent',
          }}
        />
        <div
          className="h-5 w-5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
          }}
        />
      </div>
      <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--q-muted)' }}>
        {message}
      </p>
    </div>
  )
}
