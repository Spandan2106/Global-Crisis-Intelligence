import React, { useState, useEffect } from 'react';
import { CrisisEvent, GlobalNewsReport } from '../types/crisis';
import { 
  X, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Globe, 
  HelpCircle, 
  CheckCircle2,
  Radio,
  Tv,
  PlayCircle
} from 'lucide-react';

interface EventDetailsProps {
  event: CrisisEvent | null;
  onClose: () => void;
  onSelectCountry?: (countryCode: string) => void;
  onFlyToEvent?: (event: CrisisEvent) => void;
}

interface NewsSynthesisResponse {
  whatHappened: string;
  whyItMatters: string;
  whatIsKnown: string;
  whatIsUncertain: string;
  recentDevelopments: string;
  confidence: string;
  methodologyNote: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onSelectCountry,
  onFlyToEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'sources' | 'liveWire' | 'aiSynthesis'>('overview');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisData, setSynthesisData] = useState<NewsSynthesisResponse | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [liveNews, setLiveNews] = useState<GlobalNewsReport[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Fetch real-time news for this conflict
  useEffect(() => {
    if (!event) return;
    setIsLoadingNews(true);
    fetch(`/api/news/global?conflictId=${encodeURIComponent(event.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.news && data.news.length > 0) {
          setLiveNews(data.news);
        } else {
          // Fallback to region dispatches
          fetch(`/api/news/global?search=${encodeURIComponent(event.region)}`)
            .then(res2 => res2.json())
            .then(data2 => {
              if (data2.news) setLiveNews(data2.news.slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(err => console.error('Error fetching conflict news:', err))
      .finally(() => setIsLoadingNews(false));
  }, [event]);

  if (!event) return null;

  const getRiskLabel = (val: number) => {
    if (val < 0.20) return { label: 'Very Low', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800' };
    if (val < 0.40) return { label: 'Low', color: 'text-blue-400 bg-blue-950/50 border-blue-800' };
    if (val < 0.60) return { label: 'Moderate', color: 'text-yellow-400 bg-yellow-950/50 border-yellow-800' };
    if (val < 0.80) return { label: 'High', color: 'text-orange-400 bg-orange-950/50 border-orange-800' };
    return { label: 'Very High', color: 'text-red-400 bg-red-950/50 border-red-800' };
  };

  const riskMeta = getRiskLabel(event.riskIndicator);

  const handleRunAiSynthesis = async () => {
    setIsSynthesizing(true);
    setSynthesisError(null);
    setActiveTab('aiSynthesis');
    try {
      const res = await fetch('/api/gemini/analyze-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setSynthesisData(data);
    } catch (err: unknown) {
      console.error('Synthesis failed:', err);
      setSynthesisError(err instanceof Error ? err.message : 'Unable to complete synthesis');
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <aside className="fixed md:static inset-y-0 right-0 z-40 w-96 bg-slate-950/95 border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto font-mono text-slate-200 shadow-2xl">
      <div>
        {/* Header & Controls */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${riskMeta.color}`}>
                Risk {event.riskIndicator.toFixed(2)} • {riskMeta.label}
              </span>
              {event.isDemo && (
                <span className="text-[10px] bg-amber-950/80 text-amber-400 border border-amber-800/80 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-slate-100 leading-snug">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location & Metadata Bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <button
              onClick={() => onSelectCountry && onSelectCountry(event.countryCode)}
              className="text-cyan-400 hover:underline font-semibold"
            >
              {event.country}
            </button>
            <span>({event.region})</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Updated: {new Date(event.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Geographic Coordinates & Real Flight Button */}
        <div className="p-2 my-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="text-[10px] text-slate-400 font-mono">
            <span className="text-slate-500">GEO: </span>
            <strong className="text-slate-200">{event.latitude.toFixed(4)}° N, {event.longitude.toFixed(4)}° E</strong>
          </div>
          {onFlyToEvent && (
            <button
              onClick={() => onFlyToEvent(event)}
              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 rounded-lg text-[10px] font-bold transition-all shadow-sm"
            >
              <Globe className="w-3 h-3" />
              <span>VIEW ON EARTH</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 my-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
              activeTab === 'sources'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sources ({event.sources.length})
          </button>
          <button
            onClick={() => setActiveTab('liveWire')}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
              activeTab === 'liveWire'
                ? 'border-red-400 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-red-300'
            }`}
          >
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>Wire ({liveNews.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('aiSynthesis');
              if (!synthesisData && !isSynthesizing) handleRunAiSynthesis();
            }}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
              activeTab === 'aiSynthesis'
                ? 'border-purple-400 text-purple-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Intel</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 pt-1 text-xs">
            {/* Reports Differ Alert */}
            {event.reportsDiffer && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-300 text-[11px] flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block text-amber-200 font-bold">REPORTS DIFFER</strong>
                  <span>{event.reportsDisagreementSummary || 'Discrepancies noted across reporting sources.'}</span>
                </div>
              </div>
            )}

            {/* Summary */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Summary
              </span>
              <p className="mt-1 text-slate-300 leading-relaxed font-sans">
                {event.summary}
              </p>
            </div>

            {/* Why Monitored */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold block mb-1">
                Why is this being monitored?
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {event.whyMonitored}
              </p>
            </div>

            {/* AI-Assisted Risk Indicator Breakdown */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  AI-Assisted Risk Indicator
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  {event.riskIndicator.toFixed(2)} / 1.00
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 italic">
                An analytical indicator derived from available evidence. It is not a guaranteed prediction.
              </p>

              {/* Contributing Factors Table */}
              <div className="space-y-2 border-t border-slate-800 pt-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Contributing Factors:
                </div>
                {event.contributingFactors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[200px]" title={f.description}>
                      {f.factor}
                    </span>
                    <span className={`font-mono font-bold ${f.weight >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.weight >= 0 ? `+${f.weight.toFixed(2)}` : f.weight.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Domain Impacts */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Impact Assessments
              </span>
              {event.economicImpact && (
                <div className="p-2 bg-blue-950/20 border border-blue-900/40 rounded-lg">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Economic Impact</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                    {event.economicImpact}
                  </p>
                </div>
              )}

              {event.humanitarianImpact && (
                <div className="p-2 bg-amber-950/20 border border-amber-900/40 rounded-lg">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Humanitarian Impact</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                    {event.humanitarianImpact}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Chronological Timeline */}
        {activeTab === 'timeline' && (
          <div className="pt-2 space-y-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
              Event Milestones & Progression
            </span>
            <div className="relative border-l border-slate-700/80 ml-2 space-y-4 pl-4 text-xs">
              {event.timeline.map((m, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-950" />
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold">
                    {m.date}
                  </div>
                  <h4 className="font-semibold text-slate-200 mt-0.5">
                    {m.title}
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-1 font-sans leading-relaxed">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Sources & Provenance */}
        {activeTab === 'sources' && (
          <div className="pt-2 space-y-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
              Verified Source Attribution
            </span>
            <div className="space-y-2 text-xs">
              {event.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between text-slate-200 font-semibold mb-1">
                    <span className="group-hover:text-cyan-400 transition-colors">{s.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mb-1">
                    Publisher: {s.publisher}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="capitalize">Type: {s.type}</span>
                    <span>Date: {s.publishedDate}</span>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 italic mt-3 leading-normal">
              Sources are independently curated from multilateral agencies, accredited news wires, and official gazettes.
            </p>
          </div>
        )}

        {/* Tab: Real-Time Live Wire News (BBC, CNN, Al Jazeera, AP, NDTV, YouTube) */}
        {activeTab === 'liveWire' && (
          <div className="pt-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Live Wire Dispatches
              </span>
              <span className="text-[10px] text-slate-400">
                {liveNews.length} verified reports
              </span>
            </div>

            {isLoadingNews ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Fetching latest global dispatches...</p>
              </div>
            ) : liveNews.length === 0 ? (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-center">
                <p className="text-xs mb-1">No direct dispatches logged in the last 24h.</p>
                <p className="text-[10px] text-slate-500">Continuous telemetry monitoring active.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {liveNews.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 uppercase">
                          {item.source}
                        </span>
                        {item.source.toLowerCase().includes('youtube') && (
                          <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-red-900 text-white font-bold">
                            <PlayCircle className="w-2.5 h-2.5" />
                            VIDEO
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium">{item.category}</span>
                    </div>

                    <h4 className="font-bold text-slate-100 text-xs leading-snug mb-1">
                      {item.headline}
                    </h4>

                    <p className="text-slate-300 text-[11px] leading-relaxed mb-2 font-sans">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px]">
                      <span className="text-slate-400 font-mono">Region: {item.region}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                      >
                        <span>VIEW WIRE</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Gemini News Intelligence Synthesis */}
        {activeTab === 'aiSynthesis' && (
          <div className="pt-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini Multi-Report Synthesis
              </span>
              <button
                onClick={handleRunAiSynthesis}
                disabled={isSynthesizing}
                className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded hover:bg-purple-900 transition-colors disabled:opacity-50"
              >
                {isSynthesizing ? 'Synthesizing...' : 'Re-Analyze'}
              </button>
            </div>

            {isSynthesizing ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Distilling multi-source intelligence reports...</p>
                <p className="text-[10px] text-slate-500">Checking evidence, extracting transmission channels</p>
              </div>
            ) : synthesisError ? (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs">
                {synthesisError}
              </div>
            ) : synthesisData ? (
              <div className="space-y-3 font-sans">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    WHAT HAPPENED
                  </strong>
                  <p className="text-slate-300 text-xs leading-relaxed">{synthesisData.whatHappened}</p>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="block text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1">
                    WHY IT MATTERS
                  </strong>
                  <p className="text-slate-300 text-xs leading-relaxed">{synthesisData.whyItMatters}</p>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="block text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                    WHAT IS KNOWN
                  </strong>
                  <p className="text-slate-300 text-xs leading-relaxed">{synthesisData.whatIsKnown}</p>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="block text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                    WHAT IS UNCERTAIN
                  </strong>
                  <p className="text-slate-300 text-xs leading-relaxed">{synthesisData.whatIsUncertain}</p>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="block text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-1">
                    RECENT DEVELOPMENTS
                  </strong>
                  <p className="text-slate-300 text-xs leading-relaxed">{synthesisData.recentDevelopments}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                  {synthesisData.methodologyNote}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={handleRunAiSynthesis}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-semibold transition-all shadow-lg shadow-purple-950/50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesize News Intelligence</span>
        </button>
      </div>
    </aside>
  );
};
