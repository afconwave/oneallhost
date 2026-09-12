'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@oneallhost/ui';
import { MessageSquare, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="w-full font-sans">
      {/* 1. Top Live Support Strip (White Background) */}
      <div className="w-full bg-[#FFFFFF] border-t border-b border-[#E5E7EB] py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <span className="text-sm font-semibold text-[#2D3748]">
            Need help? We&apos;re always here for you.
          </span>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#2C6E63] hover:bg-[#23584F] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Go to Live Chat page</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Dark Mega-Footer Body */}
      <div className="w-full bg-[#181818] text-[#D1D5DB] pt-14 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Left Column: Brand Info, Newsletter & Socials (4 cols on desktop) */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block">
                <BrandLogo variant="horizontal" height={36} />
              </Link>
              
              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm">
                We make registering, hosting, and managing domains for yourself or others easy and affordable, because the internet needs people.
              </p>

              <div className="space-y-2 text-xs font-semibold">
                <div>
                  <Link href="/about" className="text-white hover:text-[#DE3723] transition-colors inline-flex items-center gap-1.5 group">
                    <span>About Oneallhost</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div>
                  <Link href="/about" className="text-white hover:text-[#DE3723] transition-colors inline-flex items-center gap-1.5 group">
                    <span>Read our blog</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Join Our Newsletter &amp; Marketing Communication
                </div>
                <p className="text-[11px] text-[#9CA3AF]">
                  We&apos;ll send you news and offers.
                </p>

                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className="flex items-center gap-0 max-w-sm">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yours.com"
                      className="h-10 px-3.5 bg-[#262626] border border-[#3A3A3A] text-white text-xs rounded-l-md outline-none focus:border-[#DE3723] w-full placeholder:text-[#6B7280]"
                    />
                    <button
                      type="submit"
                      className="h-10 px-5 bg-[#DE3723] hover:bg-[#C52D1C] text-white font-bold text-xs rounded-r-md transition-colors shrink-0"
                    >
                      Join
                    </button>
                  </form>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 text-xs font-semibold rounded-md">
                    <Check className="w-4 h-4" />
                    <span>Thank you for subscribing!</span>
                  </div>
                )}
              </div>

              {/* Social Icons (X, Facebook, Instagram, Pinterest) */}
              <div className="flex items-center gap-4 pt-2 text-[#9CA3AF]">
                {/* X (Twitter) */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* Pinterest */}
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.98-.13-2.48.03-3.55.14-.98.94-6.42.94-6.42s-.24-.48-.24-1.19c0-1.12.65-1.95 1.46-1.95.69 0 1.02.52 1.02 1.14 0 .69-.44 1.73-.67 2.69-.19.81.41 1.47 1.21 1.47 1.45 0 2.57-1.53 2.57-3.74 0-1.95-1.4-3.32-3.41-3.32-2.49 0-3.95 1.87-3.95 3.8 0 .75.29 1.56.65 2 .07.09.08.16.06.25-.07.28-.22.88-.25.99-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.47 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.52 2.21 5.52 5.17 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.03l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A11.98 11.98 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Multi-Columns: 8 cols on desktop */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-[11px]">
              
              {/* Column 1: Domains & Hosting */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Domains</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/domains/domain-name-search" className="hover:text-white transition-colors">Domain Name Search</Link></li>
                    <li><Link href="/domains/transfer" className="hover:text-white transition-colors">Domain Transfer</Link></li>
                    <li><Link href="/domains/explore-new-tlds" className="hover:text-white transition-colors">New TLDs</Link></li>
                    <li><Link href="/domains/personal" className="hover:text-white transition-colors">Personal Domain</Link></li>
                    <li><Link href="/domains/market" className="hover:text-white transition-colors">Oneallhost Market</Link></li>
                    <li><Link href="/domains/whois" className="hover:text-white transition-colors">Whois Lookup</Link></li>
                    <li><Link href="/security/premiumdns" className="hover:text-white transition-colors">PremiumDNS</Link></li>
                    <li><Link href="/domains/freedns" className="hover:text-white transition-colors">FreeDNS</Link></li>
                    <li>
                      <Link href="/rentals" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Subdomain Rentals</span>
                        <span className="bg-[#10B981] text-black text-[9px] font-extrabold px-1 py-0.2 rounded">100% REBATE</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Hosting</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/hosting/shared" className="hover:text-white transition-colors">Shared Hosting</Link></li>
                  </ul>
                </div>
              </div>

              {/* Column 2: Hosting continuation & WordPress */}
              <div className="space-y-4">
                <div>
                  <ul className="space-y-1.5 text-[#9CA3AF] pt-6 sm:pt-6">
                    <li><Link href="/wordpress" className="hover:text-white transition-colors">Hosting for WordPress</Link></li>
                    <li><Link href="/hosting/reseller" className="hover:text-white transition-colors">Reseller Hosting</Link></li>
                    <li><Link href="/hosting/vps" className="hover:text-white transition-colors">VPS Hosting</Link></li>
                    <li><Link href="/hosting/dedicated-servers" className="hover:text-white transition-colors">Dedicated Servers</Link></li>
                    <li><Link href="/hosting/email" className="hover:text-white transition-colors">Private Email Hosting</Link></li>
                    <li><Link href="/hosting/hosting-migrate-to-oneallhost" className="hover:text-white transition-colors">Migrate to Oneallhost</Link></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">WordPress</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/wordpress" className="hover:text-white transition-colors">Hosting for WordPress</Link></li>
                    <li><Link href="/wordpress/migrate" className="hover:text-white transition-colors">Migrate WordPress</Link></li>
                    <li><Link href="/tools/is-it-wp" className="hover:text-white transition-colors">Is WP Site Detector</Link></li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Security & SSL Certificates */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Security</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/security/domain-privacy-service" className="hover:text-white transition-colors">Domain Privacy</Link></li>
                    <li>
                      <Link href="/security/protect-website" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Website Security</span>
                        <span className="bg-[#DE3723] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">NEW</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/security/fix-hacked-website" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Fix Hacked Website</span>
                        <span className="bg-[#DE3723] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">SOS</span>
                      </Link>
                    </li>
                    <li><Link href="/security/premiumdns" className="hover:text-white transition-colors">PremiumDNS</Link></li>
                    <li><Link href="/supersonic-cdn" className="hover:text-white transition-colors">CDN</Link></li>
                    <li>
                      <Link href="/vpn" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>FastVPN</span>
                        <span className="bg-[#DE3723] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">UPDATED</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/cyber-insurance" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Cyber Insurance</span>
                        <span className="bg-[#DE3723] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">NEW</span>
                      </Link>
                    </li>
                    <li><Link href="/security/2fa-two-factor-authentication" className="hover:text-white transition-colors">2FA</Link></li>
                    <li><Link href="/dns/free-public-dns" className="hover:text-white transition-colors">Public DNS</Link></li>
                    <li><Link href="/security/anti-spam-protection" className="hover:text-white transition-colors">Anti-Spam Protection</Link></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">SSL Certificates</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/security/ssl-certificates/ssl-com" className="hover:text-white transition-colors">SSL.com</Link></li>
                    <li><Link href="/security/ssl-certificates/organization-validation" className="hover:text-white transition-colors">Organization Validation</Link></li>
                    <li><Link href="/security/ssl-certificates/domain-validation" className="hover:text-white transition-colors">Domain Validation</Link></li>
                    <li><Link href="/security/ssl-certificates/extended-validation" className="hover:text-white transition-colors">Extended Validation</Link></li>
                    <li><Link href="/security/ssl-certificates/single-domain" className="hover:text-white transition-colors">Single Domain</Link></li>
                    <li><Link href="/security/ssl-certificates/wildcard" className="hover:text-white transition-colors">Wildcard</Link></li>
                    <li><Link href="/security/ssl-certificates/multi-domain" className="hover:text-white transition-colors">Multi Domain</Link></li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Transfer, Resellers & Promos */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs inline-flex items-center gap-1">
                    <span>Transfer to Us</span>
                    <span className="bg-[#DE3723] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">TRY ME</span>
                  </h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/domains/transfer" className="hover:text-white transition-colors">Domain Transfer</Link></li>
                    <li><Link href="/hosting/hosting-migrate-to-oneallhost" className="hover:text-white transition-colors">Migrate Hosting</Link></li>
                    <li><Link href="/wordpress/migrate" className="hover:text-white transition-colors">Migrate WordPress</Link></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Resellers</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/resellers/ssl-certificates/join-the-program" className="hover:text-white transition-colors">SSL Certificates</Link></li>
                    <li><Link href="/hosting/reseller" className="hover:text-white transition-colors">Reseller Hosting</Link></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">
                    <Link href="/promos" className="hover:text-[#DE3723] transition-colors">Promos</Link>
                  </h4>
                </div>
              </div>

              {/* Column 5: Guru Guides, Help Center, Marketing Tools, Visual, Company */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">
                    <Link href="/guru-guides" className="hover:text-[#DE3723] transition-colors">Guru Guides</Link>
                  </h4>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Help Center</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/status-updates" className="hover:text-white transition-colors">Status Updates</Link></li>
                    <li><Link href="/support/knowledgebase" className="hover:text-white transition-colors">Knowledgebase</Link></li>
                    <li><Link href="/dashboard/support" className="hover:text-white transition-colors">Submit Ticket</Link></li>
                    <li><Link href="/help-center/live-chat" className="hover:text-white transition-colors">Live Chat</Link></li>
                    <li><Link href="/support/report-abuse" className="hover:text-white transition-colors">Report Abuse</Link></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Marketing Tools</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/apps" className="hover:text-white transition-colors">Marketplace</Link></li>
                    <li><Link href="/build-and-grow-hub" className="hover:text-white transition-colors">How to Get Started</Link></li>
                    <li>
                      <Link href="/apps/business-starter-kit" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Business Starter Kit</span>
                        <span className="bg-[#3B82F6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">FREE</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/apps/business-starter-kit" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Free LLC</span>
                        <span className="bg-[#6B7280] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">US ONLY</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Relate Marketing Suite</span>
                        <span className="bg-[#3B82F6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">SAVE</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/seo" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>RelateSEO</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/social" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>RelateSocial</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/reviews" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>RelateReviews</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/ads" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>RelateAds</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/local" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>RelateLocal</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/relate/radar" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Brand Monitoring</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-xs">Visual</h4>
                  <ul className="space-y-1.5 text-[#9CA3AF]">
                    <li><Link href="/visual/site-maker" className="hover:text-white transition-colors">Site Maker</Link></li>
                    <li><Link href="/visual/font-generator" className="hover:text-white transition-colors">Font Maker</Link></li>
                    <li>
                      <Link href="/logo-maker" className="hover:text-white transition-colors inline-flex items-center gap-1">
                        <span>Logo Maker</span>
                        <span className="bg-[#8B5CF6] text-white text-[9px] font-extrabold px-1 py-0.2 rounded">AI</span>
                      </Link>
                    </li>
                    <li><Link href="/visual/business-name-generator" className="hover:text-white transition-colors">Business Name Generator</Link></li>
                    <li><Link href="/visual/card-maker" className="hover:text-white transition-colors">Business Card Maker</Link></li>
                  </ul>
                </div>

                <div className="pt-2 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                    <Link href="/careers" className="hover:text-[#DE3723] transition-colors">Careers</Link>
                  </h4>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                    <Link href="/affiliates" className="hover:text-[#DE3723] transition-colors">Affiliates</Link>
                  </h4>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                    <a href="mailto:feedback@oneallhost.com?subject=Send%20us%20Feedback" className="hover:text-[#DE3723] transition-colors">Send us Feedback</a>
                  </h4>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Single-line Dark Legal / Copyright Strip */}
          <div className="mt-14 pt-8 border-t border-[#2B2B2B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#9CA3AF]">
            <div>
              <p>The entirety of this site is protected by copyright © 2000–2026 Oneallhost, Inc.</p>
              <p className="text-[10px] text-[#6B7280]">4600 East Washington Street, Suite 300, Phoenix, AZ 85034, USA</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/udrp" className="hover:text-white transition-colors">UDRP</Link>
              <Link href="/domain-registration-data-disclosure-policy" className="hover:text-white transition-colors">Domain Registration Data Disclosure Policy</Link>
              <Link href="/cookie-preferences" className="hover:text-white transition-colors">Cookie Preferences</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Light Bottom Trust & Compliance Strip (#F5F5F5) */}
      <div className="w-full bg-[#F5F5F5] border-t border-[#E5E7EB] text-[#374151] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ICANN, Payment Badges & Store Badges */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* ICANN Accreditation */}
            <div className="flex items-center gap-3">
              <img
                src="/images/brand/icann-accredited.png"
                alt="ICANN Accredited Registrar"
                className="w-12 h-12 object-contain shrink-0 select-none drop-shadow-xs"
                loading="lazy"
              />
              <div className="text-xs text-[#4B5563]">
                <p className="font-semibold text-[#1F2937]">We are an ICANN-accredited registrar.</p>
                <p className="text-[11px] text-[#6B7280]">Serving customers worldwide.</p>
              </div>
            </div>

            {/* Payment Options (Card + Crypto + African Mobile Money Rails) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">
                Payment Options
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Amex */}
                <span className="h-6 px-2 bg-[#007AC1] text-white font-extrabold text-[9px] rounded flex items-center tracking-wider">
                  AMEX
                </span>
                {/* Tether USDT */}
                <span className="h-6 px-2 bg-white border border-[#DCDDD8] rounded flex items-center gap-1">
                  <img
                    src="/images/payments/usdt-svgrepo-com.png"
                    alt="USDT"
                    className="h-4 w-4 object-contain"
                  />
                  <span className="font-extrabold text-[#111111] text-[10px]">USDT</span>
                </span>
                {/* Mastercard */}
                <span className="h-6 px-2 bg-[#EB001B] text-white font-bold text-[10px] rounded flex items-center">
                  MasterCard
                </span>
                {/* PayPal */}
                <span className="h-6 px-2 bg-[#003087] text-white font-extrabold text-[10px] rounded flex items-center italic">
                  PayPal
                </span>
                {/* Visa */}
                <span className="h-6 px-2 bg-[#1A1F71] text-white font-black text-[10px] rounded flex items-center tracking-wider">
                  VISA
                </span>
                {/* Discover */}
                <span className="h-6 px-2 bg-[#FF6000] text-white font-bold text-[9px] rounded flex items-center">
                  DISCOVER
                </span>
                {/* MTN MoMo */}
                <span className="h-6 px-2 bg-[#FFCC00] text-[#000000] font-black text-[9px] rounded flex items-center">
                  MTN MoMo
                </span>
                {/* Orange Money */}
                <span className="h-6 px-2 bg-[#FF6600] text-white font-bold text-[9px] rounded flex items-center">
                  Orange Money
                </span>
                {/* Wave */}
                <span className="h-6 px-2 bg-[#1DC4FA] text-white font-bold text-[9px] rounded flex items-center">
                  Wave
                </span>
              </div>
            </div>

            {/* Sectigo & Mobile Apps */}
            <div className="flex items-center gap-3">
              {/* Official Secured by Sectigo Trust Seal */}
              <div className="flex items-center shrink-0">
                <img
                  src="/images/payments/sectigo.svg"
                  alt="Secured by Sectigo"
                  className="h-8 w-auto object-contain select-none"
                  loading="lazy"
                />
              </div>

              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#000000] text-white rounded-md hover:bg-[#1F2937] transition-colors text-left"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.59 1.59 0 0 1-.22-.843V2.657c0-.317.08-.609.22-.843zM15.207 13.414l2.585 2.586-12.7 7.332 10.115-9.918zm0-2.828L5.092.668l12.7 7.332-2.585 2.586zm1.414 1.414l3.771-2.177a1.6 1.6 0 0 1 0 2.768l-3.771 2.177-1.414-1.414 1.414-1.354z" />
                </svg>
                <div className="text-[9px] leading-none">
                  <span className="text-[7px] block uppercase text-[#9CA3AF]">GET IT ON</span>
                  <span className="font-bold">Google Play</span>
                </div>
              </a>

              {/* Apple App Store */}
              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#000000] text-white rounded-md hover:bg-[#1F2937] transition-colors text-left"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.57.66-.99 1.73-.89 2.78 1.07.08 2.06-.57 2.67-1.32z" />
                </svg>
                <div className="text-[9px] leading-none">
                  <span className="text-[7px] block uppercase text-[#9CA3AF]">Download on the</span>
                  <span className="font-bold">App Store</span>
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
};
