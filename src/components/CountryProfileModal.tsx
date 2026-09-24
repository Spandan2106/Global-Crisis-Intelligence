import React from 'react';
import { COUNTRIES_INTELLIGENCE } from '../data/countries';
import { CrisisEvent } from '../types/crisis';
import { 
  X, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  BarChart3, 
  Globe, 
  FileText, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface CountryProfileModalProps {
  countryCode: string | null;
  onClose: () => void;
  allEvents: CrisisEvent[];
  onSelectEvent: (event: CrisisEvent) => void;
}

export const CountryProfileModal: React.FC<CountryProfileModalProps> = ({
  countryCode,
  onClose,
  allEvents,
  onSelectEvent,
}) => {
  if (!countryCode) return null;
  const country = COUNTRIES_INTELLIGENCE[countryCode];

  const profile = country || {
    name: countryCode,
    code: countryCode,
    capital: 'N/A',
    region: 'Global',
    population: 'N/A',
    gdp: 'N/A',
    flagEmoji: '🌐',
    coordinates: [0, 0] as [number, number],
    riskBreakdown: {
      politicalRisk: 0.50,
      economicStress: 0.50,
      conflictRisk: 0.50,
      humanitarianStress: 0.50,
      marketStress: 0.50,
    },
    summary: 'Active geopolitical intelligence surveillance sector.',
    currentConditions: 'Continuous monitoring of bilateral statements and open-source intelligence.',
    majorDiplomaticDevelopments: ['Monitoring active diplomatic communications.'],
    activeCrisisIds: [],
    historicalCrisisIds: [],
  };

  const activeEvents = allEvents.filter(e => e.countryCode === countryCode);

  const renderGauge = (title: string, value: number, color: string) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#A0A0A0]">{title}</span>
        <span className="font-bold text-[#E6E6E6]">{Math.round(value * 100)}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/85 backdrop-blur-sm p-4 font-mono select-none">
      <div className="bg-[#151515] border border-[#303030] rounded shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col text-[#E6E6E6] text-xs">
        {/* Header */}
        <div className="p-3.5 border-b border-[#303030] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{profile.flagEmoji}</span>
            <div>
              <h2 className="text-sm font-bold text-[#E6E6E6] uppercase">{profile.name}</h2>
              <span className="text-[10px] text-[#707070]">{profile.region} · Sovereign Dossier</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#707070] hover:text-[#E6E6E6] hover:bg-[#202020] rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-[#111111] border border-[#252525] rounded">
              <span className="text-[9px] text-[#707070] uppercase font-bold block">Capital</span>
              <span className="text-[#E6E6E6] font-bold">{profile.capital}</span>
            </div>
            <div className="p-2 bg-[#111111] border border-[#252525] rounded">
              <span className="text-[9px] text-[#707070] uppercase font-bold block">Population</span>
              <span className="text-[#E6E6E6] font-bold">{profile.population}</span>
            </div>
            <div className="p-2 bg-[#111111] border border-[#252525] rounded">
              <span className="text-[9px] text-[#707070] uppercase font-bold block">Nominal GDP</span>
              <span className="text-[#E6E6E6] font-bold">{profile.gdp}</span>
            </div>
            <div className="p-2 bg-[#111111] border border-[#252525] rounded">
              <span className="text-[9px] text-[#707070] uppercase font-bold block">Active Dossiers</span>
              <span className="text-[#E6E6E6] font-bold">{activeEvents.length}</span>
            </div>
          </div>

          {/* Risk Spectrum Gauges */}
          <div className="p-3 bg-[#111111] border border-[#252525] rounded space-y-2.5">
            <span className="text-[10px] font-bold text-[#707070] uppercase block">
              Sovereign Risk Vector Breakdown:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderGauge('Armed Conflict / Border Threat', profile.riskBreakdown.conflictRisk, '#dc2626')}
              {renderGauge('Political / Regime Stability', profile.riskBreakdown.politicalRisk, '#94a3b8')}
              {renderGauge('Macroeconomic Stress', profile.riskBreakdown.economicStress, '#2563eb')}
              {renderGauge('Humanitarian Emergency', profile.riskBreakdown.humanitarianStress, '#d97706')}
            </div>
          </div>

          {/* Situation Summary */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#707070] uppercase block">
              Strategic Assessment:
            </span>
            <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
              {profile.summary}
            </p>
          </div>

          {/* Associated Crisis Dossiers */}
          {activeEvents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#707070] uppercase block">
                Active Monitored Incidents:
              </span>
              <div className="space-y-1">
                {activeEvents.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      onSelectEvent(ev);
                      onClose();
                    }}
                    className="w-full p-2 bg-[#111111] hover:bg-[#181818] border border-[#252525] rounded text-left flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#E6E6E6]">{ev.title}</div>
                      <div className="text-[10px] text-[#707070]">{ev.subcategory}</div>
                    </div>
                    <span className="text-[10px] text-[#A0A0A0] font-bold uppercase">{ev.severity}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
