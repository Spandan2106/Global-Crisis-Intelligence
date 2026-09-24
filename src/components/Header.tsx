import React, { useState } from 'react';
import { 
  Globe2, 
  Globe,
  Search, 
  AlertTriangle, 
  SlidersHorizontal,
  Clock,
  Radio,
  X
} from 'lucide-react';
import { CrisisEvent } from '../types/crisis';

export type DashboardMode = 'global' | 'conflicts' | 'economy' | 'markets' | 'live_news' | 'history' | 'network' | 'scenarios';

interface HeaderProps {
  currentMode: DashboardMode;
  onSelectMode: (mode: DashboardMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  events: CrisisEvent[];
  onSelectEvent: (event: CrisisEvent) => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  onToggleAnalystChat: () => void;
  isAnalystChatOpen: boolean;
  onToggleFilterSidebar: () => void;
  earthMode: 'map' | 'earth';
  onToggleEarthMode: (mode: 'map' | 'earth') => void;
  isTodayActive?: boolean;
  onToggleToday?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  searchQuery,
  onSearchChange,
  events,
  onSelectEvent,
  demoMode,
  onToggleDemoMode,
  onToggleAnalystChat,
  isAnalystChatOpen,
  onToggleFilterSidebar,
  earthMode,
  onToggleEarthMode,
  isTodayActive = false,
  onToggleToday,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Search filtering
  const matchingEvents = searchQuery.trim() === '' ? [] : events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <header className="relative z-30 h-12 bg-[#111111] border-b border-[#303030] px-3 sm:px-4 flex items-center justify-between gap-3 text-[#E6E6E6] font-mono text-xs select-none">
      {/* Left: Mobile Nav Toggle + Geographic View Switcher [ MAP ] [ 3D EARTH ] */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilterSidebar}
          title="Toggle Filters & Layers"
          className="p-1 text-[#A0A0A0] hover:text-[#E6E6E6] hover:bg-[#202020] rounded md:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Real Geographic View Switcher: [ MAP ] [ 3D EARTH ] */}
        <div className="flex items-center bg-[#181818] border border-[#303030] p-0.5 rounded text-[11px]">
          <button
            onClick={() => onToggleEarthMode('map')}
            title="Switch to 2D Real-World Map (Google Maps)"
            className={`px-2 py-0.5 rounded transition-colors font-bold flex items-center gap-1 ${
              earthMode === 'map'
                ? 'bg-[#2563eb] text-white'
                : 'text-[#A0A0A0] hover:text-[#E6E6E6]'
            }`}
          >
            <Globe2 className="w-3 h-3" />
            <span>MAP</span>
          </button>
          <button
            onClick={() => onToggleEarthMode('earth')}
            title="Switch to Interactive 3D Geographic Globe (WGS84 Earth)"
            className={`px-2 py-0.5 rounded transition-colors font-bold flex items-center gap-1 ${
              earthMode === 'earth'
                ? 'bg-[#2563eb] text-white'
                : 'text-[#A0A0A0] hover:text-[#E6E6E6]'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>3D EARTH</span>
          </button>
        </div>

        {/* Dedicated "TODAY" Quick Switcher (Part 18) */}
        {onToggleToday && (
          <button
            onClick={onToggleToday}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
              isTodayActive
                ? 'bg-[#2563eb] text-white border-[#2563eb]'
                : 'bg-[#181818] text-[#A0A0A0] hover:text-[#E6E6E6] border-[#303030]'
            }`}
          >
            <Clock className="w-3 h-3 text-[#A0A0A0]" />
            <span>TODAY</span>
          </button>
        )}
      </div>

      {/* Center / Right: Global Search & System Status */}
      <div className="flex items-center gap-3">
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative w-44 sm:w-64">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#707070] pointer-events-none" />
            <input
              type="text"
              placeholder="Search region, conflict, chokepoint..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-[#181818] border border-[#303030] rounded pl-8 pr-7 py-1 text-xs text-[#E6E6E6] placeholder-[#707070] focus:border-[#2563eb] outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 text-[#707070] hover:text-[#E6E6E6]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && matchingEvents.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#151515] border border-[#303030] rounded shadow-xl max-h-60 overflow-y-auto z-50 font-mono">
              <div className="p-1.5 text-[9px] text-[#707070] uppercase font-bold border-b border-[#252525]">
                Matching Intelligence Dossiers ({matchingEvents.length})
              </div>
              {matchingEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev);
                    setShowSearchDropdown(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left hover:bg-[#202020] flex items-center justify-between gap-2 border-b border-[#202020] last:border-0"
                >
                  <div className="truncate">
                    <div className="text-[#E6E6E6] font-semibold truncate text-[11px]">
                      {ev.title}
                    </div>
                    <div className="text-[10px] text-[#707070] flex items-center gap-1.5">
                      <span>{ev.country}</span>
                      <span>·</span>
                      <span className="uppercase">{ev.category}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                    ev.severity === 'critical' ? 'text-[#dc2626]' : 'text-[#A0A0A0]'
                  }`}>
                    {ev.severity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Institutional Time Readout */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#707070] border-l border-[#303030] pl-3">
          <span>UTC:</span>
          <span className="text-[#E6E6E6] font-bold">
            {new Date().toISOString().slice(11, 19)}
          </span>
        </div>
      </div>
    </header>
  );
};
