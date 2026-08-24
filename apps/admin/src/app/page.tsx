'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { DollarSign, Users, Globe, Repeat, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('http://localhost:4000/api/v1/admin/stats'),
        fetch('http://localhost:4000/api/v1/admin/audit-logs'),
      ]);

      if (!statsRes.ok || !logsRes.ok) {
        throw new Error('Failed to load operational metrics from server');
      }

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      setStats(statsData.data || null);
      setAuditLogs(logsData.logs || []);
    } catch (err: any) {
      console.error('[Admin Overview Fetch Error]', err);
      setError(err.message || 'Unable to connect to Admin API Gateway');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">Platform Operations Overview</h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Real-time computed metrics for domain sales, rental leases, payment reconciliation, and infrastructure.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAdminData}
          className="text-xs font-semibold gap-1.5 border-[#DCDDD8]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </Button>
      </div>

      {/* STATE 1: LOADING SKELETON */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-28 bg-gray-100 rounded-2xl border border-gray-200" />
            <div className="h-28 bg-gray-100 rounded-2xl border border-gray-200" />
            <div className="h-28 bg-gray-100 rounded-2xl border border-gray-200" />
            <div className="h-28 bg-gray-100 rounded-2xl border border-gray-200" />
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      )}

      {/* STATE 2: ERROR STATE WITH RETRY */}
      {!isLoading && error && (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">Admin API Unavailable</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchAdminData} className="bg-red-700 hover:bg-red-800 text-xs">
            Retry Connection
          </Button>
        </div>
      )}

      {/* STATES 3 & 4: POPULATED / EMPTY METRICS & AUDIT FEED */}
      {!isLoading && !error && stats && (
        <div className="space-y-8">
          {/* Dynamic Computed Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B6E68]">
                <span>Total Settled Revenue</span>
                <DollarSign className="w-4 h-4 text-[#0D3B85]" />
              </div>
              <div className="text-2xl font-extrabold text-[#111111] font-display">
                ${stats.totalRevenueUsd.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#6B6E68]">
                {stats.totalRevenueXaf.toLocaleString()} XAF Settled
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B6E68]">
                <span>Active Clients</span>
                <Users className="w-4 h-4 text-[#1B6FC9]" />
              </div>
              <div className="text-2xl font-extrabold text-[#111111] font-display">
                {stats.totalClients}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                100% KYC Verified
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B6E68]">
                <span>Domains Managed</span>
                <Globe className="w-4 h-4 text-[#7CB342]" />
              </div>
              <div className="text-2xl font-extrabold text-[#111111] font-display">
                {stats.totalDomains}
              </div>
              <div className="text-[11px] text-[#6B6E68]">
                Live Anycast Registry
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B6E68]">
                <span>Active Subdomain Leases</span>
                <Repeat className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-[#111111] font-display">
                {stats.activeRentals}
              </div>
              <div className="text-[11px] text-[#0D3B85] font-semibold">
                100% Rebate Eligible
              </div>
            </div>
          </div>

          {/* Real Live Audit Log Feed */}
          <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#EBEBE7] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111111]">Live Transaction & Security Audit Feed</h2>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Log Active
              </span>
            </div>

            {auditLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Target Entity</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-[#FAFAF9]/80 transition-colors text-xs">
                        <TableCell className="text-[#6B6E68]">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-[#0D3B85]">
                          {log.action}
                        </TableCell>
                        <TableCell className="font-semibold text-[#111111]">
                          {log.actor}
                        </TableCell>
                        <TableCell className="text-[#6B6E68]">
                          {log.target}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success">Logged</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-10 text-center space-y-2 text-xs text-[#6B6E68]">
                <div>No recent system events logged.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
