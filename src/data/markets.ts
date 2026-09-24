import { MarketAsset } from '../types/crisis';

export const GLOBAL_MARKET_ASSETS: MarketAsset[] = [
  // 1. S&P 500 (US Benchmark Equity Index)
  {
    id: 'sp500-index',
    symbol: 'S&P 500',
    name: 'Standard & Poor\'s 500 Index',
    category: 'index',
    exchange: 'NYSE / NASDAQ',
    country: 'United States',
    price: 5722.25,
    change24h: 0.42,
    unit: 'pts',
    realTimeStats: {
      dayHigh: 5741.80,
      dayLow: 5708.15,
      yearHigh: 5752.40,
      yearLow: 4103.78,
      volume24h: '3.42B shares',
      volatilityBeta: 1.00,
      sentimentIndex: 68, // Greed / Risk-on
    },
    probabilityForecast: {
      bullishProb: 0.58,
      neutralProb: 0.24,
      bearishProb: 0.18,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 5550, mid: 5850, high: 6050 },
      catalysts: [
        'Federal Reserve rate-cutting cycle lowering corporate financing costs',
        'Generative AI enterprise infrastructure capital expenditure monetization',
        'Resilient corporate earnings across mega-cap technology and healthcare sectors'
      ],
      probabilityRationale: 'Probabilistic consensus derived from easing monetary policy, historical post-first-cut equity performance (averaging +11% over 12 months in non-recessionary regimes), balanced against elevated price-to-earnings valuations and geopolitical supply chain vulnerabilities.'
    },
    history: {
      '1D': [
        { time: '09:30', value: 5709.20 },
        { time: '11:00', value: 5720.50 },
        { time: '13:00', value: 5716.40 },
        { time: '15:00', value: 5735.10 },
        { time: '16:00', value: 5722.25 }
      ],
      '1W': [
        { time: 'Day -6', value: 5690.00 },
        { time: 'Day -4', value: 5705.50 },
        { time: 'Day -2', value: 5718.00 },
        { time: 'Today', value: 5722.25 }
      ],
      '1M': [
        { time: 'Wk -4', value: 5580.00 },
        { time: 'Wk -3', value: 5625.00 },
        { time: 'Wk -2', value: 5670.00 },
        { time: 'Wk -1', value: 5715.00 },
        { time: 'Current', value: 5722.25 }
      ],
      '3M': [
        { time: 'Month -3', value: 5460.00 },
        { time: 'Month -2', value: 5350.00 },
        { time: 'Month -1', value: 5600.00 },
        { time: 'Current', value: 5722.25 }
      ],
      '1Y': [
        { time: 'Q1', value: 4780.00 },
        { time: 'Q2', value: 5200.00 },
        { time: 'Q3', value: 5400.00 },
        { time: 'Q4', value: 5722.25 }
      ],
      '5Y': [
        { time: '2020', value: 3756.00 },
        { time: '2021', value: 4766.00 },
        { time: '2022', value: 3839.00 },
        { time: '2023', value: 4769.00 },
        { time: '2024', value: 5722.25 }
      ]
    },
    geopoliticalDrivers: [
      'US-China trade tariff adjustments and technology export controls',
      'Federal Open Market Committee policy trajectory and liquidity injections',
      'Taiwan Strait maritime stability protecting advanced TSMC chip supplies',
      'Middle East energy risk premiums influencing domestic US consumer sentiment'
    ],
    exposedSectors: ['Technology Hardware', 'Software & Cloud', 'Financial Services', 'Aerospace & Defense'],
    exposedCountries: ['United States', 'Global']
  },

  // 2. NIFTY 50 (National Stock Exchange of India Benchmark)
  {
    id: 'nifty-50',
    symbol: 'NIFTY 50',
    name: 'NIFTY 50 Index (NSE India)',
    category: 'index',
    exchange: 'NSE India',
    country: 'India',
    price: 25790.95,
    change24h: 0.85,
    unit: 'INR pts',
    realTimeStats: {
      dayHigh: 25845.20,
      dayLow: 25690.15,
      yearHigh: 26277.35,
      yearLow: 18837.85,
      volume24h: '480M shares',
      volatilityBeta: 0.92,
      sentimentIndex: 74, // Strong Bullish
    },
    probabilityForecast: {
      bullishProb: 0.65,
      neutralProb: 0.22,
      bearishProb: 0.13,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 24800, mid: 26500, high: 28000 },
      catalysts: [
        'India\'s GDP growth projected at 7.0%+ (fastest among major global economies)',
        'Domestic Institutional Investors (DII) and mutual fund SIP inflows exceeding $2.5B monthly',
        'Crude oil price stabilization reducing India\'s current account deficit and inflation strain',
        'Global manufacturing supply chain diversification ("China + 1" PLI initiatives)'
      ],
      probabilityRationale: 'Sustained domestic retail and institutional liquidity provides an unprecedented structural buffer. Upward trajectory supported by capex cycle expansion, banking sector balance sheet strength (NPAs at decadal low of 2.8%), and stable macroeconomic fiscal metrics.'
    },
    history: {
      '1D': [
        { time: '09:15', value: 25695.10 },
        { time: '11:30', value: 25740.50 },
        { time: '13:30', value: 25810.20 },
        { time: '15:30', value: 25790.95 }
      ],
      '1W': [
        { time: 'Day -6', value: 25420.00 },
        { time: 'Day -4', value: 25550.00 },
        { time: 'Day -2', value: 25680.00 },
        { time: 'Today', value: 25790.95 }
      ],
      '1M': [
        { time: 'Wk -4', value: 24850.00 },
        { time: 'Wk -3', value: 25150.00 },
        { time: 'Wk -2', value: 25400.00 },
        { time: 'Wk -1', value: 25650.00 },
        { time: 'Current', value: 25790.95 }
      ],
      '3M': [
        { time: 'Month -3', value: 24100.00 },
        { time: 'Month -2', value: 24350.00 },
        { time: 'Month -1', value: 25200.00 },
        { time: 'Current', value: 25790.95 }
      ],
      '1Y': [
        { time: 'Q1', value: 21700.00 },
        { time: 'Q2', value: 22500.00 },
        { time: 'Q3', value: 24800.00 },
        { time: 'Q4', value: 25790.95 }
      ],
      '5Y': [
        { time: '2020', value: 13981.00 },
        { time: '2021', value: 17354.00 },
        { time: '2022', value: 18105.00 },
        { time: '2023', value: 21731.00 },
        { time: '2024', value: 25790.95 }
      ]
    },
    geopoliticalDrivers: [
      'Crude oil import sensitivity: India imports >85% of crude; every $10/bbl drop saves ~$15B in trade deficit',
      'Reserve Bank of India (RBI) repo rate stance (6.50%) and domestic liquidity buffering',
      'Foreign Institutional Investor (FII) rebalancing across emerging Asian markets',
      'Middle East transit security (Bab al-Mandab & Persian Gulf) protecting petroleum and engineering exports'
    ],
    exposedSectors: ['Banking & NBFCs', 'IT Services', 'Automobile', 'Infrastructure & Capital Goods', 'Renewables'],
    exposedCountries: ['India', 'United States', 'Middle East']
  },

  // 3. BSE SENSEX (Bombay Stock Exchange 30 Bluechips)
  {
    id: 'bse-sensex',
    symbol: 'SENSEX',
    name: 'BSE SENSEX 30 Benchmark',
    category: 'index',
    exchange: 'BSE Mumbai',
    country: 'India',
    price: 84299.90,
    change24h: 0.82,
    unit: 'INR pts',
    realTimeStats: {
      dayHigh: 84450.00,
      dayLow: 83980.50,
      yearHigh: 85978.25,
      yearLow: 63183.77,
      volume24h: '310M shares',
      volatilityBeta: 0.90,
      sentimentIndex: 72,
    },
    probabilityForecast: {
      bullishProb: 0.63,
      neutralProb: 0.23,
      bearishProb: 0.14,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 81000, mid: 87000, high: 91500 },
      catalysts: [
        'Corporate earnings compounding across top 30 Indian conglomerate leaders',
        'India demographic dividend driving domestic consumption in urban & tier-2 cities',
        'Government capital expenditure budget scaling to record ₹11.11 lakh crore'
      ],
      probabilityRationale: 'Strong probability of compounding gains anchored by heavyweights HDFC Bank, Reliance Industries, ICICI Bank, TCS, and Larsen & Toubro.'
    },
    history: {
      '1D': [
        { time: '09:15', value: 83995.00 },
        { time: '11:30', value: 84150.00 },
        { time: '13:30', value: 84380.00 },
        { time: '15:30', value: 84299.90 }
      ],
      '1W': [
        { time: 'Day -6', value: 83100.00 },
        { time: 'Day -4', value: 83600.00 },
        { time: 'Day -2', value: 84050.00 },
        { time: 'Today', value: 84299.90 }
      ],
      '1M': [
        { time: 'Wk -4', value: 81200.00 },
        { time: 'Wk -3', value: 82300.00 },
        { time: 'Wk -2', value: 83100.00 },
        { time: 'Wk -1', value: 83900.00 },
        { time: 'Current', value: 84299.90 }
      ],
      '3M': [
        { time: 'Month -3', value: 78500.00 },
        { time: 'Month -2', value: 79800.00 },
        { time: 'Month -1', value: 82500.00 },
        { time: 'Current', value: 84299.90 }
      ],
      '1Y': [
        { time: 'Q1', value: 71500.00 },
        { time: 'Q2', value: 74000.00 },
        { time: 'Q3', value: 81000.00 },
        { time: 'Q4', value: 84299.90 }
      ],
      '5Y': [
        { time: '2020', value: 47751.00 },
        { time: '2021', value: 58253.00 },
        { time: '2022', value: 60840.00 },
        { time: '2023', value: 72240.00 },
        { time: '2024', value: 84299.90 }
      ]
    },
    geopoliticalDrivers: [
      'Bilateral free trade agreements (India-UAE CEPA, India-EFTA, ongoing UK/EU trade talks)',
      'Rupee exchange rate resilience against US dollar index (DXY)',
      'Strategic national energy reserve expansion in underground salt caverns'
    ],
    exposedSectors: ['Financial Conglomerates', 'Energy & Petrochemicals', 'FMCG', 'Automotive', 'Telecom'],
    exposedCountries: ['India', 'Global']
  },

  // 4. BANK NIFTY (Indian Banking & Financial Sector)
  {
    id: 'bank-nifty',
    symbol: 'BANKNIFTY',
    name: 'NIFTY Bank Index',
    category: 'index',
    exchange: 'NSE India',
    country: 'India',
    price: 53880.40,
    change24h: 0.95,
    unit: 'INR pts',
    realTimeStats: {
      dayHigh: 54100.00,
      dayLow: 53620.10,
      yearHigh: 54467.35,
      yearLow: 42105.40,
      volume24h: '290M shares',
      volatilityBeta: 1.15,
      sentimentIndex: 76,
    },
    probabilityForecast: {
      bullishProb: 0.67,
      neutralProb: 0.21,
      bearishProb: 0.12,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 51500, mid: 55500, high: 58500 },
      catalysts: [
        'Cleanest Indian commercial bank balance sheets in 15 years (provision coverage ratio >75%)',
        'Consistent double-digit credit growth (14-16% YoY) across retail, MSME, and infrastructure loans',
        'Deposit growth catching up to loan growth, preserving Net Interest Margins (NIMs)'
      ],
      probabilityRationale: 'Indian private and public sector lenders display superior return on equity (ROE >15%) and disciplined underwriting, making BANK NIFTY one of the highest-rated emerging market banking baskets globally.'
    },
    history: {
      '1D': [
        { time: '09:15', value: 53650.00 },
        { time: '11:30', value: 53780.00 },
        { time: '13:30', value: 53950.00 },
        { time: '15:30', value: 53880.40 }
      ],
      '1W': [
        { time: 'Day -6', value: 52900.00 },
        { time: 'Day -4', value: 53300.00 },
        { time: 'Day -2', value: 53650.00 },
        { time: 'Today', value: 53880.40 }
      ],
      '1M': [
        { time: 'Wk -4', value: 50800.00 },
        { time: 'Wk -3', value: 51600.00 },
        { time: 'Wk -2', value: 52400.00 },
        { time: 'Wk -1', value: 53400.00 },
        { time: 'Current', value: 53880.40 }
      ],
      '3M': [
        { time: 'Month -3', value: 49800.00 },
        { time: 'Month -2', value: 50400.00 },
        { time: 'Month -1', value: 52100.00 },
        { time: 'Current', value: 53880.40 }
      ],
      '1Y': [
        { time: 'Q1', value: 46200.00 },
        { time: 'Q2', value: 48500.00 },
        { time: 'Q3', value: 51800.00 },
        { time: 'Q4', value: 53880.40 }
      ],
      '5Y': [
        { time: '2020', value: 31264.00 },
        { time: '2021', value: 35481.00 },
        { time: '2022', value: 42986.00 },
        { time: '2023', value: 48292.00 },
        { time: '2024', value: 53880.40 }
      ]
    },
    geopoliticalDrivers: [
      'RBI monetary transmission and systemic liquidity operations',
      'Indian digital payments (UPI) infrastructure scaling globally across France, UAE, Singapore',
      'Insolvency and Bankruptcy Code (IBC) resolutions resolving legacy corporate debts'
    ],
    exposedSectors: ['Private Banking', 'Public Sector Banks', 'Housing Finance', 'Credit Cards'],
    exposedCountries: ['India']
  },

  // 2. NASDAQ 100 (Technology & Innovation)
  {
    id: 'nasdaq-100',
    symbol: 'NDX',
    name: 'Nasdaq 100 Index',
    category: 'index',
    exchange: 'NASDAQ',
    country: 'United States',
    price: 19885.60,
    change24h: 0.78,
    unit: 'pts',
    realTimeStats: {
      dayHigh: 19960.20,
      dayLow: 19810.40,
      yearHigh: 20690.97,
      yearLow: 14058.30,
      volume24h: '5.12B shares',
      volatilityBeta: 1.25,
      sentimentIndex: 72,
    },
    probabilityForecast: {
      bullishProb: 0.62,
      neutralProb: 0.20,
      bearishProb: 0.18,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 18900, mid: 20500, high: 21800 },
      catalysts: [
        'Massive AI accelerator demand (Blackwell architecture rollouts)',
        'Sovereign AI infrastructure investments in Europe, Japan, and Gulf states',
        'Lower cost of debt stimulating venture capital and tech acquisitions'
      ],
      probabilityRationale: 'High probability of continued momentum driven by structural secular demand for compute, enterprise AI licensing revenues, and cloud hyperscaler capex growth.'
    },
    history: {
      '1D': [
        { time: '09:30', value: 19790.00 },
        { time: '11:30', value: 19840.00 },
        { time: '13:30', value: 19890.00 },
        { time: '16:00', value: 19885.60 }
      ],
      '1W': [
        { time: 'Day -6', value: 19650.00 },
        { time: 'Day -4', value: 19780.00 },
        { time: 'Day -2', value: 19840.00 },
        { time: 'Today', value: 19885.60 }
      ],
      '1M': [
        { time: 'Wk -4', value: 19100.00 },
        { time: 'Wk -3', value: 19450.00 },
        { time: 'Wk -2', value: 19700.00 },
        { time: 'Wk -1', value: 19820.00 },
        { time: 'Current', value: 19885.60 }
      ],
      '3M': [
        { time: 'Month -3', value: 19900.00 },
        { time: 'Month -2', value: 18200.00 },
        { time: 'Month -1', value: 19400.00 },
        { time: 'Current', value: 19885.60 }
      ],
      '1Y': [
        { time: 'Q1', value: 16500.00 },
        { time: 'Q2', value: 18200.00 },
        { time: 'Q3', value: 19500.00 },
        { time: 'Q4', value: 19885.60 }
      ],
      '5Y': [
        { time: '2020', value: 12888.00 },
        { time: '2021', value: 16320.00 },
        { time: '2022', value: 10939.00 },
        { time: '2023', value: 16825.00 },
        { time: '2024', value: 19885.60 }
      ]
    },
    geopoliticalDrivers: [
      'Export bans on advanced GPU silicon to restricted jurisdictions',
      'Cybersecurity offensive/defensive state-sponsored campaigns',
      'Critical mineral supplies (gallium, germanium, rare earths) for semiconductor packaging'
    ],
    exposedSectors: ['Semiconductors', 'Cloud SaaS', 'Consumer Electronics', 'Artificial Intelligence'],
    exposedCountries: ['United States', 'Taiwan', 'Netherlands', 'South Korea']
  },

  // 3. DAX 40 (German & European Industrial Benchmark)
  {
    id: 'dax-40',
    symbol: 'DAX',
    name: 'DAX 40 Performance Index',
    category: 'index',
    exchange: 'XETRA Frankfurt',
    country: 'Germany',
    price: 18918.50,
    change24h: -0.35,
    unit: 'pts',
    realTimeStats: {
      dayHigh: 19045.00,
      dayLow: 18880.20,
      yearHigh: 19045.00,
      yearLow: 14630.20,
      volume24h: '78M shares',
      volatilityBeta: 0.95,
      sentimentIndex: 52,
    },
    probabilityForecast: {
      bullishProb: 0.44,
      neutralProb: 0.36,
      bearishProb: 0.20,
      consensusDirection: 'Neutral',
      targetForecastRange: { low: 18200, mid: 19100, high: 19700 },
      catalysts: [
        'European Central Bank interest rate reductions easing borrowing rates',
        'Recovery in global export demand for industrial automation and chemicals',
        'Energy cost stabilization relative to the 2022 gas supply crunch'
      ],
      probabilityRationale: 'Balanced outlook: ECB policy easing provides support, but automotive sector headwind from Chinese electric vehicle competition and domestic energy restructuring limits aggressive multiple expansion.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 18990.00 },
        { time: '12:00', value: 18940.00 },
        { time: '15:00', value: 18910.00 },
        { time: '17:30', value: 18918.50 }
      ],
      '1W': [
        { time: 'Day -6', value: 18720.00 },
        { time: 'Day -4', value: 18850.00 },
        { time: 'Day -2', value: 18950.00 },
        { time: 'Today', value: 18918.50 }
      ],
      '1M': [
        { time: 'Wk -4', value: 18400.00 },
        { time: 'Wk -3', value: 18600.00 },
        { time: 'Wk -2', value: 18800.00 },
        { time: 'Wk -1', value: 18980.00 },
        { time: 'Current', value: 18918.50 }
      ],
      '3M': [
        { time: 'Month -3', value: 18200.00 },
        { time: 'Month -2', value: 17500.00 },
        { time: 'Month -1', value: 18500.00 },
        { time: 'Current', value: 18918.50 }
      ],
      '1Y': [
        { time: 'Q1', value: 16800.00 },
        { time: 'Q2', value: 18400.00 },
        { time: 'Q3', value: 18200.00 },
        { time: 'Q4', value: 18918.50 }
      ],
      '5Y': [
        { time: '2020', value: 13718.00 },
        { time: '2021', value: 15884.00 },
        { time: '2022', value: 13923.00 },
        { time: '2023', value: 16751.00 },
        { time: '2024', value: 18918.50 }
      ]
    },
    geopoliticalDrivers: [
      'EU regulatory carbon border adjustments (CBAM) and industrial competitiveness',
      'Nordic and European power grid integration and LNG import dependency',
      'Eastern European security spending stimulating German defense industrial champions'
    ],
    exposedSectors: ['Automotive & Engineering', 'Chemicals & Materials', 'Defense & Aerospace', 'Renewable Energy'],
    exposedCountries: ['Germany', 'France', 'Italy', 'Poland']
  },

  // 4. Nikkei 225 (Japan)
  {
    id: 'nikkei-225',
    symbol: 'NKY',
    name: 'Nikkei 225 Stock Average',
    category: 'index',
    exchange: 'Tokyo Stock Exchange',
    country: 'Japan',
    price: 37920.00,
    change24h: 1.15,
    unit: 'JPY pts',
    realTimeStats: {
      dayHigh: 38150.00,
      dayLow: 37620.00,
      yearHigh: 42426.77,
      yearLow: 30540.00,
      volume24h: '1.45B shares',
      volatilityBeta: 1.35,
      sentimentIndex: 58,
    },
    probabilityForecast: {
      bullishProb: 0.50,
      neutralProb: 0.32,
      bearishProb: 0.18,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 35000, mid: 39500, high: 43000 },
      catalysts: [
        'Tokyo Stock Exchange corporate governance reforms boosting share buybacks and ROE',
        'Stabilization of the yen following August carry-trade unwind panic',
        'Strong semiconductor equipment exports (Tokyo Electron, Advantest)'
      ],
      probabilityRationale: 'Structural governance improvements and wage-price virtuous cycle support a positive long-term trajectory, though BOJ interest rate normalization pacing remains a key volatility factor.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 37650.00 },
        { time: '11:30', value: 37880.00 },
        { time: '13:30', value: 37950.00 },
        { time: '15:00', value: 37920.00 }
      ],
      '1W': [
        { time: 'Day -6', value: 36800.00 },
        { time: 'Day -4', value: 37200.00 },
        { time: 'Day -2', value: 37700.00 },
        { time: 'Today', value: 37920.00 }
      ],
      '1M': [
        { time: 'Wk -4', value: 38200.00 },
        { time: 'Wk -3', value: 36400.00 },
        { time: 'Wk -2', value: 36800.00 },
        { time: 'Wk -1', value: 37500.00 },
        { time: 'Current', value: 37920.00 }
      ],
      '3M': [
        { time: 'Month -3', value: 39800.00 },
        { time: 'Month -2', value: 31458.00 }, // historic August 5 crash
        { time: 'Month -1', value: 36800.00 },
        { time: 'Current', value: 37920.00 }
      ],
      '1Y': [
        { time: 'Q1', value: 33400.00 },
        { time: 'Q2', value: 39500.00 },
        { time: 'Q3', value: 36000.00 },
        { time: 'Q4', value: 37920.00 }
      ],
      '5Y': [
        { time: '2020', value: 27444.00 },
        { time: '2021', value: 28791.00 },
        { time: '2022', value: 26094.00 },
        { time: '2023', value: 33464.00 },
        { time: '2024', value: 37920.00 }
      ]
    },
    geopoliticalDrivers: [
      'Yen-dollar currency movements influencing Japanese multinational exporter profits',
      'Bank of Japan benchmark rate policy divergence vs US Fed',
      'East Asian maritime commercial transit routes through Taiwan Strait'
    ],
    exposedSectors: ['Automotive', 'Semiconductor Equipment', 'Industrial Robotics', 'Trading Houses (Sogo Shosha)'],
    exposedCountries: ['Japan', 'United States', 'China']
  },

  // 5. Brent Crude Oil (Global Energy Benchmark)
  {
    id: 'brent-crude',
    symbol: 'BRENT',
    name: 'Brent Crude Oil Benchmark',
    category: 'commodity',
    exchange: 'ICE London',
    country: 'Global',
    price: 74.85,
    change24h: 2.14,
    unit: 'USD/bbl',
    realTimeStats: {
      dayHigh: 75.40,
      dayLow: 73.10,
      yearHigh: 92.18,
      yearLow: 68.68,
      volume24h: '380K contracts',
      volatilityBeta: 1.40,
      sentimentIndex: 61,
    },
    probabilityForecast: {
      bullishProb: 0.42,
      neutralProb: 0.38,
      bearishProb: 0.20,
      consensusDirection: 'Neutral',
      targetForecastRange: { low: 68, mid: 76, high: 88 },
      catalysts: [
        'Geopolitical risk premium expansions in Levant and Strait of Hormuz',
        'OPEC+ voluntary production curb discipline versus compliance slippage',
        'Non-OPEC supply expansion (US, Guyana, Brazil offshore)'
      ],
      probabilityRationale: 'Probabilistic simulation models balanced market: downside anchored by strong non-OPEC barrel additions, while upside capped unless kinetic actions directly impair Gulf refining or export infrastructure.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 73.20 },
        { time: '11:00', value: 73.65 },
        { time: '13:00', value: 74.10 },
        { time: '15:00', value: 74.50 },
        { time: '17:00', value: 74.85 }
      ],
      '1W': [
        { time: 'Day -6', value: 72.40 },
        { time: 'Day -4', value: 73.10 },
        { time: 'Day -2', value: 73.80 },
        { time: 'Today', value: 74.85 }
      ],
      '1M': [
        { time: 'Wk -4', value: 76.50 },
        { time: 'Wk -3', value: 74.00 },
        { time: 'Wk -2', value: 71.90 },
        { time: 'Wk -1', value: 73.20 },
        { time: 'Current', value: 74.85 }
      ],
      '3M': [
        { time: 'Month -3', value: 85.20 },
        { time: 'Month -2', value: 79.50 },
        { time: 'Month -1', value: 72.80 },
        { time: 'Current', value: 74.85 }
      ],
      '1Y': [
        { time: 'Q1', value: 82.50 },
        { time: 'Q2', value: 89.00 },
        { time: 'Q3', value: 78.40 },
        { time: 'Q4', value: 74.85 }
      ],
      '5Y': [
        { time: '2020', value: 42.00 },
        { time: '2021', value: 70.80 },
        { time: '2022', value: 122.50 },
        { time: '2023', value: 82.00 },
        { time: '2024', value: 74.85 }
      ]
    },
    geopoliticalDrivers: [
      'Middle East geopolitical risk premium in Levant and Strait of Hormuz',
      'Red Sea commercial tanker rerouting around Cape of Good Hope',
      'OPEC+ voluntary production quotas and compliance reviews',
      'Global macroeconomic demand signals from China and OECD economies'
    ],
    exposedSectors: ['Airlines & Logistics', 'Petrochemicals', 'Automotive', 'Renewable Energy'],
    exposedCountries: ['Saudi Arabia', 'United States', 'Russia', 'Germany', 'Japan', 'India']
  },

  // 6. Gold Bullion Spot (Sovereign Safe Haven)
  {
    id: 'gold-spot',
    symbol: 'XAU/USD',
    name: 'Gold Bullion Spot',
    category: 'commodity',
    exchange: 'LBMA London / COMEX',
    country: 'Global',
    price: 2658.40,
    change24h: 0.65,
    unit: 'USD/oz',
    realTimeStats: {
      dayHigh: 2664.20,
      dayLow: 2638.10,
      yearHigh: 2685.50,
      yearLow: 1810.20,
      volume24h: '$42B turnover',
      volatilityBeta: 0.65,
      sentimentIndex: 78,
    },
    probabilityForecast: {
      bullishProb: 0.68,
      neutralProb: 0.22,
      bearishProb: 0.10,
      consensusDirection: 'Bullish',
      targetForecastRange: { low: 2500, mid: 2750, high: 2950 },
      catalysts: [
        'Central bank sovereign reserve diversification away from US dollar assets',
        'Lower global real bond yields reducing holding opportunity cost',
        'Persistent geopolitical conflict hedging in Eastern Europe and Middle East'
      ],
      probabilityRationale: 'Dominant probability favored to the upside: Structural sovereign gold purchases by non-Western central banks (China, India, Poland, Turkey) provide an unprecedented institutional price floor.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 2642.10 },
        { time: '11:00', value: 2649.30 },
        { time: '13:00', value: 2652.80 },
        { time: '15:00', value: 2655.40 },
        { time: '17:00', value: 2658.40 }
      ],
      '1W': [
        { time: 'Day -6', value: 2615.00 },
        { time: 'Day -4', value: 2630.50 },
        { time: 'Day -2', value: 2644.20 },
        { time: 'Today', value: 2658.40 }
      ],
      '1M': [
        { time: 'Wk -4', value: 2510.00 },
        { time: 'Wk -3', value: 2545.00 },
        { time: 'Wk -2', value: 2580.00 },
        { time: 'Wk -1', value: 2620.00 },
        { time: 'Current', value: 2658.40 }
      ],
      '3M': [
        { time: 'Month -3', value: 2320.00 },
        { time: 'Month -2', value: 2410.00 },
        { time: 'Month -1', value: 2510.00 },
        { time: 'Current', value: 2658.40 }
      ],
      '1Y': [
        { time: 'Q1', value: 1980.00 },
        { time: 'Q2', value: 2150.00 },
        { time: 'Q3', value: 2420.00 },
        { time: 'Q4', value: 2658.40 }
      ],
      '5Y': [
        { time: '2020', value: 1890.00 },
        { time: '2021', value: 1820.00 },
        { time: '2022', value: 1815.00 },
        { time: '2023', value: 2060.00 },
        { time: '2024', value: 2658.40 }
      ]
    },
    geopoliticalDrivers: [
      'Central bank sovereign reserve de-dollarization (PBOC, RBI, Central Bank of Turkey)',
      'Escalation hedges against regional conflict and sovereign sanctions risk',
      'Global central bank monetary easing cycle (Federal Reserve rate cuts)',
      'US federal debt trajectory and fiscal deficit expansion concerns'
    ],
    exposedSectors: ['Sovereign Reserve Management', 'Jewelry Retail', 'Precious Metal Mining', 'Central Banking'],
    exposedCountries: ['China', 'India', 'Switzerland', 'United States', 'Russia']
  },

  // 7. Cboe Volatility Index (VIX)
  {
    id: 'vix-volatility',
    symbol: 'VIX',
    name: 'Cboe Volatility Index',
    category: 'volatility',
    exchange: 'CBOE Chicago',
    country: 'United States',
    price: 15.42,
    change24h: -1.82,
    unit: 'pts',
    realTimeStats: {
      dayHigh: 16.35,
      dayLow: 15.15,
      yearHigh: 65.73, // August 5 spike
      yearLow: 11.52,
      volume24h: '1.2M contracts',
      volatilityBeta: -2.80,
      sentimentIndex: 32, // Low fear
    },
    probabilityForecast: {
      bullishProb: 0.35, // Probability of spike
      neutralProb: 0.45,
      bearishProb: 0.20,
      consensusDirection: 'Neutral',
      targetForecastRange: { low: 12.5, mid: 16.0, high: 28.0 },
      catalysts: [
        'Geopolitical surprise escalations in the Middle East or Taiwan Strait',
        'US election cycle policy and tariff rhetoric volatility',
        'Systemic liquidity deleveraging in systematic options strategy funds'
      ],
      probabilityRationale: 'VIX trades near long-term historical median (~15-16), indicating calm equity markets, but the distribution of risk remains heavily right-skewed with elevated tail-risk hedging volume.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 16.10 },
        { time: '12:00', value: 15.80 },
        { time: '14:00', value: 15.55 },
        { time: '17:00', value: 15.42 }
      ],
      '1W': [
        { time: 'Day -6', value: 16.80 },
        { time: 'Day -4', value: 16.20 },
        { time: 'Day -2', value: 15.70 },
        { time: 'Today', value: 15.42 }
      ],
      '1M': [
        { time: 'Wk -4', value: 19.40 },
        { time: 'Wk -3', value: 17.50 },
        { time: 'Wk -2', value: 16.10 },
        { time: 'Wk -1', value: 15.80 },
        { time: 'Current', value: 15.42 }
      ],
      '3M': [
        { time: 'Month -3', value: 12.80 },
        { time: 'Month -2', value: 38.50 },
        { time: 'Month -1', value: 18.20 },
        { time: 'Current', value: 15.42 }
      ],
      '1Y': [
        { time: 'Q1', value: 13.50 },
        { time: 'Q2', value: 12.40 },
        { time: 'Q3', value: 23.00 },
        { time: 'Q4', value: 15.42 }
      ],
      '5Y': [
        { time: '2020', value: 65.00 },
        { time: '2021', value: 17.20 },
        { time: '2022', value: 32.00 },
        { time: '2023', value: 13.80 },
        { time: '2024', value: 15.42 }
      ]
    },
    geopoliticalDrivers: [
      'Tail-risk pricing for unexpected geopolitical military escalation',
      'Liquidity stress in systematic volatility-targeting funds',
      'Foreign exchange carry unwinds and unexpected interest rate shifts'
    ],
    exposedSectors: ['Options Market Makers', 'Hedge Funds', 'Systematic Volatility Sellers'],
    exposedCountries: ['Global']
  },

  // 8. US 10-Year Treasury Yield
  {
    id: 'us-10y-treasury',
    symbol: 'US10Y',
    name: 'US 10-Year Benchmark Treasury Yield',
    category: 'bond',
    exchange: 'US Treasury Markets',
    country: 'United States',
    price: 3.74,
    change24h: -0.05,
    unit: '%',
    realTimeStats: {
      dayHigh: 3.80,
      dayLow: 3.72,
      yearHigh: 4.99,
      yearLow: 3.60,
      volume24h: '$650B daily market',
      volatilityBeta: 0.88,
      sentimentIndex: 48,
    },
    probabilityForecast: {
      bullishProb: 0.40, // Bullish on bond prices = lower yields
      neutralProb: 0.42,
      bearishProb: 0.18,
      consensusDirection: 'Neutral',
      targetForecastRange: { low: 3.35, mid: 3.75, high: 4.25 },
      catalysts: [
        'Federal Reserve terminal rate trajectory toward neutral (approx 2.9% - 3.25%)',
        'US Treasury quarterly refunding auction supply absorption capacity',
        'Safe-haven flight to quality during acute geopolitical shocks'
      ],
      probabilityRationale: 'Yields are expected to trade in a bounded channel: downward pressure from Fed rate reductions is balanced against persistent US fiscal deficits requiring sustained high treasury debt issuance.'
    },
    history: {
      '1D': [
        { time: '09:00', value: 3.79 },
        { time: '12:00', value: 3.77 },
        { time: '15:00', value: 3.75 },
        { time: '17:00', value: 3.74 }
      ],
      '1W': [
        { time: 'Day -6', value: 3.82 },
        { time: 'Day -4', value: 3.78 },
        { time: 'Day -2', value: 3.76 },
        { time: 'Today', value: 3.74 }
      ],
      '1M': [
        { time: 'Wk -4', value: 3.92 },
        { time: 'Wk -3', value: 3.85 },
        { time: 'Wk -2', value: 3.78 },
        { time: 'Wk -1', value: 3.75 },
        { time: 'Current', value: 3.74 }
      ],
      '3M': [
        { time: 'Month -3', value: 4.28 },
        { time: 'Month -2', value: 3.95 },
        { time: 'Month -1', value: 3.80 },
        { time: 'Current', value: 3.74 }
      ],
      '1Y': [
        { time: 'Q1', value: 4.10 },
        { time: 'Q2', value: 4.50 },
        { time: 'Q3', value: 4.20 },
        { time: 'Q4', value: 3.74 }
      ],
      '5Y': [
        { time: '2020', value: 0.92 },
        { time: '2021', value: 1.52 },
        { time: '2022', value: 3.88 },
        { time: '2023', value: 3.88 },
        { time: '2024', value: 3.74 }
      ]
    },
    geopoliticalDrivers: [
      'Federal Reserve terminal rate expectations and global liquidity',
      'Foreign central bank demand for dollar reserve assets',
      'Safe-haven capital inflows during acute geopolitical shocks'
    ],
    exposedSectors: ['Commercial Real Estate', 'Banking', 'Mortgage Lending'],
    exposedCountries: ['Global']
  }
];
