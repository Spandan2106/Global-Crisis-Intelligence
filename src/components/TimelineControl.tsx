import React, { useEffect } from 'react';
import { Play, Pause, Calendar, Clock, ChevronRight, FastForward } from 'lucide-react';
import { CrisisEvent } from '../types/crisis';

interface TimelineControlProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  events: CrisisEvent[];
}

export const TimelineControl: React.FC<TimelineControlProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  events,
}) => {
  const milestoneYears = [1950, 1956, 1962, 1973, 1979, 1990, 1997, 2008, 2020, 2024, 2026];

  // Automatic playback ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onYearChange(currentYear >= 2026 ? 1950 : currentYear + 2);
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentYear, onYearChange]);

  // Count events for current timeline slice
  const eventsInYear = events.filter(e => {
    const yr = new Date(e.date).getFullYear();
    return yr <= currentYear;
  });

  return (
    <div className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono select-none">
      {/* Play / Step Buttons & Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY TIMELINE'}</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">CHRONO:</span>
          <span className="text-slate-100 font-bold text-sm">{currentYear}</span>
        </div>

        <span className="text-[11px] text-slate-400 hidden xl:inline">
          Active In-Scope Events: <strong className="text-slate-200">{eventsInYear.length}</strong>
        </span>
      </div>

      {/* Year Slider (1950 -> 2026) */}
      <div className="flex-1 max-w-xl flex items-center gap-3 px-2 w-full">
        <span className="text-[11px] text-slate-500 font-bold">1950</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="1950"
            max="2026"
            step="1"
            value={currentYear}
            onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
        <span className="text-[11px] text-cyan-400 font-bold">2026 (Present)</span>
      </div>

      {/* Historical Epoch Shortcuts */}
      <div className="hidden lg:flex items-center gap-1">
        {milestoneYears.map((yr) => (
          <button
            key={yr}
            onClick={() => onYearChange(yr)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              currentYear === yr
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {yr}
          </button>
        ))}
      </div>
    </div>
  );
};
