'use client'

import React from 'react'
import {
  Atom,
  Flame,
  GraduationCap,
  Sparkles,
  Cpu,
  Bot,
  BookOpen,
  Trophy,
  Sliders,
  Compass,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  User,
  Layers,
  KeyRound,
  Shield,
  LogIn,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { ActiveTab, UserLevel } from '@/types/quantify'
import { ThemeToggle } from '@/components/theme-toggle'
import { useScrollPosition } from '@/hooks/useScrollPosition'

export function QuantifyHeader() {
  const isScrolled = useScrollPosition(20)
  const {
    activeTab,
    setActiveTab,
    currentUser,
    userLevel,
    streakDays,
    weakCategories,
  } = useQuantify()

  const NAV_TABS: { id: ActiveTab; label: string; fullTitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', fullTitle: 'Overview & Platform Modules', icon: Compass },
    { id: 'login', label: 'Login', fullTitle: 'Authentication & Role Selection (Screen 4.2)', icon: KeyRound },
    { id: 'onboarding', label: 'Onboarding', fullTitle: 'User Onboarding & Profile Setup', icon: User },
    { id: 'assessment', label: '10-Q Test', fullTitle: '10-Question Diagnostic Assessment', icon: GraduationCap },
    { id: 'result', label: 'Result', fullTitle: 'Diagnostic Result & Gap Profiling', icon: CheckCircle2 },
    { id: 'learning_path', label: 'Learning Path', fullTitle: 'Adaptive Learning Path Roadmap', icon: Sparkles },
    { id: 'topic_learning', label: 'Lessons', fullTitle: 'Topic Lessons & Concept Learning', icon: BookOpen },
    { id: 'resource_library', label: 'Resources', fullTitle: 'Resource Library & Cheat Sheets', icon: Layers },
    { id: 'circuit_simulator', label: 'Simulator', fullTitle: 'Quantum Circuit Simulator', icon: Cpu },
    { id: 'ai_tutor', label: 'AI Tutor', fullTitle: 'Quanta AI Quantum Tutor', icon: Bot },
    { id: 'books', label: 'Books', fullTitle: 'Explainable Book Recommendations', icon: BookOpen },
    { id: 'progress', label: 'Progress', fullTitle: 'Progress, Streaks & Badges', icon: Trophy },
    { id: 'admin', label: 'Admin', fullTitle: 'Admin Analytics & Topic Control', icon: Sliders },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-2xl shadow-lg' : 'backdrop-blur-xl'
      }`}
      style={{
        borderColor: 'var(--q-line)',
        background: isScrolled
          ? 'color-mix(in oklch, var(--q-bg-deep) 92%, transparent)'
          : 'color-mix(in oklch, var(--q-bg-deep) 88%, transparent)',
        boxShadow: isScrolled
          ? '0 8px 32px -8px color-mix(in oklch, var(--q-bg-deep) 80%, transparent)'
          : 'none',
      }}
    >
      {/* Top Brand & Status Row - spread across window */}
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                boxShadow: '0 0 24px color-mix(in oklch, var(--q-violet) 60%, transparent)',
              }}
            >
              <Atom className="h-5 w-5 text-black" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold tracking-tight text-white">
                  QUANTIFY
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                    color: 'var(--q-cyan)',
                    border: '1px solid color-mix(in oklch, var(--q-cyan) 35%, transparent)',
                  }}
                >
                  SIH26140
                </span>
              </div>
              <p className="text-[11px] leading-tight text-zinc-400 hidden sm:block">
                AI-Based Interactive Quantum Algorithm Learning Platform
              </p>
            </div>
          </button>
        </div>

        {/* User Status Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Weak Topic Alert Flag */}
          {weakCategories.length > 0 && (
            <button
              onClick={() => setActiveTab('learning_path')}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
              title="Click to view tailored learning path"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Prioritizing Weak Area: <strong>{weakCategories[0].toUpperCase()}</strong></span>
            </button>
          )}

          {/* User Level Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              userLevel === 'beginner'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : userLevel === 'intermediate'
                ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                : 'border-purple-500/40 bg-purple-500/15 text-purple-300'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{userLevel} Level</span>
          </div>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 text-xs font-bold text-amber-400"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg) 80%, transparent)',
            }}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>{streakDays} Days</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Account / Auth Button */}
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 text-xs font-semibold transition-all ${
              currentUser.isAuthenticated
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            }`}
            title={currentUser.isAuthenticated ? `Logged in as ${currentUser.name} (${currentUser.role}) - Click to manage` : 'Sign In to Quantify'}
          >
            {currentUser.role === 'admin' ? (
              <Shield className="h-3.5 w-3.5 text-purple-400" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {currentUser.isAuthenticated ? currentUser.name : 'Sign In'}
            </span>
            {currentUser.isAuthenticated && (
              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] uppercase font-mono text-zinc-300">
                {currentUser.role}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar - Fluid across window */}
      <div className="border-t overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--q-line)' }}>
        <div className="flex w-full items-center justify-start xl:justify-center gap-1.5 px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16 py-2">
          {NAV_TABS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.fullTitle}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, color-mix(in oklch, var(--q-cyan) 25%, transparent), color-mix(in oklch, var(--q-violet) 25%, transparent))',
                        color: 'var(--q-cyan)',
                        border: '1px solid color-mix(in oklch, var(--q-cyan) 40%, transparent)',
                        boxShadow: '0 0 16px color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                      }
                    : {}
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
