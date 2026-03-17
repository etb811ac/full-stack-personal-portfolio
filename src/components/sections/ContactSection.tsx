'use client';

import { useEffect, useRef, FormEvent, useState } from 'react';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const contactLinks = [
  { Icon: MailIcon,     label: 'Send me a message',             href: '#contact-form' },
  { Icon: GitHubIcon,   label: 'github.com/etb811ac',           href: 'https://github.com/etb811ac',                          target: '_blank' },
  { Icon: LinkedInIcon, label: 'linkedin.com/in/esteban-acuña', href: 'https://www.linkedin.com/in/esteban-acu%C3%B1a/',      target: '_blank' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setSubmitted(true);
      } else {
        setError(body.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll('.contact-reveal'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 60%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="section-wrapper">
        <div className="section-num-col">
          <span className="section-num">05</span>
        </div>
        <div className="section-divider-line" />
        <div className="section-content-col">
          <span className="section-overline contact-reveal opacity-0">05 — Contact</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: 'var(--space-4xl)' }}>
            {/* Left: Content */}
            <div>
              <h2
                className="contact-reveal opacity-0 editorial-heading"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 'var(--space-lg)' }}
              >
                <span className="display-word">LET&apos;S BUILD</span>
                <em className="accent-word" style={{ fontSize: '0.85em' }}>something great</em>
              </h2>
              <p
                className="contact-reveal opacity-0"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-2xl)',
                }}
              >
                Got a project in mind? Need a full-stack developer who thinks beyond the code?
                Let&apos;s talk. I&apos;m currently available for freelance work and interesting collaborations.
              </p>

              <div className="contact-reveal opacity-0 flex flex-col" style={{ gap: 'var(--space-md)' }}>
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={'target' in link ? link.target : undefined}
                    rel={'target' in link ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                      padding: '12px 16px',
                      borderLeft: '2px solid var(--accent)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast), background var(--duration-fast)',
                      background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <link.Icon />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Form or Success */}
            {submitted ? (
              <div
                className="contact-reveal flex flex-col items-center justify-center text-center"
                style={{
                  padding: 'var(--space-4xl) var(--space-2xl)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  gap: 'var(--space-lg)',
                  animation: 'success-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                }}
              >
                {/* Animated checkmark */}
                <div style={{ position: 'relative', width: 64, height: 64 }}>
                  <svg viewBox="0 0 64 64" width={64} height={64} fill="none">
                    <circle
                      cx="32" cy="32" r="30"
                      stroke="var(--accent)" strokeWidth="2"
                      style={{ animation: 'circle-draw 0.5s ease forwards' }}
                      strokeDasharray="188.5"
                      strokeDashoffset="188.5"
                    />
                    <path
                      d="M18 32l10 10 18-18"
                      stroke="var(--accent)" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: 'check-draw 0.4s 0.4s ease forwards' }}
                      strokeDasharray="40"
                      strokeDashoffset="40"
                    />
                  </svg>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      letterSpacing: '0.03em',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    MESSAGE SENT
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                    Thanks for reaching out.<br />
                    I'll get back to you as soon as possible.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: 'var(--space-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="contact-reveal opacity-0 flex flex-col"
              style={{ gap: 'var(--space-lg)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--space-lg)' }}>
                <div className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
                  <label
                    htmlFor="name"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '0',
                      padding: '12px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
                  <label
                    htmlFor="email"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '0',
                      padding: '12px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
                <label
                  htmlFor="subject"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Project inquiry, collaboration, etc."
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '0',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="flex flex-col" style={{ gap: 'var(--space-sm)' }}>
                <label
                  htmlFor="message"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="resize-y"
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '0',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                    minHeight: '140px',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f87171' }}>
                  {error}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1 }}
                >
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes success-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes circle-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes check-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}
