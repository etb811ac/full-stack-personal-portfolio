'use client';

interface MarqueeProps {
  items: string[];
  separator?: string;
}

export default function Marquee({ items, separator = '●' }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-strip">
      <div className="marquee-content">
        {doubled.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="sep" style={{ color: 'var(--accent)' }}>●</span>}
            <span style={{ marginLeft: i > 0 ? 'var(--space-3xl)' : 0 }}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
