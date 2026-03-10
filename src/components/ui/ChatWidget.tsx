'use client';

import { useState, useEffect } from 'react';

const mockMessages = [
  { role: 'bot' as const, text: "👋 Hi! I'm Esteban's AI assistant. Ask me anything about his skills, experience, or availability." },
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
              className="text-lg cursor-pointer border-none bg-transparent p-1 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              ✕
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
              className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer text-sm transition-transform hover:scale-105"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
              }}
            >
              →
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
        💬 <strong style={{ color: 'var(--text-primary)' }}>Ask AI</strong> about Esteban&apos;s skills & experience
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
        <span className="text-[26px]" style={{ color: 'var(--bg-primary)' }}>
          🤖
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
