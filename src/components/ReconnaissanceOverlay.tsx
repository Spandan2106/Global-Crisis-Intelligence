import React, { useState } from 'react';
import { 
  Ship, 
  Plane, 
  Flame, 
  Eye, 
  EyeOff, 
  Crosshair, 
  Radio, 
  Layers, 
  Navigation, 
  ChevronRight, 
  AlertTriangle,
  Compass,
  Gauge
} from 'lucide-react';
import { 
  MaritimeVessel, 
  MilitaryFlight, 
  ThermalSensorEvent, 
  ChokepointId 
} from '../types/recon';
import { soundFx } from '../services/soundFxService';

interface ReconnaissanceOverlayProps {
  vessels: MaritimeVessel[];
  flights: MilitaryFlight[];
  thermalEvents: ThermalSensorEvent[];
  activeLayers: {
    ais: boolean;
    adsb: boolean;
    firms: boolean;
  };
  onToggleLayer: (layer: 'ais' | 'adsb' | 'firms') => void;
  onFocusEntity: (coords: { lat: number; lng: number; zoom?: number }, label?: string) => void;
}

export const ReconnaissanceOverlay: React.FC<ReconnaissanceOverlayProps> = ({
  vessels,
  flights,
  thermalEvents,
  activeLayers,
  onToggleLayer,
  onFocusEntity,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'ais' | 'adsb' | 'firms'>('ais');
  const [chokepointFilter, setChokepointFilter] = useState<string>('all');
  const [inspectedVessel, setInspectedVessel] = useState<MaritimeVessel | null>(null);
  const [inspectedFlight, setInspectedFlight] = useState<MilitaryFlight | null>(null);
  const [inspectedThermal, setInspectedThermal] = useState<ThermalSensorEvent | null>(null);

  const filteredVessels = chokepointFilter === 'all'
    ? vessels
    : vessels.filter(v => v.chokepoint === chokepointFilter);

  return (
    <>
      {/* Floating Tactical Recon Dock (bottom left corner of the Map / Earth Globe) */}
      <div className="absolute bottom-16 left-4 z-20 font-mono text-xs select-none">
        {!isExpanded ? (
          /* Collapsed Pill Button */
          <button
            onClick={() => {
              soundFx.playRadarPing();
              setIsExpanded(true);
            }}
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800/95 border border-cyan-500/60 shadow-xl shadow-cyan-950/40 text-cyan-300 px-3 py-2 rounded-xl backdrop-blur-md transition-all hover:scale-105"
            title="Open Live Reconnaissance & Telemetry Overlays"
          >
            <div className="relative">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-1" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[11px] tracking-wider text-slate-100 flex items-center gap-1.5">
                LIVE RECON TELEMETRY
                <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1 py-0.2 rounded border border-cyan-800">
                  ONLINE
                </span>
              </span>
              <span className="text-[9px] text-slate-400">
                AIS: {vessels.length} · ADS-B: {flights.length} · FIRMS: {thermalEvents.length}
              </span>
            </div>
          </button>
        ) : (
          /* Expanded Tactical Telemetry Window */
          <div className="w-80 sm:w-96 bg-slate-950/95 border border-cyan-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-[460px]">
            {/* Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-100 tracking-wider text-xs">
                  SATELLITE & TACTICAL FEEDS
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Quick Layer Visibility Switches */}
            <div className="grid grid-cols-3 gap-1 p-2 bg-slate-900/50 border-b border-slate-800">
              <button
                onClick={() => {
                  soundFx.playHudBeep(1200);
                  onToggleLayer('ais');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                  activeLayers.ais
                    ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Ship className="w-3 h-3" />
                <span>AIS ({vessels.length})</span>
                {activeLayers.ais ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              </button>

              <button
                onClick={() => {
                  soundFx.playHudBeep(1300);
                  onToggleLayer('adsb');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                  activeLayers.adsb
                    ? 'bg-blue-950/80 border-blue-500/80 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Plane className="w-3 h-3" />
                <span>ADS-B ({flights.length})</span>
                {activeLayers.adsb ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              </button>

              <button
                onClick={() => {
                  soundFx.playHudBeep(1400);
                  onToggleLayer('firms');
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                  activeLayers.firms
                    ? 'bg-orange-950/80 border-orange-500/80 text-orange-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>FIRMS ({thermalEvents.length})</span>
                {activeLayers.firms ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950">
              <button
                onClick={() => setSelectedTab('ais')}
                className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors ${
                  selectedTab === 'ais'
                    ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                AIS VESSELS
              </button>
              <button
                onClick={() => setSelectedTab('adsb')}
                className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors ${
                  selectedTab === 'adsb'
                    ? 'border-blue-400 text-blue-300 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                MILITARY FLIGHTS
              </button>
              <button
                onClick={() => setSelectedTab('firms')}
                className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors ${
                  selectedTab === 'firms'
                    ? 'border-orange-400 text-orange-300 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                FIRMS THERMAL
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {/* TAB 1: AIS MARITIME VESSELS */}
              {selectedTab === 'ais' && (
                <>
                  {/* Chokepoint filter */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                    {['all', 'hormuz', 'bab_el_mandeb', 'taiwan_strait', 'suez'].map((cp) => (
                      <button
                        key={cp}
                        onClick={() => setChokepointFilter(cp)}
                        className={`px-2 py-0.5 rounded uppercase font-bold whitespace-nowrap ${
                          chokepointFilter === cp
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {cp.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  {filteredVessels.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setInspectedVessel(v)}
                      className="p-2 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <Ship className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="truncate max-w-[170px]">{v.name}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          v.status === 'high_risk_zone'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : v.status === 'diverting'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {v.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{v.flag} · {v.speedKnots} kts ({v.headingDeg}°)</span>
                        <span className="text-cyan-400">{v.chokepointLabel}</span>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                        <span className="text-slate-400 truncate max-w-[190px]">Dest: {v.destination}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playRadarPing();
                            onFocusEntity({ lat: v.lat, lng: v.lng, zoom: 8.5 }, v.name);
                          }}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold ml-1"
                        >
                          <Crosshair className="w-2.5 h-2.5" />
                          <span>TRACK</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* TAB 2: ADS-B MILITARY & RECON FLIGHTS */}
              {selectedTab === 'adsb' && (
                <>
                  {flights.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setInspectedFlight(f)}
                      className="p-2 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-blue-300">
                          <Plane className="w-3.5 h-3.5 text-blue-400" />
                          <span>{f.callsign}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({f.modelCode})</span>
                        </div>
                        <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded font-bold">
                          {f.altitudeFt.toLocaleString()} FT
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 mt-1">
                        <strong className="text-slate-100">{f.aircraftType}</strong> · {f.operator}
                      </div>

                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {f.mission}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                        <span className="text-slate-400">Area: {f.patrolArea.split('/')[0]}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playRadarPing();
                            onFocusEntity({ lat: f.lat, lng: f.lng, zoom: 7.5 }, f.callsign);
                          }}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold ml-1"
                        >
                          <Crosshair className="w-2.5 h-2.5" />
                          <span>TRACK</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* TAB 3: NASA FIRMS THERMAL SENSORS */}
              {selectedTab === 'firms' && (
                <>
                  <div className="text-[10px] text-orange-400/90 bg-orange-950/40 border border-orange-800/60 p-1.5 rounded mb-1">
                    NASA VIIRS / NOAA Infrared Detections (Last 12H Satellite Swath)
                  </div>
                  {thermalEvents.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setInspectedThermal(t)}
                      className="p-2 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-orange-400">
                          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                          <span>{t.theater}</span>
                        </div>
                        <span className="text-[9px] bg-orange-950 text-orange-300 border border-orange-800 px-1.5 py-0.5 rounded font-bold">
                          {t.brightnessMw} MW
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                        <span className="uppercase text-slate-400">{t.classification.replace('_', ' ')}</span>
                        <span className="text-emerald-400 font-bold text-[9px]">{t.confidence}</span>
                      </div>

                      <div className="text-[9px] text-slate-400 mt-0.5">
                        Near {t.nearestCity} · Sensor: {t.sensor}
                      </div>

                      <div className="mt-1.5 flex items-center justify-end pt-1 border-t border-slate-800/60 text-[10px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playRadarPing();
                            onFocusEntity({ lat: t.lat, lng: t.lng, zoom: 9.0 }, t.theater);
                          }}
                          className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-bold"
                        >
                          <Crosshair className="w-2.5 h-2.5" />
                          <span>FLY TO STRIKE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Entity Modal (When clicked) */}
      {inspectedVessel && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500 rounded-2xl w-full max-w-md p-4 text-xs font-mono text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white">{inspectedVessel.name}</span>
              </div>
              <button 
                onClick={() => setInspectedVessel(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded">
                <div>
                  <span className="text-slate-400 text-[10px] block">Flag & Registration:</span>
                  <span className="font-bold">{inspectedVessel.flag}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Vessel Type:</span>
                  <span className="font-bold uppercase text-cyan-400">{inspectedVessel.type.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2 rounded text-center">
                <div>
                  <span className="text-slate-400 text-[10px] block">Speed:</span>
                  <span className="font-bold">{inspectedVessel.speedKnots} kts</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Heading:</span>
                  <span className="font-bold">{inspectedVessel.headingDeg}°</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">DWT:</span>
                  <span className="font-bold">{inspectedVessel.deadweightTons.toLocaleString()} t</span>
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded">
                <span className="text-slate-400 text-[10px] block">Reported Cargo:</span>
                <span className="font-bold text-amber-300">{inspectedVessel.cargo}</span>
              </div>

              <div className="bg-slate-900 p-2 rounded">
                <span className="text-slate-400 text-[10px] block">Destination & ETA:</span>
                <span className="font-bold text-slate-100">{inspectedVessel.destination} (ETA: {inspectedVessel.eta})</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  soundFx.playRadarPing();
                  onFocusEntity({ lat: inspectedVessel.lat, lng: inspectedVessel.lng, zoom: 8.5 }, inspectedVessel.name);
                  setInspectedVessel(null);
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>LOCK SATELLITE CAMERA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {inspectedFlight && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-blue-500 rounded-2xl w-full max-w-md p-4 text-xs font-mono text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm text-white">{inspectedFlight.callsign}</span>
              </div>
              <button 
                onClick={() => setInspectedFlight(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="bg-slate-900 p-2 rounded">
                <span className="text-slate-400 text-[10px] block">Aircraft & Operator:</span>
                <span className="font-bold text-slate-100">{inspectedFlight.aircraftType} ({inspectedFlight.modelCode})</span>
                <span className="text-blue-400 block text-[11px]">{inspectedFlight.operator}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2 rounded text-center">
                <div>
                  <span className="text-slate-400 text-[10px] block">Altitude:</span>
                  <span className="font-bold">{inspectedFlight.altitudeFt.toLocaleString()} ft</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Speed:</span>
                  <span className="font-bold">{inspectedFlight.speedKnots} kts</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Squawk:</span>
                  <span className="font-bold text-amber-400">{inspectedFlight.squawk}</span>
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded">
                <span className="text-slate-400 text-[10px] block">Operational Mission:</span>
                <span className="font-bold text-emerald-300">{inspectedFlight.mission}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  soundFx.playRadarPing();
                  onFocusEntity({ lat: inspectedFlight.lat, lng: inspectedFlight.lng, zoom: 7.5 }, inspectedFlight.callsign);
                  setInspectedFlight(null);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>FOLLOW FLIGHT PATH</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
