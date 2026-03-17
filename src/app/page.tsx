'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/ui/Navbar';
import Marquee from '@/components/ui/Marquee';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/sections/HeroSection';
import SolverSection from '@/components/sections/SolverSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';

const SmoothScroll = dynamic(() => import('@/components/ui/SmoothScroll'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ui/ChatWidget'), { ssr: false });
const PageLoader = dynamic(() => import('@/components/ui/PageLoader'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}
      <SmoothScroll />

      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: loading ? 'none' : 'opacity 0.7s ease',
        }}
      >
        <div className="grain-overlay" />
        <Navbar />

        <main>
          {/* 1. Hero */}
          <HeroSection />

          {/* Marquee divider */}
          <Marquee
            items={['Developer', 'Maker', 'Problem Solver', 'Builder', 'Tinkerer', 'Full-Stack', 'Creative']}
          />

          {/* 2. Problem Solver */}
          <SolverSection />

          {/* 3. Expertise & Tech Stack */}
          <ExpertiseSection />

          {/* 4. Reviews */}
          <ReviewsSection />

          {/* 5. Contact */}
          <ContactSection />
        </main>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}
