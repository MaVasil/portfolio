import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm **Ask Vasil AI**, Mohammed Abdul Vasil's official AI recruiter assistant. Ask me anything about his projects, GATE CSE+DA prep, CBIT academics, or why he'd be a great addition to your engineering team!"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Tell me about Vasil",
    "What is TrainETA architecture?",
    "What is his GATE 2027 goal?",
    "What are his strongest skills?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: messages })
      });
      const data = await res.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || "I apologize, but I couldn't process that request right now."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Network error connecting to AI assistant service. Please reach Vasil directly at mdvasil07@gmail.com." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render basic markdown formatting (bold, bullet lines, paragraphs)
  const renderFormattedMessage = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Check for bullet points
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•');
      const cleanLine = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

      // Format bold asterisks
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const formattedContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2" />
            <span>{formattedContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={`${idx > 0 ? 'mt-2' : ''} leading-relaxed`}>
          {formattedContent}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-slate-900 hover:bg-orange-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20"
          aria-label="Open Ask Vasil AI Assistant"
        >
          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Ask Vasil AI</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card w-[92vw] sm:w-[420px] h-[580px] rounded-3xl shadow-2xl flex flex-col border border-white/80 bg-white/95 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Ask Vasil AI</h3>
                <p className="text-[10px] text-slate-400 font-medium">Official Recruiter Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([{ role: 'assistant', content: "Conversation cleared. How else can I help you learn about Vasil's engineering background?" }])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-orange-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedMessage(msg.content)}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs italic bg-white/80 p-3 rounded-2xl w-fit border border-slate-200 shadow-xs">
                <div className="w-5 h-5 rounded-lg bg-orange-600 text-white flex items-center justify-center animate-spin">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>Analyzing knowledge base & formatting response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about projects, CGPA, GATE..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
