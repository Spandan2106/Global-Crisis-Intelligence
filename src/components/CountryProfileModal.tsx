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
  Flame,
  AlertTriangle
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

  // If no predefined dossier exists, create a dynamic fallback
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

  const renderGauge = (title: string, value: number, color: string, icon: React.ReactNode) => (
    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          {icon}
          <span>{title}</span>
        </span>
        <span className="font-mono font-bold text-slate-100">{value.toFixed(2)}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, value * 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto p-5 text-slate-200">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{profile.flagEmoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                  {profile.name}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {profile.code}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>Capital: <strong className="text-slate-200">{profile.capital}</strong></span>
                <span>Region: <strong className="text-slate-200">{profile.region}</strong></span>
                <span>Pop: <strong className="text-slate-200">{profile.population}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category-Specific Risk Breakdown */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Domain Risk Spectrum (0.00 – 1.00)
            </span>
            <span className="text-[10px] text-slate-500 italic">
              Independently calculated domains — not a combined country score
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {renderGauge('Conflict Risk', profile.riskBreakdown.conflictRisk, 'bg-red-500', <Flame className="w-3.5 h-3.5 text-red-400" />)}
            {renderGauge('Economic Stress', profile.riskBreakdown.economicStress, 'bg-blue-500', <TrendingUp className="w-3.5 h-3.5 text-blue-400" />)}
            {renderGauge('Political Risk', profile.riskBreakdown.politicalRisk, 'bg-purple-500', <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />)}
            {renderGauge('Humanitarian Stress', profile.riskBreakdown.humanitarianStress, 'bg-amber-500', <Users className="w-3.5 h-3.5 text-amber-400" />)}
            {renderGauge('Market Stress', profile.riskBreakdown.marketStress, 'bg-cyan-500', <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />)}
          </div>
        </div>

        {/* Current Intelligence Assessment */}
        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Intelligence Dossier Summary
            </span>
            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              {profile.summary}
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Operating Conditions
            </span>
            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              {profile.currentConditions}
            </p>
          </div>

          {/* Major Diplomatic Developments */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Major Diplomatic & Strategic Developments
            </span>
            <ul className="space-y-1.5">
              {profile.majorDiplomaticDevelopments.map((dev, i) => (
                <li key={i} className="flex items-start gap-2 p-2 bg-slate-950/40 border border-slate-800/80 rounded-lg text-slate-300 font-sans text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{dev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Crises in this Territory */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Monitored Events in Territory ({activeEvents.length})
            </span>
            {activeEvents.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No active focal flashpoints currently recorded in this jurisdiction.</p>
            ) : (
              <div className="space-y-2">
                {activeEvents.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      onSelectEvent(ev);
                      onClose();
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 text-xs">{ev.title}</div>
                      <div className="text-[10px] text-slate-400">{ev.category} • Status: {ev.status}</div>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      Risk {ev.riskIndicator.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
