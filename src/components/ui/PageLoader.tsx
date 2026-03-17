'use client';

import { useEffect, useRef, useState } from 'react';

interface PageLoaderProps {
  onComplete: () => void;
}

// Each stage: animate bar to `target` over `duration` ms, then pause before next
const STAGES = [
  { target: 12, duration: 320,  label: 'Initializing'     },
  { target: 29, duration: 420,  label: 'Loading fonts'     },
  { target: 48, duration: 500,  label: 'Loading scripts'   },
  { target: 67, duration: 580,  label: 'Loading 3D scene'  },
  { target: 83, duration: 460,  label: 'Loading assets'    },
  { target: 96, duration: 340,  label: 'Almost ready'      },
];

const PAUSE_BETWEEN = 160; // ms pause between stages

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// Ease-in-out quad: fast-start, slow-end within each stage
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [counter, setCounter]   = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [label, setLabel]       = useState('Initializing');
  const [exiting, setExiting]   = useState(false);
  const doneRef                 = useRef(false);
  const pageLoadedRef           = useRef(false);

  const triggerExit = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setCounter(100);
    setBarWidth(100);
    setTimeout(() => setExiting(true), 480);
  };

  useEffect(() => {
    // Track real page load in parallel
    const handleLoad = () => { pageLoadedRef.current = true; };
    if (document.readyState === 'complete') {
      pageLoadedRef.current = true;
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    let cancelled = false;

    const animate = (from: number, to: number, duration: number, onTick: (v: number) => void) =>
      new Promise<void>(resolve => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) { resolve(); return; }
          const t = Math.min((now - start) / duration, 1);
          onTick(from + (to - from) * easeInOut(t));
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });

    const run = async () => {
      let prev = 0;

      for (const stage of STAGES) {
        if (cancelled) return;
        setLabel(stage.label);
        await animate(prev, stage.target, stage.duration, (v) => {
          setCounter(Math.floor(v));
          setBarWidth(v);
        });
        prev = stage.target;
        await sleep(PAUSE_BETWEEN);
      }

      // Wait for real page load if not done yet, then exit
      while (!pageLoadedRef.current && !cancelled) {
        await sleep(100);
      }

      if (!cancelled) triggerExit();
    };

    run();

    return () => {
      cancelled = true;
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div
      onTransitionEnd={() => exiting && onComplete()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        transition: exiting ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }}
    >
      {/* Leading-edge accent streak */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--accent)',
          opacity: exiting ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      />

      <div style={{ textAlign: 'center', userSelect: 'none' }}>

        {/* Counter */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(9rem, 22vw, 20rem)',
            lineHeight: 0.9,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            animation: 'loader-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
            fontVariantNumeric: 'tabular-nums',
          } as React.CSSProperties}
        >
          {counter.toString().padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 'min(500px, 78vw)',
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            margin: '2.5rem auto 2rem',
            position: 'relative',
            overflow: 'hidden',
            animation: 'loader-up 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${barWidth}%`,
              background: 'var(--accent)',
            }}
          />
        </div>

        {/* Name */}
        <div style={{ animation: 'loader-up 0.7s 0.18s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 5vw, 4rem)',
              letterSpacing: '0.1em',
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            ESTEBAN
          </div>
          <em
            style={{
              display: 'block',
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 4vw, 3.2rem)',
              color: 'var(--accent)',
              lineHeight: 1.2,
            }}
          >
            Acuña
          </em>
        </div>

        {/* Stage label — updates as loading progresses */}
        <p
          key={label}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            marginTop: '2rem',
            animation: 'loader-up 0.6s 0.32s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          {label}
        </p>
      </div>

      <style>{`
        @keyframes loader-up {
          from { transform: translateY(28px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
