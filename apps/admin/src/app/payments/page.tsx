'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, toast } from '@oneallhost/ui';
import { RotateCcw } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = () => {
    setIsLoading(true);
    fetch('/api/admin/payments')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.payments)) {
          setPayments(data.payments);
        }
      })
      .catch((err) => console.error('[Admin Payments Fetch Error]', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRetryPayment = (ref: string) => {
    toast.info(`Re-dispatching settlement webhook trigger for reference ${ref}.`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#EBEBE7] pb-4">
        <h1 className="text-xl font-medium text-[#111111]">Payment Reconciliation & Settlement Ledger</h1>
        <p className="text-xs text-[#6B6E68] mt-0.5">
          Unified ledger across MTN MoMo, Orange Money, Credit Cards, and Direct Bank Transfers.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Ref</TableHead>
            <TableHead>Client / Order</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Amount (USD / XAF)</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((tx) => (
            <TableRow key={tx.id || tx.reference}>
              <TableCell className="font-mono text-xs font-medium text-[#0D3B85]">
                {tx.reference || tx.id}
              </TableCell>
              <TableCell className="text-xs text-[#111111] max-w-xs truncate">
                <div className="font-medium">{tx.client || 'Client'}</div>
                <div className="text-[11px] text-[#6B6E68]">{tx.item || 'Order'}</div>
              </TableCell>
              <TableCell className="text-xs text-[#6B6E68]">
                {tx.method}
              </TableCell>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                ${Number(tx.amountUsd || 0).toFixed(2)} USD ({Number(tx.amountXaf || 0).toLocaleString()} XAF)
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
              </TableCell>
              <TableCell>
                {tx.status === 'settled' || tx.status === 'completed' ? (
                  <Badge variant="success">Settled</Badge>
                ) : tx.status === 'pending' ? (
                  <Badge variant="warning">Pending</Badge>
                ) : (
                  <Badge variant="danger">Failed</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {tx.status !== 'settled' && tx.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => handleRetryPayment(tx.reference || tx.id)}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-verify</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-xs text-[#6B6E68]">
                No payment transactions recorded in ledger.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
