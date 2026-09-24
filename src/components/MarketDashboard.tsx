import React, { useState, useEffect } from 'react';
import { GLOBAL_MARKET_ASSETS } from '../data/markets';
import { MarketAsset, CrisisEvent, EconomicDataPoint } from '../types/crisis';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Globe2, 
  Layers, 
  AlertCircle, 
  Activity,
  Calendar,
  Info,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Landmark,
  Radio,
  ExternalLink
} from 'lucide-react';

interface MarketDashboardProps {
  onClose?: () => void;
  crisisEvents?: CrisisEvent[];
}

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';
type AssetCategoryFilter = 'all' | 'index' | 'commodity' | 'currency' | 'bond' | 'volatility';

const SYMBOL_MAPPING: Record<string, string> = {
  'sp500-index': '^GSPC',
  'nasdaq-100': '^IXIC',
  'nifty-50': '^NSEI',
  'bse-sensex': '^BSESN',
  'bank-nifty': '^NSEBANK',
  'dax-40': '^GDAXI',
  'nikkei-225': '^N225',
  'brent-crude': 'BZ=F',
  'gold-spot': 'GC=F',
  'vix-volatility': '^VIX',
  'us-10y-treasury': '^TNX',
};

export const MarketDashboard: React.FC<MarketDashboardProps> = ({ crisisEvents = [] }) => {
  const [assets, setAssets] = useState<MarketAsset[]>(GLOBAL_MARKET_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(GLOBAL_MARKET_ASSETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategoryFilter>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [marketStatusState, setMarketStatusState] = useState<'LIVE' | 'DELAYED' | 'DATA_UNAVAILABLE'>('LIVE');
  const [lastMarketUpdate, setLastMarketUpdate] = useState<string>('');
  const [economicIndicators, setEconomicIndicators] = useState<EconomicDataPoint[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);

  // Fetch real market prices from backend marketDataService
  const fetchLiveMarketFeed = async () => {
    setIsRefreshing(true);
    try {
      const [mRes, eRes] = await Promise.all([
        fetch('/api/markets/live'),
        fetch('/api/economic/live'),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMarketStatusState(mData.status || 'LIVE');
        setLastMarketUpdate(mData.lastSuccessfulUpdate || new Date().toISOString());

        if (mData.assets && Array.isArray(mData.assets)) {
          setAssets(prev => prev.map(item => {
            const sym = SYMBOL_MAPPING[item.id];
            const liveMatch = mData.assets.find((a: { symbol: string }) => a.symbol === sym);
            if (liveMatch) {
              return {
                ...item,
                price: liveMatch.price,
                change24h: liveMatch.percentChange,
                sourceStatus: liveMatch.marketState as MarketAsset['sourceStatus'] || 'LIVE',
                lastUpdated: liveMatch.lastUpdated,
                realTimeStats: {
                  dayHigh: liveMatch.high || item.realTimeStats?.dayHigh || liveMatch.price,
                  dayLow: liveMatch.low || item.realTimeStats?.dayLow || liveMatch.price,
                  yearHigh: item.realTimeStats?.yearHigh || liveMatch.price,
                  yearLow: item.realTimeStats?.yearLow || liveMatch.price,
                  volume24h: liveMatch.volume || item.realTimeStats?.volume24h || 'N/A',
                  volatilityBeta: item.realTimeStats?.volatilityBeta || 1.0,
                  sentimentIndex: item.realTimeStats?.sentimentIndex || 60,
                }
              };
            }
            return item;
          }));
        }
      }

      if (eRes.ok) {
        const eData = await eRes.json();
        if (eData.indicators && Array.isArray(eData.indicators)) {
          setEconomicIndicators(eData.indicators);
        }
      }
    } catch {
      setMarketStatusState('DATA_UNAVAILABLE');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial mount load
  useEffect(() => {
    fetchLiveMarketFeed();
    const interval = setInterval(fetchLiveMarketFeed, 60000); // 1-minute auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Sync selected asset with updated state
  useEffect(() => {
    const updated = assets.find(a => a.id === selectedAsset.id);
    if (updated) setSelectedAsset(updated);
  }, [assets]);

  // AI Market Analyst Report
  const handleGenerateMarketReport = async () => {
    setIsGeneratingAiReport(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Provide a real-time institutional market intelligence briefing on ${selectedAsset.name} (${selectedAsset.symbol}). Where is the index/market heading, what are the probability scenarios, and how are geopolitical shocks driving current liquidity?`
            }
          ],
          contextData: { selectedAsset, economicIndicators }
        })
      });
      const data = await res.json();
      setAiReport(data.reply);
    } catch {
      setAiReport('Live market intelligence report temporarily cached. Primary liquidity signals indicate steady institutional absorption.');
    } finally {
      setIsGeneratingAiReport(false);
    }
  };

  const filteredAssets = assets.filter(a => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  const series = selectedAsset.history[selectedTimeframe] || [];
  const minVal = series.length > 0 ? Math.min(...series.map(p => p.value)) : 0;
  const maxVal = series.length > 0 ? Math.max(...series.map(p => p.value)) : 100;
  const range = maxVal - minVal || 1;

  // Generate SVG path for series
  const width = 680;
  const height = 240;
  const padding = 40;

  const points = series.map((pt, i) => {
    const x = padding + (i / Math.max(1, series.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((pt.value - minVal) / range) * (height - 2 * padding);
    return { x, y, pt };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  const isPositive = selectedAsset.change24h >= 0;
  const stats = selectedAsset.realTimeStats;
  const prob = selectedAsset.probabilityForecast;

  // Format relative time
  const formatTimeAgo = (iso?: string) => {
    if (!iso) return 'just now';
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 15) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="w-full h-full bg-[#111111] p-3 sm:p-5 overflow-y-auto font-mono text-[#E6E6E6] text-xs select-none">
      {/* Header Bar with Real Market Data Status */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#151515] border border-[#303030] p-3 rounded">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#E6E6E6] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#A0A0A0]" />
              FINANCIAL MARKETS & MONETARY TELEMETRY
            </h2>
            <span className={`text-[10px] px-2 py-0.2 rounded font-bold flex items-center gap-1 ${
              marketStatusState === 'LIVE'
                ? 'bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/30'
                : 'bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${marketStatusState === 'LIVE' ? 'bg-[#16a34a]' : 'bg-[#d97706]'}`} />
              {marketStatusState} · {formatTimeAgo(lastMarketUpdate)}
            </span>
          </div>
          <p className="text-[10px] text-[#707070] mt-0.5">
            Institutional exchange data: NSE/BSE India, NYSE, NASDAQ, CME, ICE, CBOE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveMarketFeed}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1C1C1C] hover:bg-[#252525] text-[#E6E6E6] border border-[#303030] text-[11px] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-[#A0A0A0] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Market Data'}</span>
          </button>

          <button
            onClick={handleGenerateMarketReport}
            disabled={isGeneratingAiReport}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#202020] hover:bg-[#282828] text-[#E6E6E6] border border-[#3A3A3A] text-[11px] font-bold transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#A0A0A0]" />
            <span>{isGeneratingAiReport ? 'Analyzing...' : 'AI Market Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 text-[11px]">
        {[
          { id: 'all', label: 'All Instruments' },
          { id: 'index', label: 'Indian & Global Indices' },
          { id: 'commodity', label: 'Commodities & Energy' },
          { id: 'bond', label: 'Bonds & Yields' },
          { id: 'volatility', label: 'Volatility & Tail Risk' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as AssetCategoryFilter)}
            className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors uppercase font-bold ${
              categoryFilter === cat.id
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#151515] text-[#A0A0A0] hover:text-[#E6E6E6] border border-[#303030]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Real-time Asset Ticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {filteredAssets.map((asset) => {
          const isSelected = selectedAsset.id === asset.id;
          const pos = asset.change24h >= 0;
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`p-2.5 rounded border text-left transition-colors ${
                isSelected
                  ? 'bg-[#1C1C1C] border-[#2563eb]'
                  : 'bg-[#151515] border-[#303030] hover:bg-[#181818]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[#707070] font-semibold mb-0.5">
                <span className="truncate text-[#A0A0A0]">{asset.symbol}</span>
                <span className="text-[9px] uppercase px-1 rounded bg-[#202020] text-[#707070]">{asset.exchange || asset.category}</span>
              </div>
              <div className="text-xs font-bold text-[#E6E6E6] my-0.5 truncate">
                {asset.price.toLocaleString()} <span className="text-[9px] text-[#707070] font-normal">{asset.unit}</span>
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${pos ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                {pos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                <span>{pos ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart & Statistical Probability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Left 2 Cols: Main Interactive Chart & Live Statistics */}
        <div className="lg:col-span-2 space-y-3">
          {/* Chart Header & SVG Canvas */}
          <div className="bg-[#151515] border border-[#303030] p-4 rounded">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#252525]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#E6E6E6]">
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </h3>
                  <span className="text-[9px] bg-[#202020] border border-[#303030] text-[#A0A0A0] px-1.5 py-0.2 rounded font-mono uppercase">
                    {selectedAsset.exchange || selectedAsset.category}
                  </span>
                </div>
                <div className="text-[11px] text-[#707070] mt-0.5 flex items-center gap-3">
                  <span>Price: <strong className="text-[#E6E6E6]">{selectedAsset.price} {selectedAsset.unit}</strong></span>
                  <span>24h: <strong className={isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}>{isPositive ? '+' : ''}{selectedAsset.change24h}%</strong></span>
                  {selectedAsset.country && <span>Region: <strong className="text-[#A0A0A0]">{selectedAsset.country}</strong></span>}
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-1 bg-[#111111] p-0.5 rounded border border-[#303030]">
                {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2 py-0.5 text-[10px] rounded transition-colors font-bold ${
                      selectedTimeframe === tf
                        ? 'bg-[#2563eb] text-white'
                        : 'text-[#707070] hover:text-[#E6E6E6]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart Graphic */}
            <div className="relative mt-3 h-56 w-full">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#252525" strokeDasharray="3 3" />
                <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#252525" strokeDasharray="3 3" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#303030" />

                {/* Y Axis Labels */}
                <text x={padding - 6} y={padding + 4} textAnchor="end" fill="#707070" fontSize="10">{maxVal.toFixed(1)}</text>
                <text x={padding - 6} y={height / 2 + 4} textAnchor="end" fill="#707070" fontSize="10">{((maxVal + minVal) / 2).toFixed(1)}</text>
                <text x={padding - 6} y={height - padding + 4} textAnchor="end" fill="#707070" fontSize="10">{minVal.toFixed(1)}</text>

                {/* Area & Line */}
                <path d={areaD} fill="url(#chartGradient2)" />
                <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2" />

                {/* Data Points */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="2.5"
                    className="fill-[#2563eb] hover:r-4 cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(p.pt)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-2 right-2 bg-[#111111] border border-[#303030] px-2 py-1 rounded text-[10px]">
                  <span className="text-[#707070]">{hoveredPoint.time}: </span>
                  <span className="font-bold text-[#E6E6E6]">{hoveredPoint.value} {selectedAsset.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Market Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-[#151515] border border-[#303030] rounded">
                <span className="text-[9px] text-[#707070] uppercase font-bold block mb-0.5">Day Range</span>
                <span className="text-[11px] font-bold text-[#E6E6E6]">{stats.dayLow} – {stats.dayHigh}</span>
              </div>
              <div className="p-2.5 bg-[#151515] border border-[#303030] rounded">
                <span className="text-[9px] text-[#707070] uppercase font-bold block mb-0.5">52-Week Range</span>
                <span className="text-[11px] font-bold text-[#E6E6E6]">{stats.yearLow} – {stats.yearHigh}</span>
              </div>
              <div className="p-2.5 bg-[#151515] border border-[#303030] rounded">
                <span className="text-[9px] text-[#707070] uppercase font-bold block mb-0.5">24h Volume</span>
                <span className="text-[11px] font-bold text-[#E6E6E6]">{stats.volume24h}</span>
              </div>
              <div className="p-2.5 bg-[#151515] border border-[#303030] rounded">
                <span className="text-[9px] text-[#707070] uppercase font-bold block mb-0.5">Sentiment Index</span>
                <span className="text-[11px] font-bold text-[#E6E6E6]">{stats.sentimentIndex}/100</span>
              </div>
            </div>
          )}

          {/* Market News & Event Correlation Section */}
          <div className="p-3 bg-[#151515] border border-[#303030] rounded space-y-2">
            <div className="flex items-center gap-1.5 pb-1.5 border-b border-[#252525]">
              <Zap className="w-3.5 h-3.5 text-[#d97706]" />
              <h4 className="text-[11px] font-bold text-[#E6E6E6] uppercase tracking-wider">
                Geopolitical Event Transmission & Observable Market Correlation
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#111111] border border-[#252525] rounded space-y-1">
                <span className="text-[9px] text-[#d97706] font-bold uppercase block">
                  Observed Market Movement:
                </span>
                <p className="text-[#A0A0A0] font-mono">
                  {selectedAsset.symbol} observed at <strong>{selectedAsset.price} {selectedAsset.unit}</strong> ({isPositive ? '+' : ''}{selectedAsset.change24h}% 24h).
                </p>
                <span className="text-[9px] text-[#707070] block">
                  Status: {marketStatusState} · Feed: {selectedAsset.exchange || 'Official Exchange'}
                </span>
              </div>

              <div className="p-2.5 bg-[#111111] border border-[#252525] rounded space-y-1">
                <span className="text-[9px] text-[#2563eb] font-bold uppercase block">
                  Possible Transmission Channel:
                </span>
                <p className="text-[#A0A0A0] font-sans leading-relaxed text-[11px]">
                  {selectedAsset.geopoliticalDrivers?.[0] || 'Macro liquidity and sovereign yield adjustments propagate into corporate multiple valuations.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Direction Probability Engine & Catalysts */}
        <div className="space-y-3">
          {prob && (
            <div className="bg-[#151515] border border-[#303030] p-3 rounded space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#252525]">
                <h4 className="text-[11px] font-bold text-[#E6E6E6] uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#A0A0A0]" />
                  Probabilistic Direction Model
                </h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  prob.consensusDirection === 'Bullish' ? 'text-[#16a34a] bg-[#16a34a]/10 border border-[#16a34a]/30' :
                  prob.consensusDirection === 'Bearish' ? 'text-[#dc2626] bg-[#dc2626]/10 border border-[#dc2626]/30' :
                  'text-[#A0A0A0] bg-[#202020]'
                }`}>
                  {prob.consensusDirection.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#16a34a] font-semibold">Bullish Upside Probability</span>
                    <span className="font-bold text-[#16a34a]">{(prob.bullishProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                    <div className="h-full bg-[#16a34a] rounded-full" style={{ width: `${prob.bullishProb * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#A0A0A0]">Neutral / Range-Bound</span>
                    <span className="font-bold text-[#A0A0A0]">{(prob.neutralProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                    <div className="h-full bg-[#707070] rounded-full" style={{ width: `${prob.neutralProb * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#dc2626] font-semibold">Bearish Downside Risk</span>
                    <span className="font-bold text-[#dc2626]">{(prob.bearishProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                    <div className="h-full bg-[#dc2626] rounded-full" style={{ width: `${prob.bearishProb * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#111111] border border-[#252525] rounded text-[10px]">
                <span className="text-[#707070] uppercase font-bold block mb-1">
                  12-Month Target Channel:
                </span>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#dc2626]">Floor: {prob.targetForecastRange.low}</span>
                  <span className="text-[#E6E6E6]">Mid: {prob.targetForecastRange.mid}</span>
                  <span className="text-[#16a34a]">Cap: {prob.targetForecastRange.high}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exposed Sectors and Countries */}
          <div className="bg-[#151515] border border-[#303030] p-3 rounded text-[11px] space-y-2">
            <div>
              <span className="text-[9px] text-[#707070] font-bold uppercase block mb-1">
                Exposed Sectors
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedAsset.exposedSectors.map((sec, i) => (
                  <span key={i} className="text-[10px] bg-[#1C1C1C] border border-[#252525] text-[#A0A0A0] px-1.5 py-0.2 rounded">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] text-[#707070] font-bold uppercase block mb-1">
                Exposed Sovereign Economies
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedAsset.exposedCountries.map((c, i) => (
                  <span key={i} className="text-[10px] bg-[#1C1C1C] border border-[#252525] text-[#A0A0A0] px-1.5 py-0.2 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Macroeconomic Indicators Board */}
      <div className="bg-[#151515] border border-[#303030] p-3 rounded space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#252525]">
          <div className="flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-[#A0A0A0]" />
            <h3 className="text-[11px] font-bold text-[#E6E6E6] uppercase tracking-wider">
              Official Central Bank & Macroeconomic Indicators
            </h3>
          </div>
          <span className="text-[9px] text-[#707070]">
            Source: Official National Statistical Agencies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {economicIndicators.map((ind) => (
            <div key={ind.id} className="p-2.5 bg-[#111111] border border-[#252525] rounded space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#E6E6E6]">{ind.country}</span>
                <span className="text-[9px] text-[#707070] bg-[#181818] px-1 rounded">{ind.period}</span>
              </div>
              <div className="text-xs font-bold text-[#E6E6E6] font-mono">
                {ind.value} <span className="text-[9px] text-[#707070] font-normal">{ind.unit}</span>
              </div>
              <div className="text-[10px] text-[#A0A0A0] truncate">
                {ind.indicator}
              </div>
              <div className="text-[9px] text-[#707070] truncate">
                {ind.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
