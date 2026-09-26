'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, toast } from '@oneallhost/ui';
import { Users, Eye } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = () => {
    setIsLoading(true);
    fetch('/api/v1/admin/clients')
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

  const handleVerifyKyc = (id: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, kycStatus: 'verified' } : c))
    );
    toast.success(`KYC status verified for client ${id}`);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'reactivate'} this user?`)) return;
    
    try {
      const res = await fetch(`/api/v1/admin/clients/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: 'Admin action' })
      });
      if (res.ok) {
        setClients(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        toast.success(`User has been ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to change user status');
    }
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
            <TableRow key={client.id} className={client.status === 'suspended' ? 'opacity-60' : ''}>
              <TableCell>
                <div className="font-medium text-xs text-[#111111] flex items-center gap-2">
                  {client.name}
                  {client.status === 'suspended' && <Badge variant="danger" className="text-[9px] px-1 py-0 h-4">Suspended</Badge>}
                </div>
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
                  className={`text-xs gap-1 ${client.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                  onClick={() => handleToggleStatus(client.id, client.status || 'active')}
                >
                  {client.status === 'active' ? 'Suspend' : 'Reactivate'}
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

    </div>
  );
}
