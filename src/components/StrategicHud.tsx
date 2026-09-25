import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Volume2, 
  VolumeX, 
  Palette, 
  ChevronDown, 
  AlertOctagon,
  Anchor,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { StrategicThreatHudState, TacticalTheme, ChokepointStressMetric } from '../types/recon';
import { soundFx } from '../services/soundFxService';

interface StrategicHudProps {
  threatState: StrategicThreatHudState;
  currentTheme: TacticalTheme;
  onChangeTheme: (theme: TacticalTheme) => void;
  onSelectChokepoint?: (chokepoint: ChokepointStressMetric) => void;
  onOpenWhatIfSimulator?: () => void;
  onOpenBriefing?: () => void;
}

export const StrategicHud: React.FC<StrategicHudProps> = ({
  threatState,
  currentTheme,
  onChangeTheme,
  onSelectChokepoint,
  onOpenWhatIfSimulator,
  onOpenBriefing,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const defconColors: Record<number, { bg: string; text: string; border: string; glow: string }> = {
    1: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600', glow: 'shadow-red-600/50 shadow-lg' },
    2: { bg: 'bg-red-900/60', text: 'text-red-400', border: 'border-red-500', glow: 'shadow-red-500/40 shadow-md' },
    3: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-amber-500/30' },
    4: { bg: 'bg-emerald-950/70', text: 'text-emerald-400', border: 'border-emerald-600', glow: '' },
    5: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-600', glow: '' },
  };

  const themeLabels: Record<TacticalTheme, { name: string; accent: string; preview: string }> = {
    'cyber-dark': { name: 'Cyber Dark', accent: 'text-cyan-400', preview: 'bg-slate-900 border-cyan-500' },
    'night-vision': { name: 'Night Vision', accent: 'text-emerald-400', preview: 'bg-emerald-950 border-emerald-400' },
    'amber-mono': { name: 'Amber Monospace', accent: 'text-amber-400', preview: 'bg-amber-950 border-amber-400' },
    'deep-navy': { name: 'Deep Cyber Navy', accent: 'text-sky-400', preview: 'bg-blue-950 border-sky-400' },
  };

  const defconCfg = defconColors[threatState.defconLevel] || defconColors[3];

  return (
    <div className="bg-slate-950/95 border-b border-slate-800/80 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none relative z-20">
      {/* Left: Strategic DEFCON Posture & Tension Index */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DEFCON Badge */}
        <button
          onClick={() => {
            soundFx.playHudBeep();
            setIsDetailOpen(!isDetailOpen);
          }}
          className={`flex items-center gap-2 px-2.5 py-1 rounded border font-bold transition-all ${defconCfg.bg} ${defconCfg.border} ${defconCfg.text} ${defconCfg.glow} hover:brightness-110`}
          title="Click to view DEFCON Assessment & Readiness Details"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span className="tracking-wider">DEFCON {threatState.defconLevel}</span>
          <span className="text-[10px] hidden md:inline opacity-80 uppercase">
            {threatState.defconLevel === 1 ? 'MAX READINESS' : threatState.defconLevel === 2 ? 'FAST DEPLOY 6H' : 'ROUND THE CLOCK'}
          </span>
          <Info className="w-3 h-3 opacity-60 ml-0.5" />
        </button>

        {/* Global Tension Index Gauge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded">
          <span className="text-slate-400 text-[10px]">TENSION INDEX:</span>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className={`h-full ${threatState.globalTensionIndex > 75 ? 'bg-red-500' : threatState.globalTensionIndex > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
              style={{ width: `${threatState.globalTensionIndex}%` }}
            />
          </div>
          <span className="font-bold text-slate-200">{threatState.globalTensionIndex}/100</span>
        </div>

        {/* Nuclear & Cyber Threat Sub-Badges */}
        <div className="hidden sm:flex items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>NUC: {threatState.nuclearPosture}</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-800/60 text-purple-300">
            <ShieldAlert className="w-3 h-3 text-purple-400" />
            <span>CYBER: {threatState.cyberThreatLevel}</span>
          </div>
        </div>
      </div>

      {/* Center: Chokepoint High-Tension Quick Pills */}
      <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-1">
          <Anchor className="w-3 h-3 text-cyan-400" />
          <span>CHOKEPOINTS:</span>
        </span>
        {threatState.chokepoints.slice(0, 4).map((cp) => (
          <button
            key={cp.id}
            onClick={() => {
              soundFx.playHudBeep(1400);
              onSelectChokepoint?.(cp);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all hover:scale-105 ${
              cp.status === 'interdicted'
                ? 'bg-red-950/80 border-red-500/80 text-red-300 font-bold'
                : cp.status === 'critical'
                ? 'bg-red-950/50 border-red-700/60 text-red-400'
                : 'bg-amber-950/40 border-amber-700/50 text-amber-300'
            }`}
            title={`${cp.name}: ${cp.stressScore}% stress, ${cp.transitDropPercent}% transits`}
          >
            <span className="truncate">{cp.name.split(' ')[0]}</span>
            <span className="font-bold">{cp.stressScore}%</span>
            <span className={`text-[9px] ${cp.transitDropPercent < 0 ? 'text-red-400' : 'text-slate-400'}`}>
              ({cp.transitDropPercent}%)
            </span>
          </button>
        ))}
      </div>

      {/* Right: Rapid Action Buttons (What-If, PDB Briefing, Tactical Theme, Sound Mute) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* What-If Shock Simulator trigger */}
        {onOpenWhatIfSimulator && (
          <button
            onClick={() => {
              soundFx.playHudBeep(1500);
              onOpenWhatIfSimulator();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900/80 border border-purple-600/70 text-purple-300 font-bold transition-all shadow-sm"
            title="Launch Interactive What-If Crisis Shock Simulator"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">WHAT-IF SIMULATOR</span>
            <span className="sm:hidden">WHAT-IF</span>
          </button>
        )}

        {/* President's Daily Brief (PDB) trigger */}
        {onOpenBriefing && (
          <button
            onClick={() => {
              soundFx.playHudBeep(1600);
              onOpenBriefing();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/80 border border-red-600/70 text-red-300 font-bold transition-all shadow-sm"
            title="Open Classified Intelligence Briefing & Export PDF"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">DAILY BRIEF (PDB)</span>
            <span className="sm:hidden">PDB</span>
          </button>
        )}

        {/* Tactical Theme Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              soundFx.playHudBeep();
              setIsThemeMenuOpen(!isThemeMenuOpen);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-[11px] transition-colors"
            title="Switch Tactical Display Theme"
          >
            <Palette className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">{themeLabels[currentTheme].name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1 z-50">
              <div className="text-[10px] text-slate-400 px-2 py-1 uppercase tracking-wider font-bold">
                Tactical Theme
              </div>
              {(Object.keys(themeLabels) as TacticalTheme[]).map((thm) => (
                <button
                  key={thm}
                  onClick={() => {
                    soundFx.playHudBeep(1300);
                    onChangeTheme(thm);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                    currentTheme === thm
                      ? 'bg-slate-800 font-bold text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span>{themeLabels[thm].name}</span>
                  <span className={`w-3 h-3 rounded-full border ${themeLabels[thm].preview}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound FX Audio Mute / Unmute */}
        <button
          onClick={handleToggleMute}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-950/60 border-cyan-700/80 text-cyan-400 hover:brightness-110 shadow-sm'
          }`}
          title={isMuted ? 'Sound FX Muted: Click to Enable Tactical Radar & Wire Audio' : 'Sound FX Active: Click to Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded DEFCON Breakdown Popover */}
      {isDetailOpen && (
        <div className="absolute top-full left-3 mt-1.5 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-red-400 tracking-wider">STRATEGIC ALERT POSTURE</span>
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 space-y-2 text-slate-300">
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-bold text-red-400">{threatState.defconLabel}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Nuclear Readiness:</span>
                <span className="font-bold text-amber-400">{threatState.nuclearPosture}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Cyber Threat Level:</span>
                <span className="font-bold text-purple-400">{threatState.cyberThreatLevel}</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-bold">
                Active Chokepoint Risk Index:
              </span>
              <div className="space-y-1">
                {threatState.chokepoints.map((cp) => (
                  <div key={cp.id} className="flex items-center justify-between text-[11px] bg-slate-950 px-2 py-1 rounded">
                    <span>{cp.name}</span>
                    <span className={`font-bold ${cp.stressScore > 85 ? 'text-red-400' : 'text-amber-400'}`}>
                      {cp.stressScore}% ({cp.transitDropPercent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
