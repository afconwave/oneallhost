export interface NavItem {
  label: string;
  href: string;
  desc: string;
  icon: string;
  badge?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  items?: NavItem[];
}

export const NAV_ITEMS: NavGroup[] = [
  {
    label: 'Domains',
    href: '/domains',
    badge: 'NEW',
    badgeColor: 'bg-[#FF5A27]',
    items: [
      { label: 'Domain Name Search', href: '/domains/domain-name-search', desc: 'Search 400+ TLDs with sub-3-minute Anycast DNS', icon: 'fa-solid fa-magnifying-glass', badge: 'POPULAR' },
      { label: 'Subdomain Staging Rentals', href: '/domains/rentals', desc: 'Lease staging subdomains with 100% purchase rebate', icon: 'fa-solid fa-arrows-rotate', badge: '100% REBATE' },
      { label: 'Domain Transfer', href: '/domains/transfer', desc: 'Transfer your domain to Oneallhost with +1 YR free', icon: 'fa-solid fa-arrow-right-arrow-left', badge: '+1 YR FREE' },
      { label: 'New TLDs', href: '/domains/explore-new-tlds', desc: 'Explore the newest domain extensions available', icon: 'fa-solid fa-sparkles', badge: 'NEW' },
      { label: 'Bulk Domain Search', href: '/domains/bulk-domain-search', desc: 'Search and register up to 5,000 domains at once', icon: 'fa-solid fa-list-check' },
      { label: 'TLD List', href: '/domains/full-tld-list', desc: 'Complete list of 400+ TLD extensions and prices', icon: 'fa-solid fa-table-list' },
      { label: 'Oneallhost Market', href: '/market', desc: 'Buy and sell premium domain names securely', icon: 'fa-solid fa-store' },
      { label: 'Whois Lookup', href: '/domains/whois', desc: 'Check ownership records and registration info', icon: 'fa-solid fa-id-card' },
      { label: 'PremiumDNS', href: '/security/premiumdns', desc: 'Enterprise Anycast DNS with 100% uptime SLA', icon: 'fa-solid fa-shield-halved' },
      { label: 'FreeDNS', href: '/domains/freedns', desc: 'Backup DNS hosting with instant propagation', icon: 'fa-solid fa-network-wired' },
    ],
  },
  {
    label: 'Hosting',
    href: '/hosting',
    items: [
      { label: 'Shared Hosting', href: '/hosting/shared', desc: 'High-speed NVMe cloud hosting with cPanel', icon: 'fa-solid fa-server', badge: 'POPULAR' },
      { label: 'Hosting for WordPress', href: '/wordpress', desc: '1-click optimized WordPress cloud instances', icon: 'fa-brands fa-wordpress' },
      { label: 'Reseller Hosting', href: '/hosting/reseller', desc: 'Start your own hosting business with WHM/cPanel', icon: 'fa-solid fa-users-gear' },
      { label: 'VPS Hosting', href: '/hosting/vps', desc: 'Full root access VPS with dedicated KVM resources', icon: 'fa-solid fa-microchip' },
      { label: 'Dedicated Servers', href: '/hosting/dedicated-servers', desc: 'Bare-metal enterprise servers with unmetered bandwidth', icon: 'fa-solid fa-hard-drive' },
      { label: 'Migrate to Oneallhost', href: '/hosting/migrate', desc: 'Free zero-downtime hosting migration service', icon: 'fa-solid fa-truck-ramp-box', badge: 'FREE' },
    ],
  },
  {
    label: 'WordPress',
    href: '/wordpress',
    items: [
      { label: 'WordPress Cloud', href: '/wordpress', desc: 'Ultra-fast managed WordPress with 99.9% SLA', icon: 'fa-brands fa-wordpress', badge: 'FAST' },
      { label: 'Migrate WordPress', href: '/wordpress/migrate', desc: 'Seamlessly move your WP site with zero downtime', icon: 'fa-solid fa-arrow-right-to-bracket' },
      { label: 'Is WP Site Detector', href: '/tools/is-it-wp', desc: 'Check if a website uses WordPress, its theme & plugins', icon: 'fa-solid fa-wand-magic-sparkles', badge: 'FREE' },
    ],
  },
  {
    label: 'Email',
    href: '/email',
    items: [
      { label: 'Private Business Email', href: '/email', desc: 'Look professional with @yourdomain.com email', icon: 'fa-solid fa-envelope-open-text', badge: 'PRO' },
    ],
  },
  {
    label: 'Marketing Tools',
    href: '/apps',
    badge: 'NEW',
    badgeColor: 'bg-[#FF5A27]',
    items: [
      { label: 'How to Get Started', href: '/build-and-grow-hub', desc: 'Step-by-step launch guide for online businesses', icon: 'fa-solid fa-rocket' },
      { label: 'Business Starter Kit', href: '/apps/business-starter-kit', desc: 'Complete brand setup with domain, email, and logo', icon: 'fa-solid fa-briefcase', badge: 'FREE' },
      { label: 'Business Registration', href: '/apps/business-registration-cameroon', desc: 'Official RCCM & NIU legal setup for Cameroonian businesses', icon: 'fa-solid fa-file-contract', badge: 'CAMEROON ONLY' },
      { label: 'Growth Tools', href: '/relate', desc: 'SEO optimization, automated reviews, and local listings', icon: 'fa-solid fa-chart-line', badge: 'AI' },
      { label: 'Design Tools', href: '/visual', desc: 'AI logo maker, website generator, and social graphics', icon: 'fa-solid fa-palette', badge: 'AI' },
    ],
  },
  {
    label: 'Security',
    href: '/security',
    badge: 'NEW',
    badgeColor: 'bg-[#FF5A27]',
    items: [
      { label: 'SSL Certificates', href: '/security/ssl-certificates', desc: 'DV, OV, and EV SSL with 256-bit encryption', icon: 'fa-solid fa-lock' },
      { label: 'Domain Privacy', href: '/security/domain-privacy-service', desc: 'Lifetime identity masking for domain owners', icon: 'fa-solid fa-user-shield', badge: 'FREE' },
      { label: 'Website Security', href: '/security/protect-website', desc: 'Automatic malware scanning & daily cloud backup', icon: 'fa-solid fa-shield-virus', badge: 'NEW' },
      { label: 'Fix Hacked Website', href: '/security/fix-hacked-website', desc: 'Emergency 24-hour malware cleanup & site repair', icon: 'fa-solid fa-kit-medical', badge: 'SOS' },
      { label: 'PremiumDNS', href: '/security/premiumdns', desc: 'DDoS protected Anycast DNS infrastructure', icon: 'fa-solid fa-tower-cell' },
      { label: 'CDN', href: '/supersonic-cdn', desc: 'Global content delivery network with edge caching', icon: 'fa-solid fa-bolt' },
      { label: 'VPN', href: '/vpn', desc: 'Secure encrypted virtual private network', icon: 'fa-solid fa-shield-cat', badge: 'UPDATED' },
      { label: 'Cyber Insurance', href: '/cyber-insurance', desc: 'Up to $50,000 protection against security breaches', icon: 'fa-solid fa-building-shield', badge: 'NEW' },
      { label: '2FA', href: '/security/2fa-two-factor-authentication', desc: 'Multi-factor authentication for total account protection', icon: 'fa-solid fa-key' },
      { label: 'Public DNS', href: '/dns/free-public-dns', desc: 'Fast, secure public DNS resolver', icon: 'fa-solid fa-network-wired' },
      { label: 'Anti-Spam Protection', href: '/security/anti-spam-protection', desc: 'AI spam filtering for incoming and outgoing mail', icon: 'fa-solid fa-filter-circle-xmark' },
    ],
  },
  {
    label: 'Transfer to Us',
    href: '/domains/transfer',
    badge: 'TRY ME',
    badgeColor: 'bg-[#0D3B85]',
    items: [
      { label: 'Transfer Domains', href: '/domains/transfer', desc: 'Transfer domain with +1 YR free extension', icon: 'fa-solid fa-arrow-right-arrow-left', badge: '+1 YR FREE' },
      { label: 'Migrate Hosting', href: '/hosting/migrate', desc: 'We move your cPanel files, databases, and mail free', icon: 'fa-solid fa-truck-arrow-right', badge: 'FREE' },
      { label: 'Migrate WordPress', href: '/wordpress/migrate', desc: 'Zero downtime transfer for WordPress websites', icon: 'fa-brands fa-wordpress' },
    ],
  },
  {
    label: 'Help Center',
    href: '/help-center',
    badge: 'NEW',
    badgeColor: 'bg-[#FF5A27]',
    items: [
      { label: 'Knowledgebase', href: '/support/knowledgebase', desc: 'Search 500+ tutorials and step-by-step guides', icon: 'fa-solid fa-book' },
      { label: 'Fix Hacked Website', href: '/security/fix-hacked-website', desc: 'Immediate incident response for compromised sites', icon: 'fa-solid fa-kit-medical', badge: 'SOS' },
      { label: 'Guru Guides', href: '/guru-guides', desc: 'In-depth technical guides written by engineers', icon: 'fa-solid fa-graduation-cap' },
      { label: 'Blog', href: '/blog', desc: 'Product announcements, tech tips, and industry news', icon: 'fa-solid fa-newspaper' },
      { label: 'Build + Grow Hub', href: '/build-and-grow-hub', desc: 'Resources for growing your online presence', icon: 'fa-solid fa-cubes-stacked', badge: 'NEW' },
      { label: 'Status Updates', href: '/status-updates', desc: 'Real-time server uptime and network status', icon: 'fa-solid fa-signal' },
    ],
  },
  {
    label: 'Account',
    href: '/dashboard',
    badge: 'NEW',
    badgeColor: 'bg-[#FF5A27]',
    items: [
      { label: 'Dashboard', href: '/dashboard', desc: 'Overview of active services, invoices, and tickets', icon: 'fa-solid fa-gauge' },
      { label: 'Expiring Soon', href: '/dashboard/expiring-soon', desc: 'View domains and services nearing expiration', icon: 'fa-solid fa-clock-rotate-left' },
      { label: 'Domain List', href: '/dashboard/domain-list', desc: 'Manage DNS records, WHOIS, and auto-renewal', icon: 'fa-solid fa-globe' },
      { label: 'Hosting List', href: '/dashboard/hosting-list', desc: 'Access cPanel, manage SSL, and scale resources', icon: 'fa-solid fa-server' },
      { label: 'Private Email', href: '/dashboard/private-email', desc: 'Access webmail and configure mailboxes', icon: 'fa-solid fa-envelope' },
      { label: 'SSL Certificates', href: '/dashboard/ssl-certificates', desc: 'Install and renew your domain security certs', icon: 'fa-solid fa-lock' },
      { label: 'Subscriptions', href: '/apps/subscriptions', desc: 'Manage recurring billing and payment methods', icon: 'fa-solid fa-credit-card' },
      { label: 'My Offers', href: '/dashboard/my-offers', desc: 'Exclusive client discounts and renewal promotions', icon: 'fa-solid fa-tag', badge: 'NEW' },
      { label: 'Profile', href: '/dashboard/profile', desc: 'Update contact info, security, and preferences', icon: 'fa-solid fa-user-gear' },
    ],
  },
];
