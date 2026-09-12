'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../Header';
import { Footer } from '../Footer';

export interface TldConfig {
  tld: string;
  category: 'gtld' | 'cctld';
  tagline: string;
  description: string;
  regPrice1Yr: number;
  origPrice1Yr: number;
  discountPct: number;
  renewalPrice1Yr: number;
  transferPrice: number;
  specialBadge?: string;
  whyChoose: {
    title1: string;
    text1: string;
    title2: string;
    text2: string;
    title3: string;
    text3: string;
  };
  features: string[];
  alternatives: {
    tld: string;
    desc: string;
    price: number;
    badge?: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const TLD_DATABASE: Record<string, TldConfig> = {
  dev: {
    tld: 'dev',
    category: 'gtld',
    tagline: 'Develop your site today',
    description: 'A secure, dedicated domain extension for developers, engineers, programmers, and technology innovators. Includes built-in HTTPS enforcement via HSTS preloading.',
    regPrice1Yr: 10.98,
    origPrice1Yr: 15.98,
    discountPct: 31,
    renewalPrice1Yr: 20.98,
    transferPrice: 15.98,
    specialBadge: 'Special offer for 1st year',
    whyChoose: {
      title1: 'Why Choose a .DEV Domain?',
      text1: 'Built by Google Registry specifically for developers, .dev is a top-level domain with built-in security. It belongs to the HSTS preload list, which means browsers require HTTPS to connect to your site, keeping your users safe from malware and eavesdropping.',
      title2: 'Is a .DEV Right for Me?',
      text2: 'Whether you are launching a personal developer portfolio, sharing open-source code repositories, publishing API documentation, or building SaaS apps, .dev immediately communicates tech credibility.',
      title3: 'Find Your Tribe with a .DEV',
      text3: 'Join millions of programmers, full-stack engineers, software architects, and tech organizations building the future on .dev domains worldwide.',
    },
    features: [
      'Fast & reliable Anycast DNS mesh',
      'Free Lifetime WHOIS Privacy Guard',
      'HSTS Preloaded HTTPS Security standard',
      'Instant automated DNS zone deployment',
      '24/7 Developer & Engineering support',
    ],
    alternatives: [
      { tld: 'app', desc: 'The domain for app developers', price: 12.98, badge: 'SALE' },
      { tld: 'io', desc: 'The tech domain TLD', price: 34.98, badge: 'HOT' },
      { tld: 'tech', desc: 'The domain for modern tech', price: 6.98, badge: 'SALE' },
      { tld: 'online', desc: 'Carve out your online space', price: 3.99, badge: 'SALE' },
    ],
    faqs: [
      {
        q: 'How to know how to register a .dev domain name?',
        a: 'Search for your desired domain name in the search box above. Once you confirm availability, click Add to Cart and complete your checkout. Your .dev domain will activate within 3 minutes.',
      },
      {
        q: 'For how many years can I buy a domain name?',
        a: 'You can register a .dev domain name for anywhere between 1 and 10 years at a time. Multi-year discounts are applied automatically at checkout.',
      },
      {
        q: 'What does a developer domain mean I can do?',
        a: 'You can host software projects, deploy cloud applications, host developer portfolios, create REST APIs, and configure custom @yourname.dev business email accounts.',
      },
      {
        q: 'Is this a top-level domain?',
        a: 'Yes, .dev is an ICANN-accredited generic top-level domain (gTLD) operated by Google Registry and recognized by all root name servers globally.',
      },
      {
        q: 'Can I hide my contact details for a .dev domain?',
        a: 'Yes! Every .dev domain registered at Oneallhost comes with 100% Free Lifetime WHOIS Privacy Guard, keeping your personal phone number and address private.',
      },
    ],
  },
  com: {
    tld: 'com',
    category: 'gtld',
    tagline: 'Get the most sought-after domain',
    description: 'The world’s most recognized and trusted domain extension. Give your website instant international authority with .com.',
    regPrice1Yr: 6.79,
    origPrice1Yr: 13.99,
    discountPct: 51,
    renewalPrice1Yr: 13.99,
    transferPrice: 11.98,
    specialBadge: 'New customer special',
    whyChoose: {
      title1: 'Why Choose a .COM Domain?',
      text1: 'As the undisputed gold standard of web domains, .com builds instant global trust and credibility with clients, search engines, and investors.',
      title2: 'Is a .COM Right for Me?',
      text2: 'If you are building a commercial business, startup, online store, or professional services firm, .com ensures your customers find you first.',
      title3: 'Build Global Recognition with .COM',
      text3: 'Over 150 million businesses worldwide power their digital presence on .com domains with sub-3-minute Anycast DNS resolution.',
    },
    features: [
      'Sub-3-minute Anycast DNS mesh',
      'Free Lifetime WHOIS Privacy Guard',
      'Global brand recognition & trust',
      'Instant DNS record management',
      '24/7 Technical support ticket team',
    ],
    alternatives: [
      { tld: 'net', desc: 'A true Internet original', price: 12.48, badge: 'SALE' },
      { tld: 'org', desc: 'A trusted marker of causes', price: 8.48, badge: 'SALE' },
      { tld: 'store', desc: 'The domain for commerce', price: 0.98, badge: 'HOT' },
      { tld: 'cm', desc: 'Cameroon official ccTLD', price: 28.00, badge: 'LOCAL' },
    ],
    faqs: [
      {
        q: 'Why is .com the most popular domain extension?',
        a: '.com has been the primary global standard for commercial internet websites since 1985 and carries unmatched consumer recall and credibility.',
      },
      {
        q: 'How fast will my .com domain activate?',
        a: 'Your .com domain provisions instantly upon checkout confirmation with automated Anycast DNS nameserver propagation in under 3 minutes.',
      },
    ],
  },
  net: {
    tld: 'net',
    category: 'gtld',
    tagline: 'Get set with a .NET',
    description: 'A true internet original. Perfect for networking companies, tech platforms, and online services.',
    regPrice1Yr: 12.48,
    origPrice1Yr: 14.98,
    discountPct: 17,
    renewalPrice1Yr: 18.58,
    transferPrice: 12.98,
    whyChoose: {
      title1: 'Why Choose a .NET Domain?',
      text1: 'Historically built for network providers and infrastructure companies, .net is one of the original top-level domains alongside .com.',
      title2: 'Is a .NET Right for Me?',
      text2: 'Ideal for tech startups, SaaS tools, developers, and internet service businesses looking for a trusted alternative to .com.',
      title3: 'Establish Technical Authority',
      text3: 'Tens of millions of established web applications and service networks rely on .net for reliable digital identity.',
    },
    features: [
      'Anycast DNS propagation',
      'Free Lifetime WHOIS Privacy',
      'Proven 30+ year internet track record',
      'Instant cPanel & DNS synchronization',
      '24/7 Live person support',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'SALE' },
      { tld: 'org', desc: 'Trusted marker of causes', price: 8.48, badge: 'SALE' },
      { tld: 'io', desc: 'Tech & developer favorite', price: 34.98, badge: 'HOT' },
    ],
    faqs: [
      {
        q: 'Who can register a .net domain?',
        a: 'Anyone in the world can register a .net domain without any special restrictions or citizenship requirements.',
      },
    ],
  },
  org: {
    tld: 'org',
    category: 'gtld',
    tagline: 'Start making a difference today with a .ORG',
    description: 'The trusted domain for non-profits, open-source projects, community initiatives, and educational foundations.',
    regPrice1Yr: 8.48,
    origPrice1Yr: 14.48,
    discountPct: 41,
    renewalPrice1Yr: 18.98,
    transferPrice: 12.28,
    whyChoose: {
      title1: 'Why Choose a .ORG Domain?',
      text1: 'Recognized globally as the voice of non-profits, foundations, cultural organizations, and community movements.',
      title2: 'Is a .ORG Right for Me?',
      text2: 'If your organization is driven by a mission, charity, public good, or open-source software, .org gives you unmatched moral authority.',
      title3: 'Inspire Online Trust with .ORG',
      text3: 'Millions of users trust .org websites for unbiased information, humanitarian causes, and community collaborations.',
    },
    features: [
      'Universal non-profit & mission trust',
      'Free WHOIS identity masking',
      'Sub-3-minute Anycast DNS mesh',
      '1-Click automated DNS routing',
      '24/7 Support access',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'SALE' },
      { tld: 'net', desc: 'A true Internet original', price: 12.48, badge: 'SALE' },
    ],
    faqs: [
      {
        q: 'Do I need non-profit tax documentation to register a .org domain?',
        a: 'No, .org is open to any individual, business, or organization worldwide looking to build a purpose-driven digital presence.',
      },
    ],
  },
  io: {
    tld: 'io',
    category: 'cctld',
    tagline: 'Time to grow with a .IO',
    description: 'The tech and SaaS startup industry favorite. Recognized globally as Input/Output in computing.',
    regPrice1Yr: 34.98,
    origPrice1Yr: 65.98,
    discountPct: 47,
    renewalPrice1Yr: 75.98,
    transferPrice: 65.98,
    whyChoose: {
      title1: 'Why Choose a .IO Domain?',
      text1: 'As the shorthand for Input/Output, .io is the premier badge of honor for tech startups, developer tools, and Web3 projects.',
      title2: 'Is a .IO Right for Me?',
      text2: 'If you are building an AI app, developer tool, open-source library, or SaaS product, .io instantly resonates with tech enthusiasts.',
      title3: 'Join Top Tech Innovators',
      text3: 'Leading tech unicorns and developer tools run their main platforms on .io domain extensions.',
    },
    features: [
      'Tech-forward brand identity',
      'Free WHOIS privacy guard',
      'Fast global Anycast resolution',
      'Instant DNS record management',
    ],
    alternatives: [
      { tld: 'dev', desc: 'Built for developers', price: 10.98, badge: 'HOT' },
      { tld: 'ai', desc: 'Artificial intelligence TLD', price: 89.98, badge: 'AI' },
    ],
    faqs: [
      {
        q: 'Can anyone register a .io domain?',
        a: 'Yes, .io is treated as a generic top-level domain by search engines and is open to anyone worldwide.',
      },
    ],
  },
  ai: {
    tld: 'ai',
    category: 'cctld',
    tagline: 'Secure your .AI for a great price',
    description: 'The definitive top-level domain for Artificial Intelligence, machine learning startups, and algorithmic innovation.',
    regPrice1Yr: 89.98,
    origPrice1Yr: 179.96,
    discountPct: 50,
    renewalPrice1Yr: 114.98,
    transferPrice: 99.98,
    whyChoose: {
      title1: 'Why Choose a .AI Domain?',
      text1: 'The explosive growth of Artificial Intelligence makes .ai the single most prestigious and valuable tech extension in the world today.',
      title2: 'Is a .AI Right for Me?',
      text2: 'Essential for AI research labs, LLM applications, generative startups, machine learning tools, and robotic automation platforms.',
      title3: 'Own the Future of Computing',
      text3: 'Establish commanding industry leadership with an authentic .ai domain name.',
    },
    features: [
      'Premier Artificial Intelligence branding',
      'Sub-3-minute Anycast DNS propagation',
      '2-year registration cycle compliant with registry',
      'Free DNSSEC & TLS support',
    ],
    alternatives: [
      { tld: 'dev', desc: 'Built for developers', price: 10.98, badge: 'DEV' },
      { tld: 'io', desc: 'Tech & SaaS favorite', price: 34.98, badge: 'TECH' },
    ],
    faqs: [
      {
        q: 'Why are .ai domains registered for 2 years minimum?',
        a: 'The official registry rules for the .ai ccTLD require all new registrations and renewals to be completed in 2-year increments.',
      },
    ],
  },
  cm: {
    tld: 'cm',
    category: 'cctld',
    tagline: 'Claim Your Official Cameroon Domain (.CM)',
    description: 'The official country-code top-level domain (ccTLD) for Cameroon. Build local trust with Cameroonian customers and businesses.',
    regPrice1Yr: 28.00,
    origPrice1Yr: 37.99,
    discountPct: 26,
    renewalPrice1Yr: 37.99,
    transferPrice: 28.00,
    whyChoose: {
      title1: 'Why Choose a .CM Domain?',
      text1: 'Establish an authentic local presence in Cameroon. Local search algorithms in Central Africa prioritize .cm domains for regional queries.',
      title2: 'Is a .CM Right for Me?',
      text2: 'Essential for Cameroonian businesses, fintechs, government initiatives, retail shops, and international brands operating in Cameroon.',
      title3: 'Fast Local Anycast DNS',
      text3: 'Hosted with local routing for the fastest connection times across Douala, Yaoundé, Bafoussam, and all 10 regions of Cameroon.',
    },
    features: [
      'Official Cameroon ccTLD authority',
      'Local Central Africa Anycast caching',
      'Direct Mobile Money payment (MTN MoMo & Orange Money)',
      'Instant DNS zone deployment',
    ],
    alternatives: [
      { tld: 'africa', desc: 'The pan-African domain', price: 14.50, badge: 'HOT' },
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'GLOBAL' },
    ],
    faqs: [
      {
        q: 'Can I pay for my .cm domain with MTN MoMo or Orange Money?',
        a: 'Yes! Oneallhost supports instant direct mobile money payment via MTN MoMo and Orange Money in CFA Francs (XAF).',
      },
    ],
  },
  store: {
    tld: 'store',
    category: 'gtld',
    tagline: 'Grab your first .store domain for just $0.98',
    description: 'The ultimate domain extension for ecommerce, retail stores, direct-to-consumer brands, and digital merchants worldwide.',
    regPrice1Yr: 0.98,
    origPrice1Yr: 2.88,
    discountPct: 66,
    renewalPrice1Yr: 2.88,
    transferPrice: 0.98,
    specialBadge: 'Sale: $0.98 1st Year',
    whyChoose: {
      title1: 'Why Choose a .STORE Domain?',
      text1: 'Instantly tell shoppers that you are in business to sell. .store is immediately recognized by global search engines and ecommerce shoppers.',
      title2: 'Is a .STORE Right for Me?',
      text2: 'Whether launching a Shopify store, WooCommerce boutique, physical retail branch, or dropshipping brand, .store drives conversion.',
      title3: 'Build a Memorable Shopping Brand',
      text3: 'Over 1 million merchants worldwide drive high-converting ecommerce sales on .store domains.',
    },
    features: [
      'Sub-3-minute Anycast DNS mesh',
      'Free Lifetime WHOIS Privacy Guard',
      'Instant WooCommerce & Shopify CNAME sync',
      '24/7 Commerce Support Engineers',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'GLOBAL' },
      { tld: 'online', desc: 'Carve out your space', price: 3.99, badge: 'SALE' },
      { tld: 'shop', desc: 'The online shopping hub', price: 2.99, badge: 'HOT' },
    ],
    faqs: [
      {
        q: 'Can I connect a .store domain to Shopify or WooCommerce?',
        a: 'Yes! Oneallhost provides automated 1-click DNS configuration for Shopify, WooCommerce, Etsy, and Amazon storefronts.',
      },
    ],
  },
  co: {
    tld: 'co',
    category: 'cctld',
    tagline: 'Get ready to go with a .CO',
    description: 'Short, memorable, and globally recognized. The modern alternative to .com for startups, entrepreneurs, and forward-thinking businesses.',
    regPrice1Yr: 19.98,
    origPrice1Yr: 38.48,
    discountPct: 48,
    renewalPrice1Yr: 45.48,
    transferPrice: 38.48,
    whyChoose: {
      title1: 'Why Choose a .CO Domain?',
      text1: 'Recognized globally as short for Company, Corporation, and Commerce. .co is short, punchy, and highly brandable.',
      title2: 'Is a .CO Right for Me?',
      text2: 'Perfect for tech startups, venture-backed companies, creators, and brands seeking a short premium domain.',
      title3: 'Launch with Speed',
      text3: 'Over 3 million innovators and startups across 200+ countries have launched on .co.',
    },
    features: [
      'Short & memorable 2-letter extension',
      'Free WHOIS Privacy Protection',
      'Global Anycast DNS resolution',
      '24/7 Dedicated Support',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'SALE' },
      { tld: 'net', desc: 'A true Internet original', price: 12.48, badge: 'SALE' },
    ],
    faqs: [
      {
        q: 'Is .co treated as a generic domain by Google?',
        a: 'Yes, Google treats .co as a generic top-level domain (gTLD) for SEO and geotargeting purposes worldwide.',
      },
    ],
  },
  ca: {
    tld: 'ca',
    category: 'cctld',
    tagline: 'Canadians trust the .CA',
    description: 'The official country-code domain for Canada. Build trust and domestic presence with Canadian consumers and businesses.',
    regPrice1Yr: 11.98,
    origPrice1Yr: 14.98,
    discountPct: 20,
    renewalPrice1Yr: 14.98,
    transferPrice: 10.98,
    whyChoose: {
      title1: 'Why Choose a .CA Domain?',
      text1: 'Canadians prefer to shop and interact with .ca websites. It signals local Canadian identity and pride.',
      title2: 'Is a .CA Right for Me?',
      text2: 'Essential for Canadian businesses, organizations, and residents looking to serve the Canadian market.',
      title3: 'Canadian Presence Requirements',
      text3: 'Subject to CIRA Canadian Presence Requirements (CPR), ensuring a trusted local namespace.',
    },
    features: [
      'Official CIRA Canadian registry',
      'Fast North American Anycast DNS',
      'Free DNSSEC & privacy support',
      '24/7 Expert assistance',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'GLOBAL' },
      { tld: 'org', desc: 'For mission-led projects', price: 8.48, badge: 'SALE' },
    ],
    faqs: [
      {
        q: 'Who is eligible to register a .ca domain?',
        a: 'Any Canadian citizen, permanent resident, corporation, or trademark holder can register a .ca domain under CIRA guidelines.',
      },
    ],
  },
  couk: {
    tld: 'co.uk',
    category: 'cctld',
    tagline: 'Get a ‘Great’ British domain… Get a .CO.UK',
    description: 'The most popular domain extension in the United Kingdom. Perfect for UK businesses, online retailers, and creators.',
    regPrice1Yr: 6.98,
    origPrice1Yr: 7.48,
    discountPct: 7,
    renewalPrice1Yr: 9.98,
    transferPrice: 0.00,
    specialBadge: 'Free Transfers ($0.00)',
    whyChoose: {
      title1: 'Why Choose a .CO.UK Domain?',
      text1: 'Four out of five UK consumers prefer to buy from .co.uk websites. It signals trusted UK business presence and local customer care.',
      title2: 'Is a .CO.UK Right for Me?',
      text2: 'Ideal for British retailers, consultants, startups, and international firms selling to consumers across the UK.',
      title3: 'Nominet Accredited Registrar',
      text3: 'Reliable registry backed by Nominet with free transfers and instant automated DNS zone deployment.',
    },
    features: [
      'Nominet accredited DNS infrastructure',
      'Free Domain Transfers ($0.00)',
      'Instant DNS record management',
      '24/7 Expert support',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'GLOBAL' },
      { tld: 'net', desc: 'A true Internet original', price: 12.48, badge: 'SALE' },
    ],
    faqs: [
      {
        q: 'Do I need a UK address to register a .co.uk domain?',
        a: 'No! Anyone globally can register a .co.uk domain name through Oneallhost without requiring UK residency.',
      },
    ],
  },
  me: {
    tld: 'me',
    category: 'cctld',
    tagline: 'Show more of you with a .me',
    description: 'Personal, expressive, and unforgettable. The ultimate domain extension for personal portfolios, resumes, and personal branding.',
    regPrice1Yr: 10.98,
    origPrice1Yr: 19.98,
    discountPct: 45,
    renewalPrice1Yr: 23.98,
    transferPrice: 17.98,
    whyChoose: {
      title1: 'Why Choose a .ME Domain?',
      text1: 'Make your web presence personal and direct. Create memorable domain hacks like contact.me or yourname.me.',
      title2: 'Is a .ME Right for Me?',
      text2: 'Ideal for freelancers, designers, developers, photographers, bloggers, and anyone building an individual personal brand.',
      title3: 'Stand Out Online',
      text3: 'Used by millions of creators globally for memorable personal URLs and short links.',
    },
    features: [
      'High-impact personal branding',
      'Free Lifetime WHOIS Privacy Guard',
      'Sub-3-minute Anycast DNS mesh',
      '24/7 Live Support',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'GLOBAL' },
      { tld: 'dev', desc: 'For tech developers', price: 10.98, badge: 'DEV' },
    ],
    faqs: [
      {
        q: 'Can businesses also register .me domains?',
        a: 'Yes, businesses frequently use .me for call-to-action landing pages, personalized marketing links, and customer portals.',
      },
    ],
  },
};

export const TldRegistrationTemplate: React.FC<{ tldKey: string; defaultCategory?: 'gtld' | 'cctld' }> = ({
  tldKey,
  defaultCategory = 'gtld',
}) => {
  const normalizedKey = tldKey.toLowerCase().replace('.', '');
  const cleanKey = tldKey.toLowerCase().replace('.', '').replace('-', '');
  const config = TLD_DATABASE[cleanKey] || TLD_DATABASE[tldKey.toLowerCase()] || {
    tld: tldKey.toLowerCase(),
    category: defaultCategory,
    tagline: `Register your .${normalizedKey.toUpperCase()} domain`,
    description: `Claim your .${normalizedKey.toUpperCase()} domain name today with automated Anycast DNS, free lifetime WHOIS privacy, and 24/7 technical support.`,
    regPrice1Yr: 10.98,
    origPrice1Yr: 15.98,
    discountPct: 30,
    renewalPrice1Yr: 15.98,
    transferPrice: 10.98,
    whyChoose: {
      title1: `Why Choose a .${normalizedKey.toUpperCase()} Domain?`,
      text1: `A modern, flexible top-level domain that helps you create a memorable online presence and stand out from the crowd.`,
      title2: `Is a .${normalizedKey.toUpperCase()} Right for Me?`,
      text2: `Perfect for personal websites, startups, portfolio showcases, and digital businesses.`,
      title3: `Connect with Your Audience`,
      text3: `Join thousands of websites worldwide using .${normalizedKey} extensions.`,
    },
    features: [
      'Fast & reliable Anycast DNS mesh',
      'Free Lifetime WHOIS Privacy Guard',
      'Instant automated DNS zone deployment',
      '24/7 Expert Technical Support',
    ],
    alternatives: [
      { tld: 'com', desc: 'The King of domains', price: 6.79, badge: 'SALE' },
      { tld: 'dev', desc: 'For tech developers', price: 10.98, badge: 'DEV' },
      { tld: 'io', desc: 'Tech & SaaS favorite', price: 34.98, badge: 'HOT' },
    ],
    faqs: [
      {
        q: `How do I register a .${normalizedKey} domain?`,
        a: 'Enter your desired domain name in the search box, confirm availability, and proceed through our instant checkout.',
      },
    ],
  };

  const [searchDomain, setSearchDomain] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDomain.trim()) {
      const fullDomain = searchDomain.includes('.')
        ? searchDomain
        : `${searchDomain}.${config.tld}`;
      window.location.href = `/checkout?domain=${encodeURIComponent(fullDomain)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Breadcrumb Bar */}
      <div className="bg-[#F0F3F9] py-2.5 px-4 sm:px-8 text-xs font-semibold text-[#6B6E68]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/domains" className="hover:text-[#0D3B85]">Domains</Link>
          <span>/</span>
          <Link href="/domains/domain-name-search" className="hover:text-[#0D3B85]">Domain Search</Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">.{config.tld.toUpperCase()} Domain</span>
        </div>
      </div>

      {/* 1. Dark Navy Hero with Tech Theme */}
      <section className="bg-[#091F44] text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Register your .{config.tld.toUpperCase()} domain
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            {config.tagline}
          </p>

          {/* Domain Search Strip */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 w-full">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs sm:text-sm shrink-0" />
                <input
                  type="text"
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value)}
                  placeholder={`Search your .${config.tld} domain name...`}
                  className="w-full h-10 sm:h-11 text-xs sm:text-sm text-[#111111] placeholder:text-[#6B6E68] outline-none font-medium bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Search</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Why Choose This TLD & Feature Checkmarks (2-Col Layout with Floating Circle Price) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 3 Paragraphs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-[#111111]">{config.whyChoose.title1}</h2>
              <p className="text-sm text-[#555555] leading-relaxed">{config.whyChoose.text1}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#111111]">{config.whyChoose.title2}</h3>
              <p className="text-sm text-[#555555] leading-relaxed">{config.whyChoose.text2}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#111111]">{config.whyChoose.title3}</h3>
              <p className="text-sm text-[#555555] leading-relaxed">{config.whyChoose.text3}</p>
            </div>
          </div>

          {/* Right: Feature Bulletpoints + Floating Price Circle */}
          <div className="lg:col-span-5 bg-[#FAFAF9] p-8 sm:p-10 rounded-3xl space-y-6 relative border-0 shadow-sm">
            {/* Floating Price Badge */}
            <div className="w-28 h-28 rounded-full bg-[#1B6FC9] text-white flex flex-col items-center justify-center text-center p-2 shadow-xl mx-auto lg:mx-0 lg:ml-auto">
              <span className="text-[10px] leading-tight font-medium uppercase text-blue-100">Special offer</span>
              <span className="text-xl font-black">${config.regPrice1Yr.toFixed(2)}</span>
              <span className="text-[9px] text-blue-200">/ 1st yr</span>
            </div>

            <div className="space-y-3 pt-2">
              {config.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-[#333333]">
                  <i className="fa-solid fa-check text-[#7CB342] text-sm mt-0.5 shrink-0" />
                  <span className="font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discover TLD Domain Prices (1 to 5 Years Table) */}
      <section className="py-16 px-4 sm:px-8 bg-[#F6F7F5] border-0">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
            Discover .{config.tld} domain prices
          </h2>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBE7] text-[#6B6E68] bg-[#FAFAF9]">
                  <th className="p-4 font-bold">TYPE</th>
                  <th className="p-4 font-bold">1 YEAR</th>
                  <th className="p-4 font-bold">2 YEARS</th>
                  <th className="p-4 font-bold">3 YEARS</th>
                  <th className="p-4 font-bold">4 YEARS</th>
                  <th className="p-4 font-bold">5 YEARS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE7]">
                <tr>
                  <td className="p-4 font-bold text-[#111111]">.{config.tld} registration</td>
                  <td className="p-4">
                    <span className="font-extrabold text-[#D32F2F] text-sm">${config.regPrice1Yr.toFixed(2)}</span>
                    <span className="block text-[10px] text-[#6B6E68] line-through">${config.origPrice1Yr.toFixed(2)}</span>
                  </td>
                  <td className="p-4 font-semibold">${(config.regPrice1Yr + config.renewalPrice1Yr).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.regPrice1Yr + config.renewalPrice1Yr * 2).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.regPrice1Yr + config.renewalPrice1Yr * 3).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.regPrice1Yr + config.renewalPrice1Yr * 4).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]">.{config.tld} renewal</td>
                  <td className="p-4 font-semibold">${config.renewalPrice1Yr.toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.renewalPrice1Yr * 2).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.renewalPrice1Yr * 3).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.renewalPrice1Yr * 4).toFixed(2)}</td>
                  <td className="p-4 font-semibold">${(config.renewalPrice1Yr * 5).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]">.{config.tld} transfer</td>
                  <td className="p-4 font-semibold text-[#0D3B85]">${config.transferPrice.toFixed(2)}</td>
                  <td className="p-4 text-[#6B6E68]">—</td>
                  <td className="p-4 text-[#6B6E68]">—</td>
                  <td className="p-4 text-[#6B6E68]">—</td>
                  <td className="p-4 text-[#6B6E68]">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Safety & Support for This TLD */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
          Safety and support for your .{config.tld}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FAFAF9] p-8 rounded-3xl space-y-3 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-lock text-xl" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#111111]">FREE SSL &amp; 2FA Support</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Secure your website data with 256-bit encryption and protect your registrar account with 2-factor authentication.
              </p>
            </div>
          </div>

          <div className="bg-[#FAFAF9] p-8 rounded-3xl space-y-3 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#7CB342] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user-shield text-xl" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#111111]">Free Lifetime Domain Privacy</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                We automatically hide your phone number, email address, and home location from public WHOIS search engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Find an Alternative TLD */}
      <section className="py-20 px-4 sm:px-8 bg-[#FAFAF9] border-0">
        <div className="max-w-7xl mx-auto space-y-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
            Find a .{config.tld} domain alternative
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.alternatives.map((alt, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-[#111111]">.{alt.tld}</span>
                    {alt.badge && (
                      <span className="px-2 py-0.5 bg-[#D32F2F] text-white rounded text-[10px] font-black uppercase">
                        {alt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6E68]">{alt.desc}</p>
                </div>
                <div className="pt-3 border-t border-[#F0F0EE] flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0D3B85]">${alt.price.toFixed(2)}/yr</span>
                  <Link href={`/domains/registration/${config.category}/${alt.tld}`}>
                    <button className="px-3 py-1.5 bg-[#0D3B85] hover:bg-[#091F44] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      View Price
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Perfect Partners for Your TLD */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
          Perfect partners for your .{config.tld}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs border border-[#F0F0EE]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <i className="fa-solid fa-server text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Shared Hosting</h3>
            <p className="text-xs text-[#6B6E68]">NVMe speed cloud storage for your web app.</p>
            <Link href="/hosting/shared" className="text-xs font-bold text-[#0D3B85] hover:underline block pt-1">
              Explore Hosting →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs border border-[#F0F0EE]">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#7CB342] flex items-center justify-center">
              <i className="fa-solid fa-lock text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">SSL Certificates</h3>
            <p className="text-xs text-[#6B6E68]">Industry-standard 256-bit TLS encryption.</p>
            <Link href="/security/ssl-certificates" className="text-xs font-bold text-[#0D3B85] hover:underline block pt-1">
              Get SSL →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs border border-[#F0F0EE]">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A27] flex items-center justify-center">
              <i className="fa-solid fa-tower-cell text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">PremiumDNS</h3>
            <p className="text-xs text-[#6B6E68]">100% DNS uptime SLA with DDoS protection.</p>
            <Link href="/security/premiumdns" className="text-xs font-bold text-[#0D3B85] hover:underline block pt-1">
              Add DNS →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs border border-[#F0F0EE]">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i className="fa-solid fa-envelope text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Private Email</h3>
            <p className="text-xs text-[#6B6E68]">Look pro with @yourname.{config.tld} mail.</p>
            <Link href="/email" className="text-xs font-bold text-[#0D3B85] hover:underline block pt-1">
              Create Mailbox →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions Accordion */}
      <section className="py-20 px-4 sm:px-8 bg-[#FAFAF9] border-0">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#111111] hover:text-[#0D3B85] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#6B6E68] leading-relaxed border-t border-[#F0F0EE] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Disclaimers */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto text-[11px] text-[#888888] space-y-3 leading-relaxed border-t border-[#EBEBE7]">
        <div className="font-bold uppercase tracking-wider text-[#666666]">Disclaimers</div>
        <p>
          ICANN charges a mandatory annual fee of $0.20 for each domain registration, renewal, or transfer. This is included in our transparent billing at checkout.
        </p>
        <p>
          You receive a domain privacy subscription FREE with every eligible domain registration or transfer. Lifetime identity masking is provided standard.
        </p>
      </section>

      {/* 9. Live Chat Support Bar */}
      <div className="bg-[#EAEFF8] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#111111]">
          <span className="font-semibold">Need help? We&apos;re always here for you.</span>
          <Link href="/dashboard/support">
            <button className="h-9 px-5 bg-[#2C6E63] hover:bg-[#205249] text-white font-bold text-xs rounded-xl cursor-pointer">
              Chat with a Live Person
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};
