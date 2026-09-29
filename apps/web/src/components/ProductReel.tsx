'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Plan {
  id: string;
  family: string;
  name: string;
  tagline: string;
  priceUsd: number;
  interval: string;
  highlights: string[];
}

export function ProductReel({ context = 'checkout' }: { context?: string }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetch(`/api/hosting/catalog?context=${encodeURIComponent(context)}`)
      .then((r) => r.json())
      .then((d) => setPlans(d.suggested || d.all || []))
      .catch(() => setPlans([]));
  }, [context]);

  if (!open || plans.length === 0) return null;

  return (
    <aside className="print:hidden fixed right-3 bottom-3 z-40 w-[280px] max-h-[70vh] rounded-2xl border border-[#EBEBE7] bg-white shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-[#091F44] text-white text-xs font-bold">
        <span>Suggested for you</span>
        <button type="button" onClick={() => setOpen(false)} className="text-white/80" aria-label="Close suggestions">
          ×
        </button>
      </div>
      <div className="h-[420px] overflow-y-auto snap-y snap-mandatory">
        {plans.map((p) => (
          <article key={p.id} className="snap-start min-h-[200px] p-4 border-b border-[#EBEBE7] space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-[#6B6E68]">{p.family}</p>
            <h3 className="text-sm font-extrabold text-[#111111]">{p.name}</h3>
            <p className="text-xs text-[#6B6E68]">{p.tagline}</p>
            <p className="text-lg font-black text-[#0D3B85]">
              ${p.priceUsd}
              <span className="text-xs font-semibold text-[#6B6E68]">/{p.interval}</span>
            </p>
            <ul className="text-[11px] text-[#6B6E68] list-disc pl-4">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <Link href={`/checkout?add=${p.id}`} className="inline-block text-xs font-bold text-white bg-[#D32F2F] rounded-lg px-3 py-2">
              Add to order
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}
