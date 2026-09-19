export type RoadStatus = 'open' | 'at_risk' | 'blocked'

export type RoadCategory =
  | 'national_highway'
  | 'state_highway'
  | 'major_district'
  | 'border_road'
  | 'bridge'

export interface RoadSegment {
  id: string
  code: string
  name: string
  state: string
  district: string
  from: string
  to: string
  category: RoadCategory
  status: RoadStatus
  riskScore: number // 0 - 100
  riskLevel: 'low' | 'medium' | 'high'
  lengthKm: number
  conditionScore: number // 1 - 10
  slopeDeg: number
  soilMoisturePercent: number
  rainfallMmPerHour: number
  lastInspection: string
  coordinates: [number, number][] // [lat, lng] array for GIS paths
  activeIncidentsCount: number
  hazardType?: 'landslide' | 'flood' | 'road_damage' | 'bridge_collapse' | 'bridge_damage' | 'clear'
}

export interface Bridge {
  id: string
  name: string
  roadCode: string
  river: string
  district: string
  state: string
  spanMeters: number
  healthIndexPercent: number
  status: RoadStatus
  lastAuditDate: string
  coordinates: [number, number]
}

export type IncidentType =
  | 'landslide'
  | 'flood'
  | 'road_damage'
  | 'bridge_collapse'
  | 'cleared'

export interface IncidentReport {
  id: string
  reporterId: string
  reporterName: string
  reporterRole: UserRole
  timestamp: string
  district: string
  roadCode: string
  incidentType: IncidentType
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'verified' | 'resolved'
  lat: number
  lng: number
  elevationMeters: number
  photoUrl?: string
  description: string
  isOfflineQueued?: boolean
}

export interface DisruptionPrediction {
  segmentId: string
  roadCode: string
  roadName: string
  district: string
  state: string
  riskLevel: 'low' | 'medium' | 'high'
  riskProbability: number // 0.0 - 1.0
  predictedDisruptionType: IncidentType
  rainfallIntensityMm: number
  forecastRainfall6hMm: number
  soilSaturationPercent: number
  slopeAngleDeg: number
  historicalLandslideIncidents: number
  lastComputedAt: string
  confidenceScore: number
}

export type VehicleCargo =
  | 'medical'
  | 'pds_rations'
  | 'fuel_pol'
  | 'disaster_relief'
  | 'heavy_machinery'

export type VehicleStatus = 'in_transit' | 'delayed' | 'delivered'

export interface TrackedVehicle {
  id: string
  plateNumber: string
  driverName: string
  driverContact: string
  cargoType: VehicleCargo
  cargoDescription: string
  cargoWeightTons: number
  origin: string
  destination: string
  currentDistrict: string
  currentRoadCode: string
  lat: number
  lng: number
  speedKmh: number
  status: VehicleStatus
  isAtRisk: boolean
  riskReason?: string
  etaMinutes: number
  delayMinutes: number
  pathPoints: [number, number][]
}

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface AlertNotification {
  id: string
  timestamp: string
  district: string
  title: string
  message: string
  severity: AlertSeverity
  channels: ('in_app' | 'sms' | 'push')[]
  isRead: boolean
  isResolved: boolean
  relatedRoadCode?: string
}

export interface DistrictConnectivity {
  district: string
  state: string
  totalRoadsKm: number
  openRoadsKm: number
  atRiskRoadsKm: number
  blockedRoadsKm: number
  connectivityIndexPercent: number
  essentialSuppliesBufferDays: {
    medical: number
    foodGrain: number
    fuelPol: number
  }
  populationServed: number
  isCriticalDisasterZone?: boolean
}

export type UserRole =
  | 'district_admin'
  | 'field_officer'
  | 'transport_operator'
  | 'disaster_response'
  | 'system_admin'

export type Language = 'en' | 'hi' | 'as'

export type ActiveModule =
  | 'admin_dashboard'
  | 'gis_map'
  | 'ai_prediction'
  | 'route_planner'
  | 'vehicle_tracking'
  | 'incident_report'
  | 'alerts'

export interface RouteOption {
  id: string
  title: string
  distanceKm: number
  durationHours: number
  delayMinutes: number
  riskLevel: 'low' | 'medium' | 'high'
  corridorDescription: string
  isSafestAI: boolean
  isFastestUnrestricted: boolean
  pathRoadCodes: string[]
  waypoints: string[]
  segments: {
    roadCode: string
    name: string
    status: RoadStatus
    riskScore: number
    distanceKm: number
  }[]
}
