import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CrisisEvent, CrisisCategory } from '../types/crisis';
import { 
  Compass, 
  RotateCcw, 
  Play, 
  Pause, 
  Layers, 
  Eye, 
  Maximize2, 
  Sparkles, 
  Navigation,
  Globe,
  MapPin,
  Mountain,
  Map as MapIcon
} from 'lucide-react';
import { MaritimeVessel, MilitaryFlight, ThermalSensorEvent } from '../types/recon';

interface RealEarthGlobeViewProps {
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
  searchFlyToTarget?: { lat: number; lng: number; zoom?: number } | null;
  reconTelemetry?: {
    vessels?: MaritimeVessel[];
    flights?: MilitaryFlight[];
    thermalEvents?: ThermalSensorEvent[];
    activeLayers: {
      ais: boolean;
      adsb: boolean;
      firms: boolean;
    };
  };
}

export type EarthImageryType = 'satellite' | 'hybrid' | 'terrain' | 'default';

// Regional Camera Presets (Geographic coordinates: [lng, lat, zoom, pitch])
const REGIONAL_PRESETS: { name: string; center: [number, number]; zoom: number; pitch: number }[] = [
  { name: 'GLOBAL', center: [20.0, 15.0], zoom: 1.5, pitch: 0 },
  { name: 'SOUTH ASIA', center: [78.9629, 22.5937], zoom: 3.8, pitch: 40 },
  { name: 'MIDDLE EAST', center: [45.0792, 26.8206], zoom: 3.8, pitch: 35 },
  { name: 'EUROPE', center: [15.2551, 50.5260], zoom: 3.6, pitch: 30 },
  { name: 'EAST ASIA', center: [116.4074, 34.0000], zoom: 3.5, pitch: 35 },
  { name: 'SOUTHEAST ASIA', center: [106.8456, 4.2105], zoom: 3.8, pitch: 30 },
  { name: 'NORTH AMERICA', center: [-98.5795, 39.8283], zoom: 3.2, pitch: 25 },
  { name: 'SOUTH AMERICA', center: [-58.3816, -15.6037], zoom: 3.2, pitch: 25 },
  { name: 'AFRICA', center: [21.7587, 4.0383], zoom: 3.2, pitch: 20 },
  { name: 'OCEANIA', center: [133.7751, -25.2744], zoom: 3.5, pitch: 25 },
  { name: 'ARCTIC', center: [0.0, 85.0], zoom: 2.5, pitch: 45 },
  { name: 'ANTARCTIC', center: [0.0, -82.0], zoom: 2.5, pitch: 45 },
];

const CATEGORY_COLORS: Record<CrisisCategory, string> = {
  military: '#ef4444',
  conflict: '#ef4444',
  security: '#ef4444',
  economic: '#3b82f6',
  financial: '#06b6d4',
  political: '#a855f7',
  diplomatic: '#a855f7',
  humanitarian: '#f59e0b',
  energy: '#64748b',
  environmental: '#10b981',
};

export const RealEarthGlobeView: React.FC<RealEarthGlobeViewProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onSelectCountry,
  layerFilters,
  searchFlyToTarget,
  reconTelemetry,
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
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [cameraAltitudeKm, setCameraAltitudeKm] = useState<number>(12000);

  // Initialize MapLibre 3D WGS84 Globe
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (typeof window !== 'undefined') {
      try {
        const workerUrl = new URL('/maplibre-gl-worker.mjs', window.location.origin).href;
        maplibregl.setWorkerUrl(workerUrl);
      } catch {
        maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
      }
    }

    setLoadingStep('loading_earth');

    // Define Base Geographic Style with WGS84 Globe projection
    const initialStyle: maplibregl.StyleSpecification = {
      version: 8,
      projection: {
        type: 'globe', // True 3D WGS84 Earth Ellipsoid
      },
      sky: {
        'atmosphere-blend': 0.8,
      },
      sources: {
        // Satellite Imagery Source (Esri World Imagery)
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Esri, Maxar, Earthstar Geographics',
          maxzoom: 19,
        },
        // Real Terrain DEM Elevation Tiles (MapLibre Demo Tiles)
        'terrain-dem': {
          type: 'raster-dem',
          tiles: [
            'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          encoding: 'mapbox',
          maxzoom: 12,
        },
        // Hybrid Labels and Borders
        'carto-labels': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
          ],
          tileSize: 256,
          maxzoom: 19,
        },
        // Tactical Vector Boundaries (Carto Dark)
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO',
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
          paint: { 'raster-opacity': 0.9 },
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [30.0, 20.0],
      zoom: 1.8,
      pitch: 35,
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    // Gracefully handle MapLibre worker or tile load events
    map.on('error', (e) => {
      // Diagnostic logging without throwing unhandled exceptions
      console.warn('MapLibre diagnostic note:', e?.error?.message || e);
    });

    // Add Metric Geographic Scale Control
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: 'metric',
      }),
      'bottom-right'
    );

    // Track Cursor Geographic Coordinates & Altitude
    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: parseFloat(e.lngLat.lat.toFixed(4)),
        lng: parseFloat(e.lngLat.lng.toFixed(4)),
      });
    });

    map.on('zoom', () => {
      const z = map.getZoom();
      // Approximate camera distance in kilometers
      const alt = Math.round(40000 / Math.pow(2, z));
      setCameraAltitudeKm(Math.max(10, alt));
    });

    // Handle Style and Terrain Loading Pipeline
    map.on('load', () => {
      setLoadingStep('loading_terrain');
      try {
        // Enable True 3D Terrain Elevation
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.6 });
      } catch (err) {
        console.warn('Terrain initialization notice:', err);
      }

      setLoadingStep('loading_imagery');
      setTimeout(() => {
        setLoadingStep('ready');
      }, 500);
    });

    const fallbackSafetyTimer = setTimeout(() => {
      setLoadingStep('ready');
    }, 1800);

    return () => {
      clearTimeout(fallbackSafetyTimer);
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

    // Toggle 3D Terrain
    try {
      if (terrainElevationEnabled) {
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.6 });
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
        map.setCenter([center.lng - 0.15, center.lat]);
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

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Filter events by layer toggles
    const visibleEvents = events.filter((ev) => {
      if (ev.category === 'military' && !layerFilters.conflictZones) return false;
      if (ev.category === 'economic' && !layerFilters.economicStress) return false;
      if (ev.category === 'political' && !layerFilters.diplomaticHotspots) return false;
      return true;
    });

    visibleEvents.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const catColor = CATEGORY_COLORS[ev.category] || '#ef4444';

      // Create Custom DOM Element attached to WGS84 Geographic Coordinates
      const el = document.createElement('div');
      el.className = 'crisis-geographic-marker group cursor-pointer relative';
      el.style.transform = 'translate(-50%, -50%)';

      // Radar pulse ring for active crises
      if (layerFilters.pulses && (ev.status === 'active' || ev.status === 'escalating')) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-2.5 rounded-full animate-ping pointer-events-none';
        pulse.style.backgroundColor = catColor;
        pulse.style.opacity = '0.7';
        el.appendChild(pulse);
      }

      // Pin Head
      const pin = document.createElement('div');
      pin.className = `relative z-10 flex items-center justify-center rounded-full text-white font-mono font-bold transition-all ${
        isSelected ? 'w-7 h-7 ring-2 ring-white scale-125' : 'w-5 h-5 hover:scale-125'
      }`;
      pin.style.backgroundColor = catColor;
      pin.style.boxShadow = `0 0 10px ${catColor}`;
      pin.innerHTML = `<span style="font-size: 9px;">${ev.riskIndicator >= 0.8 ? '!' : Math.round(ev.riskIndicator * 10)}</span>`;
      el.appendChild(pin);

      // Tooltip Element
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-50 pointer-events-none bg-slate-950/95 border border-slate-700 px-2.5 py-1 rounded shadow-2xl text-[10px] text-slate-100 whitespace-nowrap font-mono';
      tooltip.innerHTML = `<strong style="color: #38bdf8;">${ev.country}:</strong> ${ev.title}`;
      el.appendChild(tooltip);

      // Click Event
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(ev);
        if (onSelectCountry && ev.countryCode) {
          onSelectCountry(ev.countryCode);
        }
      });

      // Add to MapLibre on real geographic [lng, lat]
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ev.longitude, ev.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Render AIS Maritime Vessels
    if (reconTelemetry?.activeLayers.ais && reconTelemetry.vessels) {
      reconTelemetry.vessels.forEach((vessel) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';
        el.style.transform = 'translate(-50%, -50%)';

        const pin = document.createElement('div');
        pin.className = `flex items-center justify-center rounded-full text-[10px] shadow-lg transition-transform hover:scale-125 ${
          vessel.status === 'high_risk_zone'
            ? 'w-5 h-5 bg-cyan-500 border border-red-400 text-slate-900 ring-2 ring-red-500 animate-pulse'
            : 'w-4 h-4 bg-cyan-600 border border-cyan-300 text-slate-900'
        }`;
        pin.innerHTML = '⚓';
        el.appendChild(pin);

        const tooltip = document.createElement('div');
        tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none bg-slate-950/95 border border-cyan-500 px-2 py-1 rounded shadow-xl text-[9px] text-cyan-300 whitespace-nowrap font-mono';
        tooltip.innerHTML = `<strong>${vessel.name}</strong> (${vessel.speedKnots} kts)<br/>${vessel.chokepointLabel} · ${vessel.cargo}`;
        el.appendChild(tooltip);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([vessel.lng, vessel.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Render ADS-B Military & Recon Flights
    if (reconTelemetry?.activeLayers.adsb && reconTelemetry.flights) {
      reconTelemetry.flights.forEach((flight) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';
        el.style.transform = 'translate(-50%, -50%)';

        const pin = document.createElement('div');
        pin.className = 'w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 border border-blue-300 text-white text-[10px] shadow-lg transition-transform hover:scale-125';
        pin.innerHTML = '✈';
        pin.style.transform = `rotate(${flight.headingDeg - 90}deg)`;
        el.appendChild(pin);

        const tooltip = document.createElement('div');
        tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none bg-slate-950/95 border border-blue-500 px-2 py-1 rounded shadow-xl text-[9px] text-blue-300 whitespace-nowrap font-mono';
        tooltip.innerHTML = `<strong>${flight.callsign}</strong> (${flight.modelCode})<br/>${flight.altitudeFt.toLocaleString()} FT · ${flight.mission}`;
        el.appendChild(tooltip);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([flight.lng, flight.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Render NASA FIRMS Thermal Sensor Hotspots
    if (reconTelemetry?.activeLayers.firms && reconTelemetry.thermalEvents) {
      reconTelemetry.thermalEvents.forEach((thermal) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';
        el.style.transform = 'translate(-50%, -50%)';

        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-2 rounded-full bg-orange-500 animate-ping opacity-75 pointer-events-none';
        el.appendChild(pulse);

        const pin = document.createElement('div');
        pin.className = 'relative z-10 w-4 h-4 flex items-center justify-center rounded-full bg-orange-600 border border-yellow-300 text-white text-[9px] shadow-md';
        pin.innerHTML = '🔥';
        el.appendChild(pin);

        const tooltip = document.createElement('div');
        tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none bg-slate-950/95 border border-orange-500 px-2 py-1 rounded shadow-xl text-[9px] text-orange-300 whitespace-nowrap font-mono';
        tooltip.innerHTML = `<strong>${thermal.theater}</strong>: ${thermal.brightnessMw} MW<br/>${thermal.classification.replace('_', ' ').toUpperCase()} (${thermal.sensor})`;
        el.appendChild(tooltip);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([thermal.lng, thermal.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [events, selectedEvent, layerFilters, reconTelemetry]);

  // Smooth Fly-To when an Event or Search Target is Selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (searchFlyToTarget) {
      map.flyTo({
        center: [searchFlyToTarget.lng, searchFlyToTarget.lat],
        zoom: searchFlyToTarget.zoom || 4.5,
        pitch: 45,
        essential: true,
        duration: 2200,
      });
      return;
    }

    if (selectedEvent) {
      map.flyTo({
        center: [selectedEvent.longitude, selectedEvent.latitude],
        zoom: selectedEvent.severity === 'critical' ? 5.5 : 4.5,
        pitch: 45,
        essential: true,
        duration: 2000,
      });
    }
  }, [selectedEvent, searchFlyToTarget]);

  // Fly to Region Preset
  const handleFlyToPreset = (center: [number, number], zoom: number, pitch: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center,
      zoom,
      pitch,
      essential: true,
      duration: 2000,
    });
  };

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [20.0, 15.0],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      duration: 1800,
    });
    setIsAutoRotating(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-mono select-none">
      {/* 3D WebGL Geographic Globe Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading State Overlay */}
      {loadingStep !== 'ready' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider block">
                {loadingStep === 'loading_earth' && 'LOADING EARTH GEOMETRY (WGS84)...'}
                {loadingStep === 'loading_terrain' && 'LOADING 3D TERRAIN ELEVATION TILES...'}
                {loadingStep === 'loading_imagery' && 'STREAMING SATELLITE IMAGERY...'}
              </span>
              <p className="text-[11px] text-slate-400">
                Initializing geographic coordinates & level-of-detail tiles
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Left: Regional Flight Navigation Presets Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-2xl max-w-[calc(100vw-340px)] overflow-x-auto text-[10px]">
        <div className="flex items-center gap-1 text-slate-400 px-2 font-bold uppercase border-r border-slate-800">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>FLY TO:</span>
        </div>
        {REGIONAL_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleFlyToPreset(preset.center, preset.zoom, preset.pitch)}
            className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Top Right: Geographic Camera & Layer Control HUD */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-2xl w-44">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          3D EARTH CONTROLS
        </span>

        {/* Imagery Type Switcher */}
        <div className="space-y-1">
          <span className="text-[9px] text-slate-500 uppercase">Imagery Mode:</span>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              onClick={() => setImageryType('satellite')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'satellite' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setImageryType('hybrid')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'hybrid' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setImageryType('terrain')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'terrain' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setImageryType('default')}
              className={`p-1 rounded text-center transition-colors ${
                imageryType === 'default' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Default
            </button>
          </div>
        </div>

        {/* 3D Real Elevation Terrain Toggle */}
        <button
          onClick={() => setTerrainElevationEnabled(!terrainElevationEnabled)}
          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-slate-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D Elevation</span>
          </span>
          <span className={`text-[10px] font-bold ${terrainElevationEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {terrainElevationEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Auto Orbit Toggle (Optional, off by default) */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-slate-300">
            {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>Auto Rotate</span>
          </span>
          <span className={`text-[10px] font-bold ${isAutoRotating ? 'text-amber-400' : 'text-slate-500'}`}>
            {isAutoRotating ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Reset Camera to Global View */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Global</span>
        </button>
      </div>

      {/* Bottom Left: Geographic Telemetry Overlay (Coordinates, Altitude, Live Status) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 px-3.5 py-2 rounded-xl shadow-xl text-xs">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Globe className="w-4 h-4 animate-spin-slow" />
          <span>WGS84 3D GLOBE</span>
        </div>
        <span className="text-slate-600">|</span>

        {/* Live Cursor Geographic Coordinates */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-slate-500 text-[11px]">COORDS:</span>
          <span className="text-slate-200 font-mono">
            {cursorCoords
              ? `${Math.abs(cursorCoords.lat)}° ${cursorCoords.lat >= 0 ? 'N' : 'S'}, ${Math.abs(cursorCoords.lng)}° ${cursorCoords.lng >= 0 ? 'E' : 'W'}`
              : 'Hover to inspect'}
          </span>
        </div>
        <span className="text-slate-600">|</span>

        {/* Camera Elevation / Altitude */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <span>ALTITUDE:</span>
          <span className="text-slate-200 font-bold font-mono">
            {cameraAltitudeKm.toLocaleString()} km
          </span>
        </div>
        <span className="text-slate-600">|</span>

        {/* Live Telemetry Indicator */}
        <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE ●</span>
        </div>
      </div>
    </div>
  );
};
