import React, { useState } from 'react';
import { FilterState, CrisisCategory } from '../types/crisis';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  TrendingUp, 
  Users, 
  Layers, 
  Globe,
  RotateCcw,
  Landmark,
  ShieldAlert,
  Zap,
  Leaf
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

  const handleResetFilters = () => {
    onChangeFilters({
      ...filters,
      categories: {
        military: true,
        conflict: true,
        political: true,
        economic: true,
        financial: true,
        humanitarian: true,
        security: true,
        diplomatic: true,
        energy: true,
        environmental: true,
      },
      status: {
        active: true,
        ongoing: true,
        escalating: true,
        deEscalating: true,
        ceasefire: true,
        frozen: true,
        resolved: false,
        historical: false,
      },
      minRisk: 0.0,
      maxRisk: 1.0,
      region: 'All',
      zoneFilter: 'all',
    });
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#111111] border-r border-[#303030] p-3 flex flex-col justify-between overflow-y-auto font-mono text-xs select-none transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
          <div className="flex items-center gap-2 text-[#E6E6E6]">
            <Filter className="w-3.5 h-3.5 text-[#A0A0A0]" />
            <h2 className="text-xs font-bold uppercase tracking-wider">FILTERS & LAYERS</h2>
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[10px] text-[#707070] hover:text-[#E6E6E6] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>

        {/* Section 1: Categories (Part 16) */}
        <div className="border border-[#252525] bg-[#151515] rounded p-2.5 space-y-2">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between font-bold text-[11px] text-[#E6E6E6]"
          >
            <span>CRISIS CATEGORIES</span>
            {expandedSections.categories ? <ChevronUp className="w-3 h-3 text-[#707070]" /> : <ChevronDown className="w-3 h-3 text-[#707070]" />}
          </button>

          {expandedSections.categories && (
            <div className="space-y-1.5 pt-1 text-[11px]">
              {[
                { id: 'conflict', label: 'Armed Conflict', color: '#dc2626' },
                { id: 'political', label: 'Political Crisis', color: '#94a3b8' },
                { id: 'economic', label: 'Economic Stress', color: '#2563eb' },
                { id: 'financial', label: 'Financial / Monetary', color: '#2563eb' },
                { id: 'humanitarian', label: 'Humanitarian Emergency', color: '#d97706' },
                { id: 'security', label: 'Security & Chokepoints', color: '#dc2626' },
                { id: 'energy', label: 'Energy & Oil Disruption', color: '#475569' },
                { id: 'environmental', label: 'Environmental Stress', color: '#15803d' },
              ].map(cat => (
                <label key={cat.id} className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(filters.categories[cat.id as keyof FilterState['categories']])}
                    onChange={() => handleCategoryToggle(cat.id as keyof FilterState['categories'])}
                    className="accent-[#2563eb] rounded bg-[#111111] border-[#303030]"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Status Filter (Part 8) */}
        <div className="border border-[#252525] bg-[#151515] rounded p-2.5 space-y-2">
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between font-bold text-[11px] text-[#E6E6E6]"
          >
            <span>OPERATIONAL STATUS</span>
            {expandedSections.status ? <ChevronUp className="w-3 h-3 text-[#707070]" /> : <ChevronDown className="w-3 h-3 text-[#707070]" />}
          </button>

          {expandedSections.status && (
            <div className="space-y-1.5 pt-1 text-[11px]">
              {[
                { id: 'ongoing', label: 'Ongoing Situation', color: '#dc2626' },
                { id: 'escalating', label: 'Escalating', color: '#dc2626' },
                { id: 'deEscalating', label: 'De-escalating', color: '#16a34a' },
                { id: 'ceasefire', label: 'Ceasefire / Truce', color: '#16a34a' },
                { id: 'frozen', label: 'Frozen Conflict', color: '#707070' },
                { id: 'resolved', label: 'Resolved (Archive)', color: '#707070' },
              ].map(st => (
                <label key={st.id} className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                    <span>{st.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(filters.status[st.id as keyof FilterState['status']])}
                    onChange={() => handleStatusToggle(st.id as keyof FilterState['status'])}
                    className="accent-[#2563eb] rounded bg-[#111111] border-[#303030]"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Geographic Region Selector */}
        <div className="border border-[#252525] bg-[#151515] rounded p-2.5 space-y-2">
          <button
            onClick={() => toggleSection('region')}
            className="w-full flex items-center justify-between font-bold text-[11px] text-[#E6E6E6]"
          >
            <span>GEOGRAPHIC THEATRE</span>
            {expandedSections.region ? <ChevronUp className="w-3 h-3 text-[#707070]" /> : <ChevronDown className="w-3 h-3 text-[#707070]" />}
          </button>

          {expandedSections.region && (
            <div className="pt-1">
              <select
                value={filters.region}
                onChange={(e) => onChangeFilters({ ...filters, region: e.target.value })}
                className="w-full bg-[#111111] border border-[#303030] text-[#E6E6E6] rounded px-2 py-1 text-xs outline-none focus:border-[#2563eb]"
              >
                <option value="All">All Global Theatres</option>
                <option value="Middle East">Middle East & Levant</option>
                <option value="Europe">Europe & Eurasia</option>
                <option value="Asia-Pacific">Asia-Pacific & South Asia</option>
                <option value="Africa">Africa & Sahel</option>
                <option value="Americas">Americas</option>
              </select>
            </div>
          )}
        </div>

        {/* Section 4: Map Visual Layers */}
        <div className="border border-[#252525] bg-[#151515] rounded p-2.5 space-y-2">
          <button
            onClick={() => toggleSection('layers')}
            className="w-full flex items-center justify-between font-bold text-[11px] text-[#E6E6E6]"
          >
            <span>MAP OVERLAY LAYERS</span>
            {expandedSections.layers ? <ChevronUp className="w-3 h-3 text-[#707070]" /> : <ChevronDown className="w-3 h-3 text-[#707070]" />}
          </button>

          {expandedSections.layers && (
            <div className="space-y-1.5 pt-1 text-[11px]">
              <label className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                <span>Conflict Zones</span>
                <input
                  type="checkbox"
                  checked={filters.layers.conflictZones}
                  onChange={() => handleLayerToggle('conflictZones')}
                  className="accent-[#2563eb] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                <span>Economic Stress</span>
                <input
                  type="checkbox"
                  checked={filters.layers.economicStress}
                  onChange={() => handleLayerToggle('economicStress')}
                  className="accent-[#2563eb] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                <span>Humanitarian Emergencies</span>
                <input
                  type="checkbox"
                  checked={filters.layers.humanitarian !== false}
                  onChange={() => handleLayerToggle('humanitarian')}
                  className="accent-[#2563eb] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#E6E6E6] text-[#A0A0A0]">
                <span>Active Incident Pulses</span>
                <input
                  type="checkbox"
                  checked={filters.layers.pulses}
                  onChange={() => handleLayerToggle('pulses')}
                  className="accent-[#2563eb] rounded"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="w-full mt-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] text-[#E6E6E6] rounded font-bold md:hidden"
      >
        APPLY & CLOSE
      </button>
    </aside>
  );
};
