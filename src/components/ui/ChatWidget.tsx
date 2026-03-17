'use client';

import { useState, useEffect } from 'react';
function AIRobotIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* Antenna */}
      <line x1="12" y1="2" x2="12" y2="5.5" />
      <circle cx="12" cy="1.5" r="1" fill="currentColor" stroke="none" />
      {/* Head */}
      <rect x="3" y="5.5" width="18" height="14" rx="3.5" />
      {/* Eyes — rectangular for techy feel */}
      <rect x="6.5" y="9.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="9.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none" />
      {/* Mouth */}
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

const mockMessages = [
  { role: 'bot' as const, text: "Hi! I'm Esteban's AI assistant. Ask me anything about his skills, experience, or availability." },
  { role: 'user' as const, text: 'What technologies does Esteban specialize in?' },
  { role: 'bot' as const, text: 'Esteban is a full-stack developer specializing in Next.js, React, Three.js, and GSAP on the frontend, with Python, Django, and LangChain for backend and AI integration. He\'s particularly strong at combining creative 3D experiences with robust architecture.' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
            className="flex items-center justify-between"
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              borderBottom: '1px solid var(--border)',
            }}
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
            style={{ padding: 'var(--space-lg)', gap: 'var(--space-md)' }}
          >
            {mockMessages.map((msg, i) => (
              <div
                key={i}
                className="max-w-[85%] text-sm leading-relaxed"
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  borderRadius: '16px',
                  ...(msg.role === 'bot'
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
                      }),
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex"
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              borderTop: '1px solid var(--border)',
              gap: 'var(--space-sm)',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about skills, projects..."
              className="flex-1 text-sm outline-none"
              style={{
                fontFamily: 'var(--font-body)',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-transform hover:scale-105"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
              }}
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
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer relative transition-transform hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          className="absolute -inset-1 rounded-full border-2 opacity-0"
          style={{
            borderColor: 'var(--text-primary)',
            animation: 'chatPulse 3s ease-in-out infinite',
          }}
        />
        <span style={{ color: 'var(--bg-primary)', display: 'flex' }}>
          <AIRobotIcon />
        </span>
      </div>

      <style jsx>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
