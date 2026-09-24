import React, { useState } from 'react';
import { NewsArticle } from '../types/crisis';
import { 
  Radio, 
  ExternalLink, 
  Clock, 
  Compass, 
  Filter
} from 'lucide-react';

interface LiveNewsStreamProps {
  articles: NewsArticle[];
  onFlyToLocation?: (lat: number, lng: number) => void;
}

type NewsFilterCategory = 'all' | 'conflict' | 'political' | 'economic' | 'humanitarian' | 'energy';

export const LiveNewsStream: React.FC<LiveNewsStreamProps> = ({
  articles,
  onFlyToLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsFilterCategory>('all');

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'conflict') return art.category === 'military' || art.category === 'conflict';
    if (selectedCategory === 'political') return art.category === 'political';
    if (selectedCategory === 'economic') return art.category === 'economic' || art.category === 'financial';
    if (selectedCategory === 'humanitarian') return art.category === 'humanitarian';
    if (selectedCategory === 'energy') return art.category === 'energy' || art.summary.toLowerCase().includes('oil');
    return true;
  });

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '12:00';
    }
  };

  return (
    <div className="w-full h-full bg-[#111111] p-3 sm:p-5 overflow-y-auto font-mono text-xs select-none">
      {/* Top Header Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#303030]">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#dc2626]" />
            <h2 className="text-xs font-bold text-[#E6E6E6] uppercase tracking-wider">
              INTELLIGENCE WIRE FEED
            </h2>
            <span className="text-[9px] bg-[#1C1C1C] border border-[#303030] text-[#A0A0A0] px-1.5 py-0.2 rounded font-bold">
              LIVE
            </span>
          </div>
          <span className="text-[10px] text-[#707070]">
            Chronological multi-source wire dispatches & geocoded bulletins
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
          {[
            { id: 'all', label: 'ALL' },
            { id: 'conflict', label: 'CONFLICT' },
            { id: 'political', label: 'POLITICAL' },
            { id: 'economic', label: 'ECONOMIC' },
            { id: 'humanitarian', label: 'HUMANITARIAN' },
            { id: 'energy', label: 'ENERGY' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as NewsFilterCategory)}
              className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#181818] text-[#A0A0A0] hover:text-[#E6E6E6] border border-[#303030]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Compact Feed per Part 22 */}
      <div className="space-y-2">
        {filteredArticles.length === 0 ? (
          <div className="p-6 text-center bg-[#151515] border border-[#303030] rounded text-[#707070] text-[11px]">
            No wire dispatches match the selected filter.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-[#151515] hover:bg-[#181818] border border-[#303030] p-3 rounded transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
            >
              <div className="flex-1 space-y-1">
                {/* Meta Line: 20:41 UTC | SOURCE */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-[#E6E6E6] font-bold">
                    {formatTimestamp(art.publishedAt)} UTC
                  </span>
                  <span className="text-[#707070]">|</span>
                  <span className="text-[#A0A0A0] font-bold uppercase">
                    {art.source}
                  </span>
                  <span className="text-[#707070]">·</span>
                  <span className="text-[#707070] uppercase">
                    {art.region}
                  </span>
                  <span className="text-[#707070]">·</span>
                  <span className="text-[#A0A0A0] uppercase">
                    {art.category}
                  </span>
                  <span className="text-[#707070]">·</span>
                  <span className="text-[#16a34a] font-bold uppercase text-[9px]">
                    ONGOING
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-xs font-bold text-[#E6E6E6] leading-snug">
                  {art.title}
                </h3>

                {/* Summary */}
                <p className="text-[11px] text-[#A0A0A0] font-sans leading-relaxed">
                  {art.summary}
                </p>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center gap-1.5 flex-shrink-0">
                {onFlyToLocation && art.latitude && art.longitude && (
                  <button
                    onClick={() => onFlyToLocation(art.latitude!, art.longitude!)}
                    title="Fly to location on 3D Earth"
                    className="flex items-center gap-1 px-2 py-0.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#E6E6E6] border border-[#3A3A3A] rounded text-[10px] font-bold transition-colors whitespace-nowrap"
                  >
                    <Compass className="w-3 h-3 text-[#A0A0A0]" />
                    <span>FLY TO</span>
                  </button>
                )}

                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 bg-[#181818] hover:bg-[#202020] text-[#A0A0A0] hover:text-[#E6E6E6] border border-[#303030] rounded text-[10px] transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>SOURCE</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
