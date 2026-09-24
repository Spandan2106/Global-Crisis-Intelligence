import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, AlertCircle, MessageSquare } from 'lucide-react';
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
      content: `**INSTITUTIONAL CRISIS ANALYST**\n\nI am your embedded intelligence assistant. I synthesize ongoing geopolitical flashpoints, macro shocks, and historical precedents based on primary reporting.\n\nEvery assessment strictly identifies:\n• **FACT:** Verified events\n• **SOURCE:** Reporting entities\n• **ANALYSIS:** Transmission mechanisms\n• **UNCERTAINTY:** Unverified variables\n\nSpecify your intelligence query below.`
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
        `Why is ${selectedEvent.country} monitored?`,
        `What are the economic consequences of ${selectedEvent.title}?`,
        `What historical events are comparable to this crisis?`,
        `What transmission channels affect global markets?`
      ]
    : [
        'What are the primary active global flashpoints today?',
        'How does maritime choke-point friction propagate into inflation?',
        'Provide comparable historical sovereign debt restructuring precedent.',
        'What indicators drive current geopolitical risk premiums?'
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
            activeCrisisCount: allEvents.length,
            sampleEvents: allEvents.slice(0, 8).map(e => ({
              title: e.title,
              country: e.country,
              category: e.category,
              status: e.status,
              riskIndicator: e.riskIndicator,
            }))
          }
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '**SYSTEM NOTICE:** Intelligence query service delay. Live telemetry remains operational. Please retry shortly.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#111111] border-l border-[#303030] shadow-2xl flex flex-col font-mono text-[#E6E6E6] text-xs select-none">
      {/* Drawer Header */}
      <div className="p-3 border-b border-[#303030] flex items-center justify-between bg-[#151515]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#202020] border border-[#303030] flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-[#E6E6E6]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6E6E6]">
              CRISIS ANALYST ASSISTANT
            </h3>
            <span className="text-[10px] text-[#707070]">
              Evidence-Grounded Intelligence Research
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#707070] hover:text-[#E6E6E6] hover:bg-[#202020] rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded ${
                m.role === 'user'
                  ? 'bg-[#2563eb] text-white font-medium'
                  : 'bg-[#181818] border border-[#252525] text-[#E6E6E6] leading-relaxed whitespace-pre-line font-mono text-[11px]'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] text-[#707070] font-mono mt-1 px-1">
              {m.role === 'user' ? 'OPERATOR' : 'ANALYST'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[#707070] font-mono text-xs p-2">
            <div className="w-3 h-3 border-2 border-[#A0A0A0] border-t-transparent rounded-full animate-spin" />
            <span>Consulting intelligence datasets and source reports...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-[#252525] bg-[#151515] flex flex-wrap gap-1">
        {quickQuestions.slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="text-[10px] bg-[#1C1C1C] hover:bg-[#252525] text-[#A0A0A0] hover:text-[#E6E6E6] border border-[#303030] px-2 py-0.5 rounded transition-colors truncate max-w-full"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 border-t border-[#303030] bg-[#151515] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Crisis Analyst..."
          disabled={loading}
          className="flex-1 bg-[#111111] border border-[#303030] rounded px-3 py-1.5 text-xs text-[#E6E6E6] placeholder-[#707070] outline-none focus:border-[#2563eb] font-mono"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#202020] text-white disabled:text-[#707070] rounded font-bold transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
