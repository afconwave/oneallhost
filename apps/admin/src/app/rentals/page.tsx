'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Repeat, Clock, AlertTriangle } from 'lucide-react';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState([
    {
      id: 'rent-1',
      subdomain: 'event2026.oah.link',
      renter: 'client@altonixa.com',
      startedAt: '2026-08-18',
      endsAt: '2026-08-25',
      price: '$7.99',
      status: 'active',
      hoursLeft: 44,
    },
    {
      id: 'rent-2',
      subdomain: 'promo-tech.oah.link',
      renter: 'agency@douala.cm',
      startedAt: '2026-08-01',
      endsAt: '2026-08-31',
      price: '$24.99',
      status: 'active',
      hoursLeft: 188,
    },
  ]);

  const handleForceExpireRental = (id: string) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'expired', hoursLeft: 0 } : r))
    );
  };

  const handleIssueRefund = (id: string, price: string) => {
    alert(`[ADMIN REFUND] Linked Credit Note issued for rental ${id} (${price}). Financial ledger updated.`);
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
            <TableHead>Renter Email</TableHead>
            <TableHead>Time Remaining</TableHead>
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
                {r.renter}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#0D3B85]">
                {r.hoursLeft > 0 ? `${r.hoursLeft}h remaining` : 'Expired'}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#111111]">
                {r.price}
              </TableCell>
              <TableCell>
                {r.status === 'active' ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="neutral">Expired</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleIssueRefund(r.id, r.price)}
                >
                  Refund & Credit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleForceExpireRental(r.id)}
                >
                  Force Expire
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
