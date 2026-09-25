import React, { useState } from 'react';
import { 
  Globe2, 
  Tv, 
  Network, 
  TrendingUp, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Flame,
  Radio,
  RefreshCw,
  Sliders,
  Play
} from 'lucide-react';
import { CrisisEvent } from '../types/crisis';
import { RealEarthGlobeView } from './RealEarthGlobeView';
import { GoogleEarthView } from './GoogleEarthView';
import { CrisisNetworkView } from './CrisisNetworkView';
import { MarketDashboard } from './MarketDashboard';
import { soundFx } from '../services/soundFxService';

interface CommandCenterWarRoomProps {
  events: CrisisEvent[];
  selectedEvent: CrisisEvent | null;
  onSelectEvent: (event: CrisisEvent) => void;
  earthMode: 'map' | 'earth';
  onToggleEarthMode: (mode: 'map' | 'earth') => void;
  onExitWarRoom: () => void;
}

interface VideoFeed {
  id: string;
  name: string;
  source: string;
  youtubeId?: string;
  embedUrl?: string;
  directUrl: string;
  region: string;
  badge: string;
}

const OSINT_VIDEO_FEEDS: VideoFeed[] = [
  {
    id: 'feed-aljazeera',
    name: 'Al Jazeera English Live',
    source: 'Al Jazeera',
    youtubeId: 'bNyUyrR0PHo', // Official continuous live stream
    embedUrl: 'https://www.youtube-nocookie.com/embed/bNyUyrR0PHo?autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=bNyUyrR0PHo',
    region: 'Middle East & Global Wire',
    badge: 'LIVE 24/7',
  },
  {
    id: 'feed-dw-news',
    name: 'DW News Global Live (English)',
    source: 'Deutsche Welle (DW)',
    youtubeId: 'Lu_Te_qkm8o',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Lu_Te_qkm8o?autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=Lu_Te_qkm8o',
    region: 'European Union & Geopolitics',
    badge: 'FREE STREAM',
  },
  {
    id: 'feed-france24-en',
    name: 'France 24 English 24/7 Live',
    source: 'France 24',
    youtubeId: 'h3MuIUNCCzI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/h3MuIUNCCzI?autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=h3MuIUNCCzI',
    region: 'International & Global South',
    badge: 'FREE STREAM',
  },
  {
    id: 'feed-un-web-tv',
    name: 'UN Web TV / Security Council Live',
    source: 'United Nations',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC5O114-PQNYkurlTg6hekZw&autoplay=1&mute=1',
    directUrl: 'https://webtv.un.org/en',
    region: 'UNHQ Diplomatic & Humanitarian Sessions',
    badge: 'UN DIPLOMACY',
  },
  {
    id: 'feed-euronews-live',
    name: 'Euronews Live Wire (English)',
    source: 'Euronews',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCSrZ3UV4jMrRg5505w4U53A&autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=pykdAU3i8DQ',
    region: 'Pan-European & Eastern Flank',
    badge: '24/7 WIRE',
  },
  {
    id: 'feed-nasa-live',
    name: 'NASA TV Live Earth & ISS Feed',
    source: 'NASA / Space Recon',
    youtubeId: '21X5lGlDOfg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/21X5lGlDOfg?autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=21X5lGlDOfg',
    region: 'Global Satellite Surveillance & Orbit',
    badge: 'SATELLITE ORBIT',
  },
  {
    id: 'feed-sky-news',
    name: 'Sky News UK 24/7 Live Desk',
    source: 'Sky News UK',
    youtubeId: '9Auq9mYxFEE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9Auq9mYxFEE?autoplay=1&mute=1',
    directUrl: 'https://www.youtube.com/watch?v=9Auq9mYxFEE',
    region: 'UK & Global Breaking Desk',
    badge: 'NEWS DESK',
  },
];

export const CommandCenterWarRoom: React.FC<CommandCenterWarRoomProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  earthMode,
  onToggleEarthMode,
  onExitWarRoom,
}) => {
  const [activeVideoFeed, setActiveVideoFeed] = useState<VideoFeed>(OSINT_VIDEO_FEEDS[0]);
  const [expandedQuadrant, setExpandedQuadrant] = useState<'TL' | 'TR' | 'BL' | 'BR' | null>(null);

  const toggleExpand = (quadrant: 'TL' | 'TR' | 'BL' | 'BR') => {
    soundFx.playHudBeep(1200);
    setExpandedQuadrant(prev => (prev === quadrant ? null : quadrant));
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top War Room Control Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between font-mono text-xs z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="tracking-widest uppercase">WAR ROOM // 4-QUADRANT COMMAND WALL</span>
          </div>
          <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
            OPERATIONAL SITUATION ROOM
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>ACTIVE FEEDS: 4</span>
            <span>·</span>
            <span>CRITICAL CONFLICTS: {events.filter(e => e.severity === 'critical').length}</span>
          </div>

          <button
            onClick={() => {
              soundFx.playHudBeep();
              onExitWarRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded font-bold transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>EXIT WAR ROOM</span>
          </button>
        </div>
      </div>

      {/* 4-Quadrant Grid Viewport Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-1 p-1 bg-black overflow-hidden relative">
        {/* QUADRANT 1 (TOP-LEFT): 3D EARTH / GEOGRAPHIC GLOBE */}
        <div className={`relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col transition-all ${
          expandedQuadrant === 'TL' ? 'absolute inset-1 z-40' : expandedQuadrant ? 'hidden' : ''
        }`}>
          {/* Header */}
          <div className="h-8 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between font-mono text-[11px] z-10">
            <div className="flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-slate-200">Q1 // GEOGRAPHIC SURVEILLANCE ({earthMode.toUpperCase()})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleEarthMode(earthMode === 'earth' ? 'map' : 'earth')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700"
              >
                TOGGLE {earthMode === 'earth' ? '2D MAP' : '3D EARTH'}
              </button>
              <button
                onClick={() => toggleExpand('TL')}
                className="p-1 text-slate-400 hover:text-white"
                title="Expand / Restore"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Map/Globe Viewport */}
          <div className="flex-1 relative overflow-hidden">
            {earthMode === 'earth' ? (
              <RealEarthGlobeView
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={onSelectEvent}
                layerFilters={{
                  conflictZones: true,
                  economicStress: true,
                  diplomaticHotspots: true,
                  pulses: true,
                  countryBorders: true,
                  heatmaps: true,
                }}
              />
            ) : (
              <GoogleEarthView
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={onSelectEvent}
                layerFilters={{
                  conflictZones: true,
                  economicStress: true,
                  diplomaticHotspots: true,
                  pulses: true,
                  countryBorders: true,
                  heatmaps: true,
                }}
              />
            )}
          </div>
        </div>

        {/* QUADRANT 2 (TOP-RIGHT): LIVE STREAMING OSINT VIDEO WIRE */}
        <div className={`relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col transition-all ${
          expandedQuadrant === 'TR' ? 'absolute inset-1 z-40' : expandedQuadrant ? 'hidden' : ''
        }`}>
          {/* Header */}
          <div className="h-8 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between font-mono text-[11px] z-10">
            <div className="flex items-center gap-2">
              <Tv className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="font-bold text-slate-200">Q2 // LIVE OSINT VIDEO STREAM</span>
              <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1 py-0.2 rounded font-bold uppercase">
                BROADCAST
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Channel Selector */}
              <select
                value={activeVideoFeed.id}
                onChange={(e) => {
                  const feed = OSINT_VIDEO_FEEDS.find(f => f.id === e.target.value);
                  if (feed) {
                    soundFx.playHudBeep(1400);
                    setActiveVideoFeed(feed);
                  }
                }}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-[10px] rounded px-2 py-0.5 focus:outline-none"
              >
                {OSINT_VIDEO_FEEDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.source})
                  </option>
                ))}
              </select>

              <button
                onClick={() => toggleExpand('TR')}
                className="p-1 text-slate-400 hover:text-white"
                title="Expand / Restore"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* YouTube Live Player Embed with Fallback Action Bar */}
          <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
            <iframe
              key={activeVideoFeed.id}
              src={activeVideoFeed.embedUrl || `https://www.youtube-nocookie.com/embed/${activeVideoFeed.youtubeId}?autoplay=1&mute=1`}
              title={activeVideoFeed.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Live Telemetry Overlay Ribbon on Video */}
            <div className="absolute top-2 left-2 z-10 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded border border-red-500/60 flex items-center gap-2 text-[10px] font-mono text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{activeVideoFeed.name}</span>
              <span className="text-slate-400">· {activeVideoFeed.region}</span>
              <a
                href={activeVideoFeed.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-1 text-cyan-300 hover:text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 font-bold"
                title="Open broadcast in external window or backup tab"
              >
                <span>OPEN LIVE</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* QUADRANT 3 (BOTTOM-LEFT): REAL-TIME CASCADE NETWORK GRAPH */}
        <div className={`relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col transition-all ${
          expandedQuadrant === 'BL' ? 'absolute inset-1 z-40' : expandedQuadrant ? 'hidden' : ''
        }`}>
          {/* Header */}
          <div className="h-8 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between font-mono text-[11px] z-10">
            <div className="flex items-center gap-2">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-slate-200">Q3 // CRISIS CASCADE & SUPPLY CHAIN GRAPH</span>
            </div>
            <button
              onClick={() => toggleExpand('BL')}
              className="p-1 text-slate-400 hover:text-white"
              title="Expand / Restore"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Network Graph Viewport */}
          <div className="flex-1 relative overflow-hidden">
            <CrisisNetworkView />
          </div>
        </div>

        {/* QUADRANT 4 (BOTTOM-RIGHT): FINANCIAL & COMMODITY SHOCK TICKER */}
        <div className={`relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col transition-all ${
          expandedQuadrant === 'BR' ? 'absolute inset-1 z-40' : expandedQuadrant ? 'hidden' : ''
        }`}>
          {/* Header */}
          <div className="h-8 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between font-mono text-[11px] z-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-slate-200">Q4 // MACRO RISK & COMMODITY VOLATILITY</span>
            </div>
            <button
              onClick={() => toggleExpand('BR')}
              className="p-1 text-slate-400 hover:text-white"
              title="Expand / Restore"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Market Dashboard Viewport */}
          <div className="flex-1 relative overflow-hidden">
            <MarketDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};
