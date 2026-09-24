import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { CrisisEvent, CrisisCategory } from '../types/crisis';
import { 
  Globe, 
  Layers, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  Users,
  Eye,
  Maximize2
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
    pulses: boolean;
    countryBorders: boolean;
    heatmaps: boolean;
  };
}

const CATEGORY_COLORS: Record<CrisisCategory, { bg: string; border: string; glow: string }> = {
  military: { bg: 'bg-red-600', border: 'border-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.8)]' },
  economic: { bg: 'bg-blue-600', border: 'border-blue-400', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.8)]' },
  financial: { bg: 'bg-cyan-600', border: 'border-cyan-400', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.8)]' },
  political: { bg: 'bg-purple-600', border: 'border-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.8)]' },
  humanitarian: { bg: 'bg-amber-600', border: 'border-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.8)]' },
};

// Internal controller component for smooth camera animations and fly-to actions
const MapCameraController: React.FC<{
  selectedEvent: CrisisEvent | null;
  isOrbiting: boolean;
  mapType: string;
  tilt: number;
}> = ({ selectedEvent, isOrbiting, mapType, tilt }) => {
  const map = useMap();
  const headingRef = useRef(0);

  // Fly to selected event
  useEffect(() => {
    if (!map || !selectedEvent) return;
    map.panTo({ lat: selectedEvent.latitude, lng: selectedEvent.longitude });
    const targetZoom = selectedEvent.severity === 'critical' ? 6 : 5;
    if (map.getZoom() !== targetZoom) {
      map.setZoom(targetZoom);
    }
  }, [map, selectedEvent]);

  // Adjust tilt
  useEffect(() => {
    if (!map) return;
    map.setTilt(tilt);
  }, [map, tilt]);

  // Orbit rotation animation
  useEffect(() => {
    if (!map || !isOrbiting) return;
    const interval = setInterval(() => {
      headingRef.current = (headingRef.current + 0.35) % 360;
      map.setHeading(headingRef.current);
    }, 50);
    return () => clearInterval(interval);
  }, [map, isOrbiting]);

  return null;
};

export const GoogleEarthView: React.FC<GoogleEarthViewProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onSelectCountry,
  layerFilters,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD8U5wu8pBGE-lTkloLDVqc90GpMLW7GzI';

  const [mapType, setMapType] = useState<'hybrid' | 'satellite' | 'terrain' | 'roadmap'>('hybrid');
  const [tilt, setTilt] = useState<number>(45);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [hoveredEvent, setHoveredEvent] = useState<CrisisEvent | null>(null);

  // Filter events by layer
  const visibleEvents = events.filter((ev) => {
    if (ev.category === 'military' && !layerFilters.conflictZones) return false;
    if (ev.category === 'economic' && !layerFilters.economicStress) return false;
    if (ev.category === 'political' && !layerFilters.diplomaticHotspots) return false;
    return true;
  });

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-mono">
      <APIProvider apiKey={apiKey} libraries={['places', 'marker', 'geometry']}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: 25.0, lng: 35.0 }}
          defaultZoom={3}
          mapTypeId={mapType}
          tilt={tilt}
          heading={0}
          gestureHandling="greedy"
          disableDefaultUI={true}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <MapCameraController
            selectedEvent={selectedEvent}
            isOrbiting={isOrbiting}
            mapType={mapType}
            tilt={tilt}
          />

          {/* Render Real Advanced Markers with Radar Pulses */}
          {visibleEvents.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            const style = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.military;

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
                title={ev.title}
              >
                <div 
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredEvent(ev)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Radar Pulse for Active Events */}
                  {layerFilters.pulses && (ev.status === 'active' || ev.status === 'escalating') && (
                    <div 
                      className={`absolute -inset-2.5 rounded-full ${style.bg} opacity-75 animate-ping pointer-events-none`} 
                    />
                  )}

                  {/* Marker Pin Head */}
                  <div
                    className={`relative z-10 flex items-center justify-center rounded-full text-white font-bold transition-transform ${
                      isSelected 
                        ? 'w-7 h-7 ring-2 ring-white scale-125 ' + style.bg + ' ' + style.glow
                        : 'w-5 h-5 ' + style.bg + ' ' + style.border + ' border hover:scale-125'
                    }`}
                  >
                    <span className="text-[9px]">
                      {ev.riskIndicator >= 0.8 ? '!' : Math.round(ev.riskIndicator * 10)}
                    </span>
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-slate-950/95 border border-slate-700 px-2 py-1 rounded shadow-xl text-[10px] text-slate-100 whitespace-nowrap">
                      <span className="text-cyan-400 font-bold">{ev.country}: </span>
                      <span>{ev.title}</span>
                    </div>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Floating Tactical Overlay HUD Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl shadow-2xl">
        {/* Imagery Type Switcher */}
        <div className="flex flex-col gap-1 text-[10px]">
          <span className="text-slate-400 uppercase tracking-wider px-1">Earth Imagery</span>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2 py-1 rounded text-center transition-colors ${
                mapType === 'hybrid' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2 py-1 rounded text-center transition-colors ${
                mapType === 'satellite' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2 py-1 rounded text-center transition-colors ${
                mapType === 'terrain' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-1 rounded text-center transition-colors ${
                mapType === 'roadmap' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Political
            </button>
          </div>
        </div>

        {/* 3D Tilt Toggle */}
        <button
          onClick={() => setTilt(prev => prev === 0 ? 45 : 0)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between gap-2 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D TILT</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-bold">{tilt}°</span>
        </button>

        {/* Orbit Heading Rotation */}
        <button
          onClick={() => setIsOrbiting(!isOrbiting)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between gap-2 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>ORBIT</span>
          </span>
          <span className={`text-[10px] font-bold ${isOrbiting ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isOrbiting ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Real Earth Attribution & Status Watermark */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-200 font-semibold">Google Earth Satellite Live Feed</span>
        </div>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 text-[11px]">
          Rendering {visibleEvents.length} Active Geopolitical Pins
        </span>
      </div>
    </div>
  );
};
