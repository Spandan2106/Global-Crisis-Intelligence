import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { CrisisEvent, CrisisCategory } from '../types/crisis';
import { 
  Globe, 
  RotateCcw, 
  Flame, 
  TrendingUp, 
  Users,
  Compass,
  Play,
  Pause
} from 'lucide-react';

interface GoogleEarthViewProps {
  events: CrisisEvent[];
  selectedEvent: CrisisEvent | null;
  onSelectEvent: (event: CrisisEvent) => void;
  onSelectCountry?: (countryCode: string) => void;
  layerFilters: {
    conflictZones: boolean;
    economicStress: boolean;
    diplomaticHotspots: boolean;
    humanitarian?: boolean;
    pulses: boolean;
    countryBorders: boolean;
    heatmaps: boolean;
  };
}

// Strict Restrained Semantic Color Palette
const CATEGORY_COLORS: Record<CrisisCategory, { bg: string; border: string }> = {
  conflict: { bg: 'bg-[#dc2626]', border: 'border-[#dc2626]' },
  military: { bg: 'bg-[#dc2626]', border: 'border-[#dc2626]' },
  security: { bg: 'bg-[#dc2626]', border: 'border-[#dc2626]' },
  economic: { bg: 'bg-[#2563eb]', border: 'border-[#2563eb]' },
  financial: { bg: 'bg-[#2563eb]', border: 'border-[#2563eb]' },
  political: { bg: 'bg-[#94a3b8]', border: 'border-[#94a3b8]' },
  diplomatic: { bg: 'bg-[#94a3b8]', border: 'border-[#94a3b8]' },
  humanitarian: { bg: 'bg-[#d97706]', border: 'border-[#d97706]' },
  energy: { bg: 'bg-[#475569]', border: 'border-[#475569]' },
  environmental: { bg: 'bg-[#15803d]', border: 'border-[#15803d]' },
};

const MapCameraController: React.FC<{
  selectedEvent: CrisisEvent | null;
  isOrbiting: boolean;
  mapType: string;
  tilt: number;
}> = ({ selectedEvent, isOrbiting, mapType, tilt }) => {
  const map = useMap();
  const headingRef = useRef(0);

  useEffect(() => {
    if (!map || !selectedEvent) return;
    map.panTo({ lat: selectedEvent.latitude, lng: selectedEvent.longitude });
    const targetZoom = selectedEvent.severity === 'critical' ? 6 : 5;
    if (map.getZoom() !== targetZoom) {
      map.setZoom(targetZoom);
    }
    if (mapType === 'satellite' || mapType === 'hybrid') {
      map.setTilt(tilt);
    }
  }, [selectedEvent, map, mapType, tilt]);

  useEffect(() => {
    if (!map || !isOrbiting) return;
    const interval = setInterval(() => {
      headingRef.current = (headingRef.current + 1.2) % 360;
      map.setHeading(headingRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isOrbiting, map]);

  return null;
};

export const GoogleEarthView: React.FC<GoogleEarthViewProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onSelectCountry,
  layerFilters,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('satellite');
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [tilt, setTilt] = useState(45);
  const [hoveredEvent, setHoveredEvent] = useState<CrisisEvent | null>(null);

  const visibleEvents = events.filter((ev) => {
    if ((ev.category === 'conflict' || ev.category === 'military') && !layerFilters.conflictZones) return false;
    if ((ev.category === 'economic' || ev.category === 'financial') && !layerFilters.economicStress) return false;
    if ((ev.category === 'political' || ev.category === 'diplomatic') && !layerFilters.diplomaticHotspots) return false;
    if (ev.category === 'humanitarian' && layerFilters.humanitarian === false) return false;
    return true;
  });

  return (
    <div className="relative w-full h-full bg-[#111111] overflow-hidden select-none font-mono">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={mapId}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={{ lat: 25.0, lng: 20.0 }}
          defaultZoom={2.4}
          mapTypeId={mapType}
          tilt={tilt}
          heading={0}
          gestureHandling="greedy"
          disableDefaultUI={true}
          className="w-full h-full"
        >
          <MapCameraController
            selectedEvent={selectedEvent}
            isOrbiting={isOrbiting}
            mapType={mapType}
            tilt={tilt}
          />

          {visibleEvents.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            const colors = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.conflict;

            return (
              <AdvancedMarker
                key={ev.id}
                position={{ lat: ev.latitude, lng: ev.longitude }}
                onClick={() => {
                  onSelectEvent(ev);
                  if (onSelectCountry && ev.countryCode) {
                    onSelectCountry(ev.countryCode);
                  }
                }}
              >
                <div
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredEvent(ev)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {layerFilters.pulses && (ev.status === 'ongoing' || ev.status === 'escalating' || ev.status === 'active') && (
                    <div className={`absolute -inset-1.5 rounded-full ${colors.bg} animate-ping opacity-40`} />
                  )}

                  <div
                    className={`relative z-10 flex items-center justify-center rounded-full text-white font-mono font-bold border border-neutral-900 transition-transform ${
                      isSelected
                        ? `w-5 h-5 ring-2 ring-white scale-125 ${colors.bg}`
                        : `w-4 h-4 hover:scale-125 ${colors.bg}`
                    }`}
                  >
                    <span style={{ fontSize: '8px' }}>
                      {ev.severity === 'critical' ? '!' : Math.round(ev.riskIndicator * 10)}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 pointer-events-none bg-[#151515] border border-[#303030] px-2 py-1 rounded shadow-lg text-[10px] text-[#E6E6E6] whitespace-nowrap font-mono">
                    <span className="text-[#A0A0A0]">{ev.country}:</span> <strong>{ev.title}</strong>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Map Control HUD */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-[#151515]/95 border border-[#303030] p-2 rounded shadow-lg text-xs">
        <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-1">
          MAP CONTROLS
        </span>

        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <button
            onClick={() => setMapType('satellite')}
            className={`p-1 rounded text-center transition-colors font-bold ${
              mapType === 'satellite' ? 'bg-[#2563eb] text-white' : 'text-[#A0A0A0] hover:bg-[#202020]'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`p-1 rounded text-center transition-colors font-bold ${
              mapType === 'hybrid' ? 'bg-[#2563eb] text-white' : 'text-[#A0A0A0] hover:bg-[#202020]'
            }`}
          >
            Hybrid
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`p-1 rounded text-center transition-colors font-bold ${
              mapType === 'roadmap' ? 'bg-[#2563eb] text-white' : 'text-[#A0A0A0] hover:bg-[#202020]'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`p-1 rounded text-center transition-colors font-bold ${
              mapType === 'terrain' ? 'bg-[#2563eb] text-white' : 'text-[#A0A0A0] hover:bg-[#202020]'
            }`}
          >
            Terrain
          </button>
        </div>

        <button
          onClick={() => setTilt(tilt === 0 ? 45 : 0)}
          className="p-1 rounded bg-[#1C1C1C] border border-[#303030] text-[10px] text-[#A0A0A0] hover:text-[#E6E6E6] flex items-center justify-between"
        >
          <span>3D Perspective</span>
          <span className="font-bold text-[#E6E6E6]">{tilt}°</span>
        </button>

        <button
          onClick={() => setIsOrbiting(!isOrbiting)}
          className="p-1 rounded bg-[#1C1C1C] border border-[#303030] text-[10px] text-[#A0A0A0] hover:text-[#E6E6E6] flex items-center justify-between"
        >
          <span>Auto Orbit</span>
          <span className={`font-bold ${isOrbiting ? 'text-[#16a34a]' : 'text-[#707070]'}`}>
            {isOrbiting ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
};
