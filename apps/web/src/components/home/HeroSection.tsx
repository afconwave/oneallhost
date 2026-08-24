'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useDotGrid } from '../../hooks/useDotGrid';
import { DomainSearchBar } from '../DomainSearchBar';

export const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Attach interactive requestAnimationFrame canvas dot grid
  useDotGrid(canvasRef);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* 1. Background: Real Photo from public/images/DomainandHosting/hero.png */}
      <img
        src="/images/DomainandHosting/hero.png"
        alt="Oneallhost Vision"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* 2. Neutral Dark Base Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none z-[1]" />

      {/* 3. Brand Color-Tinted Gradient Overlay: Blue-Deep to Brand-Green only */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to bottom, rgba(13, 59, 133, 0.55), rgba(124, 179, 66, 0.35))',
        }}
      />

      {/* 4. Interactive Dot-Grid Canvas Layer (Tracked Mouse Repulse) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-[3]"
      />

      {/* 5. Foreground Content (Highest z-index) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center space-y-8"
      >
        <div className="space-y-4 max-w-3xl">
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white drop-shadow-sm"
          >
            All-in-one domain names and cloud hosting
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-white/90 drop-shadow-xs"
          >
            Register permanent ICANN domains with sub-3-minute Anycast DNS propagation, lease staging subdomains with 100% conversion rebates, and settle instantly with local Mobile Money.
          </p>
        </div>

        {/* Live Namecheap XML Domain Search Bar */}
        <div className="w-full max-w-3xl">
          <DomainSearchBar />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#domains"
            className="inline-flex items-center justify-center font-bold text-xs text-white rounded-[8px] h-[38px] px-6 transition-colors shadow-sm"
            style={{ backgroundColor: '#0D3B85' }}
          >
            Explore Domain Extensions
          </a>

          <Link
            href="/rentals"
            className="inline-flex items-center justify-center font-semibold text-xs text-white rounded-[8px] h-[38px] px-6 bg-black/40 hover:bg-black/60 border border-white/30 transition-colors shadow-sm"
          >
            Subdomain Staging Leases (100% Rebate)
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
