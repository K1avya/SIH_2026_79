'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  MessageSquare,
  Smartphone,
  Globe,
  Filter,
  Check,
  Send,
  Radio,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import { useLogistics } from '@/context/logistics-context'
import { AlertNotification, AlertSeverity, Language } from '@/types/logistics'
import { Skeleton } from '@/components/ui/Skeleton'

export function AlertsCenter() {
  const {
    alerts,
    resolveAlert,
    markAllAlertsRead,
    language,
    setLanguage,
    t,
  } = useLogistics()

  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [resolutionFilter, setResolutionFilter] = useState<string>('all')
  const [districtFilter, setDistrictFilter] = useState<string>('all')
  const [smsPreview, setSmsPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const unreadCount = alerts.filter((a) => !a.isRead).length
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false
    if (resolutionFilter === 'unresolved' && a.isResolved) return false
    if (resolutionFilter === 'resolved' && !a.isResolved) return false
    if (districtFilter !== 'all' && a.district.toLowerCase() !== districtFilter.toLowerCase()) return false
    return true
  })

  function handleSimulateBroadcast(alert: AlertNotification) {
    setSmsPreview(
      `[NIC/MDoNER SMS GATEWAY SIMULATION] To: Registered Drivers & District Magistrate (${alert.district})\n\n${alert.title}\n${alert.message}\nTime: ${alert.timestamp} IST. Avoid affected corridors.`
    )
    toast.success(`SMS Broadcast dispatched to ${alert.district} magistrate & drivers`)
    setTimeout(() => setSmsPreview(null), 8000)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t.navAlerts}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
                color: 'var(--q-cyan)',
                border: '1px solid color-mix(in oklch, var(--q-cyan) 30%, transparent)',
              }}
            >
              2-Minute SLA Engine (FR-5.1)
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Multi-channel automated alerting engine broadcasting road blockages, landslide risks, and convoy delays to district magistrates, transport drivers, and emergency crews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              markAllAlertsRead()
              toast.info('All alerts marked as read')
            }}
            className="rounded-xl border px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-cyan-400 active:scale-95 transition-all"
            style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Multilingual Notification Support Banner (FR-8.1, NFR-10) */}
      <div
        className="rounded-2xl border p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          borderColor: 'var(--q-line)',
          background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Multilingual Dispatch Active: {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी (Hindi)' : 'অসমীয়া (Assamese)'}
            </div>
            <div className="text-[11px] text-zinc-400">
              Notification broadcasts are localized for grassroots drivers and local transport authorities (FR-8.1, FR-8.2).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['en', 'hi', 'as'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                language === lang
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang === 'en' ? 'English (EN)' : lang === 'hi' ? 'हिंदी (HI)' : 'অসমীয়া (AS)'}
            </button>
          ))}
        </div>
      </div>

      {/* SMS Gateway Simulation Popup (FR-5.2) */}
      {smsPreview && (
        <div
          className="rounded-2xl border p-4 backdrop-blur-md animate-fade-in flex items-start gap-3"
          style={{
            borderColor: 'rgba(56,189,248,0.5)',
            background: 'color-mix(in oklch, var(--q-cyan) 20%, transparent)',
          }}
        >
          <Smartphone className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-cyan-200">NIC / TWILIO SMS GATEWAY BROADCAST LOG (FR-5.2)</div>
            <pre className="font-mono text-zinc-100 whitespace-pre-wrap text-[11px] bg-black/40 p-2.5 rounded-lg border border-cyan-500/20">
              {smsPreview}
            </pre>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Total Generated Alerts</div>
          <div className="font-heading text-2xl font-bold text-white mt-1">{alerts.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Logged with 3-year audit trail (FR-5.3)</div>
        </div>

        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Unread Alerts</div>
          <div className="font-heading text-2xl font-bold text-cyan-300 mt-1">{unreadCount}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Requiring administrative review</div>
        </div>

        <div className="rounded-2xl border p-5 backdrop-blur-md" style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 70%, transparent)' }}>
          <div className="text-xs text-zinc-400">Active Critical Disruptions</div>
          <div className="font-heading text-2xl font-bold text-rose-400 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Highways severed by landslides/floods</div>
        </div>
      </div>

      {/* Filtering Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 backdrop-blur-md"
        style={{ borderColor: 'var(--q-line)', background: 'color-mix(in oklch, var(--q-bg-deep) 75%, transparent)' }}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-medium">Severity:</span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-lg px-3 py-1.5 font-bold uppercase transition-all ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'border border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-zinc-400 font-medium ml-4">Status:</span>
          {['all', 'unresolved', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setResolutionFilter(st)}
              className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-all ${
                resolutionFilter === st
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'border border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Delivery SLA: &le; 2 mins (FR-5.1)
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : (
          filteredAlerts.map((alt, index) => {
            const isCritical = alt.severity === 'critical'
            const isWarning = alt.severity === 'warning'

            return (
              <div
                key={alt.id}
                className={`animate-fade-in rounded-2xl border p-5 transition-all ${
                  !alt.isResolved && isCritical
                    ? 'border-rose-500/60 bg-rose-950/20 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
                    : 'hover:border-zinc-700'
                }`}
                style={{
                  animationDelay: `${index * 60}ms`,
                  borderColor: !alt.isResolved && isCritical ? 'rgba(244,63,94,0.6)' : 'var(--q-line)',
                  background: 'color-mix(in oklch, var(--q-bg-deep) 65%, transparent)',
                }}
              >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {alt.severity}
                    </span>

                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {alt.district}
                    </span>

                    {alt.relatedRoadCode && (
                      <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                        {alt.relatedRoadCode}
                      </span>
                    )}

                    {alt.isResolved && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-base font-bold text-white mt-1">
                    {alt.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {alt.message}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      {alt.timestamp}
                    </span>
                    <span>
                      Channels: {alt.channels.map((c) => c.toUpperCase()).join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => handleSimulateBroadcast(alt)}
                    className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Send SMS (FR-5.2)</span>
                  </button>

                  {!alt.isResolved && (
                    <button
                      onClick={() => {
                        resolveAlert(alt.id)
                        toast.success(`Alert "${alt.title}" marked as resolved`)
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 active:scale-95 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Resolve Alert</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
