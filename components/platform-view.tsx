'use client'

import React from 'react'
import { useLogistics } from '@/context/logistics-context'
import { PlatformHeader } from '@/components/platform-header'
import { AdminDashboard } from '@/components/modules/admin-dashboard'
import { GisMapView } from '@/components/modules/gis-map-view'
import { AiPredictionEngine } from '@/components/modules/ai-prediction-engine'
import { RoutePlanner } from '@/components/modules/route-planner'
import { VehicleTracking } from '@/components/modules/vehicle-tracking'
import { IncidentReporting } from '@/components/modules/incident-reporting'
import { AlertsCenter } from '@/components/modules/alerts-center'
import { Starfield } from '@/components/starfield'

export function PlatformView() {
  const { activeModule } = useLogistics()

  return (
    <div
      className="quantum relative min-h-screen overflow-hidden text-[var(--q-text)]"
      style={{ background: 'var(--q-bg)' }}
    >
      <Starfield className="pointer-events-none fixed inset-0 z-0 opacity-40" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PlatformHeader />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {activeModule === 'admin_dashboard' && <AdminDashboard />}
          {activeModule === 'gis_map' && <GisMapView />}
          {activeModule === 'ai_prediction' && <AiPredictionEngine />}
          {activeModule === 'route_planner' && <RoutePlanner />}
          {activeModule === 'vehicle_tracking' && <VehicleTracking />}
          {activeModule === 'incident_report' && <IncidentReporting />}
          {activeModule === 'alerts' && <AlertsCenter />}
        </main>

        <footer
          className="border-t py-6 text-center text-xs backdrop-blur-md"
          style={{
            borderColor: 'var(--q-line)',
            background: 'color-mix(in oklch, var(--q-bg-deep) 85%, transparent)',
            color: 'var(--q-muted)',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>NER-LogiQ Intelligence</strong> &bull; Ministry of Development of North Eastern Region (MDoNER)
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              Problem Statement ID: SIH26002 &bull; IEEE 830 Specification Compliant
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
