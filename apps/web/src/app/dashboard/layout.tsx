'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Clock,
  Server,
  Mail,
  ShieldCheck,
  CreditCard,
  User,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Domain List', href: '/dashboard/domain-list', icon: Globe },
  { label: 'Expiring Soon', href: '/dashboard/expiring-soon', icon: Clock },
  { label: 'Hosting List', href: '/dashboard/hosting-list', icon: Server },
  { label: 'Private Email', href: '/dashboard/private-email', icon: Mail },
  { label: 'SSL Certificates', href: '/dashboard/ssl-certificates', icon: ShieldCheck },
  { label: 'Billing & Invoices', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Profile & Security', href: '/dashboard/profile', icon: User },
  { label: 'Support & Tickets', href: '/dashboard/support', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const session = typeof window !== 'undefined' ? localStorage.getItem('oneallhost_user_session') : null;
        if (!session) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
          return;
        }

        const parsed = JSON.parse(session);
        if (!parsed || !parsed.loggedIn) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
          return;
        }

        setCurrentUser({
          name: parsed.name || parsed.username?.split('@')[0] || 'Account Owner',
          email: parsed.username || 'client@oneallhost.com',
        });

        if (parsed.token) {
          const res = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${parsed.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.user) {
              setCurrentUser({ name: data.user.name, email: data.user.email });
            }
          }
        }
        setIsCheckingAuth(false);
      } catch (e) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
      }
    }
    loadUser();
  }, [pathname, router]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('oneallhost_user_session');
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
    setCurrentUser(null);
    router.push('/');
  };

  const displayName = currentUser?.name || 'Account Owner';
  const displayEmail = currentUser?.email || 'client@oneallhost.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'OH';

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0D3B85] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#6B6E68]">Verifying Console Security &amp; Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col text-[#111111]">
      {/* TOP AUXILIARY DASHBOARD HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBE7] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg border border-[#EBEBE7] text-[#6B6E68] hover:text-[#111111] hover:bg-[#FAFAF9]"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/brand/logo-horizontal.png"
                alt="Oneallhost"
                width={180}
                height={48}
                className="h-8 sm:h-12 w-auto object-contain"
                priority
              />
            </Link>

            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#0D3B85]/10 text-[#0D3B85]">
              Console
            </span>
          </div>

          {/* Right: Shortcuts, Account Pill & Direct Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#6B6E68] hover:text-[#0D3B85] px-3 py-1.5 rounded-lg border border-transparent hover:border-[#EBEBE7] hover:bg-[#FAFAF9] transition-all"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[#EBEBE7]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D3B85] text-white flex items-center justify-center font-bold text-xs font-mono">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#111111] leading-tight">{displayName}</div>
                <div className="text-[10px] text-[#6B6E68]">{displayEmail}</div>
              </div>
            </div>

            {/* Direct Header Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out of Console"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col lg:flex-row gap-5 sm:gap-6">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-[#EBEBE7] p-3 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#6B6E68]">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === '/dashboard/domain-list' && pathname === '/dashboard/domains');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0D3B85] text-white shadow-xs'
                      : 'text-[#6B6E68] hover:text-[#111111] hover:bg-[#FAFAF9]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B6E68]'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </Link>
              );
            })}

            {/* Direct Sidebar Sign Out Button */}
            <div className="pt-2 border-t border-[#F0F0EE] mt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="flex-1 font-bold">Sign Out</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#091F44] to-[#0D3B85] text-white rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-[#7CB342]">24/7 Priority Support</div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Need assistance with DNS propagation or nameserver routing?
            </p>
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline pt-1"
            >
              <span>Open Support Ticket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* MOBILE SLIDEOUT DRAWER */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-[80vw] h-full p-4 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EBEBE7]">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Dashboard Menu</span>
                    <span className="text-[11px] text-[#6B6E68]">{displayEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1 text-[#6B6E68] hover:text-[#111111]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href === '/dashboard/domain-list' && pathname === '/dashboard/domains');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#0D3B85] text-white'
                            : 'text-[#6B6E68] hover:text-[#111111] hover:bg-[#FAFAF9]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBEBE7] space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-[#6B6E68] hover:text-[#0D3B85] px-2 py-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Return to Homepage</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
