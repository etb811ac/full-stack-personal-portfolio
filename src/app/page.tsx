'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/ui/Navbar';
import Marquee from '@/components/ui/Marquee';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/sections/HeroSection';
import SolverSection from '@/components/sections/SolverSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import WorkSection from '@/components/sections/WorkSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';

const SmoothScroll = dynamic(() => import('@/components/ui/SmoothScroll'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ui/ChatWidget'), { ssr: false });
const PageLoader = dynamic(() => import('@/components/ui/PageLoader'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('site-loaded')) {
      setLoading(false);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('site-loaded', '1');
    setLoading(false);
  };

  return (
    <>
      {loading && <PageLoader onComplete={handleLoaderComplete} />}
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

          {/* 4. Work */}
          <WorkSection />

          {/* 5. Reviews */}
          <ReviewsSection />

          {/* 6. Contact */}
          <ContactSection />
        </main>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}
