'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/theme-context'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      style={{
        borderColor: 'var(--q-line)',
        background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        color: 'var(--q-text)',
        boxShadow: '0 2px 8px color-mix(in oklch, var(--q-cyan) 15%, transparent)',
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark and light theme"
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-90 scale-0 opacity-0 absolute'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        }`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100 text-cyan-300'
            : '-rotate-90 scale-0 opacity-0 absolute'
        }`}
      />
    </button>
  )
}
