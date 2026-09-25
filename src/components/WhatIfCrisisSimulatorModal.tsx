import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Ship, 
  Cpu, 
  DollarSign, 
  Globe2, 
  CheckCircle2, 
  X,
  Play
} from 'lucide-react';
import { WhatIfSimulationState } from '../types/recon';
import { calculateWhatIfShock } from '../services/simulationEngine';
import { soundFx } from '../services/soundFxService';

interface WhatIfCrisisSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SIM_STATE: WhatIfSimulationState = {
  hormuzBlockadeDays: 14,
  taiwanDisruptionPercent: 20,
  redSeaCapeReroutePercent: 75,
  blackSeaGrainInterdiction: false,
  cyberGridAttackSeverity: 15,
};

export const WhatIfCrisisSimulatorModal: React.FC<WhatIfCrisisSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [simState, setSimState] = useState<WhatIfSimulationState>(DEFAULT_SIM_STATE);

  const outputs = useMemo(() => {
    return calculateWhatIfShock(simState);
  }, [simState]);

  if (!isOpen) return null;

  const handleSliderChange = <K extends keyof WhatIfSimulationState>(key: K, value: WhatIfSimulationState[K]) => {
    soundFx.playTeletypeClick();
    setSimState(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    soundFx.playHudBeep(1400);
    switch (presetName) {
      case 'hormuz_crisis':
        setSimState({
          hormuzBlockadeDays: 30,
          taiwanDisruptionPercent: 0,
          redSeaCapeReroutePercent: 50,
          blackSeaGrainInterdiction: false,
          cyberGridAttackSeverity: 20,
        });
        break;
      case 'taiwan_quarantine':
        setSimState({
          hormuzBlockadeDays: 0,
          taiwanDisruptionPercent: 85,
          redSeaCapeReroutePercent: 20,
          blackSeaGrainInterdiction: false,
          cyberGridAttackSeverity: 40,
        });
        break;
      case 'global_interdiction':
        setSimState({
          hormuzBlockadeDays: 45,
          taiwanDisruptionPercent: 80,
          redSeaCapeReroutePercent: 100,
          blackSeaGrainInterdiction: true,
          cyberGridAttackSeverity: 65,
        });
        break;
      case 'reset':
      default:
        setSimState(DEFAULT_SIM_STATE);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-slate-950 border border-purple-600/70 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-purple-950/80 border-b border-purple-800/80 px-4 py-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5 text-purple-200">
            <Zap className="w-5 h-5 text-purple-400" />
            <div>
              <div className="font-bold text-sm tracking-wide text-white uppercase">
                INTERACTIVE "WHAT-IF" CRISIS SHOCK SIMULATOR
              </div>
              <div className="text-[10px] text-purple-300">
                Non-Linear Macroeconomic & Supply Chain Spillover Modeling Engine
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Selector Buttons */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Presets:</span>
            <button
              onClick={() => applyPreset('hormuz_crisis')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/60 transition-colors"
            >
              Hormuz 30-Day Closure
            </button>
            <button
              onClick={() => applyPreset('taiwan_quarantine')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 transition-colors"
            >
              Taiwan Strait Semiconductor Freeze
            </button>
            <button
              onClick={() => applyPreset('global_interdiction')}
              className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/80 transition-colors font-bold"
            >
              Max Simultaneous Shock
            </button>
          </div>

          <button
            onClick={() => applyPreset('reset')}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Content Body: Split Left (Sliders) & Right (Calculated Outputs) */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: INTERACTIVE LEVERS & SLIDERS (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>GEOPOLITICAL SHOCK LEVERS</span>
            </div>

            {/* Slider 1: Hormuz Blockade Days */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Strait of Hormuz Closure</span>
                </span>
                <span className="text-white font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {simState.hormuzBlockadeDays} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={simState.hormuzBlockadeDays}
                onChange={(e) => handleSliderChange('hormuzBlockadeDays', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0d (Normal)</span>
                <span>15d</span>
                <span>30d (SPR Exhaust)</span>
                <span>60d (Depot Freeze)</span>
              </div>
            </div>

            {/* Slider 2: Taiwan Strait Disruption */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Taiwan Strait Disruption</span>
                </span>
                <span className="text-white font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {simState.taiwanDisruptionPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simState.taiwanDisruptionPercent}
                onChange={(e) => handleSliderChange('taiwanDisruptionPercent', Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Open)</span>
                <span>50% (Sorties)</span>
                <span>100% (Full Quarantine)</span>
              </div>
            </div>

            {/* Slider 3: Red Sea / Cape Reroute */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-300 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-red-400" />
                  <span>Bab al-Mandab Cape Reroute</span>
                </span>
                <span className="text-white font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  {simState.redSeaCapeReroutePercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simState.redSeaCapeReroutePercent}
                onChange={(e) => handleSliderChange('redSeaCapeReroutePercent', Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Via Suez)</span>
                <span>50% (Mixed)</span>
                <span>100% (+14d via Africa)</span>
              </div>
            </div>

            {/* Slider 4: Critical Cyber/Energy Grid Attack */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Energy Pipeline / Cyber Stress</span>
                </span>
                <span className="text-white font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {simState.cyberGridAttackSeverity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simState.cyberGridAttackSeverity}
                onChange={(e) => handleSliderChange('cyberGridAttackSeverity', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Toggle 5: Black Sea Grain Corridor */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-300 block">Black Sea Grain Interdiction</span>
                <span className="text-[10px] text-slate-400">Halts 35M tons Ukrainian wheat exports</span>
              </div>
              <button
                onClick={() => handleSliderChange('blackSeaGrainInterdiction', !simState.blackSeaGrainInterdiction)}
                className={`px-3 py-1 rounded font-bold transition-colors ${
                  simState.blackSeaGrainInterdiction
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {simState.blackSeaGrainInterdiction ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME SIMULATED IMPACT OUTPUTS (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-800 font-mono">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>DYNAMIC MACRO FORECAST</span>
              </span>
              <span className="text-[10px] text-slate-500">REAL-TIME SIMULATION ENGINE</span>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
              {/* Brent Crude Spike */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block">Brent Crude Projected</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-white">${outputs.brentCrudePrice}</span>
                  <span className="text-[10px] text-slate-400">/bbl</span>
                </div>
                <div className={`text-[11px] font-bold mt-1 ${outputs.brentCrudeDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  +{outputs.brentCrudeDelta} (+{outputs.brentCrudeDeltaPercent}%)
                </div>
              </div>

              {/* Container Freight Index */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block">Global Freight Rates</span>
                <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">
                  +{outputs.containerFreightIndexDeltaPercent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  SCFI Benchmark Surge
                </div>
              </div>

              {/* Semiconductor Lead Times */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase block">Semi Lead Time</span>
                <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-1">
                  {outputs.semiconductorLeadTimeWeeks} wks
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Baseline: 14.0 weeks
                </div>
              </div>

              {/* Inflation Spike */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block">Inflation Impulse</span>
                <div className="text-xl sm:text-2xl font-bold text-red-400 mt-1">
                  +{outputs.globalInflationSpikePercent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Headline CPI Addition
                </div>
              </div>

              {/* Global GDP Drag */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block">Global GDP Drag</span>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                  -${outputs.globalGdpDragBillionUsd}B
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Annualized Output Loss
                </div>
              </div>

              {/* Food Insecure Population */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase block">Famine At-Risk</span>
                <div className="text-xl sm:text-2xl font-bold text-orange-400 mt-1">
                  {outputs.atRiskFaminePopulationMillions}M
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Severely Impacted People
                </div>
              </div>
            </div>

            {/* Strategic Synthesis Assessment */}
            <div className="bg-slate-900/90 border border-purple-800/60 p-3.5 rounded-xl">
              <span className="font-mono text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
                Systemic Vulnerability Verdict
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {outputs.strategicAssessment}
              </p>
            </div>

            {/* Top Impacted Economies */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Most Vulnerable Sovereign & Commercial Sectors:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {outputs.topImpactedNations.map((nat) => (
                  <div key={nat.country} className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{nat.flag}</span>
                      <div>
                        <span className="font-bold text-white block">{nat.country}</span>
                        <span className="text-[10px] text-slate-300 font-sans">{nat.impactDescription}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      nat.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {nat.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
