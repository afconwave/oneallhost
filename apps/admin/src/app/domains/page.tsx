'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Globe, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState([
    {
      id: 'dom-1',
      name: 'altonixa-tech.com',
      owner: 'client@altonixa.com',
      regId: 'RC-9821034-ALX',
      expiresAt: '2026-09-15',
      status: 'active',
      autoRenew: true,
    },
    {
      id: 'dom-2',
      name: '360class.cm',
      owner: 'client@altonixa.com',
      regId: 'RC-9821099-360',
      expiresAt: '2026-11-20',
      status: 'active',
      autoRenew: true,
    },
    {
      id: 'dom-3',
      name: 'douala-event.cm',
      owner: 'agency@douala.cm',
      regId: 'RC-9821150-DLA',
      expiresAt: '2026-09-01',
      status: 'expiring_soon',
      autoRenew: false,
    },
  ]);

  const handleManualRenew = (id: string) => {
    alert(`[ADMIN OVERRIDE] Sent upstream renew command to ResellerClub API for ${id}.`);
  };

  const handleForceExpire = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'expired' } : d))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Global Domain Inventory</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Full registry portfolio under management with override actions (manual renew, force-expire).
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync ResellerClub registry</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain Name</TableHead>
            <TableHead>Registrar Ref ID</TableHead>
            <TableHead>Owner Email</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Overrides</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((dom) => (
            <TableRow key={dom.id}>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                {dom.name}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {dom.regId}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#1B6FC9]">
                {dom.owner}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#111111]">
                {dom.expiresAt}
              </TableCell>
              <TableCell>
                {dom.status === 'active' ? (
                  <Badge variant="success">Active</Badge>
                ) : dom.status === 'expiring_soon' ? (
                  <Badge variant="warning">Expiring Soon</Badge>
                ) : (
                  <Badge variant="danger">Expired</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleManualRenew(dom.name)}
                >
                  Manual Renew
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleForceExpire(dom.id)}
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
