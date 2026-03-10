'use client';

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

export default function Home() {
  return (
    <>
      <SmoothScroll />
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

        {/* Marquee divider */}
        <Marquee
          items={['Next.js', 'React', 'Three.js', 'GSAP', 'Python', 'Django', 'LangChain']}
          separator="—"
        />

        {/* 4. Reviews */}
        <ReviewsSection />

        {/* 5. Contact */}
        <ContactSection />
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
