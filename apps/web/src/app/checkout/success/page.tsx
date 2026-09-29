'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { fulfillPaidOrder, CartItem } from '../../../lib/fulfill-order';

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState('Fulfilling order…');
  const [receiptRef, setReceiptRef] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentReference = params.get('ref') || params.get('paymentReference') || '';
    const domain = params.get('domain') || '';
    const planId = params.get('plan') || '';
    if (!paymentReference) {
      setError('Missing payment reference');
      return;
    }
    setReceiptRef(paymentReference);
    const items: CartItem[] = [];
    if (domain && planId) items.push({ kind: 'hosting', planId, domain });
    else if (domain) items.push({ kind: 'domain', domainName: domain });
    fulfillPaidOrder(paymentReference, items)
      .then((data) => setStatus(data.success ? 'Order fulfilled' : 'Partial fulfillment — see details'))
      .catch((e) => setError(e.message || 'Fulfillment failed'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F5]">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full p-8 space-y-4">
        <h1 className="text-2xl font-black">Payment received</h1>
        {error ? <p className="text-red-700 text-sm">{error}</p> : <p className="text-sm">{status}</p>}
        {receiptRef ? (
          <Link href={`/dashboard/billing/receipt/${encodeURIComponent(receiptRef)}`} className="inline-block h-10 px-4 leading-10 bg-[#091F44] text-white text-xs font-bold rounded-lg">
            View branded receipt
          </Link>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
