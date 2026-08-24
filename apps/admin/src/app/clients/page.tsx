'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Users, Search, ShieldCheck, ShieldAlert, UserCheck, Eye } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([
    {
      id: 'usr-1',
      name: 'Altonixa Enterprise',
      email: 'client@altonixa.com',
      phone: '+237 671 223 419',
      country: 'Cameroon',
      role: 'client',
      kyc: 'verified',
      domainsCount: 3,
      rentalsCount: 2,
      totalSpent: '$64.97',
    },
    {
      id: 'usr-2',
      name: 'Douala Media Agency',
      email: 'agency@douala.cm',
      phone: '+237 690 441 882',
      country: 'Cameroon',
      role: 'client',
      kyc: 'verified',
      domainsCount: 5,
      rentalsCount: 4,
      totalSpent: '$148.50',
    },
    {
      id: 'usr-3',
      name: 'Crypto Fintech Ltd',
      email: 'ops@fintech.io',
      phone: '+1 415 555 0192',
      country: 'International',
      role: 'client',
      kyc: 'pending',
      domainsCount: 1,
      rentalsCount: 0,
      totalSpent: '$89.99',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleImpersonate = (clientName: string, clientEmail: string) => {
    alert(`[AUDIT LOGGED] Support impersonation session started for ${clientName} (${clientEmail}). All actions logged.`);
  };

  const handleVerifyKyc = (id: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, kyc: 'verified' } : c))
    );
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Client Directory & KYC Control</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Manage user accounts, review compliance documents for crypto payments, and support clients.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name & Email</TableHead>
            <TableHead>Country / Phone</TableHead>
            <TableHead>KYC Status</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="font-medium text-xs text-[#111111]">{client.name}</div>
                <div className="font-mono text-[11px] text-[#6B6E68]">{client.email}</div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-[#111111]">{client.country}</div>
                <div className="font-mono text-[11px] text-[#6B6E68]">{client.phone}</div>
              </TableCell>
              <TableCell>
                {client.kyc === 'verified' ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="warning">Pending Review</Badge>
                )}
              </TableCell>
              <TableCell className="text-xs text-[#6B6E68]">
                {client.domainsCount} domains • {client.rentalsCount} rentals
              </TableCell>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                {client.totalSpent}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {client.kyc === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleVerifyKyc(client.id)}
                  >
                    Approve KYC
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => handleImpersonate(client.name, client.email)}
                >
                  <Eye className="w-3 h-3" />
                  <span>Impersonate</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
