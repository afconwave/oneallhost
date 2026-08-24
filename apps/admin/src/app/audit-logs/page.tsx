'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { ShieldCheck, Download, Search, Lock, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [searchFilter, setSearchFilter] = useState('');

  const auditLogs = [
    {
      id: 'AUD-9021',
      timestamp: '2026-08-23 02:45:11 UTC',
      staffId: 'STAFF-001 (Admin)',
      actionType: 'STAFF_IMPERSONATION',
      target: 'Client: alex@altonixa.com',
      details: 'Started support session with write-lock confirmation',
      ipAddress: '102.244.155.12',
      status: 'success',
    },
    {
      id: 'AUD-9020',
      timestamp: '2026-08-23 01:14:02 UTC',
      staffId: 'STAFF-004 (Ops)',
      actionType: 'MANUAL_FRAUD_REVIEW',
      target: 'Txn: TXN-20260823-9941',
      details: 'Approved crypto settlement for $499.00 USD after TXID hash verification',
      ipAddress: '197.234.22.8',
      status: 'approved',
    },
    {
      id: 'AUD-9019',
      timestamp: '2026-08-22 18:22:45 UTC',
      staffId: 'SYSTEM_AUTOPROCESS',
      actionType: 'LEASE_AUTO_EXPIRE',
      target: 'Subdomain: beta.360class.cm',
      details: '72hr lease expired. Subdomain deprovisioned and freed back to registry',
      ipAddress: '127.0.0.1',
      status: 'executed',
    },
    {
      id: 'AUD-9018',
      timestamp: '2026-08-22 14:05:30 UTC',
      staffId: 'STAFF-002 (Compliance)',
      actionType: 'KYC_APPROVAL',
      target: 'Client: finance@doualatech.cm',
      details: 'Approved Cameroon Business Registry Certificate verification',
      ipAddress: '102.244.155.12',
      status: 'verified',
    },
    {
      id: 'AUD-9017',
      timestamp: '2026-08-22 09:12:18 UTC',
      staffId: 'STAFF-001 (Admin)',
      actionType: 'PRICE_OVERRIDE',
      target: 'TLD: .cm Wholesale Matrix',
      details: 'Updated wholesale rate to $27.00 USD (Retail: 22,900 XAF)',
      ipAddress: '102.244.155.12',
      status: 'applied',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.staffId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.actionType.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.target.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Immutable Security Audit Log</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Append-only record of all administrative actions, staff impersonations, and price overrides.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV / JSON</span>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6E68]" />
          <Input
            placeholder="Filter by Staff ID, Action, or Target..."
            value={searchFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="info">Append-Only Storage</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event ID</TableHead>
            <TableHead>Timestamp (UTC)</TableHead>
            <TableHead>Actor / Staff</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target Entity</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs text-[#0D3B85] font-medium">
                {log.id}
              </TableCell>
              <TableCell className="font-mono text-[11px] text-[#6B6E68]">
                {log.timestamp}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#111111]">
                {log.staffId}
              </TableCell>
              <TableCell>
                <Badge variant="neutral">{log.actionType}</Badge>
              </TableCell>
              <TableCell className="text-xs text-[#111111]">
                {log.target}
              </TableCell>
              <TableCell className="text-xs text-[#6B6E68] max-w-xs truncate">
                {log.details}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {log.ipAddress}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
