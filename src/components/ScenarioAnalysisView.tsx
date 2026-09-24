import React, { useState } from 'react';
import { ScenarioResult } from '../types/crisis';
import { 
  GitFork, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
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
      console.error('Scenario error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate scenario analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 p-4 sm:p-6 overflow-y-auto font-mono text-slate-200">
      {/* Notice & Disclaimer Header */}
      <div className="mb-5 p-3 bg-purple-950/30 border border-purple-800/80 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Analytical Disclaimer:</strong> Scenario simulation explores plausible conditional trajectories. It does NOT forecast certainty or state that conflicts will occur.
          </span>
        </div>
        <span className="text-[10px] text-purple-400 font-bold hidden sm:inline">
          PROBABILISTIC SCENARIO ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preset Templates & Input Box */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-purple-400" />
              Scenario Inquiries
            </h3>

            {/* Presets List */}
            <div className="space-y-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPrompt(q);
                    handleRunScenario(q);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    selectedPrompt === q
                      ? 'bg-purple-950/50 border-purple-700/80 text-purple-200 font-semibold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom Scenario Prompt Form */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                Custom Scenario Question:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., What indicators could signal early de-escalation...?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customQuestion.trim()) {
                      setSelectedPrompt(customQuestion);
                      handleRunScenario(customQuestion);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => {
                    if (customQuestion.trim()) {
                      setSelectedPrompt(customQuestion);
                      handleRunScenario(customQuestion);
                    }
                  }}
                  disabled={loading || !customQuestion.trim()}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Gemini Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold">Running Strategic Scenario Analysis...</p>
              <p className="text-xs text-slate-500">Evaluating empirical evidence, transmission paths, and conditional forks</p>
            </div>
          ) : error ? (
            <div className="bg-red-950/40 border border-red-800 rounded-2xl p-4 text-red-300 text-xs">
              {error}
            </div>
          ) : scenarioData ? (
            <div className="space-y-4">
              {/* Evidence Section */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    EVIDENCE (VERIFIED EMPIRICAL BASELINE)
                  </h4>
                </div>
                <ul className="space-y-1.5 font-sans text-xs text-slate-300">
                  {scenarioData.evidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analysis Section */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    ANALYSIS (TRANSMISSION MECHANISMS)
                  </h4>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {scenarioData.analysis}
                </p>
              </div>

              {/* Plausible Scenario Paths */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <GitFork className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    SCENARIO FORKS & KEY INDICATORS TO MONITOR
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {scenarioData.scenarioPaths.map((path, idx) => {
                    const isEsc = path.riskTrend === 'escalating';
                    const isDeEsc = path.riskTrend === 'de-escalating';

                    return (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Path {idx + 1}
                            </span>
                            <span
                              className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isEsc ? 'bg-red-950 text-red-400' :
                                isDeEsc ? 'bg-emerald-950 text-emerald-400' :
                                'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {isEsc ? <TrendingUp className="w-3 h-3" /> :
                               isDeEsc ? <TrendingDown className="w-3 h-3" /> :
                               <Minus className="w-3 h-3" />}
                              <span className="capitalize">{path.riskTrend}</span>
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-200 mb-1">
                            {path.name}
                          </h5>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-3">
                            {path.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[9px] text-slate-500 uppercase font-semibold block mb-1">
                            Monitor Indicators:
                          </span>
                          <ul className="space-y-1 text-[10px] text-slate-300 font-sans">
                            {path.keyIndicatorsToMonitor.map((ind, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                <span>{ind}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Uncertainties Section */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    UNCERTAINTIES & UNKNOWN VARIABLES
                  </h4>
                </div>
                <ul className="space-y-1.5 font-sans text-xs text-slate-300">
                  {scenarioData.uncertainties.map((unc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{unc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explicit Disclaimer */}
              <div className="text-[10px] text-slate-500 italic p-3 bg-slate-900/30 rounded-xl border border-slate-800/40">
                {scenarioData.disclaimer}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
              <p className="text-xs">Select any preset question or enter a custom geopolitical inquiry to trigger strategic scenario analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
