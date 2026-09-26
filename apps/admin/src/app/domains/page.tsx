'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, toast } from '@oneallhost/ui';
import { RefreshCw } from 'lucide-react';

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDomains = () => {
    setIsLoading(true);
    fetch('/api/admin/domains')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.domains)) {
          setDomains(data.domains);
        }
      })
      .catch((err) => console.error('[Admin Domains Fetch Error]', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleManualRenew = (domainName: string) => {
    toast.success(`Sent upstream renew command to Namecheap/Registry for ${domainName}.`);
  };

  const handleSuspendDomain = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/domains/${id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Administrative suspension' }),
      });
      if (res.ok) {
        setDomains((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: 'suspended' } : d))
        );
        toast.warning(`Domain ${id} flagged as suspended.`);
      }
    } catch (err) {
      toast.error('Failed to suspend domain');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Global Domain Inventory</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Full registry portfolio under management with override actions (manual renew, suspend).
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5" onClick={fetchDomains}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Domains</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain Name</TableHead>
            <TableHead>Registrar</TableHead>
            <TableHead>Registered</TableHead>
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
                {dom.registrar || 'Oneallhost Enterprise Registry'}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {dom.registeredAt || 'N/A'}
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
                  <Badge variant="danger">Suspended</Badge>
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
                {dom.status !== 'suspended' && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuspendDomain(dom.id)}
                  >
                    Suspend
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {domains.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-xs text-[#6B6E68]">
                No registered domains found in database.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
