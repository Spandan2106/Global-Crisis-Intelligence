import React from 'react';
import { CrisisEvent } from '../types/crisis';
import { ShieldAlert, AlertTriangle, Activity, DollarSign, Users, TrendingUp } from 'lucide-react';

interface GlobalStatsBarProps {
  events: CrisisEvent[];
  onFilterCategory?: (category: string) => void;
}

export const GlobalStatsBar: React.FC<GlobalStatsBarProps> = ({ events }) => {
  const activeCrisesCount = events.filter(e => e.status === 'active' || e.status === 'escalating').length;
  const highRiskAreasCount = events.filter(e => e.riskIndicator >= 0.70).length;
  const economicStressCount = events.filter(e => e.category === 'economic').length;
  const activeConflictsCount = events.filter(e => e.category === 'military' && (e.status === 'active' || e.status === 'escalating')).length;
  const humanitarianCount = events.filter(e => e.category === 'humanitarian').length;
  const averageRisk = events.length > 0 
    ? (events.reduce((acc, curr) => acc + curr.riskIndicator, 0) / events.length).toFixed(2)
    : '0.00';

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      {/* Metrics Row */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 uppercase text-[11px]">ACTIVE CRISES:</span>
          <span className="text-slate-100 font-bold text-sm">{activeCrisesCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400 uppercase text-[11px]">HIGH-RISK AREAS:</span>
          <span className="text-red-400 font-bold text-sm">{highRiskAreasCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400 uppercase text-[11px]">ACTIVE CONFLICTS:</span>
          <span className="text-orange-400 font-bold text-sm">{activeConflictsCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 uppercase text-[11px]">ECONOMIC STRESS:</span>
          <span className="text-blue-400 font-bold text-sm">{economicStressCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 uppercase text-[11px]">HUMANITARIAN:</span>
          <span className="text-amber-400 font-bold text-sm">{humanitarianCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 uppercase text-[11px]">MARKET VOLATILITY (VIX):</span>
          <span className="text-emerald-400 font-bold text-sm">15.42 <span className="text-[10px] text-emerald-500 font-normal">(-1.8%)</span></span>
        </div>
      </div>

      {/* Mini World Risk Heatmap Indicator */}
      <div className="hidden xl:flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
        <span className="text-[10px] text-slate-400 uppercase">AVG GLOBAL RISK:</span>
        <span className="text-slate-200 font-bold">{averageRisk}</span>
        <div className="flex items-center gap-0.5 ml-1">
          <div className="w-2.5 h-3 rounded-xs bg-emerald-500/80" title="Low Risk Zone" />
          <div className="w-2.5 h-3 rounded-xs bg-blue-500/80" title="Moderate Risk Zone" />
          <div className="w-2.5 h-3 rounded-xs bg-amber-500/80" title="Elevated Risk Zone" />
          <div className="w-3.5 h-3 rounded-xs bg-red-500/90 animate-pulse" title="High Risk Critical Zone" />
        </div>
      </div>
    </div>
  );
};
