import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { PresidentialDailyBrief } from '../types/recon';
import { MOCK_PRESIDENTIAL_DAILY_BRIEF } from '../data/mockReconData';
import { soundFx } from '../services/soundFxService';

interface PresidentialDailyBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlyToCoordinates?: (coords: { lat: number; lng: number; zoom?: number }) => void;
}

export const PresidentialDailyBriefModal: React.FC<PresidentialDailyBriefModalProps> = ({
  isOpen,
  onClose,
  onFlyToCoordinates,
}) => {
  const [briefing, setBriefing] = useState<PresidentialDailyBrief>(MOCK_PRESIDENTIAL_DAILY_BRIEF);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedTheaterIdx, setSelectedTheaterIdx] = useState<number>(0);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playHudBeep(1200);
    window.print();
  };

  const handleRegenerateAi = async () => {
    soundFx.playTeletypeClick();
    setIsGeneratingAi(true);

    try {
      const response = await fetch('/api/analyst/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Generate an updated President\'s Daily Brief (PDB) executive summary and 24-hour critical watch items focusing on the Strait of Hormuz, Red Sea, and Taiwan Strait tension spikes.',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setBriefing(prev => ({
            ...prev,
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
            executiveSummary: data.reply.slice(0, 700) + '...',
          }));
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-slate-950 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-0 print:shadow-none print:bg-white print:text-black">
        {/* Classified Top Banner (Printable & Screen) */}
        <div className="bg-red-950 border-b border-red-800/80 px-4 py-2 flex items-center justify-between text-xs font-mono print:bg-transparent print:border-b-2 print:border-black print:text-black">
          <div className="flex items-center gap-2 text-red-300 print:text-black font-bold tracking-widest uppercase">
            <ShieldAlert className="w-4 h-4 text-red-500 print:hidden" />
            <span>{briefing.classificationHeader}</span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <span className="text-[10px] text-red-400/80">AUTHENTICATED // SYSTEM ID: {briefing.briefingId}</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Header (Hidden in Print) */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono print:hidden">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white tracking-wide">EXECUTIVE SITUATION REPORT // PDB</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{briefing.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerateAi}
              disabled={isGeneratingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'SYNTHESIZING INTEL...' : 'AI UPDATE RE-ASSESS'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-950/50 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / EXPORT (PDF)</span>
            </button>
          </div>
        </div>

        {/* Briefing Document Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-200 print:text-black print:overflow-visible print:p-0">
          {/* Official Document Seal & Metadata Block */}
          <div className="border-b border-slate-800 pb-4 print:border-black">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white print:text-black">
                  PRESIDENT’S DAILY INTELLIGENCE BRIEF
                </h1>
                <p className="text-xs font-mono text-cyan-400 print:text-gray-700 mt-1">
                  OFFICE OF THE DIRECTOR OF NATIONAL INTELLIGENCE // CRISIS DYNAMICS GROUP
                </p>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400 print:text-black">
                <div>DATE: <strong className="text-white print:text-black">{briefing.date}</strong></div>
                <div>DOC NO: <strong className="text-white print:text-black">{briefing.briefingId}</strong></div>
                <div>AUTHORITY: <strong className="text-white print:text-black">EXECUTIVE ORDER 13526</strong></div>
              </div>
            </div>

            {/* Caveat Distribution Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {briefing.distroCavs.map((cav) => (
                <span key={cav} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 print:border-black print:text-black">
                  {cav}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SITUATION SUMMARY */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1 print:border-black">
              <span className="font-mono text-xs font-bold text-red-400 print:text-black uppercase tracking-wider">
                1.0 // EXECUTIVE STRATEGIC SUMMARY
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 print:text-black font-sans">
              {briefing.executiveSummary}
            </p>
          </div>

          {/* SECTION 2: OPERATIONAL CRISIS THEATERS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 print:border-black">
              <span className="font-mono text-xs font-bold text-cyan-400 print:text-black uppercase tracking-wider">
                2.0 // KEY OPERATIONAL THEATERS & THREAT VECTORS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1">
              {briefing.theaters.map((th, idx) => (
                <div 
                  key={th.theaterName}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2 print:border-black print:bg-transparent"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white print:text-black truncate max-w-[240px]">
                      {th.theaterName}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      th.threatLevel === 'CRITICAL' 
                        ? 'bg-red-950 text-red-300 border border-red-700 print:border-black print:text-black' 
                        : 'bg-amber-950 text-amber-300 border border-amber-700 print:border-black print:text-black'
                    }`}>
                      {th.threatLevel}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 print:text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 print:hidden" />
                    <span>COORDS: {th.coordinates}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 print:text-black">
                    <strong className="text-[10px] font-mono text-slate-400 uppercase block">Key Indicators:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300 print:text-black">
                      {th.keyDevelopments.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 text-[11px] print:border-gray-400">
                    <span className="text-slate-400 font-mono text-[10px] block">Economic Transmission:</span>
                    <span className="text-amber-300 print:text-black font-medium">{th.economicVulnerability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: CRITICAL MARITIME CHOKEPOINTS ASSESSMENT */}
          <div className="space-y-2">
            <div className="border-b border-slate-800 pb-1 print:border-black">
              <span className="font-mono text-xs font-bold text-amber-400 print:text-black uppercase tracking-wider">
                3.0 // STRATEGIC CHOKEPOINT READINESS TABLE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-slate-800 print:border-black">
                <thead className="bg-slate-900 print:bg-gray-100 text-slate-400 print:text-black text-[10px] uppercase">
                  <tr>
                    <th className="p-2 border-b border-slate-800 print:border-black">Chokepoint</th>
                    <th className="p-2 border-b border-slate-800 print:border-black">Status</th>
                    <th className="p-2 border-b border-slate-800 print:border-black">Disruption Exposure</th>
                    <th className="p-2 border-b border-slate-800 print:border-black">Strategic Alternative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-black text-[11px]">
                  {briefing.criticalChokepointTable.map((row) => (
                    <tr key={row.chokepoint} className="hover:bg-slate-900/50">
                      <td className="p-2 font-bold text-white print:text-black">{row.chokepoint}</td>
                      <td className="p-2 text-red-400 print:text-black">{row.status}</td>
                      <td className="p-2 text-slate-300 print:text-black">{row.disruptionRisk}</td>
                      <td className="p-2 text-slate-400 print:text-gray-700">{row.strategicAlternative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: 24-HOUR ACTION & WATCH LIST */}
          <div className="space-y-2">
            <div className="border-b border-slate-800 pb-1 print:border-black">
              <span className="font-mono text-xs font-bold text-emerald-400 print:text-black uppercase tracking-wider">
                4.0 // 24-HOUR STRATEGIC WATCH LIST
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {briefing.watchList24h.map((item, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex items-start gap-2 print:border-black">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0 print:hidden" />
                  <span className="text-slate-300 print:text-black leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Signoff Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-black text-[10px] font-mono text-slate-500 print:text-black flex justify-between items-center">
            <span>PREPARED BY: {briefing.preparedBy}</span>
            <span>CLASSIFICATION REMAINS IN FORCE UNTIL 2036</span>
          </div>
        </div>
      </div>
    </div>
  );
};
