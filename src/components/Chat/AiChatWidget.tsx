import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { ScanReport } from '../../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

interface AiChatWidgetProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  activeReport?: ScanReport | null;
}

const DEFAULT_SUGGESTIONS = [
  '🅿️ How do fake parking meter stickers steal cards?',
  '🔍 Analyze: http://city-parking-pay.top/meter/urgent',
  '🚨 What should I do if I scanned a malicious QR?',
  '📱 Can a QR code hack my phone without clicking anything?',
];

export function AiChatWidget({ isOpen, onToggle, activeReport }: AiChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "**Hello! I'm ShieldAI**, your optical cybersecurity and quishing threat advisor powered by Gemini 3.8 Flash.\n\nI can analyze suspicious URLs, deconstruct physical sticker tampering tactics (like forged parking meters or delivery slips), and guide incident response. How can I protect you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const payload: any = {
        prompt: textToSend,
        messages: newMessages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content,
        })),
      };

      if (activeReport) {
        payload.scanContext = {
          url: activeReport.url,
          verdict: activeReport.verdict,
          riskScore: activeReport.riskScore,
          verdictSummary: activeReport.verdictSummary,
          threatVector: activeReport.threatVector,
          evidence: activeReport.evidence,
        };
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I received your inquiry, but no threat details could be synthesized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.model || 'Gemini 3.8 Flash',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content:
          "### ⚠️ Threat Intelligence Advisory\n\nI encountered a connection interruption to the cloud analysis model. However, here are universal quishing defense checks:\n\n- **Check domain authenticity**: Look for subtle character swaps or non-standard TLDs.\n- **Do not enter credentials**: Legitimate municipal services rarely require credit card details on unauthenticated quick forms.\n- **Verify physical provenance**: Feel if a sticker was overlaid over original signage.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'ShieldAI Local Defense',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditActiveReport = () => {
    if (!activeReport) return;
    const prompt = `Please perform an in-depth security breakdown of this scanned URL: ${activeReport.url}. The local scanner scored it ${activeReport.riskScore}/100 (${activeReport.verdict.toUpperCase()}).`;
    handleSendMessage(prompt);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "**Chat history cleared.** What other QR code threat scenario or URL would you like me to inspect?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-3.8-flash',
      },
    ]);
  };

  // Simple formatting helper for markdown-like syntax
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h5 key={idx} className="font-serif-heading text-sm sm:text-base font-bold text-[#1A1A1A] pt-1">
                {line.replace('### ', '')}
              </h5>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-bold text-[#1A1A1A]">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#4338CA] font-bold mt-0.5">•</span>
                <span className="text-[#1A1A1A] flex-1">{renderInlineFormatting(content)}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const num = line.match(/^\d+\./)?.[0] || '';
            const content = line.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-mono font-bold text-[#4338CA] text-xs mt-0.5">{num}</span>
                <span className="text-[#1A1A1A] flex-1">{renderInlineFormatting(content)}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} className="text-[#1A1A1A]">
              {renderInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    // Process inline bolding and code ticks
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-mono bg-[#FAFAF8] px-1.5 py-0.5 rounded text-[11px] text-[#4338CA] border border-[#E5E5DC]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[#1A1A1A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Launcher Pill / Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => onToggle(true)}
            id="btn-open-ai-chat"
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#4338CA] text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer border border-white/10"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1A1A1A] animate-pulse" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
                <span>Ask ShieldAI</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 text-white uppercase font-bold">
                  Bot
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white rounded-2xl border border-[#E5E5DC] paper-shadow overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#FAFAF8] border-b border-[#E5E5DC] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4338CA] text-white flex items-center justify-center paper-shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif-heading text-sm font-bold text-[#1A1A1A]">
                    ShieldAI Threat Advisor
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-[#4338CA] border border-indigo-200 font-bold">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#61615B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Optical & Quishing Intelligence</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear chat history"
                className="p-1.5 rounded-lg text-[#61615B] hover:text-[#B91C1C] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand window'}
                className="hidden sm:block p-1.5 rounded-lg text-[#61615B] hover:text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => onToggle(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-[#61615B] hover:text-[#1A1A1A] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Scan Context Ribbon (if user has scanned a QR) */}
          {activeReport && (
            <div className="px-4 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldAlert className="w-3.5 h-3.5 text-[#4338CA] shrink-0" />
                <span className="font-mono text-[11px] text-[#4338CA] truncate">
                  Active target: {activeReport.url} ({activeReport.riskScore}/100)
                </span>
              </div>
              <button
                onClick={handleAuditActiveReport}
                className="px-2 py-0.5 rounded bg-[#4338CA] text-white text-[11px] font-semibold hover:bg-[#3730A3] transition-colors shrink-0 cursor-pointer"
              >
                Audit With AI
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#4338CA] text-white flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 relative group ${
                    msg.role === 'user'
                      ? 'bg-[#1A1A1A] text-white rounded-br-xs'
                      : 'bg-[#FAFAF8] text-[#1A1A1A] border border-[#E5E5DC] rounded-bl-xs'
                  }`}
                >
                  {/* Message content */}
                  {msg.role === 'user' ? (
                    <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    renderFormattedText(msg.content)
                  )}

                  {/* Metadata and Copy */}
                  <div
                    className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] font-mono ${
                      msg.role === 'user' ? 'border-white/10 text-white/60' : 'border-[#E5E5DC] text-[#61615B]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        {msg.source && <span className="opacity-75">{msg.source}</span>}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-[#1A1A1A] cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-lg bg-[#4338CA] text-white flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#FAFAF8] border border-[#E5E5DC] rounded-2xl rounded-bl-xs p-3.5 space-y-1.5 max-w-[85%]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#4338CA]">
                    <span className="w-2 h-2 rounded-full bg-[#4338CA] animate-ping" />
                    <span>ShieldAI is evaluating threat heuristics...</span>
                  </div>
                  <div className="flex gap-1 py-1">
                    <span className="w-2 h-2 rounded-full bg-[#E5E5DC] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#E5E5DC] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#E5E5DC] animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Shelf */}
          {messages.length <= 2 && (
            <div className="px-4 py-2.5 bg-[#FAFAF8] border-t border-[#E5E5DC] shrink-0">
              <div className="text-[10px] font-mono text-[#61615B] uppercase font-semibold mb-1.5">
                Suggested Threat Inquiries:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-[#E5E5DC] hover:border-[#4338CA]/30 text-[#1A1A1A] transition-all cursor-pointer truncate max-w-full"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E5E5DC] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or paste a suspicious URL..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E5DC] rounded-xl text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              id="btn-send-chat"
              className="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer paper-shadow shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
