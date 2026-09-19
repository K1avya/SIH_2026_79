'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  RoadSegment,
  Bridge,
  IncidentReport,
  DisruptionPrediction,
  TrackedVehicle,
  AlertNotification,
  DistrictConnectivity,
  UserRole,
  Language,
  ActiveModule,
  RoadStatus,
  IncidentType,
} from '@/types/logistics'
import {
  INITIAL_ROADS,
  INITIAL_BRIDGES,
  INITIAL_DISTRICTS,
  INITIAL_VEHICLES,
  INITIAL_INCIDENTS,
  INITIAL_PREDICTIONS,
  INITIAL_ALERTS,
} from '@/lib/ner-data'
import { TRANSLATIONS, TranslationDict } from '@/lib/translations'

interface LogisticsContextType {
  roads: RoadSegment[]
  bridges: Bridge[]
  districts: DistrictConnectivity[]
  vehicles: TrackedVehicle[]
  incidents: IncidentReport[]
  predictions: DisruptionPrediction[]
  alerts: AlertNotification[]
  activeRole: UserRole
  language: Language
  activeModule: ActiveModule
  emergencyMode: boolean
  offlineMode: boolean
  pendingOfflineReports: IncidentReport[]
  t: TranslationDict
  // Actions
  setRole: (role: UserRole) => void
  setLanguage: (lang: Language) => void
  setActiveModule: (mod: ActiveModule) => void
  toggleEmergencyMode: () => void
  toggleOfflineMode: () => void
  submitIncidentReport: (
    report: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>
  ) => { success: boolean; queuedOffline: boolean }
  syncOfflineReports: () => void
  updateRoadStatus: (roadCode: string, status: RoadStatus) => void
  recomputeAIPredictions: () => void
  resolveAlert: (alertId: string) => void
  markAllAlertsRead: () => void
  simulateVehiclePulse: () => void
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined)

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS)
  const [bridges, setBridges] = useState<Bridge[]>(INITIAL_BRIDGES)
  const [districts, setDistricts] = useState<DistrictConnectivity[]>(INITIAL_DISTRICTS)
  const [vehicles, setVehicles] = useState<TrackedVehicle[]>(INITIAL_VEHICLES)
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS)
  const [predictions, setPredictions] = useState<DisruptionPrediction[]>(INITIAL_PREDICTIONS)
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS)
  const [activeRole, setActiveRole] = useState<UserRole>('district_admin')
  const [language, setLanguage] = useState<Language>('en')
  const [activeModule, setActiveModule] = useState<ActiveModule>('admin_dashboard')
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false)
  const [offlineMode, setOfflineMode] = useState<boolean>(false)
  const [pendingOfflineReports, setPendingOfflineReports] = useState<IncidentReport[]>([])

  // Load offline reports from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('ner_offline_reports')
      if (cached) {
        setPendingOfflineReports(JSON.parse(cached))
      }
    } catch {
      // Ignore SSR or restricted storage errors
    }
  }, [])

  // Persist offline reports
  useEffect(() => {
    try {
      localStorage.setItem('ner_offline_reports', JSON.stringify(pendingOfflineReports))
    } catch {
      // Ignore
    }
  }, [pendingOfflineReports])

  const t = TRANSLATIONS[language] || TRANSLATIONS.en

  function toggleEmergencyMode() {
    setEmergencyMode((prev) => !prev)
  }

  function toggleOfflineMode() {
    setOfflineMode((prev) => !prev)
  }

  function submitIncidentReport(
    reportData: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>
  ) {
    const newReport: IncidentReport = {
      ...reportData,
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'verified',
      isOfflineQueued: offlineMode,
    }

    if (offlineMode) {
      setPendingOfflineReports((prev) => [newReport, ...prev])
      return { success: true, queuedOffline: true }
    }

    applyIncidentDirectly(newReport)
    return { success: true, queuedOffline: false }
  }

  function applyIncidentDirectly(report: IncidentReport) {
    setIncidents((prev) => [report, ...prev])

    let nextStatus: RoadStatus = 'open'
    let deltaRisk = 10
    if (report.incidentType === 'cleared') {
      nextStatus = 'open'
      deltaRisk = -40
    } else if (
      report.incidentType === 'landslide' ||
      report.incidentType === 'bridge_collapse'
    ) {
      nextStatus = 'blocked'
      deltaRisk = 80
    } else {
      nextStatus = 'at_risk'
      deltaRisk = 50
    }

    // Update road segment status
    setRoads((prevRoads) =>
      prevRoads.map((r) => {
        if (r.code === report.roadCode) {
          const newRisk = Math.min(
            100,
            Math.max(10, report.incidentType === 'cleared' ? 18 : r.riskScore + deltaRisk)
          )
          return {
            ...r,
            status: nextStatus,
            riskScore: newRisk,
            riskLevel: newRisk >= 75 ? 'high' : newRisk >= 40 ? 'medium' : 'low',
            hazardType: report.incidentType === 'cleared' ? 'clear' : (report.incidentType as any),
            activeIncidentsCount:
              report.incidentType === 'cleared'
                ? Math.max(0, r.activeIncidentsCount - 1)
                : r.activeIncidentsCount + 1,
            lastInspection: report.timestamp,
          }
        }
        return r
      })
    )

    // Check affected vehicles & trigger alerts
    const affectedVehicles = vehicles.filter((v) => v.currentRoadCode === report.roadCode)
    if (affectedVehicles.length > 0 && nextStatus !== 'open') {
      setVehicles((prev) =>
        prev.map((v) =>
          v.currentRoadCode === report.roadCode
            ? {
                ...v,
                isAtRisk: true,
                status: 'delayed',
                riskReason: `Corridor ${report.roadCode} obstructed by ${report.incidentType.toUpperCase()}`,
                delayMinutes: v.delayMinutes + 60,
              }
            : v
        )
      )
    }

    // Generate real-time alert (FR-5.1)
    if (nextStatus !== 'open') {
      const newAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        timestamp: report.timestamp,
        district: report.district,
        title: `${nextStatus === 'blocked' ? 'CRITICAL DISRUPTION' : 'ROAD HAZARD'}: ${report.roadCode}`,
        message: `${report.incidentType.toUpperCase()} reported at coordinates [${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}] (${report.elevationMeters}m). ${report.description}`,
        severity: nextStatus === 'blocked' ? 'critical' : 'warning',
        channels: ['in_app', 'sms', 'push'],
        isRead: false,
        isResolved: false,
        relatedRoadCode: report.roadCode,
      }
      setAlerts((prev) => [newAlert, ...prev])
    }

    // Recompute district connectivity
    setDistricts((prevDistricts) =>
      prevDistricts.map((d) => {
        if (d.district.toLowerCase() === report.district.toLowerCase()) {
          const isBlocked = nextStatus === 'blocked'
          return {
            ...d,
            blockedRoadsKm: isBlocked ? d.blockedRoadsKm + 45 : Math.max(0, d.blockedRoadsKm - 45),
            connectivityIndexPercent: isBlocked
              ? Math.max(30, d.connectivityIndexPercent - 18)
              : Math.min(98, d.connectivityIndexPercent + 12),
          }
        }
        return d
      })
    )
  }

  function syncOfflineReports() {
    if (pendingOfflineReports.length === 0) return
    pendingOfflineReports.forEach((report) => {
      applyIncidentDirectly({ ...report, isOfflineQueued: false })
    })
    setPendingOfflineReports([])
    try {
      localStorage.removeItem('ner_offline_reports')
    } catch {
      // Ignore
    }
  }

  function updateRoadStatus(roadCode: string, status: RoadStatus) {
    setRoads((prev) =>
      prev.map((r) =>
        r.code === roadCode
          ? {
              ...r,
              status,
              riskScore: status === 'blocked' ? 90 : status === 'at_risk' ? 65 : 20,
              riskLevel: status === 'blocked' ? 'high' : status === 'at_risk' ? 'medium' : 'low',
            }
          : r
      )
    )
  }

  function recomputeAIPredictions() {
    setPredictions((prev) =>
      prev.map((p) => {
        const jitter = Math.floor(Math.random() * 10) - 5
        const newIntensity = Math.max(5, p.rainfallIntensityMm + jitter)
        const newProb = Math.min(0.98, Math.max(0.1, Number((p.riskProbability + jitter * 0.02).toFixed(2))))
        const riskLevel = newProb >= 0.7 ? 'high' : newProb >= 0.4 ? 'medium' : 'low'
        return {
          ...p,
          rainfallIntensityMm: newIntensity,
          riskProbability: newProb,
          riskLevel,
          lastComputedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }
      })
    )
  }

  function resolveAlert(alertId: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
    )
  }

  function markAllAlertsRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))
  }

  function simulateVehiclePulse() {
    setVehicles((prev) =>
      prev.map((v) => {
        const speedDelta = Math.floor(Math.random() * 7) - 3
        const newSpeed = Math.max(10, Math.min(65, v.speedKmh + speedDelta))
        const etaDelta = v.isAtRisk ? 2 : -1
        return {
          ...v,
          speedKmh: newSpeed,
          etaMinutes: Math.max(10, v.etaMinutes + etaDelta),
        }
      })
    )
  }

  return (
    <LogisticsContext.Provider
      value={{
        roads,
        bridges,
        districts,
        vehicles,
        incidents,
        predictions,
        alerts,
        activeRole,
        language,
        activeModule,
        emergencyMode,
        offlineMode,
        pendingOfflineReports,
        t,
        setRole: setActiveRole,
        setLanguage,
        setActiveModule,
        toggleEmergencyMode,
        toggleOfflineMode,
        submitIncidentReport,
        syncOfflineReports,
        updateRoadStatus,
        recomputeAIPredictions,
        resolveAlert,
        markAllAlertsRead,
        simulateVehiclePulse,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  )
}

export function useLogistics() {
  const ctx = useContext(LogisticsContext)
  if (!ctx) {
    throw new Error('useLogistics must be used within a LogisticsProvider')
  }
  return ctx
}
