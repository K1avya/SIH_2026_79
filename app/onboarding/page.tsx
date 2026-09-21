'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, GraduationCap, Compass, Target, Sparkles, BookOpen } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'
import { supabase } from '@/backend/supabase-client'

const EDUCATION_LEVELS = [
  { id: 'School', title: 'High School Student', desc: 'Starting early with physics & maths' },
  { id: 'Undergraduate', title: 'Undergraduate Student', desc: 'B.Tech / B.Sc in CS, Physics, or Engineering' },
  { id: 'Postgraduate', title: 'Postgraduate / Master', desc: 'M.Tech / M.Sc specializing in computing or physics' },
  { id: 'Researcher', title: 'PhD / Researcher', desc: 'Academic or industrial quantum research' },
  { id: 'Professional', title: 'Industry Professional', desc: 'Software developer, engineer, or tech lead' },
]

const EXPERIENCE_LEVELS = [
  { id: 'Complete beginner', title: 'Complete Beginner', desc: 'No prior quantum physics or computing background' },
  { id: 'Some basic knowledge', title: 'Some Basic Knowledge', desc: 'Familiar with classical bits and basic linear algebra' },
  { id: 'Intermediate', title: 'Intermediate Learner', desc: 'Understand qubits, superposition, and basic gates' },
  { id: 'Advanced', title: 'Advanced Practitioner', desc: 'Hands-on experience with Qiskit, Cirq, or quantum algorithms' },
]

const LEARNING_GOALS = [
  'Learn quantum computing fundamentals',
  'Learn quantum algorithms',
  'Build & simulate quantum circuits',
  'Prepare for university exams',
  'Quantum programming (Qiskit/PennyLane)',
  'Academic & industry research',
  'Quantum career preparation',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(1)

  const [educationLevel, setEducationLevel] = useState(user.educationLevel || 'Undergraduate')
  const [quantumExperience, setQuantumExperience] = useState(user.quantumExperience || 'Some basic knowledge')
  const [goals, setGoals] = useState<string[]>(user.learningGoals || ['Learn quantum algorithms', 'Build & simulate quantum circuits'])

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleComplete = async () => {
    const updates = {
      educationLevel,
      quantumExperience,
      learningGoals: goals,
      onboardingCompleted: true,
    }
    updateUser(updates)

    try {
      await supabase.from('profiles').update(updates).eq('id', user.id)
    } catch (err) {
      console.error('Failed to save onboarding data:', err)
    }

    router.push('/assessment')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-6">
        {/* Onboarding Header */}
        <div className="mb-8 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: 'color-mix(in oklch, var(--q-cyan) 15%, transparent)',
              color: 'var(--q-cyan)',
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Step {step} of 3 — Learner Setup
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
            Welcome to Quantify
          </h1>
          <p className="mt-2 text-sm text-[var(--q-muted)]">
            Personalize your AI-driven quantum learning roadmap in 3 quick steps.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs font-semibold text-[var(--q-muted)] mb-2">
            <span className={step >= 1 ? 'text-[var(--q-cyan)]' : ''}>1. Education</span>
            <span className={step >= 2 ? 'text-[var(--q-cyan)]' : ''}>2. Experience</span>
            <span className={step >= 3 ? 'text-[var(--q-cyan)]' : ''}>3. Goals</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(step / 3) * 100}%`,
                background: 'linear-gradient(90deg, var(--q-cyan), var(--q-violet))',
              }}
            />
          </div>
        </div>

        {/* Step 1: Education Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white">
              <GraduationCap className="h-4 w-4 text-[var(--q-cyan)]" />
              <span>What is your current education background?</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {EDUCATION_LEVELS.map((item) => {
                const selected = educationLevel === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setEducationLevel(item.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-[var(--q-cyan)] bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                        : 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="font-heading font-semibold text-white text-base">{item.title}</p>
                      <p className="text-xs text-[var(--q-muted)] mt-0.5">{item.desc}</p>
                    </div>
                    {selected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--q-cyan)] text-black">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Continue to Experience</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quantum Experience */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white">
              <Compass className="h-4 w-4 text-[var(--q-cyan)]" />
              <span>What is your current quantum computing experience?</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {EXPERIENCE_LEVELS.map((item) => {
                const selected = quantumExperience === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setQuantumExperience(item.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-[var(--q-cyan)] bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                        : 'border-[var(--q-line)] bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="font-heading font-semibold text-white text-base">{item.title}</p>
                      <p className="text-xs text-[var(--q-muted)] mt-0.5">{item.desc}</p>
                    </div>
                    {selected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--q-cyan)] text-black">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-[var(--q-muted)] hover:text-white"
                style={{ borderColor: 'var(--q-line)' }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Continue to Goals</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Learning Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-white">
              <Target className="h-4 w-4 text-[var(--q-cyan)]" />
              <span>Select your primary quantum learning goals:</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {LEARNING_GOALS.map((goal) => {
                const selected = goals.includes(goal)
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? 'border-[var(--q-cyan)] bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'border-[var(--q-line)] bg-white/5 text-[var(--q-muted)] hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {selected && <Check className="h-4 w-4 text-[var(--q-cyan)]" />}
                    <span>{goal}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 rounded-2xl border p-4 text-xs text-[var(--q-muted)]" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              <p className="font-semibold text-white mb-1">🎯 What happens next?</p>
              <p>You will complete a 10-question diagnostic assessment to accurately classify your knowledge level (Beginner, Intermediate, or Advanced) and tailor your learning roadmap.</p>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={() => setStep(2)}
                className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-[var(--q-muted)] hover:text-white"
                style={{ borderColor: 'var(--q-line)' }}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 rounded-xl px-7 py-3.5 font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
                style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
              >
                <span>Start Diagnostic Assessment</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
