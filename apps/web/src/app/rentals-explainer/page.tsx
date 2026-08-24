import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { RentalDiagram } from '../../components/RentalDiagram';
import { Card, Badge, Button } from '@oneallhost/ui';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RentalsExplainerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="max-w-3xl">
          <Badge variant="info">Subdomain & Domain Leasing</Badge>
          <h1 className="mt-3 text-3xl font-medium text-[#111111]">
            How Short-Term Domain Rentals Work
          </h1>
          <p className="mt-2 text-sm text-[#6B6E68] leading-relaxed">
            The traditional registrar model forces a minimum 1-year commitment and rigid registrar locks. Oneallhost introduces on-demand domain and subdomain leasing with seamless purchase conversion.
          </p>
        </div>

        {/* Custom Diagram */}
        <div className="mt-12">
          <RentalDiagram />
        </div>

        {/* Use cases breakdown */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card elevation="surface-1" className="p-6">
            <h3 className="text-base font-medium text-[#111111]">Who is domain renting for?</h3>
            <ul className="mt-4 space-y-3 text-xs text-[#6B6E68] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                <span><strong className="text-[#111111]">Event Organizers:</strong> Set up a custom URL (e.g. hackathon.oah.link) for a 3-day hackathon without renewing for 12 months.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                <span><strong className="text-[#111111]">Marketing Agencies:</strong> Run seasonal promotional landing pages and localized sales funnels on flexible weekly terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                <span><strong className="text-[#111111]">Developers & Startups:</strong> Test MVPs and customer reception under realistic domain branding before purchasing.</span>
              </li>
            </ul>
          </Card>

          <Card elevation="surface-1" className="p-6">
            <h3 className="text-base font-medium text-[#111111]">The Conversion Guarantee</h3>
            <p className="mt-4 text-xs text-[#6B6E68] leading-relaxed">
              If your campaign gains traction, you never lose your traffic. With one click from your client dashboard, convert your rental into a permanent domain purchase. 
            </p>
            <div className="mt-6 p-4 bg-white border border-[#DCDDD8] rounded text-xs">
              <div className="font-medium text-[#111111]">Automatic Rental Rebate Formula</div>
              <div className="font-mono text-[#1B6FC9] mt-1">Final Purchase Price = Domain Standard Price - Rental Fees Paid</div>
              <p className="mt-2 text-[11px] text-[#6B6E68]">You never pay twice for the period you leased.</p>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/rentals">
                <Button variant="primary" size="md" className="gap-2">
                  <span>Start a rental</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
