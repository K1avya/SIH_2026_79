import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', style, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${className}`}
      style={style}
      {...props}
    />
  )
}
