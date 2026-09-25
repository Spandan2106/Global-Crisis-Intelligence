import { WhatIfSimulationState, WhatIfSimulationOutputs } from '../types/recon';

export function calculateWhatIfShock(state: WhatIfSimulationState): WhatIfSimulationOutputs {
  const baseBrent = 84.50;

  // Hormuz has 21 Mbpd (21% of world petroleum). Each day of total closure spikes prices ~ +$0.95 to $1.35/bbl non-linearly
  const hormuzBrentSpike = state.hormuzBlockadeDays > 0 
    ? (state.hormuzBlockadeDays * 0.92) + (Math.pow(state.hormuzBlockadeDays, 1.25) * 0.42)
    : 0;

  // Red sea diversion adds fuel burn and vessel shortage
  const redSeaBrentSpike = (state.redSeaCapeReroutePercent / 100) * 8.5;

  // Cyber attack on grid/pipelines adds panic premium
  const cyberBrentSpike = (state.cyberGridAttackSeverity / 100) * 11.0;

  const totalBrentSpike = hormuzBrentSpike + redSeaBrentSpike + cyberBrentSpike;
  const brentCrudePrice = +(baseBrent + totalBrentSpike).toFixed(2);
  const brentCrudeDelta = +(brentCrudePrice - baseBrent).toFixed(2);
  const brentCrudeDeltaPercent = +((brentCrudeDelta / baseBrent) * 100).toFixed(1);

  // Global Container Shipping Rate (SCFI equivalent)
  // Base 0% delta; Red Sea 100% -> +280%, Taiwan 100% -> +350%
  const containerDelta = 
    (state.redSeaCapeReroutePercent * 2.8) + 
    (state.taiwanDisruptionPercent * 3.2) + 
    (state.hormuzBlockadeDays * 2.1);
  const containerFreightIndexDeltaPercent = +Math.min(containerDelta, 850).toFixed(0);

  // Semiconductor Lead Time: Base 14 weeks. Taiwan 100% -> up to 54 weeks!
  const semiAddedWeeks = (state.taiwanDisruptionPercent / 100) * 40 + (state.cyberGridAttackSeverity / 100) * 8;
  const semiconductorLeadTimeWeeks = +(14 + semiAddedWeeks).toFixed(1);

  // Jet Fuel Surcharge (% increase)
  const jetFuelIncrease = brentCrudeDeltaPercent * 1.35 + (state.redSeaCapeReroutePercent * 0.25);
  const jetFuelCostIncreasePercent = +jetFuelIncrease.toFixed(1);

  // Global Inflation Spike (% addition to headline CPI)
  const inflationSpike = 
    (brentCrudeDelta / 10) * 0.35 + 
    (state.taiwanDisruptionPercent / 100) * 1.2 + 
    (state.blackSeaGrainInterdiction ? 0.9 : 0);
  const globalInflationSpikePercent = +inflationSpike.toFixed(2);

  // Global GDP drag ($ Billions USD)
  const gdpDrag = 
    (brentCrudeDelta * 32) + 
    (state.taiwanDisruptionPercent * 45) + 
    (state.hormuzBlockadeDays * 24) + 
    (state.blackSeaGrainInterdiction ? 180 : 0);
  const globalGdpDragBillionUsd = +gdpDrag.toFixed(0);

  // Famine at-risk population (millions)
  let famineMillions = 14;
  if (state.blackSeaGrainInterdiction) famineMillions += 48;
  famineMillions += (state.redSeaCapeReroutePercent / 100) * 22;
  famineMillions += (state.hormuzBlockadeDays / 30) * 15;
  const atRiskFaminePopulationMillions = +famineMillions.toFixed(1);

  // Top impacted nations
  const topImpactedNations: WhatIfSimulationOutputs['topImpactedNations'] = [];

  if (state.hormuzBlockadeDays >= 14 || state.redSeaCapeReroutePercent >= 50) {
    topImpactedNations.push({
      country: 'Japan & South Korea',
      flag: '🇯🇵 🇰🇷',
      impactDescription: '82% crude dependence on Persian Gulf imports; mandatory industrial rationing triggered.',
      severity: 'critical'
    });
  }

  if (state.taiwanDisruptionPercent >= 30) {
    topImpactedNations.push({
      country: 'United States & European Union',
      flag: '🇺🇸 🇪🇺',
      impactDescription: 'High-tech auto manufacturing, AI accelerator clusters, and defense avionics supply stoppage.',
      severity: 'critical'
    });
  }

  if (state.blackSeaGrainInterdiction || state.redSeaCapeReroutePercent >= 60) {
    topImpactedNations.push({
      country: 'Egypt & Horn of Africa',
      flag: '🇪🇬 🇸🇴',
      impactDescription: 'Severe wheat subsidy depletion; currency devaluation and acute food security emergencies.',
      severity: 'critical'
    });
  }

  if (state.hormuzBlockadeDays >= 7) {
    topImpactedNations.push({
      country: 'India & South Asia',
      flag: '🇮🇳 🇵🇰',
      impactDescription: 'Import bill surge exceeding +$4.2B/month; rupee pressure and fertilizer feedstock contraction.',
      severity: 'high'
    });
  }

  if (topImpactedNations.length === 0) {
    topImpactedNations.push({
      country: 'Global Maritime Transits',
      flag: '🌐',
      impactDescription: 'Baseline friction with elevated insurance and precautionary bunker fuel adjustments.',
      severity: 'medium'
    });
  }

  // Synthesized Assessment
  let strategicAssessment = '';
  if (brentCrudePrice > 130) {
    strategicAssessment = 'CATASTROPHIC SUPPLY DECOUPLING: Simultaneous maritime choking events overwhelm reserve capacities (SPR). Global central banks forced into emergency rate interventions amid stagflationary shock.';
  } else if (brentCrudePrice > 105) {
    strategicAssessment = 'SEVERE GLOBAL SYSTEMIC FRICTION: Trans-continental container lead times double. Energy-intensive industries face mandatory demand curtailments across East Asia and Western Europe.';
  } else if (state.taiwanDisruptionPercent > 50) {
    strategicAssessment = 'TECH SUPPLY CHAIN COLLAPSE: Extreme exposure in advanced lithography (3nm/5nm) halts consumer hardware assembly lines within 45 days of transit freeze.';
  } else {
    strategicAssessment = 'LOCALIZED STRESS TRANSMISSION: Supply corridors remain resilient with elevated war-risk insurance premiums and tactical convoy escort deployment.';
  }

  return {
    brentCrudePrice,
    brentCrudeDelta,
    brentCrudeDeltaPercent,
    globalInflationSpikePercent,
    containerFreightIndexDeltaPercent,
    semiconductorLeadTimeWeeks,
    jetFuelCostIncreasePercent,
    globalGdpDragBillionUsd,
    atRiskFaminePopulationMillions,
    topImpactedNations,
    strategicAssessment
  };
}
