import React, { useState } from 'react';
import { ScenarioResult } from '../types/crisis';
import { 
  GitFork, 
  Send, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  FileText
} from 'lucide-react';

export const ScenarioAnalysisView: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    'What economic consequences could follow from a prolonged Red Sea maritime disruption?'
  );
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioResult | null>(null);

  const presetQuestions = [
    'What economic consequences could follow from a prolonged Red Sea maritime disruption?',
    'What factors could increase instability in the Taiwan Strait semiconductor supply chain?',
    'What historical events are comparable to the 2022 European energy price crunch?',
    'What indicators should be monitored to detect sovereign debt restructuring risk in developing markets?',
    'How do severe grain corridor export blockades propagate into urban food-price stress?'
  ];

  const handleRunScenario = async (questionToRun: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionToRun }),
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setScenarioData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate scenario analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#111111] p-3 sm:p-5 overflow-y-auto font-mono text-[#E6E6E6] text-xs select-none">
      {/* Disclaimer Header */}
      <div className="mb-4 p-3 bg-[#151515] border border-[#303030] rounded flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#A0A0A0]">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#d97706]" />
          <span>
            <strong>ANALYTICAL DISCLAIMER:</strong> Scenario forecasts represent structured explorations of plausible transmission pathways derived from historical precedent. They do not constitute guaranteed predictions.
          </span>
        </div>
      </div>

      {/* Preset Questions Grid */}
      <div className="mb-4 space-y-1.5">
        <span className="text-[10px] font-bold text-[#707070] uppercase tracking-wider block">
          STRATEGIC SCENARIO PRESETS:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPrompt(q);
                handleRunScenario(q);
              }}
              className={`p-2 rounded text-left border transition-colors ${
                selectedPrompt === q
                  ? 'bg-[#1C1C1C] border-[#2563eb] text-[#E6E6E6] font-bold'
                  : 'bg-[#151515] border-[#303030] text-[#A0A0A0] hover:text-[#E6E6E6] hover:bg-[#181818]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Inquiry Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (customQuestion.trim()) {
            setSelectedPrompt(customQuestion);
            handleRunScenario(customQuestion);
          }
        }}
        className="mb-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Formulate a custom scenario inquiry..."
          className="flex-1 bg-[#151515] border border-[#303030] rounded px-3 py-1.5 text-xs text-[#E6E6E6] placeholder-[#707070] outline-none focus:border-[#2563eb]"
        />
        <button
          type="submit"
          disabled={loading || !customQuestion.trim()}
          className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#1C1C1C] text-white disabled:text-[#707070] rounded font-bold transition-colors"
        >
          {loading ? 'Evaluating...' : 'Run Scenario'}
        </button>
      </form>

      {/* Scenario Output Matrix */}
      {scenarioData && (
        <div className="space-y-4">
          {/* Section 1: Transmission Analysis */}
          <div className="p-4 bg-[#151515] border border-[#303030] rounded space-y-2">
            <span className="text-[10px] font-bold text-[#707070] uppercase block">
              TRANSMISSION MECHANISM ANALYSIS:
            </span>
            <p className="text-xs text-[#A0A0A0] font-sans leading-relaxed">
              {scenarioData.analysis}
            </p>
          </div>

          {/* Section 2: Scenario Paths */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#707070] uppercase block">
              PLAUSIBLE PATHWAY PROJECTIONS:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarioData.scenarioPaths?.map((path, idx) => (
                <div key={idx} className="p-3 bg-[#151515] border border-[#303030] rounded space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#252525]">
                    <span className="font-bold text-[#E6E6E6] text-xs">{path.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      path.riskTrend === 'escalating' ? 'text-[#dc2626] bg-[#dc2626]/10' :
                      path.riskTrend === 'de-escalating' ? 'text-[#16a34a] bg-[#16a34a]/10' :
                      'text-[#A0A0A0] bg-[#202020]'
                    }`}>
                      {path.riskTrend}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A0A0A0] font-sans leading-relaxed">
                    {path.description}
                  </p>
                  <div>
                    <span className="text-[9px] text-[#707070] font-bold uppercase block mb-1">
                      Indicators to Monitor:
                    </span>
                    <ul className="text-[10px] text-[#707070] space-y-0.5 list-disc pl-3">
                      {path.keyIndicatorsToMonitor?.map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Baseline Evidence & Uncertainties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-[#151515] border border-[#303030] rounded space-y-1.5">
              <span className="text-[10px] font-bold text-[#16a34a] uppercase block">
                Empirical Baseline Evidence:
              </span>
              <ul className="space-y-1 text-[#A0A0A0] list-disc pl-3">
                {scenarioData.evidence?.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[#151515] border border-[#303030] rounded space-y-1.5">
              <span className="text-[10px] font-bold text-[#d97706] uppercase block">
                Critical Analytical Uncertainties:
              </span>
              <ul className="space-y-1 text-[#A0A0A0] list-disc pl-3">
                {scenarioData.uncertainties?.map((un, i) => (
                  <li key={i}>{un}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
