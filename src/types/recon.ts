export type TacticalTheme = 'cyber-dark' | 'night-vision' | 'amber-mono' | 'deep-navy';

export type VesselType = 'oil_tanker' | 'container_ship' | 'lng_carrier' | 'bulk_carrier' | 'naval_escort';

export type ChokepointId = 'hormuz' | 'bab_el_mandeb' | 'taiwan_strait' | 'suez' | 'bosporus' | 'malacca';

export interface MaritimeVessel {
  id: string;
  name: string;
  type: VesselType;
  flag: string;
  flagCode: string;
  imo: string;
  mmsi: string;
  lat: number;
  lng: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  eta: string;
  cargo: string;
  chokepoint: ChokepointId;
  chokepointLabel: string;
  status: 'underway' | 'anchored' | 'diverting' | 'high_risk_zone';
  draughtMeters: number;
  deadweightTons: number;
  lastPingAgo: string;
}

export interface MilitaryFlight {
  id: string;
  callsign: string;
  aircraftType: string;
  modelCode: string;
  operator: string;
  countryCode: string;
  squawk: string;
  altitudeFt: number;
  speedKnots: number;
  headingDeg: number;
  lat: number;
  lng: number;
  mission: string;
  patrolArea: string;
  flightPath: [number, number][]; // recent coordinates trail
  lastPingAgo: string;
}

export interface ThermalSensorEvent {
  id: string;
  lat: number;
  lng: number;
  brightnessMw: number;
  confidence: 'nominal' | 'high' | 'confirmed_kinetic';
  sensor: 'VIIRS / NOAA-20' | 'MODIS / Aqua' | 'Landsat-9 TIRS';
  detectedAt: string;
  theater: string;
  classification: 'artillery_strike' | 'missile_impact' | 'refinery_fire' | 'tactical_wildfire' | 'naval_explosion' | 'industrial_flare';
  estimatedDamageRadiusKm: number;
  nearestCity: string;
}

export interface ChokepointStressMetric {
  id: ChokepointId;
  name: string;
  location: string;
  stressScore: number; // 0 - 100
  status: 'normal' | 'elevated' | 'critical' | 'interdicted';
  transitDropPercent: number; // e.g. -54%
  dailyOilFlowMbpd: number; // million barrels per day
  insurancePremiumIncreasePercent: number;
  activeVesselsCount: number;
  recentIncidentsCount: number;
  lat: number;
  lng: number;
}

export interface StrategicThreatHudState {
  defconLevel: 1 | 2 | 3 | 4 | 5;
  defconLabel: string;
  nuclearPosture: 'NORMAL' | 'ELEVATED' | 'HIGH ALERT';
  cyberThreatLevel: 'GUARDED' | 'ELEVATED' | 'CRITICAL';
  globalTensionIndex: number; // 0 - 100
  chokepoints: ChokepointStressMetric[];
  lastAssessedAt: string;
}

export interface PresidentialDailyBrief {
  briefingId: string;
  date: string;
  classificationHeader: string;
  distroCavs: string[];
  executiveSummary: string;
  theaters: {
    theaterName: string;
    threatLevel: 'CRITICAL' | 'SEVERE' | 'ELEVATED';
    coordinates: string;
    keyDevelopments: string[];
    adversaryIntentions: string;
    kineticIndicators: string[];
    economicVulnerability: string;
  }[];
  criticalChokepointTable: {
    chokepoint: string;
    status: string;
    disruptionRisk: string;
    strategicAlternative: string;
  }[];
  watchList24h: string[];
  preparedBy: string;
}

export interface WhatIfSimulationState {
  hormuzBlockadeDays: number; // 0 - 60
  taiwanDisruptionPercent: number; // 0 - 100
  redSeaCapeReroutePercent: number; // 0 - 100
  blackSeaGrainInterdiction: boolean;
  cyberGridAttackSeverity: number; // 0 - 100
}

export interface WhatIfSimulationOutputs {
  brentCrudePrice: number; // $/barrel (base: 84.50)
  brentCrudeDelta: number;
  brentCrudeDeltaPercent: number;
  globalInflationSpikePercent: number;
  containerFreightIndexDeltaPercent: number;
  semiconductorLeadTimeWeeks: number; // base: 14 weeks
  jetFuelCostIncreasePercent: number;
  globalGdpDragBillionUsd: number;
  atRiskFaminePopulationMillions: number;
  topImpactedNations: { country: string; flag: string; impactDescription: string; severity: 'critical' | 'high' | 'medium' }[];
  strategicAssessment: string;
}
