import React from 'react';
import { CrisisEvent } from '../types/crisis';
import { 
  ShieldAlert, 
  Flame, 
  TrendingUp, 
  Users, 
  RefreshCw, 
  Clock,
  Radio
} from 'lucide-react';

interface GlobalStatsBarProps {
  events: CrisisEvent[];
  pipelines?: {
    markets?: { status: string; lastSuccessfulUpdate: string; source?: string };
    news?: { status: string; lastSuccessfulUpdate: string; source?: string };
    geopolitics?: { status: string; lastSuccessfulUpdate: string; source?: string };
    economy?: { status: string; lastSuccessfulUpdate: string; source?: string };
    map?: { status: string; provider?: string };
  };
  isRefreshing?: boolean;
  onRefreshNow?: () => void;
  isDemoMode?: boolean;
  onToggleDemoMode?: () => void;
  nextUpdateSeconds?: number;
}

export const GlobalStatsBar: React.FC<GlobalStatsBarProps> = ({ 
  events,
  pipelines,
  isRefreshing = false,
  onRefreshNow,
  isDemoMode = false,
  onToggleDemoMode,
  nextUpdateSeconds,
}) => {
  const ongoingCount = events.filter(e => e.isOngoing || e.status === 'ongoing' || e.status === 'escalating' || e.status === 'active').length;
  const conflictsCount = events.filter(e => e.category === 'conflict' || e.category === 'military').length;
  const politicalCount = events.filter(e => e.category === 'political').length;
  const economicCount = events.filter(e => e.category === 'economic' || e.category === 'financial').length;
  const humanitarianCount = events.filter(e => e.category === 'humanitarian').length;

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Pending';
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="w-full bg-[#111111] border-b border-[#303030] px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
      {/* Left: Summary Metrics per Part 24: ONGOING EVENTS, CONFLICTS, POLITICAL, ECONOMIC, HUMANITARIAN */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-1.5 pr-3 border-r border-[#303030]">
          <span className="text-[#707070] font-bold text-[10px] uppercase">SITUATION:</span>
          <span className="text-[#E6E6E6] font-bold text-[11px]">{ongoingCount} ONGOING</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Flame className="w-3 h-3 text-[#dc2626]" />
          <span className="text-[#707070]">CONFLICTS:</span>
          <span className="text-[#E6E6E6] font-bold">{conflictsCount}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
          <span className="text-[#707070]">POLITICAL:</span>
          <span className="text-[#E6E6E6] font-bold">{politicalCount}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <TrendingUp className="w-3 h-3 text-[#2563eb]" />
          <span className="text-[#707070]">ECONOMIC:</span>
          <span className="text-[#E6E6E6] font-bold">{economicCount}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Users className="w-3 h-3 text-[#d97706]" />
          <span className="text-[#707070]">HUMANITARIAN:</span>
          <span className="text-[#E6E6E6] font-bold">{humanitarianCount}</span>
        </div>
      </div>

      {/* Right: Pipeline Live Status & Manual Sync */}
      <div className="flex items-center gap-3 text-[10px]">
        {/* Real-time Subsystem Feeds */}
        <div className="hidden lg:flex items-center gap-2 border-r border-[#303030] pr-3 text-[#707070]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>MARKETS: {pipelines?.markets?.status || 'LIVE'}</span>
          </span>
          <span>·</span>
          <span>NEWS: {formatTimeAgo(pipelines?.news?.lastSuccessfulUpdate)}</span>
          <span>·</span>
          <span>ECONOMY: {formatTimeAgo(pipelines?.economy?.lastSuccessfulUpdate)}</span>
        </div>

        {/* Sync Countdown */}
        {nextUpdateSeconds !== undefined && nextUpdateSeconds > 0 && !isDemoMode && (
          <div className="hidden sm:flex items-center gap-1 text-[#707070]">
            <Clock className="w-3 h-3" />
            <span>Sync: <strong className="text-[#A0A0A0]">{Math.floor(nextUpdateSeconds / 60)}:{String(nextUpdateSeconds % 60).padStart(2, '0')}</strong></span>
          </div>
        )}

        {/* Manual Refresh Button */}
        {onRefreshNow && (
          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#E6E6E6] border border-[#303030] rounded font-bold transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-[#A0A0A0] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'SYNCING...' : 'REFRESH'}</span>
          </button>
        )}

        {/* Live vs Demo Mode Toggle */}
        {onToggleDemoMode && (
          <button
            onClick={onToggleDemoMode}
            className={`px-2 py-0.5 rounded font-bold border transition-colors ${
              isDemoMode
                ? 'bg-[#d97706]/20 text-[#d97706] border-[#d97706]/40'
                : 'bg-[#1C1C1C] text-[#707070] hover:text-[#A0A0A0] border-[#303030]'
            }`}
          >
            {isDemoMode ? 'DEMO DATA' : 'LIVE'}
          </button>
        )}
      </div>
    </div>
  );
};
