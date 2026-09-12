'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import {
  Download,
  CreditCard,
  Receipt,
  CheckCircle2,
  Plus,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Wallet,
  Zap,
  X,
  Trash2,
  Star,
  Lock,
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

interface PaymentMethodRecord {
  id: string;
  userId: string;
  type: 'card' | 'momo';
  cardHolder: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  createdAt: string;
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Card Modal State
  const [addCardModalOpen, setAddCardModalOpen] = useState<boolean>(false);
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isDefaultCard, setIsDefaultCard] = useState<boolean>(false);
  const [isSavingCard, setIsSavingCard] = useState<boolean>(false);
  const [cardSaveError, setCardSaveError] = useState<string | null>(null);

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
      const [userRes, invRes, methodRes] = await Promise.all([
        fetch('/api/users/me'),
        fetch('/api/users/invoices'),
        fetch('/api/payments/methods'),
      ]);

      if (!invRes.ok || !methodRes.ok) {
        throw new Error('Failed to load billing ledgers from server');
      }

      const [userData, invData, methodData] = await Promise.all([
        userRes.ok ? userRes.json() : { user: null },
        invRes.json(),
        methodRes.json(),
      ]);

      if (userData && userData.user) {
        setUserProfile(userData.user);
        if (!cardHolder) setCardHolder(userData.user.name || 'Account Owner');
      }
      if (invData && Array.isArray(invData.invoices)) {
        setInvoices(invData.invoices);
      }
      if (methodData && Array.isArray(methodData.methods)) {
        setPaymentMethods(methodData.methods);
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

  // Handle Save New Payment Card
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiry) {
      setCardSaveError('Please fill out all required card details');
      return;
    }

    setIsSavingCard(true);
    setCardSaveError(null);
    try {
      const res = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardHolder,
          cardNumber,
          expiry,
          isDefault: isDefaultCard || paymentMethods.length === 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.method) {
          if (data.method.isDefault) {
            setPaymentMethods((prev) => [
              data.method,
              ...prev.map((m) => ({ ...m, isDefault: false })),
            ]);
          } else {
            setPaymentMethods((prev) => [...prev, data.method]);
          }
        }
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setAddCardModalOpen(false);
      } else {
        const errData = await res.json();
        setCardSaveError(errData.error || 'Failed to save card');
      }
    } catch (err: any) {
      console.error('[Save Card Error]', err);
      setCardSaveError(err.message || 'Error communicating with card processor');
    } finally {
      setIsSavingCard(false);
    }
  };

  // Handle Set Default Card
  const handleSetDefaultCard = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/methods/${id}/default`, {
        method: 'PUT',
      });
      if (res.ok) {
        setPaymentMethods((prev) =>
          prev.map((m) => ({ ...m, isDefault: m.id === id }))
        );
      }
    } catch (err) {
      console.error('[Set Default Error]', err);
    }
  };

  // Handle Remove Card
  const handleRemoveCard = async (id: string) => {
    if (!confirm('Are you sure you want to remove this saved payment method?')) return;
    try {
      const res = await fetch(`/api/payments/methods/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('[Remove Card Error]', err);
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
            Billing, Wallet &amp; Payment Methods
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Manage your account wallet balance, auto-renewal debits, saved credit/debit cards, and download official tax receipts.
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
                    <div className="text-[11px] text-blue-100">Direct one-click payment &amp; automated renews</div>
                  </div>
                </div>
                <Badge variant="success" className="bg-[#7CB342]/20 text-[#7CB342] border-[#7CB342]/30">
                  Live &amp; Active
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
                  Supports MTN, Orange, Wave, Visa, Mastercard &amp; Tether USDT
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
                  Automatically renew expiring domains and hosting services from your account wallet balance or saved card without manual intervention.
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
                      Confirm &amp; Fund Wallet
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* SAVED PAYMENT METHODS & CARDS SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0D3B85]" />
                  <span>Saved Payment Methods &amp; Cards</span>
                </h2>
                <p className="text-[11px] text-[#6B6E68] mt-0.5">
                  Save credit or debit cards to enable seamless domain checkout and automated renewals.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCardSaveError(null);
                  setAddCardModalOpen(true);
                }}
                className="text-xs font-bold gap-1.5 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white rounded-xl shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Payment Card</span>
              </Button>
            </div>

            {/* Saved Cards Grid */}
            {paymentMethods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((pm) => {
                  const isVisa = pm.brand.toLowerCase().includes('visa');
                  const isMastercard = pm.brand.toLowerCase().includes('mastercard');

                  return (
                    <div
                      key={pm.id}
                      className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                        pm.isDefault ? 'border-[#0D3B85] ring-2 ring-[#0D3B85]/10' : 'border-[#EBEBE7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#F0F3F9] flex items-center justify-center font-bold text-xs text-[#0D3B85]">
                            {isVisa ? 'VISA' : isMastercard ? 'MC' : 'CARD'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#111111]">{pm.brand}</div>
                            <div className="text-[10px] text-[#6B6E68]">Exp: {pm.expiry}</div>
                          </div>
                        </div>

                        {pm.isDefault ? (
                          <Badge variant="info" className="bg-[#0D3B85]/10 text-[#0D3B85] border-0 text-[10px] font-bold">
                            Default
                          </Badge>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultCard(pm.id)}
                            className="text-[11px] font-semibold text-[#6B6E68] hover:text-[#0D3B85] hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <div className="font-mono text-sm font-bold text-[#111111] tracking-widest">
                        •••• •••• •••• {pm.last4}
                      </div>

                      <div className="pt-2 border-t border-[#F0F0EE] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#6B6E68] font-medium truncate max-w-[150px]">
                          {pm.cardHolder}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveCard(pm.id)}
                          title="Remove card"
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] text-center space-y-2">
                <CreditCard className="w-8 h-8 text-[#6B6E68] mx-auto opacity-30" />
                <div className="text-xs font-semibold text-[#111111]">No saved payment methods</div>
                <p className="text-[11px] text-[#6B6E68] max-w-sm mx-auto">
                  Add a Visa, Mastercard, or debit card to simplify checkout and avoid domain expiration.
                </p>
              </div>
            )}
          </div>

          {/* ADD PAYMENT CARD MODAL */}
          {addCardModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBEBE7] space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => setAddCardModalOpen(false)}
                  className="absolute top-6 right-6 text-[#6B6E68] hover:text-[#111111]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#0D3B85]" />
                    <span>Add Payment Card</span>
                  </h2>
                  <p className="text-xs text-[#6B6E68] mt-1">
                    Card details are securely tokenized for 256-bit encrypted transactions.
                  </p>
                </div>

                {cardSaveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    {cardSaveError}
                  </div>
                )}

                <form onSubmit={handleSaveCard} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Jean Dupont"
                      value={cardHolder}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardHolder(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#111111] block mb-1">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <Input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-1">
                        CVV / CVC
                      </label>
                      <Input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="defaultCardCheck"
                      checked={isDefaultCard}
                      onChange={(e) => setIsDefaultCard(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0D3B85] accent-[#0D3B85]"
                    />
                    <label htmlFor="defaultCardCheck" className="text-xs text-[#6B6E68] cursor-pointer">
                      Set as primary payment method for renewals
                    </label>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold rounded-xl h-11"
                      isLoading={isSavingCard}
                    >
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      <span>Save Card Securely</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#EBEBE7] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#0D3B85]" />
                <span>Invoice &amp; Payment History</span>
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

