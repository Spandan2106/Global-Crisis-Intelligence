import React, { useState, useEffect, useCallback } from 'react';
import { 
  Radio, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight, 
  ShieldAlert, 
  Flame, 
  Compass, 
  Anchor, 
  Layers, 
  Wifi, 
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';
import { LiveNewsItem, ConflictLiveTelemetry, CrisisEvent } from '../types/crisis';

interface LiveIntelligenceFeedProps {
  onSelectConflict: (conflictId: string) => void;
  allEvents: CrisisEvent[];
  onOpenNewsSection?: () => void;
}

export const LiveIntelligenceFeed: React.FC<LiveIntelligenceFeedProps> = ({
  onSelectConflict,
  allEvents,
  onOpenNewsSection,
}) => {
  const [newsItems, setNewsItems] = useState<LiveNewsItem[]>([]);
  const [telemetry, setTelemetry] = useState<ConflictLiveTelemetry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingAi, setIsFetchingAi] = useState<boolean>(false);
  const [aiFlash, setAiFlash] = useState<{ headline: string; summary: string; threatLevel: string; sourceCitation: string } | null>(null);
  const [countdown, setCountdown] = useState<number>(25);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Fetch real-time feed from backend
  const fetchLiveFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/realtime/intelligence');
      if (res.ok) {
        const data = await res.json();
        if (data.liveNews) {
          setNewsItems(data.liveNews);
        }
        if (data.conflictTelemetry) {
          setTelemetry(data.conflictTelemetry);
        }
      }
    } catch (err) {
      console.error('Failed to fetch real-time intelligence:', err);
    } finally {
      setIsLoading(false);
      setCountdown(25);
    }
  }, []);

  // On-demand AI situational sweep
  const triggerAiSweep = async () => {
    setIsFetchingAi(true);
    try {
      const res = await fetch('/api/realtime/fetch-latest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conflictFilter: selectedFilter === 'all' ? null : selectedFilter })
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.data) {
          setAiFlash(payload.data);
          // Also prepend to news list
          const newItem: LiveNewsItem = {
            id: `sweep-${Date.now()}`,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now',
            headline: payload.data.headline,
            source: payload.data.sourceCitation,
            region: 'Global Live Dispatch',
            category: 'kinetic',
            urgency: 'critical',
            details: payload.data.summary,
            verified: true,
          };
          setNewsItems(prev => [newItem, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error triggering AI sweep:', err);
    } finally {
      setIsFetchingAi(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLiveFeed();
  }, [fetchLiveFeed]);

  // Continuous auto-sync interval
  useEffect(() => {
    if (!isAutoSyncEnabled) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchLiveFeed();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoSyncEnabled, fetchLiveFeed]);

  // Filter items
  const filteredNews = newsItems.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'hormuz') return item.conflictId?.includes('hormuz') || item.headline.toLowerCase().includes('hormuz');
    if (selectedFilter === 'gaza') return item.conflictId?.includes('gaza') || item.headline.toLowerCase().includes('gaza');
    if (selectedFilter === 'lebanon') return item.conflictId?.includes('lebanon') || item.headline.toLowerCase().includes('lebanon');
    if (selectedFilter === 'sudan') return item.conflictId?.includes('sudan') || item.headline.toLowerCase().includes('sudan');
    if (selectedFilter === 'horn') return item.conflictId?.includes('horn') || item.headline.toLowerCase().includes('horn');
    if (selectedFilter === 'hybrid') return item.conflictId?.includes('hybrid') || item.headline.toLowerCase().includes('baltic') || item.headline.toLowerCase().includes('hybrid');
    return true;
  });

  const activeNewsTicker = newsItems[0];

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/80 text-xs font-mono select-none z-20">
      {/* Live Marquee & Control Bar */}
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800/50">
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-[280px]">
          {/* Animated live beacon */}
          <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded-full text-[10px] text-red-300 font-bold uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>LIVE WIRE</span>
          </div>

          {/* Rolling Ticker Headline */}
          {activeNewsTicker ? (
            <div 
              onClick={() => {
                if (activeNewsTicker.conflictId) onSelectConflict(activeNewsTicker.conflictId);
                setIsExpanded(true);
              }}
              className="text-slate-300 hover:text-cyan-400 truncate cursor-pointer transition-colors flex items-center gap-1.5 text-[11px]"
              title="Click to view full dispatch & target theater"
            >
              <span className="text-slate-500 text-[10px]">[{activeNewsTicker.timeAgo || 'Live'}]</span>
              <strong className="text-slate-100 font-semibold">{activeNewsTicker.headline}</strong>
              <ChevronRight className="w-3 h-3 text-cyan-400 inline shrink-0" />
            </div>
          ) : (
            <span className="text-slate-500 text-[11px]">Connecting to real-time geopolitical intelligence satellites...</span>
          )}
        </div>

        {/* Sync Controls & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Auto-Sync status */}
          <button
            onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${
              isAutoSyncEnabled 
                ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/80' 
                : 'text-slate-500 bg-slate-900 border border-slate-800'
            }`}
            title={isAutoSyncEnabled ? 'Auto-sync active: continuously fetching latest wire' : 'Auto-sync paused'}
          >
            <Wifi className={`w-3 h-3 ${isAutoSyncEnabled ? 'animate-pulse text-cyan-400' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">AUTO-SYNC:</span>
            <span>{isAutoSyncEnabled ? `${countdown}s` : 'PAUSED'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={fetchLiveFeed}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all text-[11px]"
            title="Fetch latest verified real-time data now"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden md:inline">FETCH NOW</span>
          </button>

          {/* Live AI Situational Sweep */}
          <button
            onClick={triggerAiSweep}
            disabled={isFetchingAi}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-red-600/90 to-amber-600/90 hover:from-red-500 hover:to-amber-500 text-white font-bold transition-all shadow-sm text-[11px]"
            title="Generate real-time situational AI dispatch using verified inputs"
          >
            <Sparkles className={`w-3 h-3 ${isFetchingAi ? 'animate-spin' : ''}`} />
            <span>{isFetchingAi ? 'SYNTHESIZING...' : 'AI INTEL SWEEP'}</span>
          </button>

          {/* Open Full Global News Section */}
          {onOpenNewsSection && (
            <button
              onClick={onOpenNewsSection}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800 hover:border-cyan-600 transition-all font-bold text-[11px]"
              title="Open the full Global News Wire report terminal with BBC, CNN, Al Jazeera, AP, NDTV, YT sources"
            >
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">GLOBAL NEWS REPORT</span>
            </button>
          )}

          {/* Expand/Collapse Drawer Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              isExpanded 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isExpanded ? 'CLOSE WIRE ▲' : 'VIEW ALL WIRE ▼'}
          </button>
        </div>
      </div>

      {/* Expandable Live News & Incident Terminal */}
      {isExpanded && (
        <div className="bg-slate-950/98 p-4 border-t border-slate-800 flex flex-col gap-3 max-h-80 overflow-y-auto">
          {/* AI Sweep Banner if generated */}
          {aiFlash && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-red-700/80 text-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  REAL-TIME SITUATIONAL AI SYNTHESIS (JUST NOW)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700 font-bold">
                  THREAT: {aiFlash.threatLevel}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{aiFlash.headline}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">{aiFlash.summary}</p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Source: {aiFlash.sourceCitation}</span>
                <span className="text-amber-400 font-medium">Verified Cross-Chokepoint Telemetry</span>
              </div>
            </div>
          )}

          {/* Conflict Live Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {telemetry.map(t => (
              <button
                key={t.conflictId}
                onClick={() => onSelectConflict(t.conflictId)}
                className="text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-700 transition-all group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400 truncate">
                    {t.name}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    t.riskIndex >= 0.90 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {t.riskIndex.toFixed(2)}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">{t.status}</div>
                <div className="text-[9px] text-cyan-500/80 truncate mt-1">FLY TO THEATER &gt;</div>
              </button>
            ))}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Filter Wire:</span>
            {[
              { id: 'all', label: 'ALL THEATERS' },
              { id: 'hormuz', label: 'STRAIT OF HORMUZ' },
              { id: 'gaza', label: 'GAZA CORRIDOR' },
              { id: 'lebanon', label: 'LEBANON BLUE LINE' },
              { id: 'sudan', label: 'SUDAN / DARFUR' },
              { id: 'horn', label: 'HORN OF AFRICA' },
              { id: 'hybrid', label: 'EUROPE HYBRID WAR' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-cyan-900 text-cyan-300 border border-cyan-700 font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* News Items List */}
          <div className="space-y-2 mt-1">
            {filteredNews.map(item => (
              <div
                key={item.id}
                onClick={() => item.conflictId && onSelectConflict(item.conflictId)}
                className="p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      item.urgency === 'critical' 
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.timeAgo || 'Recent'}</span>
                    <span className="text-[10px] text-slate-500">• {item.region}</span>
                    <span className="text-[10px] text-slate-500">• {item.source}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-100 mb-0.5">{item.headline}</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">{item.details}</p>
                </div>
                {item.conflictId && (
                  <div className="shrink-0 flex items-center gap-1 text-[11px] text-cyan-400 font-bold hover:underline">
                    <span>Fly to Theater</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
