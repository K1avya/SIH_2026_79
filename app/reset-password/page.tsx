'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/backend/supabase-client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const desc = query.get('error_description') || hash.get('error_description')
    if (desc) {
      setLinkError(desc.replace(/\+/g, ' '))
      return
    }

    let timer: NodeJS.Timeout

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true)
      } else {
        timer = setTimeout(() => {
          setReady((prevReady) => {
            if (!prevReady) {
              setLinkError('No active reset link detected. Please request a new password reset link.')
            }
            return prevReady
          })
        }, 1500)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.')
      setSubmitting(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        setSubmitting(false)
        return
      }

      document.cookie = 'quantify_session=active; path=/; max-age=604800; SameSite=Lax'
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main
      className="quantum flex min-h-screen items-center justify-center p-6"
      style={{ background: 'var(--q-bg)', color: 'var(--q-text)' }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 backdrop-blur-2xl shadow-2xl space-y-6"
        style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl font-heading text-lg font-bold text-black"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            Q
          </div>
          <span className="font-heading text-xl font-semibold text-white">Quantica</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Set New Password</h2>
          <p className="mt-1 text-sm text-[var(--q-muted)]">
            Create a new secure password for your Quantica account.
          </p>
        </div>

        {linkError ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {linkError}. <a href="/login" className="underline">Request a new reset link</a>
          </div>
        ) : !ready ? (
          <p className="text-sm text-[var(--q-muted)]">Verifying your reset link…</p>
        ) : (
          <>
            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300">
                {error}
              </div>
            )}

            {success ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <h4 className="font-heading font-bold text-emerald-300 text-sm">Password Updated!</h4>
                <p className="text-xs text-emerald-200/80">
                  Your password has been changed successfully. Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--q-muted)]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border py-2.5 pl-10 pr-11 text-sm text-white outline-none transition-colors focus:border-[var(--q-cyan)]"
                      style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--q-muted)] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-white">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--q-muted)]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border py-2.5 pl-10 pr-11 text-sm text-white outline-none transition-colors focus:border-[var(--q-cyan)]"
                      style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  {submitting ? 'Updating Password...' : 'Update Password'}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  )
}

