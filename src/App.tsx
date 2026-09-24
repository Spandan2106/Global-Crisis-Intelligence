/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_CRISIS_EVENTS } from './data/mockCrises';
import { CrisisEvent, FilterState, TimelineFilterMode } from './types/crisis';
import { Header, DashboardMode } from './components/Header';
import { GlobalStatsBar } from './components/GlobalStatsBar';
import { LiveIntelligenceFeed } from './components/LiveIntelligenceFeed';
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
  hormuz: { lat: 26.5667, lng: 56.2500, zoom: 6.5 },
  'strait of hormuz': { lat: 26.5667, lng: 56.2500, zoom: 6.5 },
  gaza: { lat: 31.4167, lng: 34.3333, zoom: 8.0 },
  palestine: { lat: 31.4167, lng: 34.3333, zoom: 7.5 },
  israel: { lat: 31.7683, lng: 35.2137, zoom: 7.0 },
  lebanon: { lat: 33.8547, lng: 35.8623, zoom: 7.0 },
  beirut: { lat: 33.8938, lng: 35.5018, zoom: 8.0 },
  sudan: { lat: 15.5007, lng: 32.5599, zoom: 5.5 },
  khartoum: { lat: 15.5007, lng: 32.5599, zoom: 6.5 },
  darfur: { lat: 13.6288, lng: 25.3549, zoom: 6.0 },
  'horn of africa': { lat: 9.5624, lng: 44.0770, zoom: 5.5 },
  somalia: { lat: 5.1521, lng: 46.1996, zoom: 5.5 },
  somaliland: { lat: 9.5624, lng: 44.0770, zoom: 6.5 },
  ethiopia: { lat: 9.1450, lng: 40.4897, zoom: 5.5 },
  baltic: { lat: 56.5000, lng: 20.0000, zoom: 5.5 },
  'baltic sea': { lat: 56.5000, lng: 20.0000, zoom: 5.5 },
  'hybrid war': { lat: 56.5000, lng: 20.0000, zoom: 5.5 },
  'europe hybrid': { lat: 56.5000, lng: 20.0000, zoom: 5.5 },
  iran: { lat: 32.4279, lng: 53.6880, zoom: 5.0 },
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
  'united states': { lat: 37.0902, lng: -95.7129, zoom: 4.0 },
  usa: { lat: 37.0902, lng: -95.7129, zoom: 4.0 },
  europe: { lat: 50.0000, lng: 15.0000, zoom: 4.0 },
  germany: { lat: 51.1657, lng: 10.4515, zoom: 5.5 },
  egypt: { lat: 26.8206, lng: 30.8025, zoom: 5.0 },
  china: { lat: 35.8617, lng: 104.1954, zoom: 4.0 },
  yemen: { lat: 15.5527, lng: 48.5164, zoom: 5.5 },
  switzerland: { lat: 46.8182, lng: 8.2275, zoom: 6.5 },
  singapore: { lat: 1.3521, lng: 103.8198, zoom: 8.0 }
};

export default function App() {
  // Navigation & View Mode
  const [currentMode, setCurrentMode] = useState<DashboardMode>('global');

  // Geographic Dual Engine: MODE A (2D Map / Google Maps) vs MODE B (3D Earth Globe)
  const [earthMode, setEarthMode] = useState<'map' | 'earth'>('earth');

  // Selected Items - Default focus on Strait of Hormuz conflict
  const defaultEvent = MOCK_CRISIS_EVENTS.find(e => e.id === 'crisis-hormuz-strait-standoff') || MOCK_CRISIS_EVENTS[0];
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | null>(defaultEvent);
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

  // Timeline Scope Mode: 'today' (DEFAULT) | '2year' | 'total' | 'custom'
  // By default, it will only show today's data, the ongoing conflicts or today's data
  const [timelineMode, setTimelineMode] = useState<TimelineFilterMode>('today');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [exactYearOnly, setExactYearOnly] = useState<boolean>(false);
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
    } else if (mode === 'history') {
      setTimelineMode('total');
    }
  };

  // Filter events according to timeline mode (Today vs 2-Year vs Total vs Custom), categories, and status
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

      // 7. Timeline filter logic:
      const evYear = new Date(ev.date).getFullYear();

      if (timelineMode === 'today') {
        // BY DEFAULT: Only show today's data, ongoing active & escalating conflicts
        const isOngoing = ev.status === 'active' || ev.status === 'escalating';
        const isContemporary = evYear >= 2024;
        return isOngoing && isContemporary;
      } else if (timelineMode === '2year') {
        // CURRENT 2-YEAR TIMELINE: 2024 to 2026
        return evYear >= 2024 && evYear <= 2026;
      } else if (timelineMode === 'total') {
        // TOTAL TIMELINE: 1950 to today
        return evYear >= 1950 && evYear <= 2026;
      } else if (timelineMode === 'custom') {
        // USER CUSTOM SPECIFIED YEAR
        if (exactYearOnly) {
          return evYear === currentYear;
        } else {
          return evYear <= currentYear;
        }
      }

      return true;
    });
  }, [filters, timelineMode, currentYear, exactYearOnly]);

  // Handle Event Fly-to request
  const handleFlyToEvent = (event: CrisisEvent) => {
    setSelectedEvent(event);
    setSearchFlyToTarget({ lat: event.latitude, lng: event.longitude, zoom: 6.0 });
  };

  // Fly to conflict from Live Intelligence Feed
  const handleSelectConflictFromWire = (conflictId: string) => {
    const target = MOCK_CRISIS_EVENTS.find(e => e.id === conflictId);
    if (target) {
      handleFlyToEvent(target);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Google Maps Quota Warning Banner */}
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

      {/* Top Header Navigation */}
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

      {/* Real-Time Live Intelligence & News Wire (Continuously Fetches & Tickers) */}
      <LiveIntelligenceFeed
        onSelectConflict={handleSelectConflictFromWire}
        allEvents={MOCK_CRISIS_EVENTS}
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
            /* MODE B: TRUE 3D GEOGRAPHIC EARTH */
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

      {/* Bottom Timeline Machine (Default: Today's Ongoing Data | 2-Year: 2024-2026 | Total: 1950-Today | Custom Year) */}
      {currentMode !== 'markets' && currentMode !== 'network' && currentMode !== 'scenarios' && (
        <TimelineControl
          timelineMode={timelineMode}
          onTimelineModeChange={setTimelineMode}
          currentYear={currentYear}
          onYearChange={(yr) => {
            setCurrentYear(yr);
            if (timelineMode === 'today') setTimelineMode('custom');
          }}
          exactYearOnly={exactYearOnly}
          onToggleExactYearOnly={() => setExactYearOnly(!exactYearOnly)}
          isPlaying={isPlayingTimeline}
          onTogglePlay={() => setIsPlayingTimeline(!isPlayingTimeline)}
          eventsCount={filteredEvents.length}
          totalEventsCount={MOCK_CRISIS_EVENTS.length}
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
