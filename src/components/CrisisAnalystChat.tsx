import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { CrisisEvent } from '../types/crisis';

interface CrisisAnalystChatProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CrisisEvent | null;
  allEvents: CrisisEvent[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const CrisisAnalystChat: React.FC<CrisisAnalystChatProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  allEvents,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `**CRISIS ANALYST OPERATIONAL**\n\nI am your intelligence research assistant. I analyze geopolitical flashpoints, macro supply shocks, and historical analogies based on structured primary data.\n\nEvery assessment strictly distinguishes:\n• **FACT:** Verified events\n• **SOURCE:** Reporting entities\n• **ANALYSIS:** Transmission mechanisms\n• **UNCERTAINTY:** Unverified variables\n\nHow may I support your intelligence inquiry?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickQuestions = selectedEvent
    ? [
        `Why is ${selectedEvent.country} being monitored?`,
        `What are the main economic consequences of ${selectedEvent.title}?`,
        `What historical events are comparable to this crisis?`,
        `What factors could reduce the risk in ${selectedEvent.country}?`
      ]
    : [
        'What are the top three high-risk global hotspots today?',
        'How does Red Sea maritime friction affect European inflation?',
        'Show me comparable historical sovereign debt restructuring crises.',
        'What factors drive the current market volatility index?'
      ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contextData: {
            selectedEvent,
            totalMonitoredCrises: allEvents.length,
            highRiskCrises: allEvents.filter(e => e.riskIndicator >= 0.70).map(e => ({
              title: e.title,
              country: e.country,
              risk: e.riskIndicator,
              category: e.category
            }))
          }
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '**SYSTEM NOTICE:** Intelligence query encountered a connection delay. Live telemetry remains operational. Please retry shortly.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col font-mono text-slate-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>Crisis Analyst</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1 py-0.5 rounded">
                AI CO-PILOT
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Evidence-Grounded Intelligence Analysis
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-xs font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs leading-relaxed whitespace-pre-line font-mono text-[11px]'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
              {m.role === 'user' ? 'Operator' : 'Crisis Analyst AI'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs p-2">
            <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Consulting intelligence datasets and source reports...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
          Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[10px] font-mono bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-300 px-2 py-1 rounded-md text-left truncate max-w-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Crisis Analyst..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[9px] text-slate-500 font-mono text-center mt-1.5">
          Answers distinguish Fact, Source, Analysis, and Uncertainty. Not an unconditional prediction.
        </div>
      </div>
    </div>
  );
};
