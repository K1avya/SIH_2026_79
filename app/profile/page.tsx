'use client'

import React, { useState } from 'react'
import { User, Mail, GraduationCap, Target, Trophy, Award, Edit3, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [educationLevel, setEducationLevel] = useState(user.educationLevel)

  const handleSave = () => {
    updateUser({ name, email, educationLevel })
    setEditing(false)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl py-4 space-y-8">
        {/* Profile Banner */}
        <div
          className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
          style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-black shadow-2xl"
              style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-xs text-[var(--q-muted)] mt-0.5">{user.email}</p>
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-0.5 text-xs font-semibold">
                  Level: {user.level}
                </span>
                <span className="rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 text-xs font-semibold uppercase">
                  Role: {user.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            style={{ borderColor: 'var(--q-line)' }}
          >
            <Edit3 className="h-4 w-4 text-[var(--q-cyan)]" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Statistics Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Box 1: Learner Credentials */}
          <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <h3 className="font-heading text-base font-bold text-white border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              Learner Profile Credentials
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--q-line)' }}>
                <span className="text-[var(--q-muted)]">Education Level:</span>
                <span className="font-semibold text-white">{user.educationLevel}</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--q-line)' }}>
                <span className="text-[var(--q-muted)]">Quantum Experience:</span>
                <span className="font-semibold text-white">{user.quantumExperience}</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--q-line)' }}>
                <span className="text-[var(--q-muted)]">Diagnostic Status:</span>
                <span className="font-semibold text-emerald-400">Assessment Verified</span>
              </div>
            </div>
          </div>

          {/* Box 2: Learning Goals */}
          <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <h3 className="font-heading text-base font-bold text-white border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
              Primary Learning Goals
            </h3>

            <div className="space-y-2">
              {user.learningGoals.map((g) => (
                <div key={g} className="flex items-center gap-2 text-xs font-semibold text-cyan-200 rounded-xl border p-2.5" style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.02)' }}>
                  <Check className="h-4 w-4 text-[var(--q-cyan)]" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Profile Edit */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setEditing(false)}>
            <div className="w-full max-w-md rounded-3xl border p-6 space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <h3 className="font-heading text-base font-bold text-white">Edit Learner Profile</h3>
                <button onClick={() => setEditing(false)}><X className="h-5 w-5 text-slate-400" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border py-2.5 px-3 text-sm text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  />
                </div>
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border py-2.5 px-3 text-sm text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button onClick={() => setEditing(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold text-[var(--q-muted)]" style={{ borderColor: 'var(--q-line)' }}>Cancel</button>
                <button onClick={handleSave} className="rounded-xl px-5 py-2 text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
