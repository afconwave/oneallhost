'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo, NotificationDrawer, NotificationItem } from '@oneallhost/ui';
import {
  LayoutDashboard,
  Globe,
  Repeat,
  Server,
  Receipt,
  LifeBuoy,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import { translations, Locale } from '../../lib/i18n';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredCurrency: string;
  twoFactorEnabled: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>('en');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const t = translations[locale];

  // Fetch real profile & notifications dynamically from live API
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/api/v1/users/me').then((r) => (r.ok ? r.json() : null)),
      fetch('http://localhost:4000/api/v1/users/notifications').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, notifData]) => {
        if (userData && userData.user) {
          setUser(userData.user);
        }
        if (notifData && Array.isArray(notifData.notifications)) {
          setNotifications(notifData.notifications);
        }
      })
      .catch((err) => console.error('[Dashboard Layout Fetch Error]', err))
      .finally(() => setIsUserLoading(false));
  }, []);

  const navItems = [
    { href: '/dashboard', label: t.dashboard.overview, icon: LayoutDashboard },
    { href: '/dashboard/domains', label: t.dashboard.domains, icon: Globe },
    { href: '/dashboard/rentals', label: t.dashboard.rentals, icon: Repeat },
    { href: '/dashboard/hosting', label: t.dashboard.hosting, icon: Server },
    { href: '/dashboard/billing', label: t.dashboard.billing, icon: Receipt },
    { href: '/dashboard/profile', label: 'Account & Security', icon: User },
    { href: '/dashboard/support', label: t.dashboard.support, icon: LifeBuoy },
  ];

  // Generate dynamic initials from live name
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-[#111111]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-[#EBEBE7] flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <BrandLogo variant="horizontal" height={38} />
          </Link>
        </div>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-[#6B6E68] hover:text-[#111111] hover:bg-[#FAFAF9] rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#0D3B85]" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7CB342] ring-2 ring-white" />
            )}
          </button>

          {/* Dynamic User Profile Indicator */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 pl-3 border-l border-[#EBEBE7] hover:opacity-85 transition-opacity"
          >
            {isUserLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0D3B85] text-white flex items-center justify-center font-bold text-xs">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="hidden sm:block text-left">
              {isUserLoading ? (
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <div className="text-xs font-bold text-[#111111]">{user?.name || 'Client Account'}</div>
                  <div className="text-[11px] text-[#6B6E68]">{user?.email || 'authenticated'}</div>
                </>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-[#EBEBE7] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0D3B85] text-white shadow-xs'
                      : 'text-[#6B6E68] hover:text-[#111111] hover:bg-[#FAFAF9]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#EBEBE7] text-[11px] text-[#6B6E68] space-y-1">
            <div className="font-semibold text-[#111111]">Oneallhost Platform</div>
            <div>ICANN Registry Gateway</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />
    </div>
  );
}
