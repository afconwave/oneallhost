'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useDotGrid } from '../../hooks/useDotGrid';
import { DomainSearchBar } from '../domains/DomainSearchBar';

export const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Attach interactive requestAnimationFrame canvas dot grid
  useDotGrid(canvasRef);

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#091F44]">
      {/* 1. Background: Real Photo from public/images/DomainandHosting/hero.png with Seamless Responsive Centering */}
      <img
        src="/images/DomainandHosting/hero.png"
        alt="Oneallhost Infrastructure"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 scale-105 transition-transform duration-1000"
      />

      {/* 2. Neutral Dark Base Overlay for High Text Contrast */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-[1]" />

      {/* 3. Brand Color-Tinted Seamless Gradient & Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(9, 31, 68, 0.45) 0%, rgba(7, 23, 54, 0.85) 100%), linear-gradient(to bottom, rgba(13, 59, 133, 0.6) 0%, rgba(124, 179, 66, 0.25) 100%)',
        }}
      />

      {/* 4. Interactive Dot-Grid Canvas Layer (Touch-Safe & Mobile Optimized) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none md:pointer-events-auto z-[3]"
      />

      {/* 5. Foreground Content */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 py-10 sm:py-24 flex flex-col items-center text-center space-y-5 sm:space-y-8"
      >
        <div className="space-y-2.5 sm:space-y-4 max-w-3xl">
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.15] neon-hero-title">
            All-in-one domain names &amp; cloud hosting
          </h1>

          <p className="text-xs sm:text-base max-w-xl mx-auto font-medium leading-relaxed text-blue-100/90 drop-shadow-xs px-2">
            Register ICANN domains with sub-3-minute Anycast DNS and settle instantly with native Mobile Money.
          </p>
        </div>

        {/* Live Domain Search Bar */}
        <div className="w-full max-w-3xl">
          <DomainSearchBar />
        </div>

        {/* Action Controls - Fully Responsive for Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto pt-1 sm:pt-2 max-w-xs sm:max-w-none mx-auto">
          <a
            href="#domains"
            className="inline-flex items-center justify-center font-bold text-xs sm:text-sm text-white rounded-xl h-10 sm:h-12 px-4 sm:px-6 transition-all shadow-sm bg-[#0D3B85] hover:bg-[#1B6FC9] w-full sm:w-auto text-center"
          >
            Explore Domain Extensions
          </a>

          <Link
            href="/rentals"
            className="inline-flex items-center justify-center font-bold text-xs sm:text-sm text-white rounded-xl h-10 sm:h-12 px-4 sm:px-6 bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all shadow-sm w-full sm:w-auto text-center"
          >
            Staging Subdomains (100% Rebate)
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
