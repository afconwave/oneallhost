'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@oneallhost/ui';
import { NAV_ITEMS } from './navData';

export const MainNav: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  };

  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const session = typeof window !== 'undefined' ? localStorage.getItem('oneallhost_user_session') : null;
        if (session) {
          const parsed = JSON.parse(session);
          setIsLoggedIn(Boolean(parsed && parsed.loggedIn));
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  const handleMobileSignOut = () => {
    try {
      localStorage.removeItem('oneallhost_user_session');
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
    setIsLoggedIn(false);
    setIsMobileOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 sm:h-24 flex items-center justify-between gap-4 sm:gap-6 relative" ref={navRef}>
      {/* Left: Brand Logo */}
      <Link href="/" className="flex items-center shrink-0 py-1">
        <BrandLogo variant="horizontal" height={52} className="h-9 sm:h-14 md:h-18 w-auto origin-left" />
      </Link>

      {/* Desktop Navigation Link Cluster with Top Floating Badges */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isOpen = activeDropdown === item.label;
          return (
            <div
              key={item.label}
              className="relative h-full flex flex-col justify-center items-start cursor-pointer"
              onMouseEnter={() => openDropdown(item.label)}
              onMouseLeave={scheduleClose}
            >
              {/* Floating Top Badge Tag */}
              <div className="h-4 flex items-center mb-0.5">
                {item.badge ? (
                  <span
                    className={`px-1.5 py-0.2 text-[8px] font-black uppercase text-white rounded tracking-wide ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <span className="h-3" />
                )}
              </div>

              <Link
                href={item.href}
                className={`text-sm font-extrabold text-[#111111] hover:text-[#0D3B85] transition-colors py-0.5 ${
                  isOpen ? 'text-[#0D3B85]' : ''
                }`}
              >
                {item.label}
              </Link>

              {/* Clean, Simple Dropdown Popover */}
              {isOpen && item.items && (
                <div className="absolute top-full left-0 mt-0 pt-0 z-50">
                  <div className="w-[20rem] bg-white rounded-xl shadow-xl p-2 border-0 animate-in fade-in duration-150 space-y-0.5">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors group"
                      >
                        <i className={`${sub.icon} text-xs text-[#6B6E68] group-hover:text-[#0D3B85] shrink-0 mt-1`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#111111] group-hover:text-[#0D3B85] flex items-center gap-2 transition-colors">
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 bg-[#7CB342] text-white rounded text-[8px] font-black uppercase tracking-wider">{sub.badge}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6B6E68] leading-snug mt-0.5 font-normal">{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#111111] hover:bg-gray-100 transition-colors"
      >
        <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
      </button>

      {/* Mobile Panel with Scrollable Drawer & Sub-Items */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden top-[108px]" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed top-[108px] left-0 right-0 max-h-[calc(100vh-112px)] overflow-y-auto lg:hidden bg-white border-b border-gray-200 p-4 space-y-3 shadow-2xl z-50">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const hasSub = item.items && item.items.length > 0;
                const isSubOpen = openMobileSub === item.label;

                return (
                  <div key={item.label} className="border-b border-gray-100/60 pb-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex-1 flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#111111] hover:bg-gray-50 rounded-lg"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white rounded ${item.badgeColor || 'bg-[#FF5A27]'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {hasSub && (
                        <button
                          type="button"
                          onClick={() => setOpenMobileSub(isSubOpen ? null : item.label)}
                          className="p-2 text-gray-500 hover:text-[#0D3B85]"
                        >
                          <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isSubOpen ? 'rotate-180 text-[#0D3B85]' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Sub-items accordion */}
                    {hasSub && isSubOpen && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-gray-50/70 rounded-xl mt-1">
                        {item.items!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#0D3B85] hover:bg-white rounded-lg transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <i className={`${sub.icon} text-[11px] text-gray-400`} />
                              <span>{sub.label}</span>
                            </span>
                            {sub.badge && (
                              <span className="px-1 py-0.2 bg-[#7CB342] text-white text-[8px] font-black rounded uppercase">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full min-h-[40px] px-4 bg-[#0D3B85] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-gauge-high text-xs" />
                    <span>Go to Dashboard Console</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleMobileSignOut}
                    className="w-full min-h-[36px] px-4 bg-gray-100 hover:bg-gray-200 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full min-h-[40px] px-4 bg-[#0D3B85] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user text-xs" />
                  <span>Sign In to Dashboard</span>
                </Link>
              )}
              <Link
                href="/checkout"
                onClick={() => setIsMobileOpen(false)}
                className="w-full min-h-[40px] px-4 bg-[#F8FAF6] text-[#4E7525] border border-[#D6E8C2] font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cart-shopping text-xs" />
                <span>View Cart &amp; Checkout</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
