'use client'

import React, { useState } from 'react'
import {
  User,
  GraduationCap,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Atom,
} from 'lucide-react'
import { useQuantify } from '@/context/quantify-context'

export function OnboardingModule() {
  const { userProfile, updateProfile, setActiveTab } = useQuantify()

  const [name, setName] = useState(userProfile.name)
  const [educationLevel, setEducationLevel] = useState(userProfile.educationLevel)
  const [learningGoal, setLearningGoal] = useState(userProfile.learningGoal)
  const [quantumNote, setQuantumNote] = useState(
    'Familiar with basic linear algebra and Python programming. Looking to understand quantum gates and algorithms.'
  )
  const [step, setStep] = useState(1)

  function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({
      name,
      educationLevel,
      learningGoal,
    })
    setActiveTab('assessment')
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl text-center"
        style={{
          borderColor: 'var(--q-line)',
          background: 'radial-gradient(circle at 50% 20%, color-mix(in oklch, var(--q-violet) 25%, transparent), var(--q-bg-deep))',
        }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 mb-3">
          <Atom className="h-7 w-7" />
        </div>

        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
          Learner Onboarding (Screen 4.3)
        </span>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-3">
          Personalize Your Quantum Journey
        </h1>
        <p className="mt-2 text-xs text-zinc-300 max-w-2xl mx-auto">
          Tell us about your background and goals so Quantify can optimize your 10-question diagnostic test and learning path.
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className={`h-2 rounded-full transition-all ${step === 1 ? 'w-12 bg-cyan-400' : 'w-3 bg-zinc-700'}`} />
          <span className={`h-2 rounded-full transition-all ${step === 2 ? 'w-12 bg-cyan-400' : 'w-3 bg-zinc-700'}`} />
        </div>
      </div>

      {/* Form Card */}
      <div
        className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)',
        }}
      >
        <form onSubmit={handleComplete} className="space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-cyan-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ada Lovelace"
                  className="w-full rounded-xl border border-zinc-700 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-cyan-400" /> Current Academic / Professional Background
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="Undergraduate Computer Science">Undergraduate Computer Science / Engineering</option>
                  <option value="Physics / Mathematics Student">Physics / Mathematics Major</option>
                  <option value="Software Developer">Software Engineer exploring Quantum Programming</option>
                  <option value="Postgraduate / Researcher">Postgraduate / PhD Researcher</option>
                  <option value="Curious Self-Learner">Self-Taught Quantum Enthusiast</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                  }}
                >
                  <span>Continue to Learning Goals</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-purple-400" /> Primary Quantum Learning Goal
                </label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="Master Quantum Circuit Design & Quantum Algorithms">
                    Master Quantum Circuit Design & Quantum Algorithms (Comprehensive)
                  </option>
                  <option value="Learn Qiskit Programming for Industry">
                    Learn Quantum Software Development (Qiskit / SDKs)
                  </option>
                  <option value="Prepare for Quantum Research / Academia">
                    Academic Research & Mathematical Quantum Physics
                  </option>
                  <option value="Explore Fundamentals from Scratch">
                    Grasp Core Conceptual Foundations (Intuitive Track)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Prior Math & Physics Exposure (Optional)
                </label>
                <textarea
                  rows={3}
                  value={quantumNote}
                  onChange={(e) => setQuantumNote(e.target.value)}
                  placeholder="e.g. Familiar with matrix multiplication and complex numbers..."
                  className="w-full rounded-xl border border-zinc-700 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-black transition-all hover:scale-105 shadow-[0_0_20px_color-mix(in oklch,var(--q-cyan)35%,transparent)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Save Profile & Start 10-Q Assessment</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
