import React, { useState } from 'react';
import { CrisisEvent } from '../types/crisis';
import { 
  X, 
  MapPin, 
  Clock, 
  Globe, 
  ExternalLink,
  Bot,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Users,
  TrendingUp,
  BarChart2
} from 'lucide-react';

interface EventDetailsProps {
  event: CrisisEvent | null;
  onClose: () => void;
  onSelectCountry?: (countryCode: string) => void;
  onFlyToEvent?: (event: CrisisEvent) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onSelectCountry,
  onFlyToEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'timeline' | 'sources' | 'ai'>('overview');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisData, setSynthesisData] = useState<any>(null);

  if (!event) return null;

  const handleRunAiSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/gemini/analyze-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      if (res.ok) {
        const data = await res.json();
        setSynthesisData(data);
      }
    } catch {
      // synthesis error catch
    } finally {
      setIsSynthesizing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'escalating':
      case 'ongoing':
      case 'active':
        return 'text-[#dc2626] bg-[#dc2626]/10 border-[#dc2626]/30';
      case 'de-escalating':
      case 'ceasefire':
        return 'text-[#16a34a] bg-[#16a34a]/10 border-[#16a34a]/30';
      case 'frozen':
      case 'historical':
      default:
        return 'text-[#707070] bg-[#1C1C1C] border-[#303030]';
    }
  };

  return (
    <aside className="fixed md:static inset-y-0 right-0 z-40 w-96 bg-[#111111] border-l border-[#303030] p-4 flex flex-col justify-between overflow-y-auto font-mono text-[#E6E6E6] text-xs select-none shadow-2xl">
      <div className="space-y-3">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#303030]">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusColor(event.status)}`}>
                {event.isOngoing ? 'ONGOING' : event.status.toUpperCase()}
              </span>
              <span className="text-[10px] text-[#A0A0A0] uppercase bg-[#181818] px-1.5 py-0.5 rounded border border-[#303030]">
                {event.category}
              </span>
            </div>
            <h2 className="text-sm font-bold text-[#E6E6E6] leading-snug">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#707070] hover:text-[#E6E6E6] hover:bg-[#1C1C1C] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location & Metadata Bar */}
        <div className="p-2 bg-[#151515] border border-[#303030] rounded space-y-1 text-[11px]">
          <div className="flex items-center justify-between text-[#A0A0A0]">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A0A0A0]" />
              <button
                onClick={() => onSelectCountry && onSelectCountry(event.countryCode)}
                className="text-[#E6E6E6] font-bold hover:underline"
              >
                {event.country}
              </button>
              <span>({event.region})</span>
            </div>

            {onFlyToEvent && (
              <button
                onClick={() => onFlyToEvent(event)}
                className="text-[10px] px-2 py-0.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#E6E6E6] border border-[#3A3A3A] rounded font-bold transition-colors"
              >
                FLY TO
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#707070] pt-1 border-t border-[#252525]">
            <span>COORDS: {event.latitude.toFixed(2)}°, {event.longitude.toFixed(2)}°</span>
            <span>STARTED: {event.startDate || event.date}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#303030] text-[11px]">
          {[
            { id: 'overview', label: 'Situation' },
            { id: 'impact', label: 'Impact Matrix' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'sources', label: 'Sources' },
            { id: 'ai', label: 'AI Synthesis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1 text-center font-bold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2563eb] text-[#E6E6E6]'
                  : 'border-transparent text-[#707070] hover:text-[#A0A0A0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Current Situation & Factors */}
        {activeTab === 'overview' && (
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-[10px] font-bold text-[#707070] uppercase block mb-1">
                CURRENT SITUATION:
              </span>
              <p className="text-[11px] text-[#A0A0A0] font-sans leading-relaxed">
                {event.currentSituation || event.summary}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#707070] uppercase block mb-1">
                WHY MONITORED:
              </span>
              <p className="text-[11px] text-[#A0A0A0] font-sans leading-relaxed">
                {event.whyMonitored}
              </p>
            </div>

            {event.contributingFactors && event.contributingFactors.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#707070] uppercase block mb-1">
                  CONTRIBUTING FACTORS:
                </span>
                <div className="space-y-1">
                  {event.contributingFactors.map((f, i) => (
                    <div key={i} className="p-1.5 bg-[#151515] border border-[#252525] rounded text-[10px] flex items-center justify-between">
                      <span className="text-[#E6E6E6]">{f.factor}</span>
                      <span className="text-[#A0A0A0] font-bold font-mono">+{f.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Multilateral Impact Matrix */}
        {activeTab === 'impact' && (
          <div className="space-y-2.5 pt-1 text-[11px]">
            {event.humanitarianImpact && (
              <div className="p-2 bg-[#151515] border border-[#303030] rounded space-y-1">
                <span className="text-[10px] font-bold text-[#d97706] uppercase flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  HUMANITARIAN IMPACT:
                </span>
                <p className="text-[#A0A0A0] font-sans leading-relaxed">
                  {event.humanitarianImpact}
                </p>
              </div>
            )}

            {event.economicImpact && (
              <div className="p-2 bg-[#151515] border border-[#303030] rounded space-y-1">
                <span className="text-[10px] font-bold text-[#2563eb] uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  ECONOMIC IMPACT:
                </span>
                <p className="text-[#A0A0A0] font-sans leading-relaxed">
                  {event.economicImpact}
                </p>
              </div>
            )}

            {event.marketImpact && (
              <div className="p-2 bg-[#151515] border border-[#303030] rounded space-y-1">
                <span className="text-[10px] font-bold text-[#16a34a] uppercase flex items-center gap-1">
                  <BarChart2 className="w-3 h-3" />
                  FINANCIAL & MARKET IMPACT:
                </span>
                <p className="text-[#A0A0A0] font-sans leading-relaxed">
                  {event.marketImpact}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Timeline Milestones */}
        {activeTab === 'timeline' && (
          <div className="space-y-2 pt-1">
            {event.timeline?.map((item, idx) => (
              <div key={idx} className="p-2 bg-[#151515] border border-[#252525] rounded text-[11px]">
                <div className="flex items-center justify-between text-[#707070] text-[10px] mb-0.5">
                  <span className="font-bold text-[#E6E6E6]">{item.date}</span>
                  <span>MILESTONE</span>
                </div>
                <div className="font-bold text-[#A0A0A0] mb-0.5">{item.title}</div>
                <p className="text-[#707070] font-sans text-[10px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Sources & Evidence */}
        {activeTab === 'sources' && (
          <div className="space-y-2 pt-1">
            {event.sources?.map((s, idx) => (
              <div key={idx} className="p-2 bg-[#151515] border border-[#252525] rounded text-[11px] flex items-center justify-between">
                <div>
                  <div className="text-[#E6E6E6] font-bold">{s.name}</div>
                  <div className="text-[10px] text-[#707070]">{s.publisher} · {s.publishedDate}</div>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-[#707070] hover:text-[#E6E6E6]"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: AI Analyst Synthesis */}
        {activeTab === 'ai' && (
          <div className="space-y-3 pt-1 text-[11px]">
            {!synthesisData ? (
              <div className="p-4 text-center bg-[#151515] border border-[#303030] rounded space-y-2">
                <p className="text-[#A0A0A0] text-xs">
                  Generate objective, multi-factor intelligence synthesis for this event dossier.
                </p>
                <button
                  onClick={handleRunAiSynthesis}
                  disabled={isSynthesizing}
                  className="px-3 py-1 bg-[#202020] hover:bg-[#252525] text-[#E6E6E6] border border-[#3A3A3A] rounded font-bold text-xs"
                >
                  {isSynthesizing ? 'Synthesizing...' : 'Run Intelligence Synthesis'}
                </button>
              </div>
            ) : (
              <div className="space-y-2 font-sans text-[11px] text-[#A0A0A0]">
                <div className="p-2 bg-[#151515] border border-[#252525] rounded">
                  <strong className="text-[#E6E6E6] block mb-0.5">What Happened:</strong>
                  {synthesisData.whatHappened}
                </div>
                <div className="p-2 bg-[#151515] border border-[#252525] rounded">
                  <strong className="text-[#E6E6E6] block mb-0.5">Why It Matters:</strong>
                  {synthesisData.whyItMatters}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Metadata */}
      <div className="pt-2 border-t border-[#303030] text-[10px] text-[#707070] flex items-center justify-between">
        <span>LAST UPDATE: {new Date(event.lastUpdated).toLocaleDateString()}</span>
        <span>CONFIDENCE: {event.confidence}</span>
      </div>
    </aside>
  );
};
