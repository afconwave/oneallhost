'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@oneallhost/ui';

interface NavItem {
  label: string;
  href: string;
  desc: string;
  icon: string;
  tone: 'blue' | 'green' | 'navy';
  tag?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Domains',
    items: [
      { label: 'Register a Domain', href: '/#domains', desc: '400+ extensions with live availability search', icon: 'fa-solid fa-globe', tone: 'blue' },
      { label: 'Transfer a Domain', href: '/transfer', desc: 'Free 1-year extension on every inbound transfer', icon: 'fa-solid fa-arrow-right-arrow-left', tone: 'green', tag: '+1 YR FREE' },
      { label: 'TLD Pricing', href: '/pricing', desc: 'Transparent per-extension pricing matrix', icon: 'fa-solid fa-table-list', tone: 'navy' },
    ],
  },
  {
    name: 'Rentals',
    items: [
      { label: 'Subdomain Leases', href: '/rentals', desc: 'Staging subdomains from 24 hours to 30 days', icon: 'fa-solid fa-arrows-rotate', tone: 'green', tag: '100% REBATE' },
      { label: 'How Leasing Works', href: '/rentals-explainer', desc: 'The rebate model explained step by step', icon: 'fa-solid fa-circle-info', tone: 'blue' },
    ],
  },
  {
    name: 'Hosting',
    items: [
      { label: 'Cloud Hosting', href: '/hosting-waitlist', desc: 'NVMe infrastructure with African edge caching', icon: 'fa-solid fa-server', tone: 'blue', tag: 'EARLY ACCESS' },
      { label: 'Hosting Dashboard', href: '/dashboard/hosting', desc: 'Manage deployments and resources', icon: 'fa-solid fa-gauge-high', tone: 'navy' },
    ],
  },
  {
    name: 'Company',
    items: [
      { label: 'About Oneallhost', href: '/about', desc: 'Our vision and Anycast infrastructure', icon: 'fa-solid fa-building', tone: 'blue' },
      { label: 'Support Desk', href: '/dashboard/support', desc: '24/7 technical assistance', icon: 'fa-solid fa-circle-question', tone: 'green' },
      { label: 'Developer API', href: '/docs', desc: 'Domain and DNS automation endpoints', icon: 'fa-solid fa-code', tone: 'navy' },
    ],
  },
];

const toneClasses: Record<NavItem['tone'], { tile: string; text: string }> = {
  blue: { tile: 'bg-brand-blue-soft text-brand-blue-deep group-hover:bg-brand-blue-deep group-hover:text-white', text: 'text-brand-blue-deep' },
  green: { tile: 'bg-brand-green-soft text-brand-green-deep group-hover:bg-brand-green group-hover:text-white', text: 'text-brand-green-deep' },
  navy: { tile: 'bg-surface-2 text-ink group-hover:bg-brand-navy group-hover:text-white', text: 'text-ink' },
};

export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsCurrencyOpen(false);
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
    setIsCurrencyOpen(false);
    setIsLangOpen(false);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" ref={navRef}>
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <BrandLogo variant="horizontal" height={34} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
          {NAV_GROUPS.map((group) => {
            const isOpen = activeDropdown === group.name;
            return (
              <div
                key={group.name}
                className="relative"
                onMouseEnter={() => openDropdown(group.name)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : group.name)}
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isOpen ? 'bg-surface-1 text-brand-blue-deep' : 'text-ink hover:bg-surface-1'
                  }`}
                >
                  <span>{group.name}</span>
                  <i className={`fa-solid fa-chevron-down text-[11px] transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-blue-deep' : 'text-muted'}`} />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="w-[22rem] bg-white rounded-2xl border border-hairline shadow-panel p-2.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-surface-1 transition-colors group"
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${toneClasses[item.tone].tile}`}>
                            <i className={`${item.icon} text-sm`} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink flex items-center gap-2">
                              <span>{item.label}</span>
                              {item.tag && (
                                <span className="px-1.5 py-0.5 bg-brand-green text-white rounded text-[10px] font-bold tracking-wide">{item.tag}</span>
                              )}
                            </div>
                            <div className="text-[13px] text-muted leading-snug mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/pricing"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-ink hover:bg-surface-1 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => { setIsCurrencyOpen(!isCurrencyOpen); setIsLangOpen(false); setActiveDropdown(null); }}
              className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg border border-hairline text-[13px] font-semibold text-ink hover:bg-surface-1 transition-colors"
            >
              <span>{currency}</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-muted" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl border border-hairline shadow-panel p-1.5 space-y-0.5 z-50">
                {(['USD', 'XAF'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                      currency === c ? 'bg-brand-blue-soft text-brand-blue-deep' : 'hover:bg-surface-1 text-ink'
                    }`}
                  >
                    <span>{c === 'USD' ? 'USD ($)' : 'XAF (FCFA)'}</span>
                    {currency === c && <i className="fa-solid fa-check text-brand-blue-deep text-xs" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrencyOpen(false); setActiveDropdown(null); }}
              className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg border border-hairline text-[13px] font-semibold text-ink hover:bg-surface-1 transition-colors"
            >
              <span>{language}</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-muted" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl border border-hairline shadow-panel p-1.5 space-y-0.5 z-50">
                {(['EN', 'FR'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => { setLanguage(l); setIsLangOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                      language === l ? 'bg-brand-blue-soft text-brand-blue-deep' : 'hover:bg-surface-1 text-ink'
                    }`}
                  >
                    <span>{l === 'EN' ? 'English' : 'Français'}</span>
                    {language === l && <i className="fa-solid fa-check text-brand-blue-deep text-xs" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-6 bg-hairline mx-1" />

          {/* Auth Actions */}
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium text-ink rounded-lg hover:bg-surface-1 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-semibold text-white bg-brand-blue-deep hover:bg-brand-blue rounded-lg transition-colors shadow-card"
          >
            Get Started
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-hairline text-ink hover:bg-surface-1 transition-colors"
          >
            <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-hairline bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1.5">
            {NAV_GROUPS.map((group) => {
              const expanded = mobileExpanded === group.name;
              return (
                <div key={group.name} className="rounded-xl border border-hairline overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(expanded ? null : group.name)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-ink bg-surface-1"
                  >
                    <span>{group.name}</span>
                    <i className={`fa-solid fa-chevron-down text-xs text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="p-1.5 space-y-0.5 bg-white">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-1"
                        >
                          <i className={`${item.icon} text-sm ${toneClasses[item.tone].text}`} />
                          <span className="text-sm font-medium text-ink">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/pricing"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-3.5 rounded-xl text-sm font-semibold text-ink bg-surface-1 border border-hairline"
            >
              Pricing
            </Link>

            <div className="flex gap-2.5 pt-3">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-xl border border-strong text-sm font-semibold text-ink"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-brand-blue-deep text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
