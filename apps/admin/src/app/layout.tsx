'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo, Badge } from '@oneallhost/ui';
import {
  LayoutDashboard,
  Users,
  Globe,
  Clock,
  Server,
  CreditCard,
  Activity,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import './globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Clients & KYC', href: '/clients', icon: Users },
    { label: 'Domain Registry', href: '/domains', icon: Globe },
    { label: 'Subdomain Rentals', href: '/rentals', icon: Clock },
    { label: 'Hosting Waitlist', href: '/hosting', icon: Server },
    { label: 'Payments & Reconciliation', href: '/payments', icon: CreditCard },
    { label: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { label: 'System Health', href: '/health', icon: Activity },
  ];

  return (
    <html lang="en">
      <body className="bg-[#FFFFFF] text-[#111111] antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Top Admin Bar */}
          <header className="h-16 border-b border-[#08214D] bg-[#091F44] px-6 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center">
                <BrandLogo variant="horizontal" height={36} />
              </Link>
              <Badge variant="warning">Ops Admin Portal</Badge>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-blue-200">Operator:</span>
              <span className="text-white font-semibold">admin@oneallhost.com</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#7CB342] animate-pulse" />
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Admin Sidebar with Rich Deep Blue Styling */}
            <aside className="w-64 bg-[#091F44] text-white p-4 flex flex-col justify-between shrink-0">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#1B6FC9] text-white shadow-md'
                          : 'text-blue-200/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3.5 bg-white/10 border border-white/15 rounded-xl text-[11px] text-blue-100 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#7CB342]" />
                  <span>2FA Enforced</span>
                </div>
                <p className="text-[10px] text-blue-200/75 leading-tight">
                  All staff actions are logged to immutable audit ledger.
                </p>
              </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl bg-[#FAFAF9]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
