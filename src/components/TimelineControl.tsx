import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  RotateCcw, 
  Zap, 
  History, 
  Sparkles,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { TimelineFilterMode } from '../types/crisis';

interface TimelineControlProps {
  timelineMode: TimelineFilterMode;
  onTimelineModeChange: (mode: TimelineFilterMode) => void;
  currentYear: number;
  onYearChange: (year: number) => void;
  exactYearOnly: boolean;
  onToggleExactYearOnly: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  eventsCount: number;
  totalEventsCount: number;
}

export const TimelineControl: React.FC<TimelineControlProps> = ({
  timelineMode,
  onTimelineModeChange,
  currentYear,
  onYearChange,
  exactYearOnly,
  onToggleExactYearOnly,
  isPlaying,
  onTogglePlay,
  eventsCount,
  totalEventsCount,
}) => {
  const [customInputYear, setCustomInputYear] = useState<string>(String(currentYear));

  const milestoneYears = [1950, 1956, 1962, 1973, 1979, 1990, 1997, 2008, 2020, 2024, 2026];

  // Automatic playback ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onYearChange(currentYear >= 2026 ? 1950 : currentYear + 1);
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentYear, onYearChange]);

  // Keep custom input in sync
  useEffect(() => {
    setCustomInputYear(String(currentYear));
  }, [currentYear]);

  const handleCustomYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customInputYear, 10);
    if (!isNaN(parsed) && parsed >= 1950 && parsed <= 2026) {
      onYearChange(parsed);
      onTimelineModeChange('custom');
    }
  };

  return (
    <div className="w-full bg-slate-950/98 backdrop-blur-md border-t border-slate-800/90 px-4 py-2.5 flex flex-col gap-2.5 text-xs font-mono select-none z-20">
      {/* Top Row: Timeline Scope Mode Switcher & Direct Year Input */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Preset Scope Buttons: [⚡ TODAY (Default)] [2-YEAR (2024-2026)] [TOTAL (1950-TODAY)] */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode 1: Today's Ongoing Data (DEFAULT) */}
          <button
            onClick={() => onTimelineModeChange('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              timelineMode === 'today'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="Default View: Shows only today's data and ongoing active conflicts (Hormuz, Gaza, Lebanon, Sudan, Horn of Africa, Europe Hybrid War, etc.)"
          >
            <Zap className={`w-3.5 h-3.5 ${timelineMode === 'today' ? 'animate-bounce text-amber-300' : 'text-amber-400'}`} />
            <span>TODAY'S ONGOING DATA</span>
            {timelineMode === 'today' && (
              <span className="text-[10px] bg-red-950/80 px-1 py-0.2 rounded border border-red-700/60 text-amber-200">
                DEFAULT
              </span>
            )}
          </button>

          {/* Mode 2: 2-Year Window (2024 - 2026) */}
          <button
            onClick={() => onTimelineModeChange('2year')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              timelineMode === '2year'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="Current 2-Year Timeline: 2024 to 2026 modern crisis horizon"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-300" />
            <span>2-YEAR WINDOW (2024 - 2026)</span>
          </button>

          {/* Mode 3: Total Timeline (1950 - Today) */}
          <button
            onClick={() => onTimelineModeChange('total')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              timelineMode === 'total'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-1 ring-purple-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="Total Timeline: Complete historical dataset from 1950 to today"
          >
            <History className="w-3.5 h-3.5 text-purple-300" />
            <span>TOTAL TIMELINE (1950 - TODAY)</span>
          </button>
        </div>

        {/* User Direct Year Input Form */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleCustomYearSubmit} className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">GIVE YEAR:</span>
            <input
              type="number"
              min="1950"
              max="2026"
              value={customInputYear}
              onChange={(e) => setCustomInputYear(e.target.value)}
              placeholder="Year (1950-2026)"
              className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold text-center focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-xs transition-colors"
            >
              APPLY
            </button>
          </form>

          {/* Exact Year vs Cumulative Toggle (for historical scrubbing) */}
          {timelineMode !== 'today' && (
            <button
              onClick={onToggleExactYearOnly}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                exactYearOnly 
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
              title={exactYearOnly ? 'Showing ONLY events matching exact selected year' : 'Showing all events cumulative up to selected year'}
            >
              <Filter className="w-3 h-3" />
              <span>{exactYearOnly ? `ONLY ${currentYear}` : `UP TO ${currentYear}`}</span>
            </button>
          )}

          {/* Active In-Scope Events Count Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
            <span className="text-slate-400">EVENTS:</span>
            <span className="text-cyan-400 font-bold text-sm">{eventsCount}</span>
            <span className="text-slate-500">/ {totalEventsCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Chronological Year Slider & Epoch Shortcuts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-slate-800/50">
        {/* Play/Pause & Current Year indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onTogglePlay}
            disabled={timelineMode === 'today'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
              timelineMode === 'today'
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                : isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
            }`}
            title="Automatically animate through historical years"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">YEAR:</span>
            <span className="text-slate-100 font-bold text-sm">
              {timelineMode === 'today' ? '2026 (TODAY)' : currentYear}
            </span>
          </div>
        </div>

        {/* Continuous Slider from 1950 to 2026 */}
        <div className="flex-1 max-w-2xl flex items-center gap-3 px-2 w-full">
          <span className="text-[11px] text-slate-500 font-bold shrink-0">1950</span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="1950"
              max="2026"
              step="1"
              value={currentYear}
              disabled={timelineMode === 'today'}
              onChange={(e) => {
                const yr = parseInt(e.target.value, 10);
                onYearChange(yr);
                if (timelineMode === 'today') onTimelineModeChange('custom');
              }}
              className={`w-full h-2 rounded-lg cursor-pointer ${
                timelineMode === 'today' 
                  ? 'accent-red-500 bg-slate-850 opacity-60' 
                  : 'accent-cyan-400 bg-slate-800'
              }`}
            />
          </div>
          <span className="text-[11px] text-cyan-400 font-bold shrink-0">2026 (Today)</span>
        </div>

        {/* Milestone Quick Jump Buttons */}
        <div className="hidden xl:flex items-center gap-1 shrink-0">
          {milestoneYears.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                onYearChange(yr);
                if (yr === 2026) {
                  onTimelineModeChange('today');
                } else if (yr >= 2024) {
                  onTimelineModeChange('2year');
                } else {
                  onTimelineModeChange('custom');
                }
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                currentYear === yr && timelineMode !== 'today'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                  : yr === 2026 && timelineMode === 'today'
                    ? 'bg-red-950 text-amber-300 border border-red-800 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
              }`}
              title={`Jump to year ${yr}`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
