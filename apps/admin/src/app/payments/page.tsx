'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { CreditCard, AlertTriangle, CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: 'tx-1',
      ref: 'ALX-MOMO-991204',
      order: 'Domain: altonixa-tech.com',
      method: 'MTN Mobile Money',
      amount: '$13.99 (8,610 XAF)',
      status: 'completed',
      fraudFlag: false,
      date: '2026-08-20',
    },
    {
      id: 'tx-2',
      ref: 'ALX-OM-883419',
      order: 'Rental: event2026.oah.link',
      method: 'Orange Money',
      amount: '$7.99 (4,920 XAF)',
      status: 'completed',
      fraudFlag: false,
      date: '2026-08-18',
    },
    {
      id: 'tx-3',
      ref: 'ALX-CARD-440212',
      order: 'Domain Renewal: 360class.cm',
      method: 'Card (Visa)',
      amount: '$37.99',
      status: 'completed',
      fraudFlag: false,
      date: '2026-07-15',
    },
    {
      id: 'tx-4',
      ref: 'ALX-CRYPTO-109283',
      order: 'Premium Domain: fintech.ai',
      method: 'USDT (TRC-20)',
      amount: '$89.99',
      status: 'review_required',
      fraudFlag: true,
      date: '2026-08-22',
    },
    {
      id: 'tx-5',
      ref: 'ALX-CARD-993821',
      order: 'Domain: quickshop.com',
      method: 'Card (Mastercard)',
      amount: '$13.99',
      status: 'failed',
      fraudFlag: false,
      date: '2026-08-22',
    },
  ]);

  const handleApproveFraud = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'completed', fraudFlag: false } : p))
    );
  };

  const handleRetryPayment = (id: string) => {
    alert(`[RETRY] Re-dispatching Altonixa Pay webhook trigger for transaction ${id}.`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#EBEBE7] pb-4">
        <h1 className="text-xl font-medium text-[#111111]">Altonixa Pay Reconciliation & Fraud Guard</h1>
        <p className="text-xs text-[#6B6E68] mt-0.5">
          Unified ledger across MTN MoMo, Orange Money, Credit Cards, and Cryptocurrency.
        </p>
      </div>

      {/* FRAUD ALERT BANNER (§8i) */}
      {payments.some((p) => p.fraudFlag) && (
        <Card elevation="surface-2" className="p-4 border-amber-300 bg-amber-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <div className="text-xs font-medium text-amber-900">Manual Review Required</div>
              <div className="text-[11px] text-amber-800">
                1 high-value crypto transaction flagged for first-time account review.
              </div>
            </div>
          </div>
          <Badge variant="warning">Action Needed</Badge>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Ref</TableHead>
            <TableHead>Order Description</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs font-medium text-[#0D3B85]">
                {tx.ref}
              </TableCell>
              <TableCell className="text-xs text-[#111111] max-w-xs truncate">
                {tx.order}
              </TableCell>
              <TableCell className="text-xs text-[#6B6E68]">
                {tx.method}
              </TableCell>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                {tx.amount}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {tx.date}
              </TableCell>
              <TableCell>
                {tx.status === 'completed' ? (
                  <Badge variant="success">Completed</Badge>
                ) : tx.status === 'review_required' ? (
                  <Badge variant="warning">Fraud Flagged</Badge>
                ) : (
                  <Badge variant="danger">Failed</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {tx.status === 'review_required' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleApproveFraud(tx.id)}
                  >
                    Release & Approve
                  </Button>
                )}
                {tx.status === 'failed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => handleRetryPayment(tx.id)}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
