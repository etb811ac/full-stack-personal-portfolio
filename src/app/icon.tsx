import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d0d',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1px',
          }}
        >
          <span
            style={{
              color: '#ff6b35',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            E
          </span>
          <span
            style={{
              color: '#f5f5f5',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            A
          </span>
        </div>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
