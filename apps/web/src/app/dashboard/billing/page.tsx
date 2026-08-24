'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Download, CreditCard, Receipt, FileText, CheckCircle2, Plus, ShieldCheck, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PaymentRecord {
  id: string;
  userId: string;
  client: string;
  method: string;
  amountUsd: number;
  amountXaf: number;
  status: string;
  item: string;
  reference: string;
  timestamp: string;
}

interface VirtualCardRecord {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  balanceUsd: number;
  balanceXaf: number;
  brand: string;
  status: string;
}

export default function BillingManagementPage() {
  const [invoices, setInvoices] = useState<PaymentRecord[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState<boolean>(false);
  const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false);

  const fetchBillingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [invRes, cardRes] = await Promise.all([
        fetch('http://localhost:4000/api/v1/users/invoices'),
        fetch('http://localhost:4000/api/v1/payments/virtual-cards'),
      ]);

      if (!invRes.ok || !cardRes.ok) {
        throw new Error('Failed to load billing ledgers from server');
      }

      const invData = await invRes.json();
      const cardData = await cardRes.json();

      setInvoices(invData.invoices || []);
      setVirtualCards(cardData.cards || []);
    } catch (err: any) {
      console.error('[Billing Fetch Error]', err);
      setError(err.message || 'Unable to connect to billing server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  // Issue new virtual card via live API
  const handleIssueVirtualCard = async () => {
    setIsCreatingCard(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/payments/virtual-card/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardHolder: 'ALOAH MILTON',
          initialBalanceUsd: 50,
          brand: 'Visa',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVirtualCards((prev) => [...prev, data.card]);
      }
    } catch (err) {
      console.error('[Card Issue Error]', err);
    } finally {
      setIsCreatingCard(false);
    }
  };

  // Generate real PDF invoice receipt
  const handleDownloadPdf = (inv: PaymentRecord) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(13, 59, 133);
    doc.text('ONEALLHOST INC.', 20, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 110, 104);
    doc.text('ICANN Accredited Infrastructure • Yaoundé, Cameroon', 20, 26);
    doc.text('Email: billing@oneallhost.com • Tax NIU: M012612345678X', 20, 31);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 17, 17);
    doc.text('TAX INVOICE / OFFICIAL RECEIPT', 20, 44);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Receipt Reference: ${inv.reference || inv.id}`, 20, 52);
    doc.text(`Date of Issue: ${new Date(inv.timestamp).toLocaleDateString()}`, 20, 58);
    doc.text(`Billed To: ${inv.client} (aloahmilton9@gmail.com)`, 20, 64);
    doc.text(`Payment Rail: ${inv.method} (Settled)`, 20, 70);

    autoTable(doc, {
      startY: 78,
      head: [['Item Description', 'Qty', 'Unit Price (USD)', 'Total (XAF)']],
      body: [[inv.item, '1', `$${inv.amountUsd.toFixed(2)}`, `${inv.amountXaf.toLocaleString()} XAF`]],
      theme: 'grid',
      headStyles: { fillColor: [13, 59, 133], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Total Paid: $${inv.amountUsd.toFixed(2)} USD (${inv.amountXaf.toLocaleString()} XAF)`, 20, finalY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(107, 110, 104);
    doc.text('Thank you for choosing Oneallhost. All rights reserved.', 20, finalY + 10);

    doc.save(`Invoice_${inv.reference || inv.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Billing, Invoices & Virtual Cards
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Automated tax receipts, mobile money transaction records, and virtual debit card management.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchBillingData}
          className="text-xs font-semibold gap-1.5 border-[#DCDDD8]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* STATE 1: LOADING SKELETON */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="h-64 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      )}

      {/* STATE 2: ERROR STATE WITH RETRY */}
      {!isLoading && error && (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">Billing Service Unavailable</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchBillingData} className="bg-red-700 hover:bg-red-800 text-xs">
            Retry Connection
          </Button>
        </div>
      )}

      {/* STATES 3 & 4: POPULATED & EMPTY STATES */}
      {!isLoading && !error && (
        <div className="space-y-8">
          {/* Virtual Cards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0D3B85]" />
                <span>Virtual Debit Cards</span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleIssueVirtualCard}
                isLoading={isCreatingCard}
                className="text-xs font-bold gap-1 text-[#0D3B85] border-[#DCDDD8]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue New Card ($50)</span>
              </Button>
            </div>

            {virtualCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {virtualCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-[#091F44] to-[#0D3B85] text-white shadow-md flex flex-col justify-between h-48 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-[#7CB342]">ONEALLHOST PREPAID</span>
                      <span className="text-xs font-bold font-mono">{card.brand}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-mono text-base font-bold tracking-widest text-white flex items-center gap-2">
                        <span>
                          {showCardDetails ? card.cardNumber : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCardDetails(!showCardDetails)}
                          className="text-blue-200 hover:text-white"
                        >
                          {showCardDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-blue-200 flex gap-4">
                        <span>EXP: {card.expiry}</span>
                        <span>CVV: {showCardDetails ? card.cvv : '•••'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                      <span className="font-semibold text-white">{card.cardHolder}</span>
                      <span className="font-bold text-[#7CB342]">${card.balanceUsd.toFixed(2)} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] text-center space-y-2">
                <CreditCard className="w-7 h-7 text-[#6B6E68] mx-auto opacity-40" />
                <div className="text-xs font-semibold text-[#111111]">No active virtual cards</div>
                <p className="text-[11px] text-[#6B6E68]">Issue a virtual USD debit card funded via Mobile Money.</p>
              </div>
            )}
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#EBEBE7] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#0D3B85]" />
                <span>Invoice & Payment History</span>
              </h2>
            </div>

            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-[#FAFAF9]/80 transition-colors text-xs">
                        <TableCell className="font-mono font-semibold text-[#0D3B85]">
                          {inv.reference || inv.id}
                        </TableCell>
                        <TableCell className="text-[#6B6E68]">
                          {new Date(inv.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold text-[#111111]">
                          {inv.item}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[#111111]">${inv.amountUsd.toFixed(2)}</div>
                          <div className="text-[10px] text-[#6B6E68]">{inv.amountXaf.toLocaleString()} XAF</div>
                        </TableCell>
                        <TableCell className="text-[#6B6E68]">
                          {inv.method}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Settled</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPdf(inv)}
                            className="h-8 px-2.5 text-xs text-[#0D3B85] border-[#DCDDD8] gap-1 font-semibold hover:bg-blue-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <Receipt className="w-8 h-8 text-[#6B6E68] mx-auto opacity-40" />
                <div className="text-sm font-semibold text-[#111111]">No payment history yet</div>
                <p className="text-xs text-[#6B6E68] max-w-sm mx-auto">
                  When you register domains or lease subdomains, your itemized tax receipts will be generated here.
                </p>
                <Link href="/#domains" className="inline-block pt-2">
                  <Button variant="primary" size="sm" className="bg-[#0D3B85] hover:bg-[#1B6FC9] text-xs">
                    Search Domains
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
