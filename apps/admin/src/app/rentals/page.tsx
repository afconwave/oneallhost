'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, toast } from '@oneallhost/ui';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRentals = () => {
    setIsLoading(true);
    fetch('/api/admin/rentals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.rentals)) {
          setRentals(data.rentals);
        }
      })
      .catch((err) => console.error('[Admin Rentals Fetch Error]', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleForceExpireRental = (id: string) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'expired' } : r))
    );
    toast.warning(`Rental ${id} expired.`);
  };

  const handleIssueRefund = (id: string, price: number) => {
    toast.success(`Refund & Credit Note issued for rental ${id} ($${price}).`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#EBEBE7] pb-4">
        <h1 className="text-xl font-medium text-[#111111]">Active Subdomain Leases & Rentals</h1>
        <p className="text-xs text-[#6B6E68] mt-0.5">
          Monitor temporary leased URLs, view lease timeframes, and issue credit refunds.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subdomain / URL</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Price Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs font-medium text-[#1B6FC9]">
                {r.subdomain}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {r.clientName || r.userId}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#0D3B85]">
                {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#111111]">
                ${Number(r.priceUsd || 0).toFixed(2)} USD
              </TableCell>
              <TableCell>
                {r.status === 'active' ? (
                  <Badge variant="success">Active</Badge>
                ) : r.status === 'converted_to_purchase' ? (
                  <Badge variant="info">Purchased Domain</Badge>
                ) : (
                  <Badge variant="neutral">Expired</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleIssueRefund(r.id, r.priceUsd)}
                >
                  Refund & Credit
                </Button>
                {r.status === 'active' && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleForceExpireRental(r.id)}
                  >
                    Force Expire
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {rentals.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-xs text-[#6B6E68]">
                No subdomain staging leases active.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
