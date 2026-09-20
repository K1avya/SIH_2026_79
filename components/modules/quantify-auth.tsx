'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Atom,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogOut,
  Sliders,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'
import { UserRole } from '@/types/quantify'

export function QuantifyAuth() {
  const { currentUser, login, logout, setActiveTab } = useQuantify()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  const isLogin = mode === 'login'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.')
      return
    }

    login(email, selectedRole, name || undefined)
    toast.success(`Authenticated successfully as ${selectedRole.toUpperCase()}!`)
    setAuthSuccessNotice(`Authenticated successfully as ${selectedRole.toUpperCase()}!`)
    setTimeout(() => setAuthSuccessNotice(null), 3000)
  }

  function handleQuickDemo(role: UserRole) {
    if (role === 'admin') {
      setEmail('admin@quantify.edu')
      setPassword('QuantifyAdmin#2026')
      setSelectedRole('admin')
      login('admin@quantify.edu', 'admin', 'Lead Administrator')
    } else {
      setEmail('learner@quantify.edu')
      setPassword('QuantumScholar#2026')
      setSelectedRole('learner')
      login('learner@quantify.edu', 'learner', 'Ada Lovelace')
    }
    toast.success(`Signed in with 1-Click Demo as ${role.toUpperCase()}!`)
    setAuthSuccessNotice(`Signed in with 1-Click Demo Credentials as ${role.toUpperCase()}!`)
    setTimeout(() => setAuthSuccessNotice(null), 3000)
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      toast.error('Please enter a valid email address.')
      return
    }
    toast.success(`Password reset link dispatched to ${forgotEmail}`)
    setForgotSubmitted(true)
    setTimeout(() => {
      setForgotSubmitted(false)
      setForgotModalOpen(false)
      setForgotEmail('')
    }, 2500)
  }

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          borderColor: 'var(--q-line)',
          background: 'radial-gradient(circle at 50% 20%, color-mix(in oklch, var(--q-violet) 25%, transparent), var(--q-bg-deep))',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              boxShadow: '0 0 28px color-mix(in oklch, var(--q-violet) 70%, transparent)',
            }}
          >
            <Atom className="h-7 w-7 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                Screen 4.2
              </span>
              <span className="font-heading text-xl font-bold text-white sm:text-2xl">
                User Authentication & Role Selection
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-300">
              Role-based access control for Smart India Hackathon 2026 &bull; Problem Statement SIH26140.
            </p>
          </div>
        </div>

        {/* Current Session Indicator */}
        {currentUser.isAuthenticated && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-xs">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="font-bold text-emerald-300">Active Session: {currentUser.name}</div>
              <div className="text-[10px] text-zinc-400 font-mono capitalize">
                Role: {currentUser.role} &bull; {currentUser.email}
              </div>
            </div>
            <button
              onClick={logout}
              className="ml-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {authSuccessNotice && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fade-in shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{authSuccessNotice}</span>
        </div>
      )}

      {/* 2-Column Responsive Workstation Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Role Overview & 1-Click Fast Demos (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick 1-Click Demo Logins for Evaluators */}
          <div
            className="rounded-3xl border p-6 backdrop-blur-xl"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="font-heading text-sm font-bold text-white">
                1-Click Evaluator Demo Credentials
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Instant one-click access for SIH judges to test both Learner and Administrator views without filling forms.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('learner')}
                className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 text-left transition-all hover:border-cyan-400 hover:scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 uppercase">
                    Demo
                  </span>
                </div>
                <div className="font-heading text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Demo Learner
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">learner@quantify.edu</p>
                <div className="mt-3 text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                  <span>Sign In as Learner</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-4 text-left transition-all hover:border-purple-400 hover:scale-[1.02] shadow-[0_0_15px_rgba(168,85,247,0.15)] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                    <Shield className="h-4 w-4" />
                  </span>
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-300 uppercase">
                    Demo
                  </span>
                </div>
                <div className="font-heading text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Demo Administrator
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">admin@quantify.edu</p>
                <div className="mt-3 text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                  <span>Sign In as Admin</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Role Explanation Cards */}
          <div
            className="rounded-3xl border p-6 backdrop-blur-xl space-y-4"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-400">
              Role Permissions & Access Matrix
            </h4>

            <div className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-white">
                <GraduationCap className="h-4 w-4 text-cyan-400" />
                <span>Quantum Learner Role (Section 4.1)</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Personalized 10-Q diagnostic assessments, real-time quantum state-vector simulation, personalized curriculum roadmaps, and grounded Quanta AI dialogue.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-white">
                <Sliders className="h-4 w-4 text-purple-400" />
                <span>Platform Administrator Role (Section 4.2)</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Live level cutoff threshold adjustments (Beginner/Intermediate ceilings), platform telemetry distributions, and diagnostic question bank inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Form (7 cols) */}
        <div className="lg:col-span-7">
          <div
            className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
            style={{
              borderColor: 'var(--q-line)',
              background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
            }}
          >
            {/* Mode Switcher Tabs */}
            <div
              className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border p-1"
              style={{ borderColor: 'var(--q-line)', background: 'black' }}
            >
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In to Platform
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-[var(--q-cyan)] to-[var(--q-violet)] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Register New Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Toggle */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  Select Operating Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('learner')}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                      selectedRole === 'learner'
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-zinc-800 bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <GraduationCap className={`h-4 w-4 ${selectedRole === 'learner' ? 'text-cyan-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="text-xs font-bold">Learner</div>
                      <div className="text-[10px] text-zinc-400">Student & Researcher</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-500 bg-purple-950/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'border-zinc-800 bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Shield className={`h-4 w-4 ${selectedRole === 'admin' ? 'text-purple-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="text-xs font-bold">Administrator</div>
                      <div className="text-[10px] text-zinc-400">Curriculum & Telemetry</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Field (for Register Mode) */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-cyan-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Erwin Schrödinger"
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@university.edu"
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-400" /> Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3.5 py-2.5 pr-10 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-black text-cyan-500 focus:ring-0"
                />
                <label htmlFor="rememberMe" className="text-xs text-zinc-400 cursor-pointer">
                  Remember my session on this device
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-black transition-all hover:scale-[1.01] shadow-[0_0_24px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                  }}
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{isLogin ? 'Sign In to Quantum Portal' : 'Register & Launch Diagnostic'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* SSO / Institutional Provider Option */}
              <div className="pt-4 border-t text-center" style={{ borderColor: 'var(--q-line)' }}>
                <div className="text-[10px] uppercase font-bold text-zinc-500 mb-3">Or Authenticate With</div>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('learner')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:border-zinc-700 transition-colors"
                >
                  <Atom className="h-4 w-4 text-cyan-300" />
                  <span>Sign In with Institutional ID / Edu SSO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl border p-6 backdrop-blur-xl animate-fade-in"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg-deep)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-cyan-400" />
                <span>Reset Account Password</span>
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Password reset link transmitted to <strong>{forgotEmail}</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter your registered institutional email address. We will transmit an encrypted recovery token.
                </p>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="learner@university.edu"
                    className="w-full rounded-xl border border-zinc-700 bg-black/60 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2 text-xs font-bold text-black"
                    style={{
                      background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                    }}
                  >
                    Send Recovery Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
