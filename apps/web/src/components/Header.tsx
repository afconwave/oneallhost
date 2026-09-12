'use client';

import React from 'react';
import { TopAuxiliaryBar } from './nav/TopAuxiliaryBar';
import { MainNav } from './nav/MainNav';
import { SubPromoBanner } from './nav/SubPromoBanner';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white z-50 relative border-0 shadow-none">
      {/* Tier 1: Top Light Auxiliary Bar */}
      <TopAuxiliaryBar />

      {/* Tier 2: Main Navigation Bar with Logo and Top Floating Badges */}
      <MainNav />

      {/* Tier 3: Sub Promo Announcement Bar */}
      <SubPromoBanner />
    </header>
  );
};
