import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Esteban Acuña — Full-Stack Developer & Maker';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d0d',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: '#ff6b35',
          }}
        />

        {/* Section label */}
        <div
          style={{
            color: '#ff6b35',
            fontSize: '13px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            marginBottom: '32px',
            display: 'flex',
          }}
        >
          // Portfolio
        </div>

        {/* ESTEBAN */}
        <div
          style={{
            fontSize: '148px',
            fontWeight: 900,
            color: '#f5f5f5',
            lineHeight: 0.88,
            letterSpacing: '0.02em',
            display: 'flex',
          }}
        >
          ESTEBAN
        </div>

        {/* Acuña */}
        <div
          style={{
            fontSize: '132px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#ff6b35',
            lineHeight: 0.88,
            marginBottom: '48px',
            display: 'flex',
          }}
        >
          Acuña
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '22px',
            color: '#ababab',
            letterSpacing: '3px',
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          Full-Stack Developer &amp; Maker
        </div>

        {/* Bottom divider */}
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '80px',
            right: '80px',
            height: '1px',
            background: '#1f1f1f',
          }}
        />

        {/* Tech stack */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            fontSize: '13px',
            color: '#555555',
            letterSpacing: '3px',
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          NEXT.JS · REACT · THREE.JS · PYTHON · AI
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            fontSize: '13px',
            color: '#ff6b35',
            letterSpacing: '1px',
            fontFamily: 'monospace',
            display: 'flex',
            opacity: 0.7,
          }}
        >
          estebanacuna.dev
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
