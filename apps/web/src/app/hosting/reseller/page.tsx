'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { ProductReel } from '../../../components/ProductReel';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceUsd: number;
  interval: string;
  highlights: string[];
  family: string;
}

export default function ResellerHostingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [whmReady, setWhmReady] = useState(false);

  useEffect(() => {
    fetch('/api/hosting/catalog?context=reseller')
      .then((r) => r.json())
      .then((d) => {
        setPlans((d.all || []).filter((p: Plan) => p.family === 'reseller'));
        setWhmReady(Boolean(d.whmReady));
      })
      .catch(() => setPlans([]));
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />
      <section className="bg-[#091F44] text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded">Reseller Hosting</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold">Sell hosting under your brand</h1>
          <p className="text-white/80 max-w-2xl">
            Plans come from the live catalog. Provisioning uses WHM createacct after payment — Namecheap XML is domains only.
          </p>
          <p className="text-xs font-semibold">{whmReady ? 'WHM endpoint configured' : 'WHM not configured yet — orders queue as pending provision'}</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-6 print-sheet">
        {plans.map((p) => (
          <article key={p.id} className="bg-white rounded-2xl border border-[#EBEBE7] p-6 space-y-3">
            <h2 className="text-xl font-extrabold">{p.name}</h2>
            <p className="text-sm text-[#6B6E68]">{p.tagline}</p>
            <p className="text-3xl font-black text-[#0D3B85]">${p.priceUsd}<span className="text-sm">/{p.interval}</span></p>
            <ul className="text-sm space-y-1">{p.highlights.map((h) => <li key={h}>• {h}</li>)}</ul>
            <Link href={`/checkout?add=${p.id}`} className="inline-block h-11 px-5 leading-[2.75rem] bg-[#D32F2F] text-white font-extrabold text-sm rounded-xl">Choose plan</Link>
          </article>
        ))}
      </section>
      <ProductReel context="reseller" />
      <Footer />
    </div>
  );
}
