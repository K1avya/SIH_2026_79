'use client'

import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration: number = 1200, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || target <= 0) return

    let startTime: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic formula: 1 - (1 - progress)^3
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOutProgress * target))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [target, duration, start])

  return count
}
