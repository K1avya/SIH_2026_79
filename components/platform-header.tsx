'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  Map,
  BrainCircuit,
  Navigation,
  Truck,
  Camera,
  Bell,
  BarChart3,
  Globe,
  Radio,
  WifiOff,
  UserCheck,
  ChevronDown,
  AlertOctagon,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { ActiveModule, Language, UserRole } from '@/types/logistics'
import { ThemeToggle } from '@/components/theme-toggle'
import { useScrollPosition } from '@/hooks/useScrollPosition'

export function PlatformHeader() {
  const isScrolled = useScrollPosition(20)
  const {
    activeModule,
    setActiveModule,
    activeRole,
    setRole,
    language,
    setLanguage,
    emergencyMode,
    toggleEmergencyMode,
    offlineMode,
    toggleOfflineMode,
    pendingOfflineReports,
    alerts,
    t,
  } = useLogistics()

  const [roleOpen, setRoleOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length

  const NAV_ITEMS: { id: ActiveModule; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'admin_dashboard', label: t.navAdmin, icon: BarChart3 },
    { id: 'gis_map', label: t.navGISMap, icon: Map },
    { id: 'ai_prediction', label: t.navAIPrediction, icon: BrainCircuit },
    { id: 'route_planner', label: t.navRoutePlanner, icon: Navigation },
    { id: 'vehicle_tracking', label: t.navFleetTracking, icon: Truck },
    { id: 'incident_report', label: t.navFieldReport, icon: Camera },
    { id: 'alerts', label: t.navAlerts, icon: Bell },
  ]

  const ROLES: { id: UserRole; label: string; badge: string }[] = [
    { id: 'district_admin', label: t.roleDistrictAdmin, badge: 'MDoNER / DC' },
    { id: 'field_officer', label: t.roleFieldOfficer, badge: 'Ground Staff' },
    { id: 'transport_operator', label: t.roleTransportOperator, badge: 'Fleet Lead' },
    { id: 'disaster_response', label: t.roleDisasterResponse, badge: 'SDRF / NDRF' },
    { id: 'system_admin', label: t.roleSystemAdmin, badge: 'Platform Root' },
  ]

  const LANGUAGES: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English (EN)', flag: '🌐' },
    { id: 'hi', label: 'हिंदी (HI)', flag: '🇮🇳' },
    { id: 'as', label: 'অসমীয়া (AS)', flag: '🌿' },
  ]

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0]

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
      {/* Top Banner: Emergency & Offline status */}
      {(emergencyMode || offlineMode) && (
        <div className={`px-4 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors ${
          emergencyMode ? 'bg-rose-950/90 text-rose-300 border-b border-rose-800/60' : 'bg-amber-950/90 text-amber-300 border-b border-amber-800/60'
        }`}>
          <div className="flex items-center gap-2">
            {emergencyMode ? (
              <>
                <AlertOctagon className="h-3.5 w-3.5 animate-pulse text-rose-400" />
                <span>{t.emergencyActive} — {t.emergencyDesc}</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.offlineBanner} ({pendingOfflineReports.length} {t.pendingSync})</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {emergencyMode && (
              <button
                onClick={toggleEmergencyMode}
                className="underline hover:text-rose-100 text-[11px]"
              >
                Deactivate Emergency View
              </button>
            )}
            {offlineMode && (
              <button
                onClick={toggleOfflineMode}
                className="underline hover:text-amber-100 text-[11px]"
              >
                Switch to Online
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Gov Problem Info */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))',
              boxShadow: '0 0 24px color-mix(in oklch, var(--q-violet) 60%, transparent)',
            }}
          >
            <Radio className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                NER-LogiQ
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                  color: 'var(--q-cyan)',
                  border: '1px solid color-mix(in oklch, var(--q-cyan) 35%, transparent)',
                }}
              >
                SIH26002
              </span>
            </div>
            <p className="text-[11px] leading-tight hidden sm:block" style={{ color: 'var(--q-muted)' }}>
              MDoNER • North Eastern Region Intelligence
            </p>
          </div>
        </div>

        {/* Global Controls: Emergency Toggle, Offline Simulation, Role, Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Lifeline Trigger */}
          <button
            onClick={toggleEmergencyMode}
            title="Toggle Disaster Lifeline Mode"
            className={`hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              emergencyMode
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                : 'border hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-300'
            }`}
            style={!emergencyMode ? { borderColor: 'var(--q-line)' } : undefined}
          >
            <ShieldAlert className={`h-3.5 w-3.5 ${emergencyMode ? 'text-rose-400' : 'text-zinc-400'}`} />
            <span>Emergency Mode</span>
          </button>

          {/* Offline Simulation Toggle */}
          <button
            onClick={toggleOfflineMode}
            title="Toggle Field Offline Simulation"
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              offlineMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                : 'border text-zinc-300 hover:border-amber-400/50'
            }`}
            style={!offlineMode ? { borderColor: 'var(--q-line)' } : undefined}
          >
            <WifiOff className="h-3.5 w-3.5" />
            <span>{offlineMode ? 'Offline' : 'Online'}</span>
            {pendingOfflineReports.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-black">
                {pendingOfflineReports.length}
              </span>
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:border-[var(--q-cyan)]"
              style={{
                borderColor: 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg) 75%, transparent)',
                color: 'var(--q-text)',
              }}
            >
              <UserCheck className="h-3.5 w-3.5" style={{ color: 'var(--q-cyan)' }} />
              <span className="max-w-[110px] truncate hidden md:inline">{currentRole.label}</span>
              <span className="md:hidden text-[11px] font-bold">{currentRole.badge}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {roleOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl z-50"
                style={{
                  borderColor: 'var(--q-line)',
                  background: 'var(--q-bg-deep)',
                }}
              >
                <div className="px-2 py-1.5 text-[10px] uppercase font-semibold text-zinc-400 border-b mb-1" style={{ borderColor: 'var(--q-line)' }}>
                  Active Stakeholder Persona (NFR-7)
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id)
                      setRoleOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      activeRole === r.id
                        ? 'bg-[var(--q-cyan)]/15 text-[var(--q-cyan)] font-semibold'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-zinc-400">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:border-[var(--q-violet)]"
              style={{
                borderColor: 'var(--q-line)',
                background: 'color-mix(in oklch, var(--q-bg) 75%, transparent)',
                color: 'var(--q-text)',
              }}
            >
              <Globe className="h-3.5 w-3.5" style={{ color: 'var(--q-violet)' }} />
              <span className="uppercase font-semibold">{language}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl border p-1 shadow-2xl backdrop-blur-xl z-50"
                style={{
                  borderColor: 'var(--q-line)',
                  background: 'var(--q-bg-deep)',
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLanguage(l.id)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      language === l.id
                        ? 'bg-[var(--q-violet)]/20 text-[var(--q-violet)] font-semibold'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Module Navigation Tabs Bar */}
      <div className="border-t overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--q-line)' }}>
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, color-mix(in oklch, var(--q-cyan) 25%, transparent), color-mix(in oklch, var(--q-violet) 25%, transparent))',
                        color: 'var(--q-cyan)',
                        border: '1px solid color-mix(in oklch, var(--q-cyan) 40%, transparent)',
                        boxShadow: '0 0 16px color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                      }
                    : {}
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === 'alerts' && unreadAlertsCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadAlertsCount}
                  </span>
                )}
                {item.id === 'incident_report' && pendingOfflineReports.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                    {pendingOfflineReports.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
