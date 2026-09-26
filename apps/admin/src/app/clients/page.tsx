'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, toast } from '@oneallhost/ui';
import { Users, Eye } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Impersonation Gate State
  const [impersonateClient, setImpersonateClient] = useState<any>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const fetchClients = () => {
    setIsLoading(true);
    fetch('/api/admin/clients')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.clients)) {
          setClients(data.clients);
        }
      })
      .catch((err) => console.error('[Admin Clients Fetch Error]', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleImpersonateClick = (client: any) => {
    setImpersonateClient(client);
    setPinInput('');
    setPinError('');
  };

  const confirmImpersonate = () => {
    if (pinInput === impersonateClient.supportPin) {
      toast.success(`Access Granted! Impersonation session started for ${impersonateClient.name} (${impersonateClient.email}).`);
      setImpersonateClient(null);
    } else {
      setPinError('Invalid Support PIN. Access Denied.');
    }
  };

  const handleVerifyKyc = (id: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, kycStatus: 'verified' } : c))
    );
    toast.success(`KYC status verified for client ${id}`);
  };

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Wallet Balance</TableHead>
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
                <div className="text-xs text-[#111111]">{client.countryCode || 'CM'}</div>
                <div className="font-mono text-[11px] text-[#6B6E68]">{client.phone || 'N/A'}</div>
              </TableCell>
              <TableCell>
                {client.kycStatus === 'verified' ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="warning">Pending Review</Badge>
                )}
              </TableCell>
              <TableCell className="text-xs text-[#6B6E68]">
                {client.domainsCount || 0} domains • {client.rentalsCount || 0} rentals
              </TableCell>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                ${Number(client.balanceUsd || 0).toFixed(2)} USD
              </TableCell>
              <TableCell className="text-right space-x-2">
                {client.kycStatus === 'pending' && (
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
                  onClick={() => handleImpersonateClick(client)}
                >
                  <Eye className="w-3 h-3" />
                  <span>Impersonate</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-xs text-[#6B6E68]">
                No registered clients found matching the search query.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Support PIN Unlock Gate Modal */}
      {impersonateClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-[#EBEBE7]">
            <h3 className="text-lg font-bold text-[#111111] mb-2 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#0D3B85]" /> Account Locked
            </h3>
            <p className="text-sm text-[#6B6E68] mb-4">
              To impersonate <span className="font-bold text-[#111111]">{impersonateClient.name}</span>, you must request their 4-digit Support PIN.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Enter Support PIN</label>
                <Input
                  placeholder="e.g. 1234"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="font-mono text-center tracking-[0.5em] text-lg"
                />
                {pinError && <p className="text-xs text-red-600 font-bold mt-2">{pinError}</p>}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setImpersonateClient(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={confirmImpersonate} className="bg-[#0D3B85] hover:bg-[#1B6FC9]">Unlock Account</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
