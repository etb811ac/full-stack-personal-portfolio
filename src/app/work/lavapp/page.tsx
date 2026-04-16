import type { Metadata } from 'next';
import LavAppCaseStudy from './LavAppCaseStudy';

export const metadata: Metadata = {
  title: 'LavApp — Case Study | Esteban Acuña',
  description: 'Full-stack SaaS for car wash queue management. Built solo with Next.js 15, Supabase, Paddle, Claude AI, and WhatsApp notifications.',
  openGraph: {
    title: 'LavApp — Case Study | Esteban Acuña',
    description: 'Full-stack SaaS for car wash queue management. Built solo with Next.js 15, Supabase, Paddle, Claude AI, and WhatsApp notifications.',
    url: 'https://estebanacuna.dev/work/lavapp',
    siteName: 'Esteban Acuña',
    locale: 'en_US',
    type: 'article',
  },
};

export default function Page() {
  return <LavAppCaseStudy />;
}
