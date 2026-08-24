import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        <h1 className="text-2xl sm:text-3xl font-medium text-[#111111]">Refund & Cancellation Policy</h1>
        <p className="mt-1 text-xs text-[#6B6E68]">Last revised: January 2026</p>

        <div className="mt-8 space-y-6 text-xs text-[#6B6E68] leading-relaxed">
          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">1. Domain Registrations</h2>
            <p>
              Due to immediate registry registration fees incurred with upstream registry operators (ICANN, VeriSign, ART), newly registered domains cannot be refunded once successfully provisioned.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">2. Domain & Subdomain Rentals</h2>
            <p>
              Rental cancellations requested within 24 hours of initiation are eligible for full account credit. Furthermore, 100% of all rental fees can be applied toward the purchase of any permanent domain name.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">3. Credit Notes & Invoicing</h2>
            <p>
              Approved refunds are issued as linked credit notes referencing the original sequential invoice number in our append-only accounting ledger.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
