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
      className="relative"
      style={{ padding: 'var(--space-6xl) var(--space-2xl)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <span
          className="absolute hidden lg:block select-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7rem',
            fontWeight: 700,
            color: 'var(--border)',
            right: 'var(--space-2xl)',
            top: 'var(--space-4xl)',
            lineHeight: 1,
          }}
        >
          05
        </span>

        <div
          className="contact-reveal opacity-0 flex items-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-lg)',
            gap: 'var(--space-md)',
          }}
        >
          <span className="w-6 h-px" style={{ background: 'var(--text-tertiary)' }} />
          Get in Touch
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: 'var(--space-4xl)' }}>
          {/* Left: Content */}
          <div>
            <h2
              className="contact-reveal opacity-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-lg)',
              }}
            >
              Let&apos;s build<br />something <em>great.</em>
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
                  className="flex items-center transition-all duration-200"
                  style={{
                    gap: 'var(--space-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    padding: 'var(--space-md)',
                    borderRadius: '8px',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--bg-hover)',
                      fontSize: '16px',
                    }}
                  >
                    {link.icon}
                  </span>
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
                  className="outline-none transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    padding: 'var(--space-md) var(--space-lg)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = '';
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
                  className="outline-none transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    padding: 'var(--space-md) var(--space-lg)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = '';
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
                className="outline-none transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '';
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
                className="outline-none transition-all duration-200 resize-y"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  minHeight: '140px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                className="text-sm font-semibold uppercase tracking-widest rounded-full cursor-pointer transition-all duration-400 hover:scale-[1.02]"
                style={{
                  fontFamily: 'var(--font-display)',
                  padding: 'var(--space-md) var(--space-xl)',
                  background: 'var(--text-primary)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  letterSpacing: '0.08em',
                }}
              >
                {submitted ? '✓ Sent!' : 'Send Message →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
