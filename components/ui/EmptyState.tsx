import React from 'react'
import { Inbox, RefreshCw } from 'lucide-react'

export function EmptyState({
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  actionLabel,
  onAction,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border p-10 text-center"
      style={{
        borderColor: 'var(--q-line)',
        background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
      }}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: 'color-mix(in oklch, var(--q-violet) 15%, transparent)',
          color: 'var(--q-cyan)',
        }}
      >
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-[var(--q-text)]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[var(--q-muted)]">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
            color: 'var(--q-bg-deep)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ErrorState({
  message = 'Something went wrong while fetching data.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center"
      style={{
        borderColor: 'color-mix(in oklch, #EF4444 30%, transparent)',
        background: 'color-mix(in oklch, #EF4444 8%, transparent)',
      }}
    >
      <p className="text-sm font-medium text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          style={{ borderColor: 'var(--q-line)' }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
      )}
    </div>
  )
}
