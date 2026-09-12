import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/home/HeroSection';
import { TopDealsSection } from '../components/home/TopDealsSection';
import { DomainAndStagingSpotlight } from '../components/home/DomainAndStagingSpotlight';
import { EveryStepFeatureSection } from '../components/home/EveryStepFeatureSection';
import { ReliabilityNumbersSection } from '../components/home/ReliabilityNumbersSection';
import { ConfidenceComparisonSection } from '../components/home/ConfidenceComparisonSection';
import { PricingMatrixSection } from '../components/home/PricingMatrixSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { SupportedPaymentMethodsSection } from '../components/home/SupportedPaymentMethodsSection';
import { FaqSection } from '../components/home/FaqSection';
import { BottomCtaSection } from '../components/home/BottomCtaSection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Top Deals & Promotional Matrix */}
        <TopDealsSection />

        {/* 3. Permanent Domains & Subdomain Staging Spotlight */}
        <DomainAndStagingSpotlight />

        {/* 4. Every Step to Online Success Feature Blocks */}
        <EveryStepFeatureSection />

        {/* 5. Infrastructure Reliability Numbers */}
        <ReliabilityNumbersSection />

        {/* 6. Feature Comparison Matrix */}
        <ConfidenceComparisonSection />

        {/* 7. Plans & Pricing Matrix */}
        <PricingMatrixSection />

        {/* 8. Verified Customer Testimonials & Reviews */}
        <ReviewsSection />

        {/* 9. Supported Mobile Money & Card Payment Methods */}
        <SupportedPaymentMethodsSection />

        {/* 10. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 11. Bottom Call to Action */}
        <BottomCtaSection />
      </main>

      {/* 12. Namecheap-Style Multi-Column Mega-Footer */}
      <Footer />
    </div>
  );
}
