'use client'

import React from 'react'
import Link from 'next/link'
import {
  Compass,
  Trophy,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  Cpu,
  Bot,
  Library,
  AlertTriangle,
  PlayCircle,
  Activity,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { DASHBOARD_ANALYTICS } from '@/lib/mock/dashboard'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl py-4 space-y-8">
        {/* Welcome Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Quantum Workspace Active
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Here is your quantum learning summary for today. Keep up the 7-day streak!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: 'var(--q-line)' }}
            >
              <Cpu className="h-4 w-4 text-[var(--q-cyan)]" />
              <span>Launch Simulator</span>
            </Link>

            <Link
              href="/path"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              <Compass className="h-4 w-4" />
              <span>Resume Path</span>
            </Link>
          </div>
        </div>

        {/* Stats Row Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border p-5 backdrop-blur-xl space-y-1" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
              <span>Current Level</span>
              <Trophy className="h-4 w-4 text-violet-400" />
            </div>
            <p className="font-heading text-2xl font-bold text-white">{user.level}</p>
            <p className="text-[11px] text-cyan-400 font-medium">Diagnostic Assessment Verified</p>
          </div>

          <div className="rounded-3xl border p-5 backdrop-blur-xl space-y-1" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
              <span>Overall Curriculum</span>
              <Compass className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="font-heading text-2xl font-bold text-white">{user.overallProgress}%</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 mt-2">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${user.overallProgress}%` }} />
            </div>
          </div>

          <div className="rounded-3xl border p-5 backdrop-blur-xl space-y-1" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
              <span>Active Streak</span>
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
            <p className="font-heading text-2xl font-bold text-amber-300">{user.streak} Days</p>
            <p className="text-[11px] text-amber-400 font-medium">🔥 Top 5% Learner Consistency</p>
          </div>

          <div className="rounded-3xl border p-5 backdrop-blur-xl space-y-1" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
              <span>Quiz Accuracy</span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-heading text-2xl font-bold text-emerald-300">{user.quizAverage}%</p>
            <p className="text-[11px] text-emerald-400 font-medium">Above Class Average (72%)</p>
          </div>
        </div>

        {/* Hero Next Recommended Topic Banner & Weak Area Alert */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Next Topic Hero Card (2 cols) */}
          <div
            className="lg:col-span-2 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-6"
            style={{
              borderColor: 'color-mix(in oklch, var(--q-cyan) 40%, transparent)',
              background: 'linear-gradient(135deg, color-mix(in oklch, var(--q-bg-deep) 90%, transparent), color-mix(in oklch, var(--q-violet) 25%, transparent))',
              boxShadow: '0 0 40px color-mix(in oklch, var(--q-violet) 15%, transparent)',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 text-xs font-bold">
                  Recommended Next Focus
                </span>
                <span className="text-xs text-[var(--q-muted)]">
                  Est. {DASHBOARD_ANALYTICS.nextRecommendedTopic.estimatedTime}
                </span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {DASHBOARD_ANALYTICS.nextRecommendedTopic.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {DASHBOARD_ANALYTICS.nextRecommendedTopic.reason}
              </p>
            </div>

            <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--q-line)' }}>
              <span className="text-xs font-semibold text-cyan-300">Category: {DASHBOARD_ANALYTICS.nextRecommendedTopic.category}</span>
              <Link
                href={`/topic/${DASHBOARD_ANALYTICS.nextRecommendedTopic.id}`}
                className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Weak Topics Alert Card (1 col) */}
          <div className="rounded-3xl border p-6 backdrop-blur-xl flex flex-col justify-between space-y-4" style={{ borderColor: 'color-mix(in oklch, #F59E0B 40%, transparent)', background: 'color-mix(in oklch, #F59E0B 8%, transparent)' }}>
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-heading text-base font-bold text-white">Focus Revision Topics</h3>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your diagnostic assessment identified <strong>Circuit Design</strong> and <strong>Quantum Algorithms</strong> as key areas requiring practice.
              </p>
            </div>

            <div className="space-y-2">
              {user.weakTopics.map((wt) => (
                <div key={wt} className="rounded-xl border border-amber-500/30 bg-black/30 p-2.5 text-xs font-semibold text-amber-300 flex justify-between items-center">
                  <span>{wt}</span>
                  <span className="text-[10px] text-amber-400">Needs Practice</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart 1: Progress History */}
          <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--q-cyan)]" />
                Weekly Learning Progress
              </h3>
              <span className="text-xs text-[var(--q-muted)]">Last 7 Days</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DASHBOARD_ANALYTICS.progressHistory}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--q-cyan)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--q-cyan)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="var(--q-muted)" fontSize={11} />
                  <YAxis stroke="var(--q-muted)" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="progress" stroke="var(--q-cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Performance */}
          <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-[var(--q-violet)]" />
                Category Performance (%)
              </h3>
              <span className="text-xs text-[var(--q-muted)]">5 Diagnostic Categories</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DASHBOARD_ANALYTICS.categoryPerformance}>
                  <XAxis dataKey="category" stroke="var(--q-muted)" fontSize={10} />
                  <YAxis stroke="var(--q-muted)" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {DASHBOARD_ANALYTICS.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? 'var(--q-cyan)' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
          <h3 className="font-heading text-base font-bold text-white">Recent Learning Timeline</h3>
          <div className="space-y-3">
            {DASHBOARD_ANALYTICS.recentActivity.map((act) => (
              <div key={act.id} className="flex items-center justify-between rounded-2xl border p-3.5 text-xs" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-4 w-4 text-[var(--q-cyan)] shrink-0" />
                  <span className="font-semibold text-white">{act.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-white/5 px-2 py-0.5 font-bold text-cyan-300">{act.score}</span>
                  <span className="text-[var(--q-muted)]">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
