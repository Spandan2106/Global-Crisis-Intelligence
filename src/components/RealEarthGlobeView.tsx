import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrisisEvent, CrisisCategory } from '../types/crisis';
import { 
  Compass, 
  RotateCcw, 
  Play, 
  Pause, 
  Navigation,
  Globe,
  Mountain
} from 'lucide-react';

// Configure Web Worker using the same-origin static module worker
if (typeof window !== 'undefined') {
  try {
    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
  } catch {
    // fallback
  }
}

interface RealEarthGlobeViewProps {
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
  searchFlyToTarget?: { lat: number; lng: number; zoom?: number } | null;
}

export type EarthImageryType = 'satellite' | 'hybrid' | 'terrain' | 'default';

// Regional Camera Presets (Geographic coordinates: [lng, lat, zoom, pitch])
const REGIONAL_PRESETS: { name: string; center: [number, number]; zoom: number; pitch: number }[] = [
  { name: 'GLOBAL', center: [20.0, 15.0], zoom: 1.5, pitch: 0 },
  { name: 'MIDDLE EAST', center: [45.0792, 26.8206], zoom: 3.8, pitch: 35 },
  { name: 'EUROPE', center: [15.2551, 50.5260], zoom: 3.6, pitch: 30 },
  { name: 'SOUTH ASIA', center: [78.9629, 22.5937], zoom: 3.8, pitch: 35 },
  { name: 'EAST ASIA', center: [116.4074, 34.0000], zoom: 3.5, pitch: 35 },
  { name: 'AFRICA', center: [21.7587, 4.0383], zoom: 3.2, pitch: 20 },
  { name: 'NORTH AMERICA', center: [-98.5795, 39.8283], zoom: 3.2, pitch: 25 },
  { name: 'SOUTH AMERICA', center: [-58.3816, -15.6037], zoom: 3.2, pitch: 25 },
  { name: 'SOUTHEAST ASIA', center: [106.8456, 4.2105], zoom: 3.8, pitch: 30 },
  { name: 'OCEANIA', center: [133.7751, -25.2744], zoom: 3.5, pitch: 25 },
  { name: 'ARCTIC', center: [0.0, 85.0], zoom: 2.5, pitch: 45 },
  { name: 'ANTARCTIC', center: [0.0, -82.0], zoom: 2.5, pitch: 45 },
];

// Strict Restrained Semantic Color Palette (No neon, no purple, no rainbow)
const CATEGORY_COLORS: Record<CrisisCategory, string> = {
  conflict: '#dc2626',      // Muted red
  military: '#dc2626',      // Muted red
  security: '#dc2626',      // Muted red
  economic: '#2563eb',      // Muted blue
  financial: '#2563eb',     // Muted blue
  political: '#94a3b8',     // Muted slate gray
  diplomatic: '#94a3b8',    // Muted slate gray
  humanitarian: '#d97706',  // Muted amber
  energy: '#475569',        // Dark slate
  environmental: '#15803d', // Muted dark green
};

export const RealEarthGlobeView: React.FC<RealEarthGlobeViewProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onSelectCountry,
  layerFilters,
  searchFlyToTarget,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Geographic UI States
  const [imageryType, setImageryType] = useState<EarthImageryType>('satellite');
  const [terrainElevationEnabled, setTerrainElevationEnabled] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingStep, setLoadingStep] = useState<'loading_earth' | 'loading_terrain' | 'loading_imagery' | 'ready'>('loading_earth');
  const [cameraAltitudeKm, setCameraAltitudeKm] = useState<number>(12000);

  // Initialize MapLibre 3D WGS84 Globe
  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLoadingStep('loading_earth');

    const initialStyle: maplibregl.StyleSpecification = {
      version: 8,
      projection: {
        type: 'globe',
      },
      sky: {
        'atmosphere-blend': 0.8,
      },
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Esri, Maxar',
          maxzoom: 19,
        },
        'terrain-dem': {
          type: 'raster-dem',
          tiles: [
            'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          encoding: 'mapbox',
          maxzoom: 12,
        },
        'carto-labels': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
          ],
          tileSize: 256,
          maxzoom: 19,
        },
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          ],
          tileSize: 256,
          attribution: 'OSM, CARTO',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          layout: { visibility: 'visible' },
          paint: { 'raster-opacity': 1.0 },
        },
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          layout: { visibility: 'none' },
          paint: { 'raster-opacity': 1.0 },
        },
        {
          id: 'labels-layer',
          type: 'raster',
          source: 'carto-labels',
          layout: { visibility: 'visible' },
          paint: { 'raster-opacity': 0.85 },
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [25.0, 20.0],
      zoom: 1.8,
      pitch: 30,
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    // Scale Control in metric units
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: 'metric',
      }),
      'bottom-right'
    );

    map.on('error', (e) => {
      // Gracefully prevent unhandled worker or network tile errors
      console.warn('Map engine notice:', e.error?.message || e);
    });

    // Track Cursor Coordinates & Altitude
    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: parseFloat(e.lngLat.lat.toFixed(4)),
        lng: parseFloat(e.lngLat.lng.toFixed(4)),
      });
    });

    map.on('zoom', () => {
      const z = map.getZoom();
      const alt = Math.round(40000 / Math.pow(2, z));
      setCameraAltitudeKm(Math.max(10, alt));
    });

    map.on('load', () => {
      setLoadingStep('loading_terrain');
      try {
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
      } catch {
        // terrain initialization catch
      }

      setLoadingStep('loading_imagery');
      setTimeout(() => {
        setLoadingStep('ready');
      }, 400);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Imagery Layers & Terrain
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (imageryType === 'satellite') {
      if (map.getLayer('satellite-layer')) map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
      if (map.getLayer('carto-dark-layer')) map.setLayoutProperty('carto-dark-layer', 'visibility', 'none');
      if (map.getLayer('labels-layer')) map.setLayoutProperty('labels-layer', 'visibility', 'none');
    } else if (imageryType === 'hybrid') {
      if (map.getLayer('satellite-layer')) map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
      if (map.getLayer('carto-dark-layer')) map.setLayoutProperty('carto-dark-layer', 'visibility', 'none');
      if (map.getLayer('labels-layer')) map.setLayoutProperty('labels-layer', 'visibility', 'visible');
    } else if (imageryType === 'default' || imageryType === 'terrain') {
      if (map.getLayer('satellite-layer')) map.setLayoutProperty('satellite-layer', 'visibility', 'none');
      if (map.getLayer('carto-dark-layer')) map.setLayoutProperty('carto-dark-layer', 'visibility', 'visible');
      if (map.getLayer('labels-layer')) map.setLayoutProperty('labels-layer', 'visibility', 'visible');
    }

    try {
      if (terrainElevationEnabled) {
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
      } else {
        map.setTerrain(null);
      }
    } catch {
      // terrain toggle catch
    }
  }, [imageryType, terrainElevationEnabled]);

  // Inertial Auto-Rotation (Optional feature, disabled by default)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isAutoRotating) return;

    let animId: number;
    const rotate = () => {
      if (map && isAutoRotating) {
        const center = map.getCenter();
        map.setCenter([center.lng - 0.12, center.lat]);
        animId = requestAnimationFrame(rotate);
      }
    };
    animId = requestAnimationFrame(rotate);

    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // Synchronize Crisis Event Markers on the Real 3D Earth
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const visibleEvents = events.filter((ev) => {
      if ((ev.category === 'conflict' || ev.category === 'military') && !layerFilters.conflictZones) return false;
      if ((ev.category === 'economic' || ev.category === 'financial') && !layerFilters.economicStress) return false;
      if ((ev.category === 'political' || ev.category === 'diplomatic') && !layerFilters.diplomaticHotspots) return false;
      if (ev.category === 'humanitarian' && layerFilters.humanitarian === false) return false;
      return true;
    });

    visibleEvents.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const catColor = CATEGORY_COLORS[ev.category] || '#dc2626';

      const el = document.createElement('div');
      el.className = 'crisis-geographic-marker group cursor-pointer relative';
      el.style.transform = 'translate(-50%, -50%)';

      // Subtle pulse for active/escalating crises
      if (layerFilters.pulses && (ev.status === 'ongoing' || ev.status === 'escalating' || ev.status === 'active')) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-1.5 rounded-full animate-ping pointer-events-none opacity-40';
        pulse.style.backgroundColor = catColor;
        el.appendChild(pulse);
      }

      // Restrained Pin Head (No glowing neon)
      const pin = document.createElement('div');
      pin.className = `relative z-10 flex items-center justify-center rounded-full text-white font-mono font-medium border border-neutral-900 transition-transform ${
        isSelected ? 'w-5 h-5 ring-2 ring-white scale-125' : 'w-4 h-4 hover:scale-125'
      }`;
      pin.style.backgroundColor = catColor;
      pin.innerHTML = `<span style="font-size: 8px;">${ev.severity === 'critical' ? '!' : Math.round(ev.riskIndicator * 10)}</span>`;
      el.appendChild(pin);

      // Tooltip Element
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 pointer-events-none bg-[#151515] border border-[#303030] px-2 py-1 rounded shadow-lg text-[10px] text-[#E6E6E6] whitespace-nowrap font-mono';
      tooltip.innerHTML = `<span style="color: #A0A0A0;">${ev.country}:</span> <strong>${ev.title}</strong>`;
      el.appendChild(tooltip);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(ev);
        if (onSelectCountry && ev.countryCode) {
          onSelectCountry(ev.countryCode);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ev.longitude, ev.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [events, selectedEvent, layerFilters]);

  // Smooth Fly-To
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (searchFlyToTarget) {
      map.flyTo({
        center: [searchFlyToTarget.lng, searchFlyToTarget.lat],
        zoom: searchFlyToTarget.zoom || 4.5,
        pitch: 35,
        essential: true,
        duration: 2000,
      });
      return;
    }

    if (selectedEvent) {
      map.flyTo({
        center: [selectedEvent.longitude, selectedEvent.latitude],
        zoom: selectedEvent.severity === 'critical' ? 5.2 : 4.2,
        pitch: 35,
        essential: true,
        duration: 1800,
      });
    }
  }, [selectedEvent, searchFlyToTarget]);

  const handleFlyToPreset = (center: [number, number], zoom: number, pitch: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center,
      zoom,
      pitch,
      essential: true,
      duration: 1800,
    });
  };

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [20.0, 15.0],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      duration: 1600,
    });
    setIsAutoRotating(false);
  };

  return (
    <div className="relative w-full h-full bg-[#111111] overflow-hidden font-mono select-none">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading State Overlay */}
      {loadingStep !== 'ready' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#111111]/85 backdrop-blur-sm">
          <div className="bg-[#151515] border border-[#303030] p-5 rounded-lg shadow-xl flex flex-col items-center gap-2.5 text-center max-w-xs">
            <div className="w-6 h-6 border-2 border-[#A0A0A0] border-t-transparent rounded-full animate-spin" />
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-[#E6E6E6] uppercase tracking-wider block">
                {loadingStep === 'loading_earth' && 'INITIALIZING WGS84 GLOBE...'}
                {loadingStep === 'loading_terrain' && 'LOADING 3D TERRAIN ELEVATION...'}
                {loadingStep === 'loading_imagery' && 'STREAMING SATELLITE TILES...'}
              </span>
              <p className="text-[10px] text-[#707070]">
                Geographic coordinates & ellipsoid geometry
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Regional Presets Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#151515]/95 border border-[#303030] p-1 rounded-md shadow-lg max-w-[calc(100vw-340px)] overflow-x-auto text-[10px]">
        <div className="flex items-center gap-1 text-[#707070] px-2 font-bold uppercase border-r border-[#303030]">
          <Navigation className="w-3 h-3 text-[#A0A0A0]" />
          <span>FLY:</span>
        </div>
        {REGIONAL_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleFlyToPreset(preset.center, preset.zoom, preset.pitch)}
            className="px-2 py-0.5 rounded hover:bg-[#202020] text-[#A0A0A0] hover:text-[#E6E6E6] transition-colors whitespace-nowrap"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* 3D Earth Controls Panel */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-[#151515]/95 border border-[#303030] p-2 rounded-md shadow-lg w-40 text-xs">
        <span className="text-[9px] font-bold text-[#707070] uppercase tracking-wider px-1">
          GLOBE CONTROLS
        </span>

        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              onClick={() => setImageryType('satellite')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'satellite' ? 'bg-[#2563eb] text-white font-bold' : 'text-[#A0A0A0] hover:bg-[#202020]'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setImageryType('hybrid')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'hybrid' ? 'bg-[#2563eb] text-white font-bold' : 'text-[#A0A0A0] hover:bg-[#202020]'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setImageryType('terrain')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'terrain' ? 'bg-[#2563eb] text-white font-bold' : 'text-[#A0A0A0] hover:bg-[#202020]'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setImageryType('default')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'default' ? 'bg-[#2563eb] text-white font-bold' : 'text-[#A0A0A0] hover:bg-[#202020]'
              }`}
            >
              Dark Grid
            </button>
          </div>
        </div>

        <button
          onClick={() => setTerrainElevationEnabled(!terrainElevationEnabled)}
          className="flex items-center justify-between p-1 rounded bg-[#1C1C1C] border border-[#303030] text-[10px] hover:bg-[#242424] transition-colors"
        >
          <span className="flex items-center gap-1 text-[#A0A0A0]">
            <Mountain className="w-3 h-3 text-[#A0A0A0]" />
            <span>3D Elevation</span>
          </span>
          <span className={`font-bold ${terrainElevationEnabled ? 'text-[#16a34a]' : 'text-[#707070]'}`}>
            {terrainElevationEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="flex items-center justify-between p-1 rounded bg-[#1C1C1C] border border-[#303030] text-[10px] hover:bg-[#242424] transition-colors"
        >
          <span className="flex items-center gap-1 text-[#A0A0A0]">
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>Auto Orbit</span>
          </span>
          <span className={`font-bold ${isAutoRotating ? 'text-[#d97706]' : 'text-[#707070]'}`}>
            {isAutoRotating ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1 p-1 rounded bg-[#202020] hover:bg-[#282828] text-[#A0A0A0] hover:text-[#E6E6E6] text-[10px] transition-colors"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset Global</span>
        </button>
      </div>

      {/* Telemetry Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-[#151515]/95 border border-[#303030] px-3 py-1.5 rounded-md shadow-md text-xs">
        <div className="flex items-center gap-1 text-[#E6E6E6] font-bold text-[10px]">
          <Globe className="w-3 h-3 text-[#A0A0A0]" />
          <span>WGS84 GLOBE</span>
        </div>
        <span className="text-[#303030]">|</span>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-[#707070]">COORDS:</span>
          <span className="text-[#E6E6E6] font-mono">
            {cursorCoords
              ? `${Math.abs(cursorCoords.lat)}°${cursorCoords.lat >= 0 ? 'N' : 'S'}, ${Math.abs(cursorCoords.lng)}°${cursorCoords.lng >= 0 ? 'E' : 'W'}`
              : 'Hover to inspect'}
          </span>
        </div>
        <span className="text-[#303030]">|</span>

        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-[#707070]">ALT:</span>
          <span className="text-[#E6E6E6] font-mono">{cameraAltitudeKm.toLocaleString()} km</span>
        </div>
      </div>
    </div>
  );
};
