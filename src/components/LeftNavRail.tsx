import React from 'react';
import { 
  Globe, 
  Flame, 
  Landmark, 
  TrendingUp, 
  Users, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Clock, 
  GitFork, 
  ShieldAlert, 
  Radio, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  MapPin,
  Bot
} from 'lucide-react';
import { DashboardMode } from './Header';
import { CrisisCategory } from '../types/crisis';

interface LeftNavRailProps {
  currentMode: DashboardMode;
  onSelectMode: (mode: DashboardMode) => void;
  selectedCategory: string;
  onSelectCategoryFilter: (category: string) => void;
  onToggleFilterSidebar: () => void;
  onToggleAnalystChat: () => void;
  isAnalystChatOpen: boolean;
  activeCount: number;
}

export const LeftNavRail: React.FC<LeftNavRailProps> = ({
  currentMode,
  onSelectMode,
  selectedCategory,
  onSelectCategoryFilter,
  onToggleFilterSidebar,
  onToggleAnalystChat,
  isAnalystChatOpen,
  activeCount,
}) => {
  return (
    <aside className="w-56 bg-[#111111] border-r border-[#303030] flex flex-col justify-between select-none font-mono text-xs flex-shrink-0 z-30">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Workspace Brand / Header */}
        <div className="p-3 border-b border-[#303030] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="font-bold text-[#E6E6E6] text-xs uppercase tracking-wider">
                INTELLIGENCE
              </span>
            </div>
            <span className="text-[10px] text-[#707070] block">
              GLOBAL RISK TERMINAL
            </span>
          </div>

          <span className="text-[10px] bg-[#1C1C1C] border border-[#303030] text-[#A0A0A0] px-1.5 py-0.5 rounded font-mono">
            v2.6
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="p-2 space-y-4">
          {/* Main Workstation Modes */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-2 py-1 block">
              MAIN
            </span>
            <button
              onClick={() => {
                onSelectMode('global');
                onSelectCategoryFilter('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'global' && selectedCategory === 'all'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#A0A0A0]" />
                <span>OVERVIEW</span>
              </div>
              <span className="text-[10px] text-[#707070]">{activeCount}</span>
            </button>
          </div>

          {/* Intelligence Sub-Categories */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-2 py-1 block">
              INTELLIGENCE
            </span>

            <button
              onClick={() => {
                onSelectMode('global');
                onSelectCategoryFilter('all');
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded transition-colors text-left ${
                currentMode === 'global' && selectedCategory === 'all'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#707070]" />
              <span>All Events</span>
            </button>

            <button
              onClick={() => {
                onSelectMode('conflicts');
                onSelectCategoryFilter('conflict');
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded transition-colors text-left ${
                currentMode === 'conflicts' || selectedCategory === 'conflict'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#dc2626]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>Conflicts</span>
            </button>

            <button
              onClick={() => {
                onSelectMode('global');
                onSelectCategoryFilter('political');
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded transition-colors text-left ${
                selectedCategory === 'political'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#94a3b8]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Political Crises</span>
            </button>

            <button
              onClick={() => {
                onSelectMode('economy');
                onSelectCategoryFilter('economic');
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded transition-colors text-left ${
                currentMode === 'economy' || selectedCategory === 'economic'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Economic Crises</span>
            </button>

            <button
              onClick={() => {
                onSelectMode('global');
                onSelectCategoryFilter('humanitarian');
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded transition-colors text-left ${
                selectedCategory === 'humanitarian'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#d97706]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Humanitarian Crises</span>
            </button>
          </div>

          {/* Markets & Economics */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-2 py-1 block">
              MARKETS
            </span>

            <button
              onClick={() => onSelectMode('markets')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'markets'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-[#A0A0A0]" />
                <span>Financial Terminal</span>
              </div>
              <span className="text-[9px] text-[#16a34a] font-bold">LIVE</span>
            </button>
          </div>

          {/* News & Dispatch Network */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-2 py-1 block">
              FEEDS & HISTORICAL
            </span>

            <button
              onClick={() => onSelectMode('news')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'news'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#dc2626]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#A0A0A0]" />
                <span>Live Wire News</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            </button>

            <button
              onClick={() => onSelectMode('history')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'history'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#A0A0A0]" />
              <span>Historical Archive</span>
            </button>

            <button
              onClick={() => onSelectMode('network')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'network'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#A0A0A0]" />
              <span>Crisis Network</span>
            </button>

            <button
              onClick={() => onSelectMode('scenarios')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors text-left ${
                currentMode === 'scenarios'
                  ? 'bg-[#202020] text-[#E6E6E6] font-bold border-l-2 border-[#2563eb]'
                  : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-[#A0A0A0]" />
              <span>Scenario Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Rail Utilities */}
      <div className="p-2 border-t border-[#303030] space-y-1">
        <button
          onClick={onToggleFilterSidebar}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6] transition-colors text-left"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters & Layers</span>
        </button>

        <button
          onClick={onToggleAnalystChat}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
            isAnalystChatOpen
              ? 'bg-[#202020] text-[#E6E6E6] font-bold'
              : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-[#E6E6E6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-[#A0A0A0]" />
            <span>AI Analyst</span>
          </div>
          <span className="text-[9px] bg-[#1C1C1C] border border-[#303030] px-1 rounded text-[#707070]">
            Ctrl+K
          </span>
        </button>
      </div>
    </aside>
  );
};
