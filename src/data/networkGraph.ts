import { NetworkNode, NetworkEdge } from '../types/crisis';

export const CRISIS_NETWORK_NODES: NetworkNode[] = [
  {
    id: 'node-conflict',
    label: 'Armed Conflict / Kinetic Hostilities',
    category: 'military',
    riskIndicator: 0.88,
    description: 'Kinetic military engagements, artillery shelling, and missile strikes targeting strategic installations and population centers.',
    country: 'Regional Theaters'
  },
  {
    id: 'node-maritime-chokepoint',
    label: 'Maritime Chokepoint Disruption',
    category: 'military',
    riskIndicator: 0.77,
    description: 'Attacks or blockades on critical waterways (Bab al-Mandab, Strait of Hormuz, Taiwan Strait, Black Sea).',
    country: 'Red Sea / Yemen'
  },
  {
    id: 'node-oil-supply',
    label: 'Energy Supply Interruption',
    category: 'channel',
    riskIndicator: 0.65,
    description: 'Physical disruption or sanctioning of crude oil, natural gas, and refined petroleum product flows.',
  },
  {
    id: 'node-freight-rates',
    label: 'Global Freight & Insurance Surge',
    category: 'economic',
    riskIndicator: 0.72,
    description: 'Container rerouting around Africa increasing voyage days by 10-14 days and multiplying war risk insurance tariffs.',
  },
  {
    id: 'node-fertilizer-food',
    label: 'Grain & Fertilizer Supply Crunch',
    category: 'economic',
    riskIndicator: 0.55,
    description: 'Black Sea port access restrictions and ammonia pipeline shutdowns impacting global crop yields.',
    country: 'Ukraine / Black Sea'
  },
  {
    id: 'node-energy-prices',
    label: 'Benchmark Energy Prices Spike',
    category: 'financial',
    riskIndicator: 0.62,
    description: 'Brent crude geopolitical risk premium and TTF natural gas volatility affecting power utilities.',
  },
  {
    id: 'node-inflation-shock',
    label: 'Imported Headline Inflation Shock',
    category: 'economic',
    riskIndicator: 0.58,
    description: 'Consumer price index escalation driven by energy and logistics cost pass-through to retail goods.',
  },
  {
    id: 'node-currency-pressure',
    label: 'Emerging Market FX Depreciation',
    category: 'financial',
    riskIndicator: 0.70,
    description: 'Outflow of foreign reserves and currency depreciation in import-dependent emerging economies.',
    country: 'Egypt / Argentina'
  },
  {
    id: 'node-central-bank',
    label: 'Central Bank Rate Tightening',
    category: 'channel',
    riskIndicator: 0.50,
    description: 'Higher-for-longer policy rates to anchor long-term inflation expectations, compressing domestic credit.',
  },
  {
    id: 'node-market-volatility',
    label: 'Cross-Asset Financial Volatility (VIX)',
    category: 'financial',
    riskIndicator: 0.60,
    description: 'Sudden repricing of global equities, high-yield sovereign spreads, and carry-trade deleveraging.',
  },
  {
    id: 'node-humanitarian-strain',
    label: 'Displacement & Famine Emergencies',
    category: 'humanitarian',
    riskIndicator: 0.94,
    description: 'Acute IPC Phase 5 food insecurity, healthcare collapse, and cross-border refugee flows.',
    country: 'Sudan / Levant'
  },
  {
    id: 'node-hormuz',
    label: 'Strait of Hormuz Naval Standoff',
    category: 'military',
    riskIndicator: 0.93,
    description: 'Threats to 20.5M bpd oil flows, GPS spoofing, and tanker boardings in Persian Gulf entrance.',
    country: 'Strait of Hormuz / Iran'
  },
  {
    id: 'node-gaza',
    label: 'Gaza Urban Hostilities & Siege',
    category: 'military',
    riskIndicator: 0.98,
    description: 'High-intensity conflict, severe humanitarian blockades, and urban destruction.',
    country: 'Palestine / Gaza'
  },
  {
    id: 'node-lebanon',
    label: 'Lebanon Blue Line Escalation',
    category: 'military',
    riskIndicator: 0.95,
    description: 'Cross-border artillery, airstrikes, and mass displacement across southern Lebanon.',
    country: 'Lebanon'
  },
  {
    id: 'node-sudan',
    label: 'Sudan Civil War & Darfur Famine',
    category: 'humanitarian',
    riskIndicator: 0.97,
    description: 'SAF vs RSF conflict, El Fasher siege, and IPC Phase 5 famine in Zamzam camp.',
    country: 'Sudan'
  },
  {
    id: 'node-horn',
    label: 'Horn of Africa Maritime Access Standoff',
    category: 'political',
    riskIndicator: 0.81,
    description: 'Ethiopia-Somaliland Berbera port MoU triggering regional defense pacts and border alert.',
    country: 'Somalia / Ethiopia'
  },
  {
    id: 'node-hybrid',
    label: 'Europe Hybrid Warfare & Cable Sabotage',
    category: 'military',
    riskIndicator: 0.87,
    description: 'Baltic subsea cable ruptures, civilian aviation GPS jamming, and utility cyber probes.',
    country: 'Baltic Sea / EU'
  }
];

export const CRISIS_NETWORK_EDGES: NetworkEdge[] = [
  {
    id: 'e-gaza-conflict',
    source: 'node-gaza',
    target: 'node-conflict',
    label: 'Epicentral Levant catalyst',
    strength: 'high'
  },
  {
    id: 'e-gaza-humanitarian',
    source: 'node-gaza',
    target: 'node-humanitarian-strain',
    label: 'IPC Phase 5 catastrophic hunger',
    strength: 'high'
  },
  {
    id: 'e-gaza-lebanon',
    source: 'node-gaza',
    target: 'node-lebanon',
    label: 'Frontline synchronization',
    strength: 'high'
  },
  {
    id: 'e-lebanon-conflict',
    source: 'node-lebanon',
    target: 'node-conflict',
    label: 'Cross-border escalation',
    strength: 'high'
  },
  {
    id: 'e-hormuz-oil',
    source: 'node-hormuz',
    target: 'node-oil-supply',
    label: '21% global crude transit exposure',
    strength: 'high'
  },
  {
    id: 'e-hormuz-chokepoint',
    source: 'node-hormuz',
    target: 'node-maritime-chokepoint',
    label: 'Persian Gulf naval interdiction',
    strength: 'high'
  },
  {
    id: 'e-sudan-humanitarian',
    source: 'node-sudan',
    target: 'node-humanitarian-strain',
    label: '10.5M IDPs & famine declaration',
    strength: 'high'
  },
  {
    id: 'e-horn-chokepoint',
    source: 'node-horn',
    target: 'node-maritime-chokepoint',
    label: 'Gulf of Aden naval access dispute',
    strength: 'medium'
  },
  {
    id: 'e-hybrid-freight',
    source: 'node-hybrid',
    target: 'node-freight-rates',
    label: 'Baltic maritime shadow-fleet risk',
    strength: 'medium'
  },
  {
    id: 'e-hybrid-volatility',
    source: 'node-hybrid',
    target: 'node-market-volatility',
    label: 'Critical subsea infrastructure disruption',
    strength: 'medium'
  },
  {
    id: 'e1',
    source: 'node-conflict',
    target: 'node-maritime-chokepoint',
    label: 'Spillover to commercial navigation lanes',
    strength: 'high'
  },
  {
    id: 'e2',
    source: 'node-conflict',
    target: 'node-humanitarian-strain',
    label: 'Direct civilian infrastructure destruction & displacement',
    strength: 'high'
  },
  {
    id: 'e3',
    source: 'node-maritime-chokepoint',
    target: 'node-freight-rates',
    label: 'Vessel diversions around Cape of Good Hope',
    strength: 'high'
  },
  {
    id: 'e4',
    source: 'node-maritime-chokepoint',
    target: 'node-oil-supply',
    label: 'Tanker rerouting & transit insurance risk',
    strength: 'medium'
  },
  {
    id: 'e5',
    source: 'node-conflict',
    target: 'node-fertilizer-food',
    label: 'Farmland combat & port export bottlenecks',
    strength: 'medium'
  },
  {
    id: 'e6',
    source: 'node-oil-supply',
    target: 'node-energy-prices',
    label: 'Crude and LNG spot benchmark repricing',
    strength: 'high'
  },
  {
    id: 'e7',
    source: 'node-freight-rates',
    target: 'node-inflation-shock',
    label: 'Imported cost pass-through on manufactured goods',
    strength: 'medium'
  },
  {
    id: 'e8',
    source: 'node-energy-prices',
    target: 'node-inflation-shock',
    label: 'Headline energy index pass-through',
    strength: 'high'
  },
  {
    id: 'e9',
    source: 'node-inflation-shock',
    target: 'node-currency-pressure',
    label: 'Current account deterioration in net importers',
    strength: 'high'
  },
  {
    id: 'e10',
    source: 'node-inflation-shock',
    target: 'node-central-bank',
    label: 'Monetary policy rate reaction to curb expectations',
    strength: 'high'
  },
  {
    id: 'e11',
    source: 'node-central-bank',
    target: 'node-market-volatility',
    label: 'Liquidity drain, carry-trade unwinds & equity repricing',
    strength: 'medium'
  },
  {
    id: 'e12',
    source: 'node-energy-prices',
    target: 'node-market-volatility',
    label: 'Stagflation fears impacting corporate earnings',
    strength: 'medium'
  }
];
