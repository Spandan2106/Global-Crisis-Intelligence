/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_CRISIS_EVENTS } from './data/mockCrises';
import { CrisisEvent, FilterState } from './types/crisis';
import { Header, DashboardMode } from './components/Header';
import { GlobalStatsBar } from './components/GlobalStatsBar';
import { FilterPanel } from './components/FilterPanel';
import { RealEarthGlobeView } from './components/RealEarthGlobeView';
import { GoogleEarthView } from './components/GoogleEarthView';
import { EventDetails } from './components/EventDetails';
import { CountryProfileModal } from './components/CountryProfileModal';
import { MarketDashboard } from './components/MarketDashboard';
import { CrisisNetworkView } from './components/CrisisNetworkView';
import { ScenarioAnalysisView } from './components/ScenarioAnalysisView';
import { CrisisAnalystChat } from './components/CrisisAnalystChat';
import { TimelineControl } from './components/TimelineControl';

// Geographic Coordinates Lookup for Smooth Camera Flight
const SEARCH_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  india: { lat: 20.5937, lng: 78.9629, zoom: 4.5 },
  delhi: { lat: 28.6139, lng: 77.2090, zoom: 6.5 },
  mumbai: { lat: 19.0760, lng: 72.8777, zoom: 6.5 },
  ukraine: { lat: 48.3794, lng: 31.1656, zoom: 5.2 },
  kyiv: { lat: 50.4501, lng: 30.5234, zoom: 6.5 },
  'middle east': { lat: 27.0000, lng: 45.0000, zoom: 4.5 },
  tokyo: { lat: 35.6762, lng: 139.6503, zoom: 6.5 },
  japan: { lat: 36.2048, lng: 138.2529, zoom: 5.0 },
  'south china sea': { lat: 12.0000, lng: 114.0000, zoom: 5.0 },
  taiwan: { lat: 23.6978, lng: 120.9605, zoom: 6.5 },
  'red sea': { lat: 20.0000, lng: 38.5000, zoom: 5.0 },
  sudan: { lat: 15.5007, lng: 32.5599, zoom: 5.0 },
  'united states': { lat: 37.0902, lng: -95.7129, zoom: 4.0 },
  usa: { lat: 37.0902, lng: -95.7129, zoom: 4.0 },
  europe: { lat: 50.0000, lng: 15.0000, zoom: 4.0 },
  germany: { lat: 51.1657, lng: 10.4515, zoom: 5.5 },
  egypt: { lat: 26.8206, lng: 30.8025, zoom: 5.0 },
  china: { lat: 35.8617, lng: 104.1954, zoom: 4.0 },
  lebanon: { lat: 33.8547, lng: 35.8623, zoom: 7.0 },
  yemen: { lat: 15.5527, lng: 48.5164, zoom: 5.5 },
  switzerland: { lat: 46.8182, lng: 8.2275, zoom: 6.5 },
  singapore: { lat: 1.3521, lng: 103.8198, zoom: 8.0 }
};

export default function App() {
  // Navigation & View Mode
  const [currentMode, setCurrentMode] = useState<DashboardMode>('global');

  // Geographic Dual Engine: MODE A (2D Map / Google Maps) vs MODE B (3D Earth Globe)
  // Default is 'earth' as requested by the primary objective
  const [earthMode, setEarthMode] = useState<'map' | 'earth'>('earth');

  // Selected Items
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | null>(MOCK_CRISIS_EVENTS[10]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // Geographic Search Fly-To Target
  const [searchFlyToTarget, setSearchFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // UI Panels
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isAnalystChatOpen, setIsAnalystChatOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  // Google Maps Quota Listener state
  const [isGmpQuotaExceeded, setIsGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsGmpQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Time Machine (1950 - 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Search & Filters State
  const [filters, setFilters] = useState<FilterState>({
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

  // Handle Search Input & Fly-To triggering
  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));

    const clean = query.trim().toLowerCase();
    if (SEARCH_COORDINATES[clean]) {
      setSearchFlyToTarget(SEARCH_COORDINATES[clean]);
    }
  };

  // Handle Mode Change
  const handleSelectMode = (mode: DashboardMode) => {
    setCurrentMode(mode);
    if (mode === 'conflicts') {
      setFilters(prev => ({
        ...prev,
        categories: { political: false, military: true, economic: false, financial: false, humanitarian: false }
      }));
    } else if (mode === 'economy') {
      setFilters(prev => ({
        ...prev,
        categories: { political: false, military: false, economic: true, financial: true, humanitarian: false }
      }));
    } else if (mode === 'global') {
      setFilters(prev => ({
        ...prev,
        categories: { political: true, military: true, economic: true, financial: true, humanitarian: true }
      }));
    }
  };

  // Filter events according to all active criteria, zone classification, and timeline year
  const filteredEvents = useMemo(() => {
    return MOCK_CRISIS_EVENTS.filter((ev) => {
      // 1. Search filter
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matches = 
          ev.title.toLowerCase().includes(q) ||
          ev.country.toLowerCase().includes(q) ||
          ev.region.toLowerCase().includes(q) ||
          ev.subcategory.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Zone classification filter
      if (filters.zoneFilter === 'highest_conflict' && ev.zoneClassification !== 'highest_conflict_zone') {
        return false;
      }
      if (filters.zoneFilter === 'strategic_chokepoints' && ev.zoneClassification !== 'strategic_chokepoint') {
        return false;
      }
      if (filters.zoneFilter === 'resilient' && ev.zoneClassification !== 'lowest_risk_resilient') {
        return false;
      }

      // 3. Category filter
      if (!filters.categories[ev.category]) return false;

      // 4. Status filter
      if (ev.status === 'active' && !filters.status.active) return false;
      if (ev.status === 'escalating' && !filters.status.escalating) return false;
      if (ev.status === 'de-escalating' && !filters.status.deEscalating) return false;
      if (ev.status === 'historical' && !filters.status.historical) return false;
      if (ev.status === 'resolved' && !filters.status.resolved) return false;

      // 5. Risk threshold
      if (ev.riskIndicator < filters.minRisk || ev.riskIndicator > filters.maxRisk) return false;

      // 6. Region filter
      if (filters.region !== 'All' && ev.region !== filters.region) return false;

      // 7. Chronological Year filter (Time Machine from 1950)
      const evYear = new Date(ev.date).getFullYear();
      if (evYear > currentYear) return false;

      return true;
    });
  }, [filters, currentYear]);

  // Handle Event Fly-to request
  const handleFlyToEvent = (event: CrisisEvent) => {
    setSelectedEvent(event);
    setSearchFlyToTarget({ lat: event.latitude, lng: event.longitude, zoom: 5.5 });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Google Maps Quota Warning Banner (Tier 2 Client-Side Quota Defense) */}
      {isGmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm font-sans flex items-center justify-center gap-1">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Header Navigation with [ MAP ] [ 3D EARTH ] Switcher */}
      <Header
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        events={filteredEvents}
        onSelectEvent={(ev) => handleFlyToEvent(ev)}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        onToggleAnalystChat={() => setIsAnalystChatOpen(!isAnalystChatOpen)}
        isAnalystChatOpen={isAnalystChatOpen}
        onToggleFilterSidebar={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
        earthMode={earthMode}
        onToggleEarthMode={(mode) => setEarthMode(mode)}
      />

      {/* Global Intelligence Metrics Bar */}
      <GlobalStatsBar events={filteredEvents} />

      {/* Main Workspace Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Filter Sidebar */}
        <FilterPanel
          filters={filters}
          onChangeFilters={setFilters}
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
        />

        {/* Center Canvas / Mode Switcher */}
        <main className="relative flex-1 h-full overflow-hidden bg-slate-950">
          {currentMode === 'markets' ? (
            <MarketDashboard />
          ) : currentMode === 'network' ? (
            <CrisisNetworkView />
          ) : currentMode === 'scenarios' ? (
            <ScenarioAnalysisView />
          ) : earthMode === 'earth' ? (
            /* MODE B: TRUE 3D GEOGRAPHIC EARTH (WGS84 Ellipsoid, Real Terrain Elevation DEM, Satellite & Hybrid Tiles) */
            <RealEarthGlobeView
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={(ev) => setSelectedEvent(ev)}
              onSelectCountry={(code) => setSelectedCountryCode(code)}
              layerFilters={filters.layers}
              searchFlyToTarget={searchFlyToTarget}
            />
          ) : (
            /* MODE A: 2D REAL-WORLD GOOGLE MAPS EXPERIENCE */
            <GoogleEarthView
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={(ev) => setSelectedEvent(ev)}
              onSelectCountry={(code) => setSelectedCountryCode(code)}
              layerFilters={filters.layers}
            />
          )}
        </main>

        {/* Right Event Dossier Panel */}
        {selectedEvent && currentMode !== 'markets' && currentMode !== 'network' && currentMode !== 'scenarios' && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onSelectCountry={(code) => setSelectedCountryCode(code)}
            onFlyToEvent={(ev) => handleFlyToEvent(ev)}
          />
        )}
      </div>

      {/* Bottom Historical Time Machine Control (1950 - 2026) */}
      {currentMode !== 'markets' && currentMode !== 'network' && currentMode !== 'scenarios' && (
        <TimelineControl
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          isPlaying={isPlayingTimeline}
          onTogglePlay={() => setIsPlayingTimeline(!isPlayingTimeline)}
          events={MOCK_CRISIS_EVENTS}
        />
      )}

      {/* Country Intelligence Profile Modal */}
      {selectedCountryCode && (
        <CountryProfileModal
          countryCode={selectedCountryCode}
          onClose={() => setSelectedCountryCode(null)}
          allEvents={MOCK_CRISIS_EVENTS}
          onSelectEvent={(ev) => handleFlyToEvent(ev)}
        />
      )}

      {/* AI Crisis Analyst Assistant Drawer */}
      <CrisisAnalystChat
        isOpen={isAnalystChatOpen}
        onClose={() => setIsAnalystChatOpen(false)}
        selectedEvent={selectedEvent}
        allEvents={filteredEvents}
      />
    </div>
  );
}
