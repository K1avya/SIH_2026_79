'use client'

import React from 'react'
import { useQuantify } from '@/context/quantify-context'
import { QuantifyHeader } from '@/components/quantify-header'
import { QuantifyOverview } from '@/components/modules/quantify-overview'
import { DiagnosticAssessment } from '@/components/modules/diagnostic-assessment'
import { AssessmentResult } from '@/components/modules/assessment-result'
import { LearningPath } from '@/components/modules/learning-path'
import { TopicLearning } from '@/components/modules/topic-learning'
import { CircuitSimulator } from '@/components/modules/circuit-simulator'
import { QuantaAiTutor } from '@/components/modules/quanta-ai-tutor'
import { BookRecommendations } from '@/components/modules/book-recommendations'
import { ProgressDashboard } from '@/components/modules/progress-dashboard'
import { AdminQuantify } from '@/components/modules/admin-quantify'
import { OnboardingModule } from '@/components/modules/onboarding-module'
import { ResourceLibrary } from '@/components/modules/resource-library'
import { QuantifyAuth } from '@/components/modules/quantify-auth'
import { Starfield } from '@/components/starfield'

export function QuantifyView() {
  const { activeTab } = useQuantify()

  return (
    <div
      className="quantum relative min-h-screen overflow-hidden text-[var(--q-text)]"
      style={{ background: 'var(--q-bg)' }}
    >
      <Starfield className="pointer-events-none fixed inset-0 z-0 opacity-40" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <QuantifyHeader />

        <main className="w-full flex-1 px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
          {activeTab === 'overview' && <QuantifyOverview />}
          {activeTab === 'login' && <QuantifyAuth />}
          {activeTab === 'onboarding' && <OnboardingModule />}
          {activeTab === 'assessment' && <DiagnosticAssessment />}
          {activeTab === 'result' && <AssessmentResult />}
          {activeTab === 'learning_path' && <LearningPath />}
          {activeTab === 'topic_learning' && <TopicLearning />}
          {activeTab === 'resource_library' && <ResourceLibrary />}
          {activeTab === 'circuit_simulator' && <CircuitSimulator />}
          {activeTab === 'ai_tutor' && <QuantaAiTutor />}
          {activeTab === 'books' && <BookRecommendations />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'admin' && <AdminQuantify />}
        </main>

        <footer
          className="border-t py-6 text-center text-xs backdrop-blur-md"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
            color: 'var(--q-muted)',
          }}
        >
          <div className="w-full px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>QUANTIFY</strong> &bull; AI-Based Interactive Quantum Algorithm Learning Platform
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              Smart India Hackathon 2026 &bull; Problem Statement ID: SIH26140
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
