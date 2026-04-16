'use client';

import { useEffect } from 'react';

export default function DevEasterEgg() {
  useEffect(() => {
    // Suppress THREE.Clock deprecation warning — comes from @react-three/fiber internals,
    // not fixable on our end until r3f migrates to THREE.Timer.
    const _warn = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
      _warn(...args);
    };

    // HTML comment — visible in the Elements tab
    const comment = document.createComment(`

  ╔══════════════════════════════════════════════════════════════╗
  ║  👋  Hey there, fella!                                       ║
  ║                                                              ║
  ║  Ctrl+Shift+I — the digital equivalent of lifting            ║
  ║  someone's hood to "just take a look". 😄                    ║
  ║  We both know how this ends. (welcome, friend)               ║
  ║                                                              ║
  ║  ── How this is built ────────────────────────────────────── ║
  ║  Framework  :  Next.js 15  (App Router)                      ║
  ║  UI         :  React + TypeScript                            ║
  ║  Styling    :  Tailwind CSS                                  ║
  ║  3D / WebGL :  Three.js · @react-three/fiber · drei          ║
  ║  Animation  :  GSAP                                          ║
  ║  Fonts      :  Bebas Neue · Instrument Serif                 ║
  ║               DM Sans · IBM Plex Mono  (Google Fonts)        ║
  ║                                                              ║
  ║  Built with craft by Esteban Acuña — estebanacuna.dev        ║
  ╚══════════════════════════════════════════════════════════════╝

`);
    document.body.insertBefore(comment, document.body.firstChild);

    // Console easter egg — visible in the Console tab
    const base = 'font-family:monospace;';

    console.log(
      '%c 👋  Hey there, fella! ',
      base + 'color:#e2e8f0;background:#0f172a;padding:6px 14px;font-size:14px;font-weight:700;border-radius:6px 6px 0 0;letter-spacing:0.05em;'
    );
    console.log(
      '%c Ctrl+Shift+I — the digital equivalent of lifting\n someone\'s hood to "just take a look". 😄\n Welcome, friend. Glad you\'re here. ',
      base + 'color:#94a3b8;background:#0f172a;padding:6px 14px;font-size:11px;line-height:1.9;border-bottom:1px solid #1e293b;'
    );
    console.log(
      '%c 📦  Stack ',
      base + 'color:#38bdf8;background:#0f172a;padding:8px 14px 2px;font-size:11px;font-weight:700;letter-spacing:0.08em;'
    );
    console.log(
      '%c  ·  Next.js 15  (App Router)\n  ·  React + TypeScript\n  ·  Tailwind CSS\n  ·  Three.js · @react-three/fiber · drei\n  ·  GSAP ',
      base + 'color:#cbd5e1;background:#0f172a;padding:2px 14px 8px;font-size:11px;line-height:2;'
    );
    console.log(
      '%c 🛠  Built with craft by Esteban Acuña · estebanacuna.dev ',
      base + 'color:#64748b;background:#0f172a;padding:6px 14px;font-size:10px;border-radius:0 0 6px 6px;border-top:1px solid #1e293b;'
    );
  }, []);

  return null;
}
