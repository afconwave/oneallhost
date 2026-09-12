'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import {
  Download,
  CreditCard,
  Receipt,
  FileText,
  CheckCircle2,
  Plus,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Wallet,
  Zap,
  ArrowUpRight,
  X,
  Smartphone,
} from 'lucide-react';
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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  balanceUsd: number;
  balanceXaf: number;
  autoDebitEnabled: boolean;
}

export default function BillingManagementPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [invoices, setInvoices] = useState<PaymentRecord[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState<boolean>(false);
  const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false);

  // Top-Up Modal State
  const [topupModalOpen, setTopupModalOpen] = useState<boolean>(false);
  const [topupAmountUsd, setTopupAmountUsd] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [topupMethod, setTopupMethod] = useState<string>('MTN');
  const [isTopupSubmitting, setIsTopupSubmitting] = useState<boolean>(false);
  const [topupSuccessMsg, setTopupSuccessMsg] = useState<string | null>(null);

  // Auto-Debit Toggle Loading State
  const [isUpdatingAutoDebit, setIsUpdatingAutoDebit] = useState<boolean>(false);

  const fetchBillingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userRes, invRes, cardRes] = await Promise.all([
        fetch('/api/users/me'),
        fetch('/api/users/invoices'),
        fetch('/api/payments/virtual-cards'),
      ]);

      if (!invRes.ok || !cardRes.ok) {
        throw new Error('Failed to load billing ledgers from server');
      }

      const [userData, invData, cardData] = await Promise.all([
        userRes.ok ? userRes.json() : { user: null },
        invRes.json(),
        cardRes.json(),
      ]);

      if (userData && userData.user) {
        setUserProfile(userData.user);
      }
      if (invData && Array.isArray(invData.invoices)) {
        setInvoices(invData.invoices);
      }
      if (cardData && Array.isArray(cardData.cards)) {
        setVirtualCards(cardData.cards);
      }
    } catch (err: any) {
      console.error('[Billing Ledger Fetch Error]', err);
      setError(err.message || 'Unable to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  // Handle Auto-Debit Toggle
  const handleToggleAutoDebit = async () => {
    if (!userProfile) return;
    const newStatus = !userProfile.autoDebitEnabled;
    setIsUpdatingAutoDebit(true);
    try {
      const res = await fetch('/api/users/wallet/auto-debit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newStatus }),
      });
      if (res.ok) {
        setUserProfile((prev) => (prev ? { ...prev, autoDebitEnabled: newStatus } : null));
      }
    } catch (e) {
      console.error('[Auto-Debit Toggle Error]', e);
    } finally {
      setIsUpdatingAutoDebit(false);
    }
  };

  // Handle Wallet Top-Up
  const handleTopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmountUsd = customAmount ? parseFloat(customAmount) : topupAmountUsd;
    if (isNaN(finalAmountUsd) || finalAmountUsd <= 0) return;

    setIsTopupSubmitting(true);
    setTopupSuccessMsg(null);
    try {
      const finalAmountXaf = Math.round(finalAmountUsd * 615.5);
      const res = await fetch('/api/users/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUsd: finalAmountUsd,
          amountXaf: finalAmountXaf,
          paymentMethod: `${topupMethod} Mobile Money`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTopupSuccessMsg(`Successfully added $${finalAmountUsd.toFixed(2)} USD to your wallet!`);
        if (data.user) {
          setUserProfile(data.user);
        }
        // Refresh invoices list to include topup
        const invRes = await fetch('/api/users/invoices');
        if (invRes.ok) {
          const invData = await invRes.json();
          if (invData && Array.isArray(invData.invoices)) {
            setInvoices(invData.invoices);
          }
        }
        setTimeout(() => {
          setTopupModalOpen(false);
          setTopupSuccessMsg(null);
        }, 1200);
      }
    } catch (err) {
      console.error('[Topup Error]', err);
    } finally {
      setIsTopupSubmitting(false);
    }
  };

  // Issue new virtual card via live API
  const handleIssueVirtualCard = async () => {
    setIsCreatingCard(true);
    try {
      const res = await fetch('/api/payments/virtual-card/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardHolder: userProfile?.name || 'ACCOUNT OWNER',
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

    const clientEmail = userProfile?.email || 'client@oneallhost.com';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Receipt Reference: ${inv.reference || inv.id}`, 20, 52);
    doc.text(`Date of Issue: ${new Date(inv.timestamp).toLocaleDateString()}`, 20, 58);
    doc.text(`Billed To: ${inv.client} (${clientEmail})`, 20, 64);
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
            Billing, Wallet & Auto-Debit
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Top up your account wallet, manage automated renewal debits, view tax receipts, and configure virtual cards.
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
          {/* WALLET BALANCE & AUTO-DEBIT CONTROL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#091F44] via-[#0D3B85] to-[#1B6FC9] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[#7CB342]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Account Wallet Balance
                    </span>
                    <div className="text-[11px] text-blue-100">Direct one-click payment & automated renews</div>
                  </div>
                </div>
                <Badge variant="success" className="bg-[#7CB342]/20 text-[#7CB342] border-[#7CB342]/30">
                  Live & Active
                </Badge>
              </div>

              <div className="my-6">
                <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                  ${(userProfile?.balanceUsd ?? 0).toFixed(2)}{' '}
                  <span className="text-lg font-normal text-blue-200">USD</span>
                </div>
                <div className="text-sm font-mono text-blue-200 mt-1">
                  ≈ {(userProfile?.balanceXaf ?? 0).toLocaleString()} XAF
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setTopupModalOpen(true)}
                  className="bg-[#DE3723] hover:bg-[#C52D1C] text-white font-bold text-xs gap-1.5 shadow-sm rounded-xl px-5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Top-Up Balance</span>
                </Button>
                <span className="text-[11px] text-blue-200">
                  Supports MTN, Orange, Wave, Visa, Mastercard & Tether USDT
                </span>
              </div>
            </div>

            {/* Auto-Debit & Renewal Preferences Card */}
            <div className="bg-white rounded-3xl border border-[#EBEBE7] p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#DE3723]" />
                  <h3 className="text-sm font-bold text-[#111111]">Auto-Debit for Renewals</h3>
                </div>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Automatically renew expiring domains and hosting services from your account wallet balance without manual intervention.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Auto-Debit Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userProfile?.autoDebitEnabled ?? true}
                      onChange={handleToggleAutoDebit}
                      disabled={isUpdatingAutoDebit}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D3B85]"></div>
                  </label>
                </div>
                <div className="text-[11px] text-[#6B6E68]">
                  {userProfile?.autoDebitEnabled
                    ? 'Enabled: Your domains will renew 7 days prior to expiry.'
                    : 'Disabled: Manual payment required prior to domain expiration.'}
                </div>
              </div>

              <div className="text-[11px] text-[#6B6E68] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero service downtime guarantee</span>
              </div>
            </div>
          </div>

          {/* TOP-UP MODAL */}
          {topupModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBEBE7] space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => setTopupModalOpen(false)}
                  className="absolute top-6 right-6 text-[#6B6E68] hover:text-[#111111]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#0D3B85]" />
                    <span>Top-Up Account Balance</span>
                  </h2>
                  <p className="text-xs text-[#6B6E68] mt-1">
                    Instant wallet credit via African Mobile Money, Card, or Crypto.
                  </p>
                </div>

                {topupSuccessMsg ? (
                  <div className="p-6 rounded-2xl bg-[#F3F8EC] border border-[#D6E8C2] text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#4E7525] mx-auto" />
                    <div className="text-xs font-bold text-[#4E7525]">{topupSuccessMsg}</div>
                  </div>
                ) : (
                  <form onSubmit={handleTopupSubmit} className="space-y-4">
                    {/* Presets */}
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-2">Select Amount</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setTopupAmountUsd(amt);
                              setCustomAmount('');
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                              topupAmountUsd === amt && !customAmount
                                ? 'bg-[#0D3B85] text-white border-[#0D3B85]'
                                : 'bg-[#FAFAF9] border-[#EBEBE7] text-[#111111] hover:border-gray-300'
                            }`}
                          >
                            ${amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-1">Or Custom USD Amount</label>
                      <Input
                        type="number"
                        placeholder="e.g. 75"
                        value={customAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setTopupAmountUsd(0);
                        }}
                      />
                    </div>

                    {/* Payment Method Rail */}
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-2">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['MTN', 'Orange', 'Wave', 'Card', 'USDT'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setTopupMethod(m)}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                              topupMethod === m
                                ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 text-[#0D3B85]'
                                : 'bg-[#FAFAF9] border-[#EBEBE7] text-[#6B6E68] hover:border-gray-300'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAF9] rounded-xl border border-[#EBEBE7] flex justify-between items-center text-xs">
                      <span className="text-[#6B6E68]">Estimated Local Total:</span>
                      <span className="font-mono font-bold text-[#111111]">
                        {Math.round(
                          (customAmount ? parseFloat(customAmount) || 0 : topupAmountUsd) * 615.5
                        ).toLocaleString()}{' '}
                        XAF
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-[#DE3723] hover:bg-[#C52D1C] text-white font-bold rounded-xl h-11"
                      isLoading={isTopupSubmitting}
                    >
                      Confirm & Fund Wallet
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

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
                  When you register domains, lease subdomains, or top-up your wallet, your itemized tax receipts will appear here.
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

