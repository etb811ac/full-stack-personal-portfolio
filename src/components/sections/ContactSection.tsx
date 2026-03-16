'use client';

import { useEffect, useRef, FormEvent, useState } from 'react';

const contactLinks = [
  { icon: '✉️', label: 'hello@esteban.dev', href: 'mailto:hello@esteban.dev' },
  { icon: '🐙', label: 'github.com/esteban', href: '#' },
  { icon: '💼', label: 'linkedin.com/in/esteban', href: '#' },
  { icon: '🐦', label: '@esteban_dev', href: '#' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
                    <span>{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <form
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

              <div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {submitted ? '✓ Message Sent' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
