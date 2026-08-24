import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/home/HeroSection';
import { BentoSpotlightSection } from '../components/home/BentoSpotlightSection';
import { TestimonialsTrustSection } from '../components/home/TestimonialsTrustSection';
import { ReliabilityNumbersSection } from '../components/home/ReliabilityNumbersSection';
import { MobileMoneySection } from '../components/home/MobileMoneySection';
import { ConfidenceComparisonSection } from '../components/home/ConfidenceComparisonSection';
import { PricingMatrixSection } from '../components/home/PricingMatrixSection';
import { FaqSection } from '../components/home/FaqSection';
import { BottomCtaSection } from '../components/home/BottomCtaSection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. Hero with custom named image & interactive canvas dot grid */}
        <HeroSection />

        {/* 2. Two-Card Bento Spotlight */}
        <BentoSpotlightSection />

        {/* 3. Customer Testimonials */}
        <TestimonialsTrustSection />

        {/* 4. Reliability Numbers */}
        <ReliabilityNumbersSection />

        {/* 5. Native Mobile Money & Card Rails (Light Section) */}
        <MobileMoneySection />

        {/* 6. Confidence Comparison Matrix */}
        <ConfidenceComparisonSection />

        {/* 7. Tall Hostinger-Style Pricing Matrix */}
        <PricingMatrixSection />

        {/* 8. Interactive FAQs */}
        <FaqSection />

        {/* 9. Bottom CTA Banner */}
        <BottomCtaSection />
      </main>

      {/* 10. Global Footer */}
      <Footer />
    </div>
  );
}
