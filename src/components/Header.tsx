import React, { useState } from 'react';
import { 
  Globe2, 
  Globe,
  Flame, 
  TrendingUp, 
  BarChart3, 
  History, 
  Network, 
  GitFork, 
  Bot, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  X,
  Radio
} from 'lucide-react';
import { CrisisEvent } from '../types/crisis';

export type DashboardMode = 'global' | 'conflicts' | 'economy' | 'markets' | 'history' | 'network' | 'scenarios' | 'news';

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
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Search filtering
  const matchingEvents = searchQuery.trim() === '' ? [] : events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const navItems: { mode: DashboardMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'global', label: 'Global View', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { mode: 'news', label: 'News Wire', icon: <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" /> },
    { mode: 'conflicts', label: 'Conflicts', icon: <Flame className="w-3.5 h-3.5 text-red-400" /> },
    { mode: 'economy', label: 'Economy', icon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> },
    { mode: 'markets', label: 'Markets', icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> },
    { mode: 'history', label: 'History', icon: <History className="w-3.5 h-3.5 text-slate-400" /> },
    { mode: 'network', label: 'Crisis Network', icon: <Network className="w-3.5 h-3.5 text-cyan-400" /> },
    { mode: 'scenarios', label: 'Scenarios', icon: <GitFork className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  return (
    <header className="relative z-30 h-14 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between gap-3 text-slate-200">
      {/* Brand Identity & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilterSidebar}
          title="Toggle Filters & Layers"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors md:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wider text-slate-100 font-mono uppercase">
                Global Crisis Map
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                INTEL v2.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Geopolitical & Macroeconomic Risk Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Modes & Earth/Map Toggle */}
      <div className="flex items-center gap-2">
        {/* Real Geographic View Switcher: [ MAP ] [ 3D EARTH ] */}
        {(currentMode === 'global' || currentMode === 'conflicts' || currentMode === 'economy' || currentMode === 'history') && (
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg shadow-sm font-mono text-xs">
            <button
              onClick={() => onToggleEarthMode('map')}
              title="Switch to 2D Real-World Map (Google Maps)"
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center gap-1 ${
                earthMode === 'map'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>MAP</span>
            </button>
            <button
              onClick={() => onToggleEarthMode('earth')}
              title="Switch to Interactive 3D Geographic Globe (WGS84 Earth)"
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center gap-1 ${
                earthMode === 'earth'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D EARTH</span>
            </button>
          </div>
        )}

        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                currentMode === item.mode
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Global Search & System Badges */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative w-44 sm:w-64">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-cyan-500/80 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search region, crisis, topic..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && matchingEvents.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden z-50">
              <div className="p-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Matching Events ({matchingEvents.length})
              </div>
              {matchingEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev);
                    setShowSearchDropdown(false);
                  }}
                  className="w-full text-left p-2 hover:bg-slate-800 flex items-center justify-between gap-2 border-b border-slate-800/50 last:border-0"
                >
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-200 truncate">{ev.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ev.country} • {ev.category}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                    ev.riskIndicator >= 0.8 ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {ev.riskIndicator.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo / Live Data Status Toggle */}
        <button
          onClick={onToggleDemoMode}
          title={demoMode ? 'Demonstration Mode Active: Click to view telemetry status' : 'Live Data Mode Active'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            demoMode
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-400'
              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
          }`}
        >
          {demoMode ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DEMO DATA</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LIVE ARCHITECTURE</span>
            </>
          )}
        </button>

        {/* AI Crisis Analyst Assistant Drawer Toggle */}
        <button
          onClick={onToggleAnalystChat}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            isAnalystChatOpen
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
              : 'bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">CRISIS ANALYST</span>
        </button>
      </div>
    </header>
  );
};
