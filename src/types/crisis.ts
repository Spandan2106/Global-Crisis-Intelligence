export type CrisisCategory = 
  | 'political'
  | 'military'
  | 'economic'
  | 'financial'
  | 'humanitarian';

export type CrisisStatus = 
  | 'active'
  | 'escalating'
  | 'de-escalating'
  | 'resolved'
  | 'historical';

export type RiskLevel = 
  | 'very_low'    // 0.00 - 0.19
  | 'low'         // 0.20 - 0.39
  | 'moderate'    // 0.40 - 0.59
  | 'high'        // 0.60 - 0.79
  | 'very_high';  // 0.80 - 1.00

export type ZoneClassification = 
  | 'highest_conflict_zone'
  | 'strategic_chokepoint'
  | 'severe_economic_stress'
  | 'lowest_risk_resilient';

export interface ContributingFactor {
  factor: string;
  weight: number; // e.g. +0.21
  description?: string;
}

export interface EventSource {
  name: string;
  publisher: string;
  publishedDate: string;
  type: 'wire' | 'official' | 'ngo' | 'multilateral' | 'financial' | 'academic';
  url: string;
  reliableScore?: number;
  conflictingReport?: boolean;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export interface CrisisEvent {
  id: string;
  title: string;
  category: CrisisCategory;
  subcategory: string;
  country: string;
  countryCode: string; // ISO 2 or 3
  region: 'Europe' | 'Middle East' | 'Asia-Pacific' | 'Africa' | 'Americas' | 'Global';
  latitude: number;
  longitude: number;
  date: string; // ISO YYYY-MM-DD
  status: CrisisStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskIndicator: number; // 0.00 to 1.00
  confidence: 'Low' | 'Medium' | 'High';
  zoneClassification?: ZoneClassification;
  summary: string;
  whyMonitored: string;
  contributingFactors: ContributingFactor[];
  timeline: TimelineMilestone[];
  economicImpact?: string;
  humanitarianImpact?: string;
  regionalImpact?: string;
  sources: EventSource[];
  reportsDiffer?: boolean;
  reportsDisagreementSummary?: string;
  isDemo: boolean;
  lastUpdated: string;
  connectedCrisisIds?: string[];
}

export interface CountryIntelligence {
  name: string;
  code: string;
  capital: string;
  region: string;
  population: string;
  gdp: string;
  flagEmoji: string;
  coordinates: [number, number]; // [lat, lng]
  riskBreakdown: {
    politicalRisk: number;
    economicStress: number;
    conflictRisk: number;
    humanitarianStress: number;
    marketStress: number;
  };
  summary: string;
  currentConditions: string;
  majorDiplomaticDevelopments: string[];
  activeCrisisIds: string[];
  historicalCrisisIds: string[];
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: 'index' | 'commodity' | 'currency' | 'bond' | 'volatility';
  exchange?: string;
  country?: string;
  price: number;
  change24h: number;
  unit: string;
  realTimeStats?: {
    dayHigh: number;
    dayLow: number;
    yearHigh: number;
    yearLow: number;
    volume24h: string;
    volatilityBeta: number;
    sentimentIndex: number; // 0 - 100
  };
  probabilityForecast?: {
    bullishProb: number;
    neutralProb: number;
    bearishProb: number;
    consensusDirection: 'Bullish' | 'Neutral' | 'Bearish';
    targetForecastRange: { low: number; mid: number; high: number };
    catalysts: string[];
    probabilityRationale: string;
  };
  history: {
    '1D': { time: string; value: number }[];
    '1W': { time: string; value: number }[];
    '1M': { time: string; value: number }[];
    '3M': { time: string; value: number }[];
    '1Y': { time: string; value: number }[];
    '5Y': { time: string; value: number }[];
  };
  geopoliticalDrivers: string[];
  exposedSectors: string[];
  exposedCountries: string[];
}

export interface NetworkNode {
  id: string;
  label: string;
  category: CrisisCategory | 'channel';
  riskIndicator: number;
  description: string;
  country?: string;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: 'high' | 'medium' | 'low';
}

export interface ScenarioResult {
  evidence: string[];
  analysis: string;
  scenarioPaths: {
    name: string;
    description: string;
    riskTrend: 'escalating' | 'stable' | 'de-escalating';
    keyIndicatorsToMonitor: string[];
  }[];
  uncertainties: string[];
  disclaimer: string;
}

export interface FilterState {
  searchQuery: string;
  categories: {
    political: boolean;
    military: boolean;
    economic: boolean;
    financial: boolean;
    humanitarian: boolean;
  };
  status: {
    active: boolean;
    escalating: boolean;
    deEscalating: boolean;
    resolved: boolean;
    historical: boolean;
  };
  minRisk: number;
  maxRisk: number;
  region: string;
  zoneFilter: 'all' | 'highest_conflict' | 'strategic_chokepoints' | 'resilient';
  layers: {
    conflictZones: boolean;
    economicStress: boolean;
    diplomaticHotspots: boolean;
    pulses: boolean;
    countryBorders: boolean;
    heatmaps: boolean;
  };
  demoMode: boolean;
}
