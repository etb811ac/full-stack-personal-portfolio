import type { Metadata } from 'next';
import { Bebas_Neue, Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';

const bebasNeue = Bebas_Neue({
  weight: ['400'],
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['italic'],
  variable: '--font-accent',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '600'],
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Esteban Acuña — Full-Stack Developer & Maker',
  description: 'Full-stack developer specializing in Next.js, React, Three.js, Python, and AI integration. Building digital experiences where code meets craft.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <div className="top-accent-bar" />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
