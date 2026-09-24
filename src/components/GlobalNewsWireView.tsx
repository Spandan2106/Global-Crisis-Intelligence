import React, { useState, useEffect, useCallback } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  ShieldAlert, 
  Flame, 
  Tv, 
  Youtube, 
  Globe2, 
  Clock, 
  Sparkles, 
  Filter, 
  Compass, 
  CheckCircle2, 
  Share2, 
  AlertTriangle,
  PlayCircle,
  Video
} from 'lucide-react';
import { GlobalNewsReport, CrisisEvent } from '../types/crisis';

interface GlobalNewsWireViewProps {
  onFlyToConflict: (conflictId: string) => void;
  allEvents: CrisisEvent[];
  selectedConflictId?: string | null;
}

export const GlobalNewsWireView: React.FC<GlobalNewsWireViewProps> = ({
  onFlyToConflict,
  allEvents,
  selectedConflictId,
}) => {
  const [newsList, setNewsList] = useState<GlobalNewsReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(20);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizedWire, setSynthesizedWire] = useState<{
    headline: string;
    summary: string;
    threatLevel: string;
    sourceCitation: string;
    timestamp: string;
  } | null>(null);

  const sourcesList = [
    { id: 'all', label: 'ALL SOURCES' },
    { id: 'bbc', label: 'BBC WORLD', badge: 'BBC' },
    { id: 'cnn', label: 'CNN INT', badge: 'CNN' },
    { id: 'al jazeera', label: 'AL JAZEERA', badge: 'AJ' },
    { id: 'google', label: 'GOOGLE NEWS', badge: 'G-NEWS' },
    { id: 'youtube', label: 'YOUTUBE WAR DESK', badge: 'YT' },
    { id: 'ap', label: 'AP WIRE', badge: 'AP' },
    { id: 'ndtv', label: 'NDTV WORLD', badge: 'NDTV' },
    { id: 'reuters', label: 'REUTERS', badge: 'RT' },
  ];

  const categories = [
    { id: 'all', label: 'All Themes' },
    { id: 'Kinetic', label: 'Kinetic Strikes' },
    { id: 'Maritime', label: 'Maritime Chokepoints' },
    { id: 'Humanitarian', label: 'Famine & Relief' },
    { id: 'Hybrid Warfare', label: 'Hybrid & Sabotage' },
    { id: 'Diplomacy', label: 'Diplomatic Pacts' },
    { id: 'Economy', label: 'Energy & Supply Chain' },
  ];

  // Fetch real-time global news feed from server
  const fetchGlobalNews = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = '/api/news/global?';
      if (selectedSource !== 'all') url += `source=${encodeURIComponent(selectedSource)}&`;
      if (selectedConflictId) url += `conflictId=${encodeURIComponent(selectedConflictId)}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.news) {
          setNewsList(data.news);
        }
      }
    } catch (err) {
      console.error('Failed to load global news feed:', err);
    } finally {
      setIsLoading(false);
      setCountdown(20);
    }
  }, [selectedSource, selectedConflictId, searchQuery]);

  useEffect(() => {
    fetchGlobalNews();
  }, [fetchGlobalNews]);

  // Continuous live background polling
  useEffect(() => {
    if (!autoSync) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchGlobalNews();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoSync, fetchGlobalNews]);

  // Trigger on-demand AI live synthesis
  const handleTriggerAiWire = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/realtime/fetch-latest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflictFilter: selectedSource === 'all' ? 'BBC, CNN, Al Jazeera, AP, NDTV, Google, YT news wire' : `From ${selectedSource} geopolitical reporting desk`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSynthesizedWire({
            headline: data.data.headline,
            summary: data.data.summary,
            threatLevel: data.data.threatLevel || 'Elevated',
            sourceCitation: data.data.sourceCitation || 'Multi-Agency Global Wire (BBC, CNN, Al Jazeera, AP, NDTV)',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }
    } catch (err) {
      console.error('Error generating AI wire:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Filter news items by theme category
  const displayedNews = newsList.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const getSourceColor = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('bbc')) return 'bg-red-950 text-red-300 border-red-800';
    if (s.includes('cnn')) return 'bg-rose-950 text-rose-300 border-rose-800';
    if (s.includes('al jazeera')) return 'bg-amber-950 text-amber-300 border-amber-800';
    if (s.includes('youtube')) return 'bg-red-900 text-white border-red-700';
    if (s.includes('ap')) return 'bg-slate-900 text-cyan-300 border-cyan-800';
    if (s.includes('ndtv')) return 'bg-orange-950 text-orange-300 border-orange-800';
    if (s.includes('google')) return 'bg-blue-950 text-blue-300 border-blue-800';
    if (s.includes('reuters')) return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    return 'bg-slate-900 text-slate-300 border-slate-700';
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 font-mono overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
      {/* Top Banner: Global News Report & Sources Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="flex items-center gap-1.5 bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>GLOBAL NEWS WIRE REPORT</span>
            </div>
            <span className="text-xs text-slate-400">
              Real-time multi-agency verification stream
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>LIVE CONFLICT & GEOPOLITICAL NEWS MONITOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated intelligence feed continuously capturing reports from BBC, CNN, Al Jazeera, Google News, YouTube, AP, NDTV, and Reuters.
          </p>
        </div>

        {/* Real-time sync & AI actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Radio className={`w-3.5 h-3.5 ${autoSync ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-400">LIVE SYNC:</span>
            <span className="text-cyan-400 font-bold">{autoSync ? `${countdown}s` : 'PAUSED'}</span>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className="ml-2 text-[10px] text-slate-500 hover:text-slate-300 underline"
            >
              {autoSync ? 'PAUSE' : 'RESUME'}
            </button>
          </div>

          <button
            onClick={fetchGlobalNews}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>FETCH LATEST</span>
          </button>

          <button
            onClick={handleTriggerAiWire}
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'SYNTHESIZING...' : 'AI WIRE SYNTHESIS'}</span>
          </button>
        </div>
      </div>

      {/* AI Live Wire Flash if triggered */}
      {synthesizedWire && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-700/80 text-slate-200 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              BREAKING REAL-TIME INTELLIGENCE SYNTHESIS • {synthesizedWire.timestamp}
            </span>
            <span className="px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-600 text-[10px] font-bold">
              THREAT LEVEL: {synthesizedWire.threatLevel}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">{synthesizedWire.headline}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{synthesizedWire.summary}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Source Framework: {synthesizedWire.sourceCitation}</span>
            <span className="text-amber-400 font-semibold">Verified Global Intelligence Digest</span>
          </div>
        </div>
      )}

      {/* Dynamic Sources & Search Filter Bar */}
      <div className="flex flex-col gap-3 bg-slate-900/60 border border-slate-800/90 p-3.5 rounded-xl">
        {/* Source Pills Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1 mr-1">
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOURCES:</span>
          </span>
          {sourcesList.map(src => (
            <button
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedSource === src.id
                  ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* Categories & Search Input Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-[11px] text-slate-500 uppercase mr-1">THEME:</span>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-cyan-400 border border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search news by topic, headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* News Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedNews.map(item => (
          <div
            key={item.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition-all shadow-lg group relative"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSourceColor(item.source)}`}>
                    {item.source}
                  </span>
                  {item.source.toLowerCase().includes('youtube') && (
                    <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                      <PlayCircle className="w-2.5 h-2.5" />
                      VIDEO
                    </span>
                  )}
                  {item.isLiveBroadcast && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.timeAgo}
                </span>
              </div>

              {/* Headline */}
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug mb-2">
                {item.headline}
              </h4>

              {/* Summary Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.summary}
              </p>
            </div>

            <div>
              {/* Conflict Theater Linkage Card */}
              {item.conflictId && (
                <div className="mb-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">
                      LINKED CONFLICT THEATER
                    </span>
                    <span className="text-xs font-bold text-cyan-300 truncate block">
                      {item.conflictName || item.conflictId}
                    </span>
                  </div>
                  <button
                    onClick={() => onFlyToConflict(item.conflictId!)}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold transition-colors shrink-0"
                    title="Rotate 3D Earth / Map camera directly to this conflict location"
                  >
                    <Compass className="w-3 h-3" />
                    <span>FLY TO THEATER</span>
                  </button>
                </div>
              )}

              {/* Footer Meta & Direct Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{item.region}</span>
                  <span className="text-slate-600">•</span>
                  <span className={`font-semibold ${
                    item.urgency === 'critical' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {item.category}
                  </span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                >
                  <span>SOURCE WIRE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedNews.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">No matching news reports located</h4>
          <p className="text-xs text-slate-400">
            Try adjusting your source filter or clearing your search term to view all global dispatches.
          </p>
        </div>
      )}
    </div>
  );
};
