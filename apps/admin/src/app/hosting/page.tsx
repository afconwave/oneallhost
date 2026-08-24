'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Server, CheckCircle2, Clock } from 'lucide-react';

export default function AdminHostingPage() {
  const [waitlist, setWaitlist] = useState([
    { id: 'h-1', email: 'alex@company.com', tier: 'Professional', joinedAt: '2026-08-20', status: 'waitlist' },
    { id: 'h-2', email: 'dev@startup.cm', tier: 'Business', joinedAt: '2026-08-21', status: 'waitlist' },
    { id: 'h-3', email: 'founder@fintech.africa', tier: 'Starter', joinedAt: '2026-08-22', status: 'waitlist' },
  ]);

  const handleApproveProvisioning = (id: string) => {
    setWaitlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'provisioning' } : item))
    );
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#EBEBE7] pb-4">
        <h1 className="text-xl font-medium text-[#111111]">Cloud Hosting Queue & Provisioning</h1>
        <p className="text-xs text-[#6B6E68] mt-0.5">
          Manage waitlist enrollments and server allocation approvals.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Email</TableHead>
            <TableHead>Requested Tier</TableHead>
            <TableHead>Waitlist Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waitlist.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs font-medium text-[#111111]">
                {item.email}
              </TableCell>
              <TableCell className="text-xs text-[#0D3B85]">
                {item.tier}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#6B6E68]">
                {item.joinedAt}
              </TableCell>
              <TableCell>
                {item.status === 'waitlist' ? (
                  <Badge variant="warning">Waitlist Enrolled</Badge>
                ) : (
                  <Badge variant="info">Provisioning</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {item.status === 'waitlist' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleApproveProvisioning(item.id)}
                  >
                    Approve & Provision
                  </Button>
                ) : (
                  <span className="text-xs text-[#4E7525] font-medium">Server Allocated</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
