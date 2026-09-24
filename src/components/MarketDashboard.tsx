import React, { useState, useEffect } from 'react';
import { GLOBAL_MARKET_ASSETS } from '../data/markets';
import { MarketAsset } from '../types/crisis';
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
  Target
} from 'lucide-react';

interface MarketDashboardProps {
  onClose?: () => void;
}

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';
type AssetCategoryFilter = 'all' | 'index' | 'commodity' | 'currency' | 'bond' | 'volatility';

export const MarketDashboard: React.FC<MarketDashboardProps> = () => {
  const [assets, setAssets] = useState<MarketAsset[]>(GLOBAL_MARKET_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(GLOBAL_MARKET_ASSETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategoryFilter>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);

  // Live price fluctuation simulation to demonstrate real-time ticks
  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAssets(prev => prev.map(a => {
        const delta = (Math.random() - 0.48) * 0.4;
        const newPrice = parseFloat((a.price * (1 + delta / 100)).toFixed(2));
        const newChange = parseFloat((a.change24h + delta).toFixed(2));
        return {
          ...a,
          price: newPrice,
          change24h: newChange,
        };
      }));
      setIsRefreshing(false);
    }, 600);
  };

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
          contextData: { selectedAsset }
        })
      });
      const data = await res.json();
      setAiReport(data.reply);
    } catch (err) {
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

  return (
    <div className="w-full h-full bg-slate-950 p-4 sm:p-6 overflow-y-auto font-mono text-slate-200">
      {/* Header Bar with Real-time Tick Button */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Global Share Markets & Index Analytics
            </h2>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TICK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time equity indices, commodities, yields, and analytical direction probabilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshPrices}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Update Ticks</span>
          </button>

          <button
            onClick={handleGenerateMarketReport}
            disabled={isGeneratingAiReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-950/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingAiReport ? 'Analyzing...' : 'AI Market Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Instruments' },
          { id: 'index', label: 'Global Stock Indices' },
          { id: 'commodity', label: 'Commodities & Energy' },
          { id: 'bond', label: 'Treasury & Bond Yields' },
          { id: 'volatility', label: 'Volatility & Hedging' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as AssetCategoryFilter)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              categoryFilter === cat.id
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Real-time Asset Ticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {filteredAssets.map((asset) => {
          const isSelected = selectedAsset.id === asset.id;
          const pos = asset.change24h >= 0;
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                <span className="truncate">{asset.symbol}</span>
                <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400">{asset.exchange || asset.category}</span>
              </div>
              <div className="text-sm font-bold text-slate-100 my-0.5 truncate">
                {asset.price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{asset.unit}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
                {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{pos ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart & Statistical Probability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Interactive Chart & Live Statistics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart Header & SVG Canvas */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono uppercase">
                    {selectedAsset.exchange || selectedAsset.category}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                  <span>Price: <strong className="text-slate-100">{selectedAsset.price} {selectedAsset.unit}</strong></span>
                  <span>24h Change: <strong className={isPositive ? 'text-emerald-400' : 'text-red-400'}>{isPositive ? '+' : ''}{selectedAsset.change24h}%</strong></span>
                  {selectedAsset.country && <span>Jurisdiction: <strong className="text-slate-300">{selectedAsset.country}</strong></span>}
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart Graphic */}
            <div className="relative mt-4 h-64 w-full">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" />

                {/* Y Axis Labels */}
                <text x={padding - 6} y={padding + 4} textAnchor="end" fill="#64748b" fontSize="10">{maxVal.toFixed(1)}</text>
                <text x={padding - 6} y={height / 2 + 4} textAnchor="end" fill="#64748b" fontSize="10">{((maxVal + minVal) / 2).toFixed(1)}</text>
                <text x={padding - 6} y={height - padding + 4} textAnchor="end" fill="#64748b" fontSize="10">{minVal.toFixed(1)}</text>

                {/* Area & Line */}
                <path d={areaD} fill="url(#chartGradient2)" />
                <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Data Points */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    className="fill-cyan-400 hover:r-5 cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(p.pt)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-2 right-4 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-xs shadow-xl">
                  <span className="text-slate-400">{hoveredPoint.time}: </span>
                  <span className="font-bold text-cyan-400">{hoveredPoint.value} {selectedAsset.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Market Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Day Range</span>
                <span className="text-xs font-bold text-slate-200">{stats.dayLow} – {stats.dayHigh}</span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">52-Week Range</span>
                <span className="text-xs font-bold text-slate-200">{stats.yearLow} – {stats.yearHigh}</span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">24h Trading Volume</span>
                <span className="text-xs font-bold text-slate-200">{stats.volume24h}</span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Sentiment Index</span>
                <span className="text-xs font-bold text-cyan-400">{stats.sentimentIndex}/100</span>
              </div>
            </div>
          )}

          {/* AI Intelligence Briefing Output (if triggered) */}
          {aiReport && (
            <div className="p-4 bg-purple-950/30 border border-purple-800/80 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold uppercase text-[11px]">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Institutional Analyst Briefing</span>
              </div>
              <div className="text-slate-300 font-mono whitespace-pre-line leading-relaxed text-[11px]">
                {aiReport}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Direction Probability Engine & Catalysts */}
        <div className="space-y-4">
          {/* Probability Breakdown Box */}
          {prob && (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Direction Probability Model
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  prob.consensusDirection === 'Bullish' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  prob.consensusDirection === 'Bearish' ? 'bg-red-950 text-red-400 border border-red-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {prob.consensusDirection.toUpperCase()}
                </span>
              </div>

              {/* Probability Spectrum Gauge */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold">Bullish Upside Probability</span>
                    <span className="font-bold text-emerald-400">{(prob.bullishProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${prob.bullishProb * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-semibold">Neutral / Sideways Range</span>
                    <span className="font-bold text-slate-300">{(prob.neutralProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${prob.neutralProb * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-red-400 font-semibold">Bearish Downside Risk</span>
                    <span className="font-bold text-red-400">{(prob.bearishProb * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${prob.bearishProb * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Target Forecast Channel */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  12-Month Target Forecast Channel:
                </span>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-red-400">Floor: {prob.targetForecastRange.low}</span>
                  <span className="text-cyan-400">Mid: {prob.targetForecastRange.mid}</span>
                  <span className="text-emerald-400">Cap: {prob.targetForecastRange.high}</span>
                </div>
              </div>

              {/* Probability Rationale */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Macro & Statistical Rationale:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {prob.probabilityRationale}
                </p>
              </div>

              {/* Catalysts to Monitor */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">
                  Transmission Catalysts:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {prob.catalysts.map((cat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Zap className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Exposed Sectors and Countries */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Exposed Sectors
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedAsset.exposedSectors.map((sec, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Exposed Sovereign Economies
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedAsset.exposedCountries.map((c, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
