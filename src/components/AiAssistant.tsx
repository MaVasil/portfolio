import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, Trash2, Copy, Check, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// ─── Unique ID helper ───────────────────────────────────────────────────────
let _msgId = 0;
const nextId = () => `m${++_msgId}`;

// ─── Copy-code button component ──────────────────────────────────────────────
const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors silently
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors"
      aria-label="Copy code"
      title="Copy code"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// ─── Markdown components ─────────────────────────────────────────────────────
const buildMarkdownComponents = (isUser: boolean): Components => ({
  // Headings
  h1: ({ children }) => <h1 className="text-sm font-bold mt-3 mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[0.8125rem] font-bold mt-3 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xs font-bold mt-2 mb-0.5">{children}</h3>,

  // Paragraph
  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,

  // Lists
  ul: ({ children }) => <ul className="list-none pl-0 my-1 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
  li: ({ children }) => (
    <li className="flex items-start gap-1.5">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
      <span className="flex-1">{children}</span>
    </li>
  ),

  // Inline code
  code({ node, className, children, ...rest }) {
    // Detect block vs inline code by checking for a language className
    const isBlock = !!(className && className.startsWith('language-'));
    const codeString = String(children).replace(/\n$/, '');

    if (isBlock) {
      const lang = className?.replace('language-', '') || '';
      return (
        <div className="relative rounded-lg overflow-hidden my-2 bg-slate-900 border border-white/10">
          {/* Code block header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-white/10">
            <span className="text-[10px] font-mono text-slate-400">{lang || 'code'}</span>
            <CopyCodeButton code={codeString} />
          </div>
          <pre className="overflow-x-auto p-3 m-0">
            <code className="text-[0.7rem] font-mono leading-relaxed text-slate-200">{codeString}</code>
          </pre>
        </div>
      );
    }

    return (
      <code
        className={`font-mono text-[0.75em] px-1.5 py-0.5 rounded ${
          isUser
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-slate-100 text-rose-600 border border-slate-200'
        }`}
        {...rest}
      >
        {children}
      </code>
    );
  },

  // Pre – handled by code, this avoids double-wrapping
  pre: ({ children }) => <>{children}</>,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`underline underline-offset-2 decoration-1 ${isUser ? 'text-orange-200' : 'text-orange-600 hover:text-orange-700'}`}
    >
      {children}
    </a>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className={`border-l-2 pl-3 my-2 italic ${isUser ? 'border-orange-300/60 text-orange-100' : 'border-orange-400 text-slate-500'}`}>
      {children}
    </blockquote>
  ),

  // Table
  table: ({ children }) => (
    <div className="overflow-x-auto my-2 rounded-lg border border-slate-200">
      <table className="text-xs w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-slate-100 font-semibold text-slate-700 p-2 text-left border-b border-slate-200">{children}</th>,
  td: ({ children }) => <td className="p-2 border-b border-slate-100 last:border-0 align-top">{children}</td>,

  // HR
  hr: () => <hr className="my-3 border-slate-200" />,

  // Strong / em
  strong: ({ children }) => <strong className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>{children}</strong>,
  em: ({ children }) => <em className="italic opacity-90">{children}</em>,
});

// ─── Typing indicator ─────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
      <Bot className="w-3.5 h-3.5" />
    </div>
    <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-1.5 h-5">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400" />
      </div>
    </div>
  </div>
);

// ─── Copy response button ─────────────────────────────────────────────────────
const CopyResponseButton: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded text-slate-300 hover:text-slate-500"
      aria-label="Copy response"
      title="Copy response"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'assistant',
      content: "Hello! I'm **Ask Vasil AI**, Mohammed Abdul Vasil's official AI assistant powered by Google Gemini. Ask me about his projects, skills, GATE 2027 preparation, or why he'd be an exceptional fit for your engineering team!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const suggestedQuestions = [
    'Tell me about Vasil',
    'TrainETA architecture?',
    'GATE 2027 goal',
    'Strongest skills',
  ];

  // Track whether user is near the bottom to decide auto-scroll
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setIsNearBottom(scrollHeight - scrollTop - clientHeight < 80);
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isNearBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom(true);
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streamingId]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading || streamingId) return;

    const userMsg: Message = { id: nextId(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    setLoading(true);

    // Keep only the last 10 messages as history to avoid token bloat
    const historyForServer = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

    abortControllerRef.current = new AbortController();
    const assistantId = nextId();

    try {
      const res = await fetch('/api/ai-chat?stream=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ message: query, history: historyForServer }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        // Initialize streaming message
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
        setStreamingId(assistantId);
        setLoading(false);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m)
                );
              }
            } catch {
              // ignore chunk parsing glitch
            }
          }
        }
      } else {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: data.reply || "I couldn't generate a response at the moment. Please try again."
          }
        ]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return; // User cancelled
      const isServerOrNetwork = !err.message || err.message.includes('fetch') || err.message.includes('NetworkError');
      const errorMsg: Message = {
        id: nextId(),
        role: 'assistant',
        content: isServerOrNetwork
          ? `⚠️ **Unable to reach the assistant.** Please check your connection or contact Vasil directly at [mdvasil07@gmail.com](mailto:mdvasil07@gmail.com).`
          : `⚠️ ${err.message}\n\nYou can reach Vasil directly at [mdvasil07@gmail.com](mailto:mdvasil07@gmail.com).`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setStreamingId(null);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    setStreamingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: nextId(),
      role: 'assistant',
      content: 'Conversation cleared. How else can I help you learn about Vasil\'s engineering background?',
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-slate-900 hover:bg-orange-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 transition-colors duration-200"
            aria-label="Open Ask Vasil AI Assistant"
          >
            <div className="w-6 h-6 rounded-lg bg-orange-500 group-hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs shadow-md transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Ask Vasil AI</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="glass-card w-[92vw] sm:w-[430px] h-[600px] rounded-3xl shadow-2xl flex flex-col border border-white/80 bg-white/97 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Ask Vasil AI</h3>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-medium border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Gemini 3.5 Flash
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Real-Time Portfolio Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearChat}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Clear chat"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Close"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60"
            >
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-orange-600 text-white rounded-br-sm'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-sm'
                      }`}
                    >
                      <div className={`prose-chat ${msg.role === 'user' ? 'prose-chat-user' : ''}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={buildMarkdownComponents(msg.role === 'user')}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {streamingId === msg.id && (
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-orange-500 rounded-sm animate-pulse align-middle" />
                        )}
                      </div>
                      {msg.role === 'assistant' && !streamingId && (
                        <CopyResponseButton content={msg.content} />
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {suggestedQuestions.map((q, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => !loading && handleSend(q)}
                  disabled={loading}
                  className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {q}
                </motion.button>
              ))}
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-end gap-2 shrink-0">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask about projects, CGPA, skills… (Enter to send, Shift+Enter for newline)"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none overflow-hidden min-h-[40px] max-h-[120px] leading-relaxed transition-shadow disabled:opacity-60"
                style={{ height: 'auto' }}
                aria-label="Message input"
              />
              {(loading || streamingId) ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  className="p-2.5 bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-xl transition-all shadow-sm"
                  aria-label="Stop generation"
                  title="Stop"
                >
                  <Square className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
