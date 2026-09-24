import React, { useState } from 'react';
import { FilterState, CrisisCategory } from '../types/crisis';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Flame, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Layers, 
  Sliders, 
  Globe,
  RotateCcw
} from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangeFilters,
  isOpen,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    risk: true,
    status: true,
    region: true,
    layers: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (category: keyof FilterState['categories']) => {
    onChangeFilters({
      ...filters,
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category],
      },
    });
  };

  const handleStatusToggle = (status: keyof FilterState['status']) => {
    onChangeFilters({
      ...filters,
      status: {
        ...filters.status,
        [status]: !filters.status[status],
      },
    });
  };

  const handleLayerToggle = (layer: keyof FilterState['layers']) => {
    onChangeFilters({
      ...filters,
      layers: {
        ...filters.layers,
        [layer]: !filters.layers[layer],
      },
    });
  };

  const resetFilters = () => {
    onChangeFilters({
      searchQuery: '',
      categories: {
        political: true,
        military: true,
        economic: true,
        financial: true,
        humanitarian: true,
      },
      status: {
        active: true,
        escalating: true,
        deEscalating: true,
        resolved: true,
        historical: true,
      },
      minRisk: 0.0,
      maxRisk: 1.0,
      region: 'All',
      zoneFilter: 'all',
      layers: {
        conflictZones: true,
        economicStress: true,
        diplomaticHotspots: true,
        pulses: true,
        countryBorders: true,
        heatmaps: true,
      },
      demoMode: true,
    });
  };

  const regions = ['All', 'Europe', 'Middle East', 'Asia-Pacific', 'Africa', 'Americas'];

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950/95 border-r border-slate-800/80 p-3.5 flex flex-col gap-4 overflow-y-auto transform transition-transform duration-200 ease-in-out font-mono ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Intelligence Filters
          </h2>
        </div>
        <button
          onClick={resetFilters}
          title="Reset all filters"
          className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Filter Section */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5 uppercase text-[11px]">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Crisis Categories
          </span>
          {expandedSections.categories ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {expandedSections.categories && (
          <div className="space-y-1.5 text-xs">
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-200">Military & Conflict</span>
              </span>
              <input
                type="checkbox"
                checked={filters.categories.military}
                onChange={() => handleCategoryToggle('military')}
                className="rounded accent-red-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-200">Economic Stress</span>
              </span>
              <input
                type="checkbox"
                checked={filters.categories.economic}
                onChange={() => handleCategoryToggle('economic')}
                className="rounded accent-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-200">Financial Markets</span>
              </span>
              <input
                type="checkbox"
                checked={filters.categories.financial}
                onChange={() => handleCategoryToggle('financial')}
                className="rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-200">Political & Governance</span>
              </span>
              <input
                type="checkbox"
                checked={filters.categories.political}
                onChange={() => handleCategoryToggle('political')}
                className="rounded accent-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200">Humanitarian Emergencies</span>
              </span>
              <input
                type="checkbox"
                checked={filters.categories.humanitarian}
                onChange={() => handleCategoryToggle('humanitarian')}
                className="rounded accent-amber-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* 2. Risk Indicator Range Slider */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <button
          onClick={() => toggleSection('risk')}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 mb-2"
        >
          <span className="uppercase text-[11px]">AI-Assisted Risk Threshold</span>
          {expandedSections.risk ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {expandedSections.risk && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Min Risk:</span>
              <span className="text-cyan-400 font-bold">{filters.minRisk.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="1.00"
              step="0.05"
              value={filters.minRisk}
              onChange={(e) => onChangeFilters({ ...filters, minRisk: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.00 (Low)</span>
              <span>0.50 (Mod)</span>
              <span>1.00 (High)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              An analytical indicator derived from available evidence. It is not a guaranteed prediction.
            </p>
          </div>
        )}
      </div>

      {/* 3. Geographic Region Filter */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <button
          onClick={() => toggleSection('region')}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5 uppercase text-[11px]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Geographic Region
          </span>
          {expandedSections.region ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {expandedSections.region && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => onChangeFilters({ ...filters, region: reg })}
                className={`px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                  filters.region === reg
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Zone Classification Filter (Highest Conflict vs Resilient) */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <div className="text-xs font-semibold text-slate-300 mb-2 uppercase text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            Zone Classification
          </span>
        </div>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Global Zones' },
            { id: 'highest_conflict', label: '🔥 Highest Conflict Zones' },
            { id: 'strategic_chokepoints', label: '🚢 Strategic Chokepoints' },
            { id: 'resilient', label: '🛡️ Resilient / Lowest Risk' },
          ].map(z => (
            <button
              key={z.id}
              onClick={() => onChangeFilters({ ...filters, zoneFilter: z.id as FilterState['zoneFilter'] })}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                filters.zoneFilter === z.id
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold'
                  : 'text-slate-300 hover:bg-slate-850'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Event Status Filter */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <button
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 mb-2"
        >
          <span className="uppercase text-[11px]">Operational Status</span>
          {expandedSections.status ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {expandedSections.status && (
          <div className="space-y-1 text-xs">
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-red-400 font-medium">Active Hostilities</span>
              <input
                type="checkbox"
                checked={filters.status.active}
                onChange={() => handleStatusToggle('active')}
                className="rounded accent-red-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-orange-400 font-medium">Escalating</span>
              <input
                type="checkbox"
                checked={filters.status.escalating}
                onChange={() => handleStatusToggle('escalating')}
                className="rounded accent-orange-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-emerald-400 font-medium">De-escalating</span>
              <input
                type="checkbox"
                checked={filters.status.deEscalating}
                onChange={() => handleStatusToggle('deEscalating')}
                className="rounded accent-emerald-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-slate-400 font-medium">Historical / Resolved</span>
              <input
                type="checkbox"
                checked={filters.status.historical}
                onChange={() => handleStatusToggle('historical')}
                className="rounded accent-slate-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* 5. Visualization Layers Toggle */}
      <div className="border border-slate-900 bg-slate-900/40 rounded-xl p-2.5">
        <button
          onClick={() => toggleSection('layers')}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5 uppercase text-[11px]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Map Display Layers
          </span>
          {expandedSections.layers ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {expandedSections.layers && (
          <div className="space-y-1.5 text-xs">
            <label className="flex items-center justify-between p-1 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-slate-300">Animated Pulses</span>
              <input
                type="checkbox"
                checked={filters.layers.pulses}
                onChange={() => handleLayerToggle('pulses')}
                className="rounded accent-cyan-400 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-1 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-slate-300">Conflict Zones</span>
              <input
                type="checkbox"
                checked={filters.layers.conflictZones}
                onChange={() => handleLayerToggle('conflictZones')}
                className="rounded accent-cyan-400 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-1 rounded hover:bg-slate-850 cursor-pointer">
              <span className="text-slate-300">Economic Stress Points</span>
              <input
                type="checkbox"
                checked={filters.layers.economicStress}
                onChange={() => handleLayerToggle('economicStress')}
                className="rounded accent-cyan-400 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </aside>
  );
};
