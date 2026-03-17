'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

function AIRobotIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="5.5" />
      <circle cx="12" cy="1.5" r="1" fill="currentColor" stroke="none" />
      <rect x="3" y="5.5" width="18" height="14" rx="3.5" />
      <rect x="6.5" y="9.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="9.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none" />
      <path d="M8.5 16.5h7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  role: 'assistant',
  content: "Hi! I'm Esteban's AI assistant. Ask me anything about his skills, experience, or availability.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMessage: Message = { role: 'user', content: text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed z-[900]" style={{ bottom: 'var(--space-xl)', right: 'var(--space-xl)' }}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="absolute right-0 flex flex-col overflow-hidden"
          style={{
            bottom: 'calc(100% + var(--space-md))',
            width: '360px',
            height: '480px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'chatOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Ask AI about Esteban
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer border-none bg-transparent p-1 transition-colors flex items-center justify-center"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 flex flex-col overflow-y-auto"
            data-lenis-prevent
            style={{ minHeight: 0, padding: 'var(--space-lg)', gap: 'var(--space-md)', overscrollBehavior: 'contain' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="max-w-[85%] text-sm leading-relaxed"
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  borderRadius: '16px',
                  wordBreak: 'break-word',
                  ...(msg.role === 'assistant'
                    ? {
                        background: 'var(--bg-tertiary)',
                        alignSelf: 'flex-start',
                        borderBottomLeftRadius: '4px',
                        color: 'var(--text-secondary)',
                      }
                    : {
                        background: 'var(--text-primary)',
                        color: 'var(--text-inverse)',
                        alignSelf: 'flex-end',
                        borderBottomRightRadius: '4px',
                        whiteSpace: 'pre-wrap',
                      }),
                }}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      p:      ({ children }) => <p style={{ margin: '0.25em 0' }}>{children}</p>,
                      ul:     ({ children }) => <ul style={{ paddingLeft: '1.25em', margin: '0.25em 0' }}>{children}</ul>,
                      ol:     ({ children }) => <ol style={{ paddingLeft: '1.25em', margin: '0.25em 0' }}>{children}</ol>,
                      li:     ({ children }) => <li style={{ margin: '0.15em 0' }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{children}</strong>,
                      code:   ({ children }) => (
                        <code style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8em',
                          background: 'var(--bg-hover)',
                          padding: '0.1em 0.4em',
                          borderRadius: '4px',
                        }}>{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78em',
                          background: 'var(--bg-hover)',
                          padding: '0.6em 0.8em',
                          borderRadius: '6px',
                          overflowX: 'auto',
                          margin: '0.4em 0',
                        }}>{children}</pre>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
                {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span style={{ opacity: 0.5, animation: 'blink 1s step-end infinite' }}>▋</span>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex shrink-0"
            style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border)', gap: 'var(--space-sm)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about skills, projects..."
              disabled={streaming}
              className="flex-1 text-sm outline-none"
              style={{
                fontFamily: 'var(--font-body)',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                opacity: streaming ? 0.6 : 1,
              }}
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--text-primary)', color: 'var(--text-inverse)' }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Tooltip */}
      <div
        className="absolute right-0 whitespace-nowrap text-sm transition-all duration-400 pointer-events-none"
        style={{
          bottom: 'calc(100% + var(--space-md))',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: 'var(--space-md) var(--space-lg)',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-md)',
          opacity: showTooltip && !isOpen ? 1 : 0,
          transform: showTooltip && !isOpen ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <strong style={{ color: 'var(--text-primary)' }}>Ask AI</strong> about Esteban&apos;s skills &amp; experience
      </div>

      {/* Bubble */}
      <div
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer relative transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))', boxShadow: 'var(--shadow-lg)' }}
      >
        <div
          className="absolute -inset-1 rounded-full border-2 opacity-0"
          style={{ borderColor: 'var(--text-primary)', animation: 'chatPulse 3s ease-in-out infinite' }}
        />
        <span style={{ color: 'var(--bg-primary)', display: 'flex' }}>
          <AIRobotIcon />
        </span>
      </div>

      <style jsx>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%   { opacity: 0.4; transform: scale(1);   }
          100% { opacity: 0;   transform: scale(1.4); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
