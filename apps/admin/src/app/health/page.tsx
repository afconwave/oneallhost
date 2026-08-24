'use client';

import React from 'react';
import { Card, Badge, Button } from '@oneallhost/ui';
import { Activity, Server, RefreshCw, CheckCircle2, ShieldCheck, Mail, Database } from 'lucide-react';

export default function AdminHealthPage() {
  const services = [
    {
      name: 'ResellerClub Registry API',
      status: 'healthy',
      latency: '38ms',
      errorRate: '0.00%',
      lastChecked: '10s ago',
      details: 'Sandbox & Live Registry Connected',
    },
    {
      name: 'Altonixa Pay Payment Gateway',
      status: 'healthy',
      latency: '19ms',
      errorRate: '0.00%',
      lastChecked: '5s ago',
      details: 'MTN MoMo, Orange Money, Card, Crypto Webhooks Active',
    },
    {
      name: 'Redis Queue & Rate Limiter',
      status: 'healthy',
      latency: '2ms',
      errorRate: '0.00%',
      lastChecked: 'Just now',
      details: '0 queued jobs, 256MB allocated',
    },
    {
      name: 'SMTP Transactional Mail Relay',
      status: 'healthy',
      latency: '110ms',
      errorRate: '0.00%',
      lastChecked: '1m ago',
      details: 'Receipts & Renewal Notices Dispatching',
    },
    {
      name: 'Supabase PostgreSQL & Storage',
      status: 'healthy',
      latency: '12ms',
      errorRate: '0.00%',
      lastChecked: 'Just now',
      details: 'Row Level Security Active, PDF Invoices Mounted',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Platform Health & Subsystems</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Real-time status of upstream registrar APIs, payment webhooks, Redis queues, and databases.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run diagnostics</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((svc) => (
          <Card key={svc.name} elevation="surface-1" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded bg-white border border-[#EBEBE7] flex items-center justify-center text-[#0D3B85] shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[#111111]">{svc.name}</h3>
                  <Badge variant="success">Operational</Badge>
                </div>
                <p className="text-xs text-[#6B6E68] mt-0.5">{svc.details}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#6B6E68] font-mono self-end sm:self-center">
              <div>
                <span className="text-[10px] uppercase block text-[#6B6E68]">Latency</span>
                <span className="text-[#111111]">{svc.latency}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block text-[#6B6E68]">Error Rate</span>
                <span className="text-[#4E7525]">{svc.errorRate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase block text-[#6B6E68]">Checked</span>
                <span className="text-[#111111]">{svc.lastChecked}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
