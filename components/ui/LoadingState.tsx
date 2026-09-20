import React from 'react'
import { Skeleton } from './Skeleton'

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="w-full space-y-4 p-4">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <p className="text-center text-xs font-medium text-zinc-400">
        {message}
      </p>
    </div>
  )
}
