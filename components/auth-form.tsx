'use client'

import { useState, type FormEvent } from 'react'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'

type Mode = 'login' | 'register'

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isLogin = mode === 'login'

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Frontend only: simulate a request. Wire this to a backend later.
    setSubmitting(true)
    setTimeout(() => setSubmitting(false), 900)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
          }}
        >
          <span className="font-heading text-lg font-bold text-black">N</span>
        </div>
        <span
          className="font-heading text-xl font-semibold"
          style={{ color: 'var(--q-text)' }}
        >
          NER-LogiQ
        </span>
      </div>

      <div className="mb-8">
        <h2
          className="font-heading text-2xl font-bold"
          style={{ color: 'var(--q-text)' }}
        >
          {isLogin ? 'Welcome back' : 'Create authorized account'}
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--q-muted)' }}>
          {isLogin
            ? 'Sign in to access the NER Smart Logistics Command Center.'
            : 'Register for authorized MDoNER, District, or Field Officer access.'}
        </p>
      </div>

      <div
        className="mb-6 grid grid-cols-2 gap-1 rounded-xl border p-1"
        style={{ borderColor: 'var(--q-line)', background: 'oklch(1 0 0 / 4%)' }}
        role="tablist"
        aria-label="Authentication mode"
      >
        <ToggleButton active={isLogin} onClick={() => setMode('login')}>
          Sign In
        </ToggleButton>
        <ToggleButton active={!isLogin} onClick={() => setMode('register')}>
          Register
        </ToggleButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <Field
            id="name"
            label="Full name"
            type="text"
            placeholder="Ada Lovelace"
            icon={<User className="h-4 w-4" />}
            autoComplete="name"
          />
        )}
        {!isLogin && (
          <Field
            id="role"
            label="I am a"
            type="select"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        )}
        <Field
          id="email"
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: 'var(--q-text)' }}
          >
            Password
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--q-muted)' }}
            >
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full rounded-lg border py-2.5 pl-10 pr-11 text-sm outline-none transition-colors focus:border-[var(--q-cyan)] focus:ring-2 focus:ring-[var(--q-cyan)]/30"
              style={{
                borderColor: 'var(--q-line)',
                background: 'var(--q-bg-deep)',
                color: 'var(--q-text)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 transition-colors hover:text-[var(--q-cyan)]"
              style={{ color: 'var(--q-muted)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {isLogin ? (
          <div className="flex items-center justify-between text-sm">
            <label
              className="flex cursor-pointer items-center gap-2"
              style={{ color: 'var(--q-muted)' }}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--q-line)] accent-[var(--q-violet)]"
              />
              Remember me
            </label>
            <a
              href="#"
              className="font-medium transition-colors hover:underline"
              style={{ color: 'var(--q-cyan)' }}
            >
              Forgot password?
            </a>
          </div>
        ) : (
          <label
            className="flex cursor-pointer items-start gap-2 text-sm"
            style={{ color: 'var(--q-muted)' }}
          >
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 rounded border-[var(--q-line)] accent-[var(--q-violet)]"
            />
            <span>
              I agree to the{' '}
              <a
                href="#"
                className="font-medium hover:underline"
                style={{ color: 'var(--q-cyan)' }}
              >
                Terms
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium hover:underline"
                style={{ color: 'var(--q-cyan)' }}
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{
            background:
              'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
          }}
        >
          {submitting
            ? 'Please wait…'
            : isLogin
              ? 'Sign In'
              : 'Create Account'}
          {!submitting && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: 'var(--q-line)' }} />
        <span className="text-xs" style={{ color: 'var(--q-muted)' }}>
          or continue with
        </span>
        <span className="h-px flex-1" style={{ background: 'var(--q-line)' }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Google" />
        <SocialButton label="GitHub" />
      </div>

      <p className="mt-8 text-center text-sm" style={{ color: 'var(--q-muted)' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setMode(isLogin ? 'register' : 'login')}
          className="font-semibold transition-colors hover:underline"
          style={{ color: 'var(--q-cyan)' }}
        >
          {isLogin ? 'Register now' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="rounded-lg py-2 text-sm font-medium transition-all"
      style={
        active
          ? {
              background:
                'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              color: '#000',
            }
          : { color: 'var(--q-muted)', background: 'transparent' }
      }
    >
      {children}
    </button>
  )
}

function Field({
  id,
  label,
  type,
  placeholder,
  icon,
  autoComplete,
}: {
  id: string
  label: string
  type: string
  placeholder?: string
  icon: React.ReactNode
  autoComplete?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
        style={{ color: 'var(--q-text)' }}
      >
        {label}
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--q-muted)' }}
        >
          {icon}
        </span>
        {type === 'select' ? (
          <select
            id={id}
            name={id}
            defaultValue="student"
            className="w-full appearance-none rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--q-cyan)] focus:ring-2 focus:ring-[var(--q-cyan)]/30"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg-deep)',
              color: 'var(--q-text)',
            }}
          >
            <option value="district_admin">District Administrator (DC / MDoNER)</option>
            <option value="field_officer">Field Officer (Ground Verification)</option>
            <option value="transport_operator">Transport Operator / Driver</option>
            <option value="disaster_response">Disaster Response Team (SDRF / NDRF)</option>
            <option value="system_admin">System Administrator</option>
          </select>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            required
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--q-cyan)] focus:ring-2 focus:ring-[var(--q-cyan)]/30"
            style={{
              borderColor: 'var(--q-line)',
              background: 'var(--q-bg-deep)',
              color: 'var(--q-text)',
            }}
          />
        )}
      </div>
    </div>
  )
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-lg border py-2.5 text-sm font-medium transition-colors hover:border-[var(--q-cyan)]"
      style={{
        borderColor: 'var(--q-line)',
        background: 'oklch(1 0 0 / 4%)',
        color: 'var(--q-text)',
      }}
    >
      {label}
    </button>
  )
}
