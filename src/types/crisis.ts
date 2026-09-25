export type CrisisCategory = 
  | 'political'
  | 'military'
  | 'economic'
  | 'financial'
  | 'humanitarian'
  | 'conflict'
  | 'diplomatic'
  | 'security'
  | 'energy'
  | 'environmental';

export type CrisisStatus = 
  | 'active'
  | 'escalating'
  | 'de-escalating'
  | 'resolved'
  | 'historical'
  | 'ongoing';

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
  isOngoing?: boolean;
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
  sourceStatus?: string;
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

export type TimelineFilterMode = 'today' | '2year' | 'total' | 'custom';

export interface LiveNewsItem {
  id: string;
  timestamp: string;
  timeAgo?: string;
  headline: string;
  source: string;
  region: string;
  conflictId?: string;
  category: 'kinetic' | 'maritime' | 'humanitarian' | 'hybrid' | 'diplomatic';
  urgency: 'critical' | 'high' | 'medium';
  details: string;
  verified: boolean;
}

export type NewsContentType = 'wire' | 'video' | 'official_statement' | 'satellite_brief' | 'audio_dispatch';

export interface GlobalNewsReport {
  id: string;
  source: string; // e.g. 'BBC', 'CNN', 'Al Jazeera', 'Google News', 'YouTube', 'AP', 'NDTV', 'Reuters', 'UKMTO', 'UN OCHA'
  sourceLabel?: string;
  headline: string;
  summary: string;
  timestamp: string;
  timeAgo: string;
  url: string;
  category: 'Kinetic' | 'Maritime' | 'Diplomacy' | 'Economy' | 'Humanitarian' | 'Hybrid Warfare' | 'Breaking' | 'Space/Satellite';
  urgency: 'critical' | 'high' | 'medium';
  conflictId?: string;
  conflictName?: string;
  region: string;
  coordinates?: [number, number]; // [lat, lng]
  videoUrl?: string; // YouTube or video dispatch embed
  isLiveBroadcast?: boolean;
  contentType?: NewsContentType; // e.g. 'wire' | 'video' | 'official_statement' | 'satellite_brief'
  segmentTag?: string; // e.g. 'WAR ROOM OSINT', 'SATELLITE INTEL', 'UN BRIEFING', 'MARITIME ADVISORY', 'BREAKING WIRE'
  verified: boolean;
}

export interface ConflictLiveTelemetry {
  conflictId: string;
  name: string;
  status: string;
  riskIndex: number;
  lastUpdated: string;
  trend: 'escalating' | 'stable' | 'de-escalating';
  activeThreatMetric: string;
  source: string;
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
    conflict?: boolean;
    [key: string]: boolean | undefined;
  };
  status: {
    active: boolean;
    escalating: boolean;
    deEscalating: boolean;
    resolved: boolean;
    historical: boolean;
    ongoing?: boolean;
    [key: string]: boolean | undefined;
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
    humanitarian?: boolean;
    [key: string]: boolean | undefined;
  };
  demoMode: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  category?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface EconomicDataPoint {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  period: string;
  country?: string;
  indicator?: string;
  source?: string;
}
