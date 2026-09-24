import { CountryIntelligence } from '../types/crisis';

export const COUNTRIES_INTELLIGENCE: Record<string, CountryIntelligence> = {
  UA: {
    name: 'Ukraine',
    code: 'UA',
    capital: 'Kyiv',
    region: 'Eastern Europe',
    population: '38.0 Million',
    gdp: '$178 Billion',
    flagEmoji: '🇺🇦',
    coordinates: [50.4501, 30.5234],
    riskBreakdown: {
      politicalRisk: 0.65,
      economicStress: 0.72,
      conflictRisk: 0.94,
      humanitarianStress: 0.88,
      marketStress: 0.61,
    },
    summary: 'Sovereign eastern European nation enduring large-scale conventional armed invasion, sustaining critical infrastructure strain while maintaining agricultural maritime export corridors.',
    currentConditions: 'Heavy combat across Donbas and Zaporizhzhia fronts; localized blackouts due to targeted power plant strikes; continuous mobilization efforts.',
    majorDiplomaticDevelopments: [
      'EU accession negotiation framework formally initiated in June 2024',
      'Bilateral 10-year security agreements signed with 20+ partner nations',
      'Ongoing diplomatic engagement around multilateral peace formula points'
    ],
    activeCrisisIds: ['crisis-ukr-frontline'],
    historicalCrisisIds: ['crisis-black-sea-grain', 'crisis-eu-energy-shock']
  },
  YE: {
    name: 'Yemen',
    code: 'YE',
    capital: 'Sanaa',
    region: 'Middle East',
    population: '34.4 Million',
    gdp: '$21 Billion',
    flagEmoji: '🇾🇪',
    coordinates: [15.3694, 44.1910],
    riskBreakdown: {
      politicalRisk: 0.89,
      economicStress: 0.84,
      conflictRisk: 0.88,
      humanitarianStress: 0.92,
      marketStress: 0.75,
    },
    summary: 'Strategic southern Arabian Peninsula nation controlling the Bab al-Mandab maritime choke point, characterized by fractured governance between the de facto northern administration and the Presidential Leadership Council.',
    currentConditions: 'Active naval standoff with multinational task forces in the Red Sea; internal economic fragmentation with competing central banks and divided currencies.',
    majorDiplomaticDevelopments: [
      'Stalled UN roadmap negotiations following escalation of Red Sea naval strikes',
      'Periodic retaliatory strikes against coastal radar and launch infrastructure',
      'Ongoing prisoner exchange mediation facilitated by the Sultanate of Oman'
    ],
    activeCrisisIds: ['crisis-red-sea-chokepoint'],
    historicalCrisisIds: []
  },
  LB: {
    name: 'Lebanon',
    code: 'LB',
    capital: 'Beirut',
    region: 'Middle East',
    population: '5.5 Million',
    gdp: '$23 Billion',
    flagEmoji: '🇱🇧',
    coordinates: [33.8938, 35.5018],
    riskBreakdown: {
      politicalRisk: 0.87,
      economicStress: 0.93,
      conflictRisk: 0.95,
      humanitarianStress: 0.89,
      marketStress: 0.86,
    },
    summary: 'Levantine Mediterranean republic experiencing compound systemic crises: protracted presidential vacancy, deep sovereign debt insolvency, and acute cross-border military escalation.',
    currentConditions: 'Intense cross-border bombardment, mass civilian displacement across Mount Lebanon and Bekaa Valley, hospitals operating under emergency protocols.',
    majorDiplomaticDevelopments: [
      'International diplomatic push led by France and the US for implementation of UNSC Resolution 1701',
      'Prolonged failure of parliament to elect a President of the Republic since late 2022',
      'Suspension of comprehensive IMF reform package implementation'
    ],
    activeCrisisIds: ['crisis-middle-east-regional'],
    historicalCrisisIds: []
  },
  SD: {
    name: 'Sudan',
    code: 'SD',
    capital: 'Khartoum',
    region: 'North-East Africa',
    population: '48.1 Million',
    gdp: '$31 Billion',
    flagEmoji: '🇸🇩',
    coordinates: [15.5007, 32.5599],
    riskBreakdown: {
      politicalRisk: 0.98,
      economicStress: 0.95,
      conflictRisk: 0.98,
      humanitarianStress: 0.99,
      marketStress: 0.88,
    },
    summary: 'Northeast African nation facing state fragmentation following armed clashes between the Sudanese Armed Forces (SAF) and the paramilitary Rapid Support Forces (RSF).',
    currentConditions: 'Severe urban devastation in Khartoum and El Fasher; IPC Phase 5 famine declared in North Darfur; banking and communication networks non-functional in contested zones.',
    majorDiplomaticDevelopments: [
      'ALPS diplomatic coalition talks in Switzerland establishing emergency aid delivery protocols',
      'UN Security Council Resolution 2736 demanding the cessation of the siege of El Fasher',
      'Suspension of African Union membership pending constitutional restoration'
    ],
    activeCrisisIds: ['crisis-sudan-humanitarian'],
    historicalCrisisIds: []
  },
  TW: {
    name: 'Taiwan',
    code: 'TW',
    capital: 'Taipei',
    region: 'East Asia',
    population: '23.4 Million',
    gdp: '$790 Billion',
    flagEmoji: '🇹🇼',
    coordinates: [25.0330, 121.5654],
    riskBreakdown: {
      politicalRisk: 0.45,
      economicStress: 0.28,
      conflictRisk: 0.69,
      humanitarianStress: 0.15,
      marketStress: 0.62,
    },
    summary: 'Democratic island economy that serves as the indispensable epicenter of global advanced semiconductor fabrication, facing persistent gray-zone military coercion and diplomatic encirclement.',
    currentConditions: 'Continuous monitoring of PLA joint combat patrols crossing the median line; ongoing defense hardening, civil defense expansion, and domestic submarine commissioning.',
    majorDiplomaticDevelopments: [
      'Inauguration of President Lai Ching-te followed by comprehensive Chinese military drills',
      'US Congress approving Foreign Military Financing and presidential drawdown authority',
      'TSMC international fab expansion underway in Japan (Kumamoto), US (Arizona), and Germany (Dresden)'
    ],
    activeCrisisIds: ['crisis-taiwan-strait-airspace'],
    historicalCrisisIds: []
  },
  AR: {
    name: 'Argentina',
    code: 'AR',
    capital: 'Buenos Aires',
    region: 'South America',
    population: '46.0 Million',
    gdp: '$640 Billion',
    flagEmoji: '🇦🇷',
    coordinates: [-34.6037, -58.3816],
    riskBreakdown: {
      politicalRisk: 0.52,
      economicStress: 0.74,
      conflictRisk: 0.12,
      humanitarianStress: 0.55,
      marketStress: 0.68,
    },
    summary: 'Major South American agricultural and energy power undergoing structural economic shock therapy under President Javier Milei aimed at zero fiscal deficit and hyperinflation eradication.',
    currentConditions: 'First consolidated fiscal surplus in over a decade; monthly inflation down to ~4%; domestic activity recovering slowly after deep initial contraction.',
    majorDiplomaticDevelopments: [
      'Passage of foundational Ley de Bases deregulation and investment reform framework',
      'Ongoing discussions with the IMF for potential new financial program to exit FX controls',
      'Entry into OECD accession roadmap discussions and purchase of F-16 fighters from Denmark'
    ],
    activeCrisisIds: ['crisis-argentina-economic-shock'],
    historicalCrisisIds: []
  },
  ML: {
    name: 'Mali',
    code: 'ML',
    capital: 'Bamako',
    region: 'West Africa / Sahel',
    population: '22.6 Million',
    gdp: '$19 Billion',
    flagEmoji: '🇲🇱',
    coordinates: [12.6392, -8.0029],
    riskBreakdown: {
      politicalRisk: 0.91,
      economicStress: 0.82,
      conflictRisk: 0.86,
      humanitarianStress: 0.85,
      marketStress: 0.64,
    },
    summary: 'Sahelian state governed by military authorities who abrogated the 2015 Algiers Peace Accord, severed defense ties with France and the UN, and formed the Alliance of Sahel States with Burkina Faso and Niger.',
    currentConditions: 'Escalating clashes with northern Tuareg rebel coalitions and Al-Qaeda affiliate JNIM; deployment of Russian private military contractors.',
    majorDiplomaticDevelopments: [
      'Formation of Confederation of Sahel States (AES) with unified military command',
      'Formal notice of withdrawal from the 15-nation ECOWAS bloc',
      'Complete withdrawal and liquidation of the UN MINUSMA peacekeeping mission'
    ],
    activeCrisisIds: ['crisis-sahel-political-instability'],
    historicalCrisisIds: []
  },
  DE: {
    name: 'Germany',
    code: 'DE',
    capital: 'Berlin',
    region: 'Western Europe',
    population: '84.4 Million',
    gdp: '$4.45 Trillion',
    flagEmoji: '🇩🇪',
    coordinates: [52.5200, 13.4050],
    riskBreakdown: {
      politicalRisk: 0.35,
      economicStress: 0.48,
      conflictRisk: 0.22,
      humanitarianStress: 0.18,
      marketStress: 0.38,
    },
    summary: 'Europe\'s largest industrial powerhouse navigating post-Russian energy restructuring, sluggish domestic manufacturing output, and political coalition friction.',
    currentConditions: 'Natural gas storage levels exceeding 95%; economic growth near zero; structural automotive transition pressures from Chinese EV competitors.',
    majorDiplomaticDevelopments: [
      'Implementation of €100B Zeitenwende special defense modernization fund',
      'Expansion of NATO forward brigade deployment in Lithuania',
      'Establishment of new bilateral energy pacts with Norway, Qatar, and the US'
    ],
    activeCrisisIds: [],
    historicalCrisisIds: ['crisis-eu-energy-shock']
  },
  EG: {
    name: 'Egypt',
    code: 'EG',
    capital: 'Cairo',
    region: 'North Africa / Middle East',
    population: '105.0 Million',
    gdp: '$395 Billion',
    flagEmoji: '🇪🇬',
    coordinates: [30.0444, 31.2357],
    riskBreakdown: {
      politicalRisk: 0.60,
      economicStress: 0.68,
      conflictRisk: 0.48,
      humanitarianStress: 0.58,
      marketStress: 0.54,
    },
    summary: 'Arab world\'s demographic anchor balancing regional ceasefire mediation in Gaza while rebuilding sovereign liquidity after Red Sea shipping disruptions halved Suez Canal receipts.',
    currentConditions: 'Sovereign reserves at all-time high following Ras El-Hekma investment; tight monetary policy to rein in 25%+ domestic consumer inflation.',
    majorDiplomaticDevelopments: [
      'Secured historic $35B sovereign investment agreement from Abu Dhabi fund ADQ',
      'Expansion of IMF Extended Fund Facility to $8 Billion',
      'Key mediator alongside Qatar and the United States in regional ceasefire negotiations'
    ],
    activeCrisisIds: ['crisis-egypt-debt-stress'],
    historicalCrisisIds: ['crisis-red-sea-chokepoint']
  },
  JP: {
    name: 'Japan',
    code: 'JP',
    capital: 'Tokyo',
    region: 'East Asia',
    population: '124.5 Million',
    gdp: '$4.21 Trillion',
    flagEmoji: '🇯🇵',
    coordinates: [35.6762, 139.6503],
    riskBreakdown: {
      politicalRisk: 0.28,
      economicStress: 0.36,
      conflictRisk: 0.32,
      humanitarianStress: 0.12,
      marketStress: 0.58,
    },
    summary: 'G7 economic power pursuing historic exit from negative interest rates while expanding defense expenditures to 2% of GDP in response to regional ballistic and naval challenges.',
    currentConditions: 'Bank of Japan normalizing interest rates carefully after August carry-trade market shock; continuous yen stabilization operations.',
    majorDiplomaticDevelopments: [
      'Historical trilateral Camp David security cooperation deepened with US and ROK',
      'Rapid buildup of defense counterstrike capabilities and missile procurement',
      'Semiconductor sovereign capacity revival with domestic Rapidus foundry project'
    ],
    activeCrisisIds: [],
    historicalCrisisIds: ['crisis-yen-carry-unwind']
  }
};
