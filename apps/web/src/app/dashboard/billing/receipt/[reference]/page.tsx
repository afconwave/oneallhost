'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { clientAuthHeaders } from '../../../../../lib/session';

export default function ReceiptPage() {
  const params = useParams<{ reference: string }>();
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/receipts/${encodeURIComponent(params.reference)}`, { headers: clientAuthHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.receipt) setReceipt(d.receipt);
        else setError(d.error || 'Receipt not found');
      })
      .catch(() => setError('Could not load receipt'));
  }, [params.reference]);

  if (error) {
    return <div className="p-8 text-sm text-red-700">{error} — <Link href="/dashboard/billing" className="underline">Back to billing</Link></div>;
  }
  if (!receipt) return <div className="p-8 text-sm text-[#6B6E68]">Loading receipt…</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between print:hidden mb-4">
        <Link href="/dashboard/billing" className="text-xs font-bold text-[#0D3B85]">← Billing</Link>
        <button type="button" onClick={() => window.print()} className="h-9 px-4 rounded-lg bg-[#0D3B85] text-white text-xs font-bold">Print / PDF</button>
      </div>
      <article className="print-sheet bg-white border border-[#EBEBE7] rounded-2xl overflow-hidden">
        <header className="bg-[#091F44] text-white px-8 py-6 flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Oneallhost Inc.</p>
            <h1 className="text-2xl font-black">Receipt</h1>
            <p className="text-xs text-white/70 mt-1">{receipt.legal}</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-mono">{receipt.number}</p>
            <p className="text-white/70">{new Date(receipt.issuedAt).toLocaleString()}</p>
            <p className="mt-1 font-bold uppercase">{receipt.status}</p>
          </div>
        </header>
        <section className="px-8 py-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-[10px] uppercase text-[#6B6E68] font-bold">Billed to</p>
            <p className="font-bold">{receipt.payer?.name}</p>
            <p className="text-[#6B6E68]">{receipt.payer?.email}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#6B6E68] font-bold">Payment</p>
            <p>{receipt.method}</p>
          </div>
        </section>
        <section className="px-8 pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase text-[#6B6E68] border-b border-[#EBEBE7]">
                <th className="py-2">Item</th>
                <th className="py-2 text-right">USD</th>
                <th className="py-2 text-right">XAF</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#EBEBE7]">
                <td className="py-3">{receipt.item}</td>
                <td className="py-3 text-right font-mono">${Number(receipt.amountUsd).toFixed(2)}</td>
                <td className="py-3 text-right font-mono">{Number(receipt.amountXaf).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-right text-lg font-black mt-4">Total ${Number(receipt.amountUsd).toFixed(2)}</p>
          <p className="text-[11px] text-[#6B6E68] mt-6">This is an official payment receipt from Oneallhost. {receipt.email}</p>
        </section>
      </article>
    </div>
  );
}
