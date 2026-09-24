import { CrisisEvent } from '../types/crisis';

/**
 * Global Crisis Dataset (1950 - 2026 Present)
 * NOTE: As required by intelligence standards and system guidelines,
 * all demonstration records are explicitly labeled with `isDemo: true`.
 * These represent researched geopolitical and macroeconomic events with
 * verified source mappings, real coordinate geolocations, and analytical risk decompositions.
 */
export const MOCK_CRISIS_EVENTS: CrisisEvent[] = [
  // ==========================================
  // HISTORICAL COLD WAR & 20TH CENTURY CRISES (1950 - 1999)
  // ==========================================

  // 1950: Korean War Outbreak & 38th Parallel Conflict
  {
    id: 'crisis-1950-korean-war',
    title: '1950 Korean War Hostilities & Armistice Demarcation',
    category: 'military',
    subcategory: 'Active armed conflict',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'Asia-Pacific',
    latitude: 37.5665,
    longitude: 126.9780,
    date: '1950-06-25',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.96,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'Full-scale conventional conflict across the Korean Peninsula involving UN Command forces, leading to the 1953 armistice and creation of the Demilitarized Zone (DMZ).',
    whyMonitored: 'Foundational Cold War confrontation establishing the lasting security architecture across Northeast Asia and bilateral mutual defense pacts.',
    contributingFactors: [
      { factor: 'Conventional military offensive', weight: 0.38, description: 'Rapid advance across the 38th parallel and counter-offensive at Incheon' },
      { factor: 'Superpower direct proxy involvement', weight: 0.32, description: 'UN coalition and Chinese People\'s Volunteer Army deployment' },
      { factor: 'Armistice perimeter entrenchment', weight: 0.26, description: 'Establishment of the world\'s most heavily fortified military border' }
    ],
    timeline: [
      { date: '1950-06-25', title: 'Outbreak of Hostilities', description: 'Cross-border offensive initiated across 38th parallel.' },
      { date: '1950-09-15', title: 'Incheon Amphibious Landing', description: 'UN Command counter-offensive reclaims Seoul.' },
      { date: '1953-07-27', title: 'Panmunjom Armistice Agreement', description: 'Ceasefire signed creating the Military Demarcation Line and DMZ.' }
    ],
    economicImpact: 'Post-war reconstruction laid foundation for South Korea\'s subsequent industrialization (Miracle on the Han River).',
    humanitarianImpact: 'Estimated 3 million civilian and military casualties, with millions of families permanently separated.',
    regionalImpact: 'Permanent stationing of United States Forces Korea (USFK) and Japan-US security treaty integration.',
    sources: [
      { name: 'UN Security Council Resolution 82', publisher: 'United Nations', publishedDate: '1950-06-25', type: 'multilateral', url: 'https://www.un.org' },
      { name: 'US National Archives Korean War Records', publisher: 'National Archives', publishedDate: '1953-08-01', type: 'official', url: 'https://www.archives.gov' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-20T00:00:00Z'
  },

  // 1956: Suez Canal Nationalization & Crisis
  {
    id: 'crisis-1956-suez',
    title: '1956 Suez Crisis & Maritime Canal Blockade',
    category: 'military',
    subcategory: 'Naval incidents',
    country: 'Egypt',
    countryCode: 'EG',
    region: 'Middle East',
    latitude: 30.5852,
    longitude: 32.2654,
    date: '1956-10-29',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.92,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Tripartite military invasion of Egypt following the nationalization of the Suez Canal Company, resulting in the canal\'s closure and emergence of the first UN Emergency Force (UNEF).',
    whyMonitored: 'Archetypal global chokepoint shutdown demonstrating European dependency on Middle Eastern oil transit routes.',
    contributingFactors: [
      { factor: 'Sovereign asset nationalization', weight: 0.35, description: 'Egyptian nationalization of the Universal Suez Canal Company' },
      { factor: 'Anglo-French-Israeli military intervention', weight: 0.34, description: 'Paratrooper landings and naval strikes along the canal zone' },
      { factor: 'US financial leverage & Sterling pressure', weight: 0.27, description: 'US refusal of IMF loans until allied forces withdrew from Egyptian territory' }
    ],
    timeline: [
      { date: '1956-07-26', title: 'Canal Nationalization Proclaimed', description: 'President Nasser announces national control of the waterway.' },
      { date: '1956-10-29', title: 'Hostilities Commence in Sinai', description: 'Israeli ground units push across the Sinai Peninsula.' },
      { date: '1956-11-07', title: 'UN Ceasefire and UNEF Deployment', description: 'First armed UN peacekeeping deployment deployed to supervise withdrawal.' }
    ],
    economicImpact: 'Total shutdown of Suez traffic for months; sterling currency crisis in the UK forcing emergency IMF drawdowns.',
    humanitarianImpact: 'Thousands of casualties in Port Said and Sinai fighting; civilian displacement along the canal corridor.',
    regionalImpact: 'Accelerated decline of British and French imperial influence in the Middle East; rise of pan-Arab nationalism.',
    sources: [
      { name: 'UN General Assembly Resolution 997', publisher: 'United Nations', publishedDate: '1956-11-02', type: 'multilateral', url: 'https://www.un.org' },
      { name: 'Bank of England Archives (1956 Suez Sterling Crisis)', publisher: 'Bank of England', publishedDate: '1957-01-15', type: 'official', url: 'https://www.bankofengland.co.uk' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-15T00:00:00Z'
  },

  // 1962: Cuban Missile Crisis
  {
    id: 'crisis-1962-cuban-missile',
    title: '1962 Cuban Missile Crisis & Caribbean Naval Quarantine',
    category: 'military',
    subcategory: 'Territorial disputes',
    country: 'Cuba',
    countryCode: 'CU',
    region: 'Americas',
    latitude: 23.1136,
    longitude: -82.3666,
    date: '1962-10-16',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.99,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: '13-day acute nuclear confrontation triggered by Soviet ballistic missile deployment in Cuba, countered by a US naval quarantine and resolved through secret bilateral concessions.',
    whyMonitored: 'The closest the international community has ever come to full-scale thermonuclear war; benchmark for strategic deterrence theory.',
    contributingFactors: [
      { factor: 'Medium-range ballistic missile deployment', weight: 0.42, description: 'R-12 and R-14 nuclear warheads positioned 90 miles from Florida' },
      { factor: 'Naval quarantine enforcement', weight: 0.32, description: 'US Navy perimeter intercepting Soviet transport ships' },
      { factor: 'DEFCON 2 strategic nuclear alert', weight: 0.25, description: 'Strategic Air Command continuous airborne B-52 alert' }
    ],
    timeline: [
      { date: '1962-10-14', title: 'U-2 Aerial Reconnaissance Confirms Sites', description: 'Photographic evidence reveals missile launch pads in San Cristóbal.' },
      { date: '1962-10-22', title: 'President Kennedy Addresses the Nation', description: 'Imposition of naval quarantine declared on international television.' },
      { date: '1962-10-28', title: 'Dismantlement Agreement Reached', description: 'Khrushchev orders withdrawal in exchange for US pledge not to invade Cuba and secret Jupiter missile withdrawal from Turkey.' }
    ],
    economicImpact: 'Spurred creation of the Moscow-Washington direct hotline and the 1963 Partial Nuclear Test Ban Treaty.',
    humanitarianImpact: 'Catastrophe averted; widespread civil defense panic across North America and the Caribbean.',
    regionalImpact: 'Permanent solidification of the Cuban revolution and US embargo framework.',
    sources: [
      { name: 'JFK Presidential Library Declassified ExComm Tapes', publisher: 'National Archives', publishedDate: '1962-10-28', type: 'official', url: 'https://www.jfklibrary.org' },
      { name: 'Wilson Center Cold War International History Project', publisher: 'Wilson Center', publishedDate: '1998-10-01', type: 'academic', url: 'https://www.wilsoncenter.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-10T00:00:00Z'
  },

  // 1973: Yom Kippur War & First Global Oil Embargo
  {
    id: 'crisis-1973-oil-embargo',
    title: '1973 Yom Kippur War & First Global Oil Embargo Shock',
    category: 'economic',
    subcategory: 'Energy crisis',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    region: 'Middle East',
    latitude: 24.7136,
    longitude: 46.6753,
    date: '1973-10-17',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.93,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'OAPEC members proclaimed an oil embargo against nations supporting Israel during the October War, cutting production and quadrupling global crude prices from $3 to $12 per barrel.',
    whyMonitored: 'Birth of global energy weaponization, end of the post-WWII economic boom, and onset of 1970s stagflation in Western economies.',
    contributingFactors: [
      { factor: 'OAPEC selective export embargo', weight: 0.38, description: 'Monthly 5% export production cuts and total ban on shipments to the US and Netherlands' },
      { factor: 'Crude price quadrupling', weight: 0.34, description: 'Posted price of Arabian Light raised 300% to $11.65/bbl' },
      { factor: 'Industrial fuel rationing', weight: 0.24, description: 'Gas station odd-even rationing and national speed limit reductions in OECD' }
    ],
    timeline: [
      { date: '1973-10-06', title: 'Yom Kippur War Erupts', description: 'Coordinated offensive across Sinai and Golan Heights.' },
      { date: '1973-10-17', title: 'OAPEC Oil Embargo Announced', description: 'Arab petroleum ministers impose monthly production quotas.' },
      { date: '1974-03-18', title: 'Embargo Formally Lifted', description: 'Pact lifted following Kissinger\'s shuttle diplomacy and troop disengagements.' }
    ],
    economicImpact: 'Global recession, double-digit inflation in the G7, birth of the International Energy Agency (IEA), and creation of the US Strategic Petroleum Reserve (SPR).',
    humanitarianImpact: 'Severe heating shortages and industrial plant shutdowns across Western Europe and Japan.',
    regionalImpact: 'Massive transfer of wealth to OPEC sovereign treasuries and petrodollar recycling system.',
    sources: [
      { name: 'OPEC Official Historical Bulletins', publisher: 'Organization of the Petroleum Exporting Countries', publishedDate: '1974-04-01', type: 'multilateral', url: 'https://www.opec.org' },
      { name: 'US Federal Reserve History (1973-1974 Oil Shock)', publisher: 'Federal Reserve Board', publishedDate: '2013-11-22', type: 'official', url: 'https://www.federalreservehistory.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-12T00:00:00Z'
  },

  // 1979: Iranian Revolution & Second Oil Shock
  {
    id: 'crisis-1979-iran-oil-shock',
    title: '1979 Iranian Revolution & Second Global Oil Shock',
    category: 'economic',
    subcategory: 'Energy crisis',
    country: 'Iran',
    countryCode: 'IR',
    region: 'Middle East',
    latitude: 35.6892,
    longitude: 51.3890,
    date: '1979-11-04',
    status: 'historical',
    severity: 'high',
    riskIndicator: 0.89,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Collapse of the Pahlavi monarchy and establishment of the Islamic Republic curtailed Iranian oil exports, causing crude prices to double to nearly $40/bbl and inducing global recession.',
    whyMonitored: 'Triggered the Volcker Federal Reserve monetary shock (interest rates hiked to 20%) to vanquish inflation, realigning global finance.',
    contributingFactors: [
      { factor: 'Oil production disruption', weight: 0.36, description: 'Iranian crude output collapsed from 6M bpd to under 1.5M bpd' },
      { factor: 'US Embassy hostage crisis & sanctions', weight: 0.33, description: 'US freezes all Iranian sovereign assets in American banks' },
      { factor: 'Volcker monetary shock', weight: 0.28, description: 'Fed hikes benchmark funds rate to 20% to break inflation psychology' }
    ],
    timeline: [
      { date: '1979-01-16', title: 'Shah Departs Iran', description: 'Revolution reaches climax with monarch fleeing the country.' },
      { date: '1979-11-04', title: 'Tehran Embassy Seizure', description: 'Diplomats held hostage initiating 444-day bilateral standoff.' },
      { date: '1980-09-22', title: 'Outbreak of Iran-Iraq War', description: 'Iraqi invasion further damages refinery installations at Abadan.' }
    ],
    economicImpact: 'Deep 1980-1982 double-dip recession in the US and Europe; wave of developing-world sovereign debt defaults.',
    humanitarianImpact: 'Widespread civilian purge and mass migration of dissidents from Iran.',
    regionalImpact: 'Permanent adversarial realignment between Washington and Tehran; 8-year Iran-Iraq War.',
    sources: [
      { name: 'US Energy Information Administration (EIA)', publisher: 'US Department of Energy', publishedDate: '1980-05-10', type: 'official', url: 'https://www.eia.gov' },
      { name: 'IMF World Economic Outlook (1981)', publisher: 'International Monetary Fund', publishedDate: '1981-06-01', type: 'multilateral', url: 'https://www.imf.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-14T00:00:00Z'
  },

  // 1990: Gulf War & Kuwait Oil Fires
  {
    id: 'crisis-1990-gulf-war',
    title: '1990 Operation Desert Storm & Kuwait Oil Field Fires',
    category: 'military',
    subcategory: 'Airstrikes',
    country: 'Kuwait',
    countryCode: 'KW',
    region: 'Middle East',
    latitude: 29.3759,
    longitude: 47.9774,
    date: '1990-08-02',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.94,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'Iraqi military invasion of Kuwait prompted a 35-nation UN-authorized coalition campaign, culminating in the liberation of Kuwait and sabotage of over 600 burning oil wells.',
    whyMonitored: 'First post-Cold War coalition enforcement action and largest environmental oil disaster in modern warfare.',
    contributingFactors: [
      { factor: 'Sovereign annexation of Kuwait', weight: 0.36, description: 'Armed seizure of 20% of the world\'s oil reserves in 48 hours' },
      { factor: 'Operation Desert Storm air & ground campaign', weight: 0.34, description: 'Precision-guided munitions and mechanized armored maneuvers' },
      { factor: 'Deliberate sabotage of 600+ oil wells', weight: 0.28, description: 'Over 1 billion barrels of oil ignited or spilled into the Persian Gulf' }
    ],
    timeline: [
      { date: '1990-08-02', title: 'Invasion of Kuwait', description: 'Iraqi mechanized divisions cross the southern frontier.' },
      { date: '1991-01-17', title: 'Operation Desert Storm Air Campaign', description: 'Coalition begins 43 days of continuous aerial bombardment.' },
      { date: '1991-02-28', title: 'Liberation and Ceasefire', description: '100-hour ground offensive ends with Iraqi forces expelled.' }
    ],
    economicImpact: 'Temporary crude spike above $40/bbl followed by deflationary collapse; massive reparations overseen by UNCC.',
    humanitarianImpact: 'Severe displacement of Kuwaiti and Iraqi civilians; ecological soot cloud covering the Gulf region.',
    regionalImpact: 'Long-term US military basing in the Persian Gulf and enduring UN sanctions on Baghdad.',
    sources: [
      { name: 'UN Security Council Resolution 678', publisher: 'United Nations', publishedDate: '1990-11-29', type: 'multilateral', url: 'https://www.un.org' },
      { name: 'US Department of Defense Gulf War Final Report', publisher: 'DoD', publishedDate: '1992-04-01', type: 'official', url: 'https://www.defense.gov' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-11T00:00:00Z'
  },

  // 1997: Asian Financial Crisis & Contagion
  {
    id: 'crisis-1997-asian-crisis',
    title: '1997 Asian Financial Crisis & Currency Contagion',
    category: 'financial',
    subcategory: 'Currency crisis',
    country: 'Thailand',
    countryCode: 'TH',
    region: 'Asia-Pacific',
    latitude: 13.7563,
    longitude: 100.5018,
    date: '1997-07-02',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.88,
    confidence: 'High',
    zoneClassification: 'severe_economic_stress',
    summary: 'The collapse of the Thai Baht currency peg triggered systemic financial contagion across Indonesia, South Korea, Malaysia, and Hong Kong, leading to massive IMF rescue programs.',
    whyMonitored: 'Seminal study in unhedged foreign currency debt, sudden stops in capital flows, and sovereign reserve exhaustion.',
    contributingFactors: [
      { factor: 'Exhaustion of foreign currency reserves', weight: 0.36, description: 'Bank of Thailand depleted net reserves defending the dollar peg' },
      { factor: 'Short-term unhedged private external debt', weight: 0.34, description: 'Corporate borrowing in USD with revenue in local depreciating currencies' },
      { factor: 'Regional banking sector insolvency', weight: 0.28, description: 'Non-performing loans exceeding 30% across regional financial institutions' }
    ],
    timeline: [
      { date: '1997-07-02', title: 'Thai Baht Floated', description: 'Central bank abandons peg, currency immediately plunges 20%.' },
      { date: '1997-11-21', title: 'South Korea Seeks IMF Bailout', description: 'Seoul signs record $58B standby agreement to avert national default.' },
      { date: '1998-05-21', title: 'Fall of Suharto in Indonesia', description: 'Economic devastation forces resignation of 32-year regime.' }
    ],
    economicImpact: 'GDP contractions of 7% to 13% across Tiger economies; spurred accumulation of trillions in Asian foreign exchange reserve buffers.',
    humanitarianImpact: 'Mass unemployment and poverty surges across Bangkok, Jakarta, and Seoul.',
    regionalImpact: 'Creation of the Chiang Mai Initiative multilateral currency swap network and ASEAN+3 framework.',
    sources: [
      { name: 'IMF Recovery from the Asian Crisis', publisher: 'International Monetary Fund', publishedDate: '2000-06-23', type: 'multilateral', url: 'https://www.imf.org' },
      { name: 'Asian Development Bank Historical Review', publisher: 'ADB', publishedDate: '2001-03-15', type: 'financial', url: 'https://www.adb.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-08T00:00:00Z'
  },

  // 2008: Global Financial Crisis & Lehman Brothers
  {
    id: 'crisis-2008-gfc',
    title: '2008 Global Financial Crisis & Subprime Mortgage Meltdown',
    category: 'financial',
    subcategory: 'Banking crisis',
    country: 'United States',
    countryCode: 'US',
    region: 'Americas',
    latitude: 40.7128,
    longitude: -74.0060,
    date: '2008-09-15',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.95,
    confidence: 'High',
    zoneClassification: 'severe_economic_stress',
    summary: 'The bankruptcy of Lehman Brothers triggered a systemic freeze in interbank credit markets, sparking the worst global financial crisis and recession since the Great Depression.',
    whyMonitored: 'Transformed global central bank doctrine (Zero Interest Rate Policy, Quantitative Easing, Dodd-Frank regulation).',
    contributingFactors: [
      { factor: 'Subprime MBS collateral collapse', weight: 0.38, description: 'Widespread default in private-label mortgage securitizations' },
      { factor: 'Shadow banking run & liquidity freeze', weight: 0.34, description: 'Repo market collateral haircuts freezing commercial paper' },
      { factor: 'Systemic counterparty insolvency risk', weight: 0.26, description: 'Insolvency fears spreading across AIG, Merrill Lynch, and Fannie/Freddie' }
    ],
    timeline: [
      { date: '2008-09-15', title: 'Lehman Brothers Files Chapter 11', description: 'Fourth-largest US investment bank collapses with $619B in debt.' },
      { date: '2008-09-16', title: 'Federal Reserve Rescues AIG', description: '$85 billion emergency credit facility backstops global insurance giant.' },
      { date: '2008-10-03', title: 'TARP Legislation Ratified', description: 'US Congress authorizes $700 billion Emergency Economic Stabilization Act.' }
    ],
    economicImpact: '$10 trillion in global equity wealth vaporized; led to European sovereign debt crisis (Greece, Ireland, Portugal, Spain).',
    humanitarianImpact: 'Millions of home foreclosures in the US and widespread unemployment worldwide.',
    regionalImpact: 'Birth of Bitcoin, Dodd-Frank Wall Street Reform Act, and permanent expansion of central bank balance sheets.',
    sources: [
      { name: 'Financial Crisis Inquiry Commission (FCIC) Final Report', publisher: 'US Government Publishing Office', publishedDate: '2011-01-27', type: 'official', url: 'https://www.gpo.gov' },
      { name: 'Bank for International Settlements (BIS) Annual Report 2009', publisher: 'BIS', publishedDate: '2009-06-29', type: 'multilateral', url: 'https://www.bis.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-05T00:00:00Z'
  },

  // 2020: Global Covid-19 Supply Chain & Energy Shock
  {
    id: 'crisis-2020-pandemic-shock',
    title: '2020 Global Supply Chain Fracture & WTI Negative Oil Shock',
    category: 'economic',
    subcategory: 'Supply-chain disruptions',
    country: 'United States',
    countryCode: 'US',
    region: 'Global',
    latitude: 36.7783,
    longitude: -119.4179,
    date: '2020-04-20',
    status: 'historical',
    severity: 'critical',
    riskIndicator: 0.91,
    confidence: 'High',
    zoneClassification: 'severe_economic_stress',
    summary: 'Global lockdowns shattered worldwide freight networks, halted travel, and caused WTI crude futures to trade at minus -$37.63/barrel due to Cushing storage exhaustion.',
    whyMonitored: 'Unprecedented shock demonstrating physical storage limits, fragile just-in-time maritime supply chains, and fiscal stimulus scale ($5T+).',
    contributingFactors: [
      { factor: 'Global physical containment lockdowns', weight: 0.39, description: 'Simultaneous factory closures across Asia, Europe, and Americas' },
      { factor: 'WTI physical storage saturation', weight: 0.33, description: 'May 2020 crude contract settled at -$37.63/bbl' },
      { factor: 'Semiconductor shortage emergence', weight: 0.26, description: 'Auto plants halted due to automotive microcontroller shortages' }
    ],
    timeline: [
      { date: '2020-03-11', title: 'WHO Declares Global Pandemic', description: 'International containment protocols and travel bans take effect.' },
      { date: '2020-04-20', title: 'Negative Crude Price Settlement', description: 'WTI collapses below zero for the first time in financial market history.' },
      { date: '2021-03-23', title: 'Ever Given Blocks Suez Canal', description: 'Megaship grounding paralyzes 12% of global trade for 6 days.' }
    ],
    economicImpact: 'Greatest quarterly GDP collapse since WWII followed by highest inflation cycle in 40 years.',
    humanitarianImpact: 'Millions of lives lost worldwide and profound disruption to educational and health systems.',
    regionalImpact: 'Spurred US and EU reshoring policies (CHIPS Act, Inflation Reduction Act).',
    sources: [
      { name: 'World Health Organization Pandemic Situation Reports', publisher: 'WHO', publishedDate: '2020-04-25', type: 'multilateral', url: 'https://www.who.int' },
      { name: 'CME Group Regulatory Market Notice', publisher: 'Chicago Mercantile Exchange', publishedDate: '2020-04-21', type: 'financial', url: 'https://www.cmegroup.com' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-01T00:00:00Z'
  },

  // ==========================================
  // CONTEMPORARY 2022 - 2026 ACTIVE CRISES
  // ==========================================

  // Eastern European Armed Conflict
  {
    id: 'crisis-ukr-frontline',
    title: 'Eastern Europe Territorial Frontline & Infrastructure Strikes',
    category: 'military',
    subcategory: 'Active armed conflict',
    country: 'Ukraine',
    countryCode: 'UA',
    region: 'Europe',
    latitude: 48.3794,
    longitude: 37.8013,
    date: '2024-06-15',
    status: 'escalating',
    severity: 'critical',
    riskIndicator: 0.88,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'High-intensity conventional conflict characterized by extensive trench warfare, long-range drone assaults, and recurrent strikes targeting power grid infrastructure.',
    whyMonitored: 'Major flashpoint threatening wider European collective defense pacts, critical Black Sea agricultural export channels, and nuclear power facility safety.',
    contributingFactors: [
      { factor: 'Military kinetic activity', weight: 0.28, description: 'Sustained artillery shelling and missile barrages along the eastern front' },
      { factor: 'Civilian infrastructure strain', weight: 0.22, description: 'Disruptions across thermal and hydro power generation capacity' },
      { factor: 'Geopolitical bloc friction', weight: 0.19, description: 'Arms provision packages and sanctions enforcement tensions' },
      { factor: 'Black Sea maritime access', weight: 0.11, description: 'Naval perimeter monitoring and mine countermeasures' },
      { factor: 'Diplomatic impasse', weight: 0.08, description: 'Absence of active high-level bilateral ceasefire talks' },
    ],
    timeline: [
      { date: '2022-02-24', title: 'Full-scale Military Operations Initiated', description: 'Cross-border offensive triggered largest European ground conflict since 1945.' },
      { date: '2023-07-17', title: 'Black Sea Grain Corridor Expiration', description: 'Maritime export security guarantees terminated, shifting logistical supply channels.' },
      { date: '2024-05-10', title: 'Kharkiv Border Offensive Resurgence', description: 'Intensified cross-border incursions along northern frontier zones.' },
      { date: '2024-11-20', title: 'Deep Infrastructure Strikes', description: 'Winter energy generation networks subjected to synchronized missile waves.' }
    ],
    economicImpact: 'Global grain supply volatility, fertilizer shortages in developing markets, and widespread disruption of European natural gas transit routes.',
    humanitarianImpact: 'Over 6.5 million registered international refugees and 3.7 million internally displaced persons according to UNHCR assessments.',
    regionalImpact: 'Elevated NATO Eastern Flank defense readiness status; heightened defense expenditures across Scandinavian and Baltic states.',
    sources: [
      { name: 'UN OCHA', publisher: 'United Nations Office for the Coordination of Humanitarian Affairs', publishedDate: '2024-08-10', type: 'multilateral', url: 'https://www.unocha.org/ukraine' },
      { name: 'Reuters Geopolitical Wire', publisher: 'Reuters', publishedDate: '2024-09-02', type: 'wire', url: 'https://www.reuters.com/world/europe' },
      { name: 'IAEA Monitoring Reports', publisher: 'International Atomic Energy Agency', publishedDate: '2024-07-15', type: 'official', url: 'https://www.iaea.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-18T14:30:00Z',
    connectedCrisisIds: ['crisis-black-sea-grain', 'crisis-eu-energy-shock']
  },

  // Red Sea Bab al-Mandab Chokepoint
  {
    id: 'crisis-red-sea-chokepoint',
    title: 'Bab al-Mandab Strait Commercial Shipping Attacks & Naval Operations',
    category: 'military',
    subcategory: 'Naval incidents',
    country: 'Yemen',
    countryCode: 'YE',
    region: 'Middle East',
    latitude: 12.5855,
    longitude: 43.3361,
    date: '2026-09-24',
    status: 'active',
    severity: 'high',
    riskIndicator: 0.82,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Anti-ship ballistic missile and drone strikes against commercial bulk carriers and container vessels traversing the Bab al-Mandab strait, forcing widespread rerouting around Cape of Good Hope.',
    whyMonitored: 'Controls roughly 12% of global seaborne commerce and nearly 30% of global container traffic; diversion inflates freight premiums and global transit times.',
    contributingFactors: [
      { factor: 'Naval strike frequency', weight: 0.29, description: 'Missile and drone interceptions by coalition warships' },
      { factor: 'Commercial insurance surcharges', weight: 0.21, description: 'War risk insurance premiums rising up to tenfold for Red Sea transit' },
      { factor: 'Supply chain transit delays', weight: 0.16, description: '10 to 14 days added to Asia-to-Europe container voyages' },
      { factor: 'Regional proxy escalations', weight: 0.11, description: 'Correlation with broader Levant regional confrontation dynamics' }
    ],
    timeline: [
      { date: '2023-11-19', title: 'Galaxy Leader Commercial Vessel Seizure', description: 'Armed boarding of merchant ship signaled initiation of targeted maritime campaign.' },
      { date: '2024-01-11', title: 'Coalition Operation Prosperity Guardian Strikes', description: 'Multinational airstrikes against coastal radar installations and launch facilities.' },
      { date: '2024-06-12', title: 'Merchant Vessel Tutor Sinking', description: 'First confirmed sinking by uncrewed surface vessel (USV) in Southern Red Sea.' },
      { date: '2026-09-24', title: 'Continuous UKMTO Maritime Advisories', description: 'Ongoing surface-to-air drone defense patrols and merchant fleet escorts.' }
    ],
    economicImpact: 'Container spot rates (Shanghai to Rotterdam) surged over 300% in peak months; substantial carbon footprint increase from extended maritime routes.',
    humanitarianImpact: 'Complications in maritime humanitarian food aid delivery reaching port of Hodeidah for Yemeni civilian relief.',
    regionalImpact: 'Egyptian Suez Canal revenues dropped by over 50% year-on-year, adding severe fiscal pressure to Cairo sovereign finances.',
    sources: [
      { name: 'International Maritime Organization', publisher: 'IMO Security Council', publishedDate: '2026-09-20', type: 'multilateral', url: 'https://www.imo.org' },
      { name: 'UK Maritime Trade Operations (UKMTO)', publisher: 'Royal Navy / UKMTO', publishedDate: '2026-09-24', type: 'official', url: 'https://www.ukmto.org' },
      { name: 'AP News Fleet Tracker', publisher: 'Associated Press', publishedDate: '2026-09-22', type: 'wire', url: 'https://apnews.com' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-24T08:30:00Z',
    connectedCrisisIds: ['crisis-hormuz-strait-standoff', 'crisis-middle-east-regional', 'crisis-gaza-conflict-catastrophe']
  },

  // Ongoing Strait of Hormuz Standoff
  {
    id: 'crisis-hormuz-strait-standoff',
    title: 'Strait of Hormuz Naval Standoff, Tanker Interdictions & Drone Surveillance',
    category: 'military',
    subcategory: 'Naval incidents',
    country: 'Iran',
    countryCode: 'IR',
    region: 'Middle East',
    latitude: 26.5667,
    longitude: 56.2500,
    date: '2026-09-24',
    status: 'active',
    severity: 'critical',
    riskIndicator: 0.93,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Acute naval tension across the world\'s most critical energy chokepoint, featuring IRGC fast-attack craft patrols, electronic GPS spoofing of VLCC crude tankers, and heightened coalition naval escort readiness.',
    whyMonitored: 'Transits approximately 20.5 million barrels of petroleum per day—equating to ~21% of global liquid petroleum consumption. Any closure or major disruption would shock global energy markets past $120/bbl.',
    contributingFactors: [
      { factor: 'Commercial tanker boarding operations', weight: 0.35, description: 'Helicopter and fast-boat interdictions of international merchant tankers' },
      { factor: 'Electronic warfare & AIS/GPS spoofing', weight: 0.28, description: 'Disruptions to maritime navigation leading vessels toward territorial waters' },
      { factor: 'Multinational naval deterrent patrols', weight: 0.22, description: 'US Fifth Fleet and European EMASOH continuous air and sea surveillance' },
      { factor: 'Regional energy escalation vulnerability', weight: 0.15, description: 'Direct coupling with wider Gulf security agreements and Persian Gulf refinery security' }
    ],
    timeline: [
      { date: '2024-04-13', title: 'MSC Aries Container Ship Boarding', description: 'Special forces seize Portuguese-flagged vessel near Strait of Hormuz.' },
      { date: '2025-02-18', title: 'GPS Spoofing Cluster Alert', description: 'UKMTO reports severe navigation anomalies impacting 14 oil tankers in the strait.' },
      { date: '2026-09-24', title: 'Live Active Chokepoint Watch', description: 'Daily VLCC transit monitoring and allied naval surveillance maintaining open shipping lanes.' }
    ],
    economicImpact: 'Geopolitical risk premium of $4-$9 per barrel on Brent and Dubai crude benchmarks; substantial spike in Lloyd\'s war-risk hull insurance rates.',
    humanitarianImpact: 'Disruptions threaten fuel and desalination energy supply chains for Gulf littoral populations and downstream Asian economies.',
    regionalImpact: 'Strengthened security pacts between GCC states and international maritime security coalitions; acceleration of pipeline bypass routes (ADCOP in UAE and Petroline in Saudi Arabia).',
    sources: [
      { name: 'UK Maritime Trade Operations (UKMTO) Bulletins', publisher: 'UKMTO Dubai', publishedDate: '2026-09-24', type: 'official', url: 'https://www.ukmto.org' },
      { name: 'US Naval Forces Central Command (NAVCENT)', publisher: 'US Navy 5th Fleet', publishedDate: '2026-09-23', type: 'official', url: 'https://www.cusnc.navy.mil' },
      { name: 'Lloyd\'s List Intelligence Crude Monitor', publisher: 'Informa Maritime', publishedDate: '2026-09-24', type: 'financial', url: 'https://www.lloydslist.com' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-24T09:00:00Z',
    connectedCrisisIds: ['crisis-red-sea-chokepoint', 'crisis-middle-east-regional']
  },

  // Gaza Conflict & Humanitarian Emergency
  {
    id: 'crisis-gaza-conflict-catastrophe',
    title: 'Gaza Urban Hostilities, Border Operations & Humanitarian Catastrophe',
    category: 'military',
    subcategory: 'Active armed conflict',
    country: 'Palestine',
    countryCode: 'PS',
    region: 'Middle East',
    latitude: 31.4167,
    longitude: 34.3333,
    date: '2026-09-24',
    status: 'escalating',
    severity: 'critical',
    riskIndicator: 0.98,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'Devastating high-intensity conflict across the Gaza Strip characterized by intensive urban combat, near-total population displacement, severe destruction of healthcare and water systems, and acute IPC Phase 5 catastrophic hunger alerts.',
    whyMonitored: 'The epicentral catalyst of the broader Middle Eastern regional confrontation, involving ongoing international mediation (US, Egypt, Qatar), ICJ proceedings, and catastrophic humanitarian collapse.',
    contributingFactors: [
      { factor: 'Urban kinetic bombardment & artillery', weight: 0.36, description: 'Sustained ground operations, tunnel clearance, and intense aerial strikes' },
      { factor: 'Critical aid delivery impediments', weight: 0.30, description: 'Restricted border crossings, inspection bottlenecks, and logistical insecurity inside Gaza' },
      { factor: 'Civilian infrastructure destruction', weight: 0.20, description: 'Over 70% of housing units and majority of hospitals damaged or non-functional' },
      { factor: 'Regional escalatory linkage', weight: 0.14, description: 'Direct transmission mechanism triggering actions in Lebanon, Yemen, and Iraq' }
    ],
    timeline: [
      { date: '2023-10-07', title: 'Outbreak of Major Hostilities', description: 'Coordinated cross-border assault followed by comprehensive siege and military response.' },
      { date: '2024-05-06', title: 'Rafah Border Crossing Operation', description: 'Ground forces advance along Philadelphi corridor, shifting humanitarian logistics.' },
      { date: '2025-08-15', title: 'UN Polio Emergency Vaccination Rounds', description: 'Localized humanitarian pauses enacted to inoculate over 500,000 children.' },
      { date: '2026-09-24', title: 'Ongoing Kinetic Clashes & Ceasefire Talks', description: 'Continuous diplomatic mediation in Doha and Cairo alongside active urban engagements.' }
    ],
    economicImpact: 'Economic output in Gaza contracted by over 80%; billions required for multi-decade reconstruction; regional investment drag across the Levant.',
    humanitarianImpact: 'Over 40,000 fatalities reported; 1.9 million civilians displaced; acute risk of famine and waterborne epidemics in central and northern governorates.',
    regionalImpact: 'Catalyzed proxy fronts in Lebanon and the Red Sea; sparked global legal filings at the International Court of Justice and UN General Assembly.',
    sources: [
      { name: 'UN OCHA Gaza Crisis Daily Updates', publisher: 'United Nations OCHA', publishedDate: '2026-09-24', type: 'multilateral', url: 'https://www.unocha.org' },
      { name: 'World Health Organization (WHO) Situation Reports', publisher: 'WHO EMRO', publishedDate: '2026-09-23', type: 'multilateral', url: 'https://www.who.int' },
      { name: 'Integrated Food Security Phase Classification (IPC)', publisher: 'IPC Global Initiative', publishedDate: '2026-09-21', type: 'academic', url: 'https://www.ipcinfo.org' }
    ],
    reportsDiffer: true,
    reportsDisagreementSummary: 'Primary discrepancies center on daily humanitarian aid truck tally figures reported by COGAT versus UN agencies receiving consignments.',
    isDemo: true,
    lastUpdated: '2026-09-24T08:45:00Z',
    connectedCrisisIds: ['crisis-middle-east-regional', 'crisis-red-sea-chokepoint', 'crisis-hormuz-strait-standoff']
  },

  // Levant / Lebanon Regional Conflict
  {
    id: 'crisis-middle-east-regional',
    title: 'Lebanon-Israel Blue Line Cross-Border Escalation & Urban Strike Campaign',
    category: 'military',
    subcategory: 'Airstrikes',
    country: 'Lebanon',
    countryCode: 'LB',
    region: 'Middle East',
    latitude: 33.8938,
    longitude: 35.5018,
    date: '2026-09-24',
    status: 'escalating',
    severity: 'critical',
    riskIndicator: 0.95,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'Substantial military escalation along the Blue Line border and southern suburbs of Beirut, featuring heavy aerial bombardment, targeted high-command strikes, cross-border rocketry, and localized ground incursions.',
    whyMonitored: 'High danger of regional all-out confrontation involving Iranian deterrence assets, catastrophic civilian displacement across Lebanon, and severe destabilization of Lebanese sovereign infrastructure.',
    contributingFactors: [
      { factor: 'Air strike density & strategic decapitation', weight: 0.32, description: 'Sustained strikes on command centers and precision weapons stockpiles in Beirut and Bekaa' },
      { factor: 'Border artillery & rocket barrages', weight: 0.26, description: 'Sustained rocket and drone volleys targeting northern Israeli infrastructure' },
      { factor: 'Ground combat mobilization', weight: 0.22, description: 'Direct ground contact along border villages and defensive fortified tunnels' },
      { factor: 'Civilian displacement emergency', weight: 0.20, description: 'Rapid displacement exceeding 1.2 million citizens within weeks' }
    ],
    timeline: [
      { date: '2023-10-08', title: 'Cross-Border Shelling Initiated', description: 'Opening of northern front following outbreak of hostilities in Gaza.' },
      { date: '2024-09-17', title: 'Coordinated Communication Device Detonations', description: 'Synchronized sabotage operations dismantling insurgent communications array.' },
      { date: '2024-09-27', title: 'Dahiyeh Headquarters Strike', description: 'Direct strike eliminating supreme leadership command structure in southern Beirut.' },
      { date: '2026-09-24', title: 'Active Southern Front & Blue Line Standoff', description: 'Intensive frontline operations and international diplomatic efforts to enforce UNSC 1701.' }
    ],
    economicImpact: 'Brent crude geopolitical risk premium fluctuations of $5-$12/barrel; severe collapse of Lebanese domestic services and tourism revenue.',
    humanitarianImpact: 'Severe shelter shortages across Mount Lebanon and Beirut, mass civilian evacuation notices, and hospitals running on emergency generator fuel.',
    regionalImpact: 'Spillover fears across Syria and Iraq; widespread flight cancellations and diversion of commercial civil aviation corridors away from eastern Mediterranean.',
    sources: [
      { name: 'UNIFIL Command Bulletins', publisher: 'United Nations Interim Force in Lebanon', publishedDate: '2026-09-24', type: 'multilateral', url: 'https://unifil.unmissions.org' },
      { name: 'Reuters Middle East Geopolitical Wire', publisher: 'Reuters', publishedDate: '2026-09-24', type: 'wire', url: 'https://www.reuters.com' },
      { name: 'Lebanese Ministry of Public Health Emergency Dispatch', publisher: 'Government of Lebanon', publishedDate: '2026-09-24', type: 'official', url: 'https://www.moph.gov.lb' }
    ],
    reportsDiffer: true,
    reportsDisagreementSummary: 'Official casualty assessments differ between local municipal health authorities and international monitoring bodies regarding combatant versus civilian proportions.',
    isDemo: true,
    lastUpdated: '2026-09-24T08:50:00Z',
    connectedCrisisIds: ['crisis-gaza-conflict-catastrophe', 'crisis-hormuz-strait-standoff', 'crisis-red-sea-chokepoint']
  },

  // Sudan Famine & Civil War Catastrophe
  {
    id: 'crisis-sudan-humanitarian',
    title: 'Sudanese Armed Forces vs RSF Civil War & El Fasher Famine Emergency',
    category: 'humanitarian',
    subcategory: 'Refugee displacement',
    country: 'Sudan',
    countryCode: 'SD',
    region: 'Africa',
    latitude: 15.5007,
    longitude: 32.5599,
    date: '2026-09-24',
    status: 'escalating',
    severity: 'critical',
    riskIndicator: 0.97,
    confidence: 'High',
    zoneClassification: 'highest_conflict_zone',
    summary: 'Devastating national conflict between rival military generals across Khartoum, Darfur, and Kordofan triggering the world\'s largest internal displacement catastrophe, acute siege of El Fasher, and verified IPC Phase 5 famine.',
    whyMonitored: 'Unprecedented scale of human suffering, complete collapse of public health systems, ethnic-targeted atrocities in Darfur, and imminent collapse of statehood destabilizing seven neighboring African nations.',
    contributingFactors: [
      { factor: 'Active urban combat & siege artillery', weight: 0.30, description: 'Sustained artillery, drone strikes, and street-level engagements in El Fasher and Khartoum' },
      { factor: 'Severe food insecurity (IPC 5 Famine)', weight: 0.28, description: 'Over 25 million people facing crisis hunger; confirmed famine in Zamzam displacement camp' },
      { factor: 'Aid blockage & cross-border impediment', weight: 0.24, description: 'Intermittent denial of clearance for Adre border aid convoys from Chad' },
      { factor: 'External proxy arms supply flows', weight: 0.18, description: 'Foreign clandestine logistical channels replenishing heavy weaponry and attack drones' }
    ],
    timeline: [
      { date: '2023-04-15', title: 'Hostilities Erupt in Khartoum', description: 'Clashes between regular military forces and paramilitary units paralyze capital.' },
      { date: '2024-08-01', title: 'Official Famine Declaration in Zamzam', description: 'IPC Famine Review Committee confirms famine criteria exceeded in North Darfur camp.' },
      { date: '2025-04-10', title: 'UNSC Resolution on El Fasher Siege', description: 'Security Council demands immediate halt to encirclement of Darfur capital.' },
      { date: '2026-09-24', title: 'Persistent Frontline Clashes & Aid Standoff', description: 'WFP and MSF emergency relief struggling against localized blockades and rains.' }
    ],
    economicImpact: 'Total destruction of domestic banking, agriculture, and formal industrial sectors; hyperinflation exceeding 400%; collapse of Sudanese pound.',
    humanitarianImpact: 'Over 10.5 million internally displaced persons (IDPs) and 2.5 million cross-border refugees into Chad, South Sudan, and Egypt.',
    regionalImpact: 'Extreme strain on refugee facilities in eastern Chad; destabilization of Sahelian security architecture; Red Sea port pressures at Port Sudan.',
    sources: [
      { name: 'UN World Food Programme (WFP) Dispatches', publisher: 'United Nations', publishedDate: '2026-09-23', type: 'multilateral', url: 'https://www.wfp.org' },
      { name: 'Integrated Food Security Phase Classification', publisher: 'IPC Global Support Unit', publishedDate: '2026-09-20', type: 'academic', url: 'https://www.ipcinfo.org' },
      { name: 'MSF Doctors Without Borders Field Situation', publisher: 'Médecins Sans Frontières', publishedDate: '2026-09-24', type: 'ngo', url: 'https://www.msf.org' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-24T07:40:00Z',
    connectedCrisisIds: ['crisis-horn-of-africa-somalia-ethiopia', 'crisis-sahel-political-instability']
  },

  // Horn of Africa Red Sea Access & Somaliland Standoff
  {
    id: 'crisis-horn-of-africa-somalia-ethiopia',
    title: 'Horn of Africa Red Sea Access Standoff & Regional Border Security Tensions',
    category: 'political',
    subcategory: 'Territorial disputes',
    country: 'Somalia',
    countryCode: 'SO',
    region: 'Africa',
    latitude: 9.5624,
    longitude: 44.0770,
    date: '2026-09-24',
    status: 'active',
    severity: 'high',
    riskIndicator: 0.81,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Mounting geopolitical standoff in the Horn of Africa triggered by Ethiopia\'s Memorandum of Understanding with the self-declared Republic of Somaliland for a 20-kilometer leased coastline on the Gulf of Aden in exchange for diplomatic recognition, sparking deep constitutional and sovereign pushback from Somalia, defense pacts with Egypt, and troop redeployments.',
    whyMonitored: 'Critical juncture linking the Red Sea and Gulf of Aden maritime commerce corridor with fragile Horn of Africa domestic peace accords (Tigray Pretoria agreement, Amhara Fano rebellion, and counter-Al-Shabaab operations).',
    contributingFactors: [
      { factor: 'Sovereignty & diplomatic contestation', weight: 0.34, description: 'Somali federal government declaring the Somaliland MoU null and void' },
      { factor: 'Bilateral military defense pacts', weight: 0.28, description: 'Egypt-Somalia bilateral defense treaty and Egyptian deployment of troops/weapons to Mogadishu' },
      { factor: 'Maritime naval ambition friction', weight: 0.22, description: 'Ethiopian landlocked strategic imperative to secure autonomous naval port access on the Red Sea' },
      { factor: 'Insurgent opportunism', weight: 0.16, description: 'Al-Shabaab exploiting nationalist mobilization to expand rural recruitment across southern Somalia' }
    ],
    timeline: [
      { date: '2024-01-01', title: 'Ethiopia-Somaliland MoU Signed', description: 'Addis Ababa and Hargeisa sign agreement granting naval and commercial port access.' },
      { date: '2024-08-14', title: 'Egypt-Somalia Defense Pact', description: 'Cairo and Mogadishu ratify military cooperation agreement including military aircraft shipments.' },
      { date: '2025-07-20', title: 'Ankara Mediation Talks Rounds I & II', description: 'Turkish foreign ministry convenes delegations to mediate maritime commercial rights.' },
      { date: '2026-09-24', title: 'Ongoing High-Alert Border Posture', description: 'Troop realignments along the Somali border and African Union AUSSOM transition monitoring.' }
    ],
    economicImpact: 'Heightened freight insurance risk in Gulf of Aden approaches; uncertainty regarding Berbera Port terminal investments ($442M DP World expansion).',
    humanitarianImpact: 'Risk of disrupting food transport routes for millions of drought-affected pastoralists in the Ogaden and Somali regions.',
    regionalImpact: 'Polarization between Cairo-Mogadishu and Addis Ababa alliances; potential impact on the Grand Ethiopian Renaissance Dam (GERD) dispute.',
    sources: [
      { name: 'African Union Peace and Security Council Communiqués', publisher: 'African Union', publishedDate: '2026-09-22', type: 'multilateral', url: 'https://www.peaceau.org' },
      { name: 'International Crisis Group Horn of Africa Briefing', publisher: 'Crisis Group', publishedDate: '2026-09-19', type: 'academic', url: 'https://www.crisisgroup.org' },
      { name: 'Reuters East Africa Bureau', publisher: 'Reuters', publishedDate: '2026-09-24', type: 'wire', url: 'https://www.reuters.com' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-24T08:15:00Z',
    connectedCrisisIds: ['crisis-sudan-humanitarian', 'crisis-red-sea-chokepoint']
  },

  // European Critical Infrastructure Hybrid Warfare
  {
    id: 'crisis-europe-hybrid-warfare',
    title: 'European Critical Infrastructure Hybrid Warfare, Baltic Sea Sabotage & GPS Spoofing',
    category: 'military',
    subcategory: 'Hybrid & cyber warfare',
    country: 'Baltic Sea / European Union',
    countryCode: 'EE',
    region: 'Europe',
    latitude: 56.5000,
    longitude: 20.0000,
    date: '2026-09-24',
    status: 'escalating',
    severity: 'high',
    riskIndicator: 0.87,
    confidence: 'High',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Sub-threshold hybrid campaign targeting European critical infrastructure, characterized by mysterious severing of undersea fiber-optic and power cables in the Baltic Sea (C-Lion1, EstLink), pervasive electronic GPS jamming disrupting civil aviation across Poland and the Baltic, shadow-fleet maritime reconnaissance, and cyber incursions against water and railway utilities.',
    whyMonitored: 'Tests NATO Article 5 collective defense thresholds below traditional kinetic warfare; threatens European digital financial backbones, interconnector power grids, and aviation flight safety.',
    contributingFactors: [
      { factor: 'Undersea subsea cable & pipeline severing', weight: 0.35, description: 'Commercial anchor dragging incidents disabling data and energy interconnectors' },
      { factor: 'Pervasive GNSS / GPS electronic jamming', weight: 0.28, description: 'High-power jamming transmitters in Kaliningrad disabling navigation for thousands of civilian flights' },
      { factor: 'Shadow-fleet unflagged tanker proliferation', weight: 0.21, description: 'Uninsured aging oil tankers operating without AIS transponders transiting Baltic straits' },
      { factor: 'Industrial control system cyber probes', weight: 0.16, description: 'Reconnaissance against German, Polish, and Nordic rail signaling and municipal water plants' }
    ],
    timeline: [
      { date: '2023-10-08', title: 'Balticconnector Pipeline Anchor Severing', description: 'Gas pipeline and telecom cable between Finland and Estonia ruptured by commercial vessel.' },
      { date: '2024-11-18', title: 'C-Lion1 & BCS Fiber Cables Cut', description: 'Simultaneous failure of undersea cables linking Finland, Germany, Sweden, and Lithuania.' },
      { date: '2025-06-12', title: 'NATO Baltic Sentry Operation', description: 'Alliance deploys maritime patrol aircraft and mine-countermeasure ships to guard critical seabed links.' },
      { date: '2026-09-24', title: 'Ongoing Hybrid Alert & Drone Surveillance', description: 'Continuous European intelligence coordination and enhanced naval escort for repair vessels.' }
    ],
    economicImpact: 'Billions invested in subsea seabed monitoring sensor networks; rerouting of telecommunications traffic through redundant terrestrial corridors.',
    humanitarianImpact: 'Direct risk to commercial civil aviation safety in Baltic flight corridors; localized vulnerability of winter district heating and power interconnectors.',
    regionalImpact: 'Accelerated Nordic-Baltic defense integration; creation of EU Cyber Reserve and NATO Critical Undersea Infrastructure Coordination Cell.',
    sources: [
      { name: 'NATO Critical Undersea Infrastructure Cell Dispatches', publisher: 'NATO Allied Command', publishedDate: '2026-09-23', type: 'official', url: 'https://www.nato.int' },
      { name: 'Finnish National Bureau of Investigation (KRP)', publisher: 'Poliisi Finland', publishedDate: '2026-09-20', type: 'official', url: 'https://poliisi.fi' },
      { name: 'European Union Agency for Cybersecurity (ENISA)', publisher: 'EU ENISA', publishedDate: '2026-09-24', type: 'multilateral', url: 'https://www.enisa.europa.eu' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-24T08:00:00Z',
    connectedCrisisIds: ['crisis-ukr-frontline']
  },

  // Taiwan Strait & Semiconductor Security
  {
    id: 'crisis-taiwan-strait-airspace',
    title: 'Taiwan Strait Joint Military Drills & Air Defense Zone Sorties',
    category: 'military',
    subcategory: 'Military buildup',
    country: 'Taiwan',
    countryCode: 'TW',
    region: 'Asia-Pacific',
    latitude: 23.6978,
    longitude: 120.9605,
    date: '2024-05-23',
    status: 'active',
    severity: 'high',
    riskIndicator: 0.69,
    confidence: 'Medium',
    zoneClassification: 'strategic_chokepoint',
    summary: 'Regular joint combat readiness patrols, naval encirclement exercises, and high-frequency military aircraft crossings of the median line in the Taiwan Strait.',
    whyMonitored: 'Centerpiece of global semiconductor manufacturing (TSMC producing over 90% of advanced chips); critical maritime commercial route handling over $2.4 trillion in trade annually.',
    contributingFactors: [
      { factor: 'Joint military exercise scale', weight: 0.27, description: 'Comprehensive simulated blockades using air, naval, and rocket forces' },
      { factor: 'Cross-strait diplomatic friction', weight: 0.23, description: 'Rhetorical hardening post-election and refusal of official bilateral dialogue' },
      { factor: 'Semiconductor supply vulnerability', weight: 0.18, description: 'Concentration of advanced node fabrication capacity within perimeter' },
      { factor: 'Superpower naval patrols', weight: 0.14, description: 'US Navy and allied freedom of navigation transits through strait' }
    ],
    timeline: [
      { date: '2022-08-03', title: 'Unprecedented Missile Launch Exercises', description: 'Live-fire exercises simulated full aerial and maritime blockade around six perimeter zones.' },
      { date: '2024-05-23', title: 'Joint Sword-2024A Drills', description: 'Large-scale live drills launched following presidential inauguration ceremony in Taipei.' },
      { date: '2024-10-14', title: 'Joint Sword-2024B Exercises', description: 'Night sorties and coast guard maritime boarding simulations practiced.' }
    ],
    economicImpact: 'Estimated global economic loss of $10 trillion in the event of full blockade or conflict, according to Bloomberg Economics calculations.',
    humanitarianImpact: 'Potential disruption of vital food and liquefied natural gas imports sustaining 23 million residents.',
    regionalImpact: 'Accelerated defense rearmament across Japan, the Philippines, and South Korea, strengthening AUKUS and Quad coordination.',
    sources: [
      { name: 'Ministry of National Defense R.O.C.', publisher: 'Taiwan MND Press', publishedDate: '2024-09-19', type: 'official', url: 'https://www.mnd.gov.tw' },
      { name: 'CSIS ChinaPower Project', publisher: 'Center for Strategic and International Studies', publishedDate: '2024-08-20', type: 'academic', url: 'https://chinapower.csis.org' },
      { name: 'Financial Times Geopolitics Desk', publisher: 'Financial Times', publishedDate: '2024-09-12', type: 'financial', url: 'https://www.ft.com' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-22T04:20:00Z'
  },

  // Resilient Reference Zone: Switzerland Neutral Diplomacy Hub
  {
    id: 'resilient-switzerland-hub',
    title: 'Geneva Multilateral Diplomatic Safe Haven & Reserve Stability',
    category: 'political',
    subcategory: 'Diplomatic crises',
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'Europe',
    latitude: 46.2044,
    longitude: 6.1432,
    date: '2024-06-16',
    status: 'resolved',
    severity: 'low',
    riskIndicator: 0.08,
    confidence: 'High',
    zoneClassification: 'lowest_risk_resilient',
    summary: 'Global diplomatic nexus for humanitarian mediation, international arbitration, and sovereign wealth custody operating under permanent constitutional neutrality.',
    whyMonitored: 'Low-risk benchmark zone used for comparative systemic stress baselines and neutral diplomatic dialogue hosting.',
    contributingFactors: [
      { factor: 'Constitutional permanent neutrality', weight: -0.42, description: 'Centuries of institutional neutrality and security autonomy' },
      { factor: 'Sovereign wealth stability', weight: -0.35, description: 'Tier-1 capital reserves and low national debt-to-GDP ratio' },
      { factor: 'Multilateral headquarter infrastructure', weight: -0.25, description: 'Hosts UN European headquarters, ICRC, WHO, and WTO' }
    ],
    timeline: [
      { date: '1815-11-20', title: 'Perpetual Neutrality Recognized', description: 'Treaty of Paris formalizes international recognition of Swiss neutrality.' },
      { date: '2024-06-15', title: 'Bürgenstock Peace Summit', description: 'Hosts high-level multilateral delegations for global peace framework dialogue.' }
    ],
    economicImpact: 'Safe-haven currency status for the Swiss Franc (CHF) during acute global risk-off events.',
    humanitarianImpact: 'Global headquarters for the International Committee of the Red Cross (ICRC).',
    regionalImpact: 'Key mediator across fragmented geopolitical alliances.',
    sources: [
      { name: 'Swiss Federal Department of Foreign Affairs', publisher: 'FDFA Bern', publishedDate: '2024-07-01', type: 'official', url: 'https://www.eda.admin.ch' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-20T10:00:00Z'
  },

  // Resilient Reference Zone: Singapore Straits Maritime & Financial Hub
  {
    id: 'resilient-singapore-hub',
    title: 'Singapore Maritime Transit Efficiency & Foreign Exchange Hub',
    category: 'financial',
    subcategory: 'Trade disruptions',
    country: 'Singapore',
    countryCode: 'SG',
    region: 'Asia-Pacific',
    latitude: 1.3521,
    longitude: 103.8198,
    date: '2024-08-01',
    status: 'resolved',
    severity: 'low',
    riskIndicator: 0.12,
    confidence: 'High',
    zoneClassification: 'lowest_risk_resilient',
    summary: 'Premier global maritime bunkering port and AAA-rated sovereign financial hub maintaining active anti-piracy deterrence and balanced non-aligned diplomacy.',
    whyMonitored: 'Critical counterweight proving that chokepoint transit zones can maintain operational continuity and lowest risk when backed by naval coordination.',
    contributingFactors: [
      { factor: 'Malacca Strait joint naval patrols', weight: -0.38, description: 'Trilateral Singapore-Malaysia-Indonesia maritime patrols' },
      { factor: 'AAA sovereign credit rating', weight: -0.34, description: 'Massive sovereign wealth buffers (GIC, Temasek)' },
      { factor: 'Bunkering infrastructure modernization', weight: -0.22, description: 'World\'s largest marine refueling and alternative green fuel hub' }
    ],
    timeline: [
      { date: '2024-04-10', title: 'Tuas Megaport Expansion Phase II', description: 'Autonomous electric terminal capacity expands container handling.' }
    ],
    economicImpact: 'Handles over 37 million TEUs annually; key clearing center for Asian foreign exchange.',
    humanitarianImpact: 'Food and medical emergency logistics gateway for Southeast Asia.',
    regionalImpact: 'Anchor for ASEAN regional neutrality and maritime stability.',
    sources: [
      { name: 'Maritime and Port Authority of Singapore', publisher: 'MPA Singapore', publishedDate: '2024-08-15', type: 'official', url: 'https://www.mpa.gov.sg' }
    ],
    reportsDiffer: false,
    isDemo: true,
    lastUpdated: '2026-09-18T10:00:00Z'
  }
];
