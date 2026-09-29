export type PlanFamily = 'shared' | 'reseller' | 'vps' | 'email' | 'ssl' | 'security' | 'domain-addon';

export interface CatalogPlan {
  id: string;
  family: PlanFamily;
  name: string;
  tagline: string;
  priceUsd: number;
  interval: 'month' | 'year';
  highlights: string[];
  whmPackage?: string;
  suggestWhen: string[];
}

export const CATALOG: CatalogPlan[] = [
  { id: 'shared-starter', family: 'shared', name: 'Starter Cloud', tagline: 'One site, SSL, backups', priceUsd: 4.99, interval: 'month', highlights: ['10 GB NVMe', 'Free SSL', 'Daily backup'], whmPackage: 'onh_starter', suggestWhen: ['domain', 'checkout', 'empty-hosting'] },
  { id: 'shared-pro', family: 'shared', name: 'Pro Cloud', tagline: 'Stores and agencies', priceUsd: 12.99, interval: 'month', highlights: ['50 GB NVMe', 'Free SSL', 'Staging'], whmPackage: 'onh_pro', suggestWhen: ['domain', 'wordpress', 'checkout'] },
  { id: 'reseller-nebula', family: 'reseller', name: 'Nebula Reseller', tagline: 'WHM white-label start', priceUsd: 19.99, interval: 'month', highlights: ['25 cPanel accounts', 'WHM access', 'Own nameservers'], whmPackage: 'onh_reseller_nebula', suggestWhen: ['reseller', 'checkout'] },
  { id: 'reseller-galaxy', family: 'reseller', name: 'Galaxy Reseller', tagline: 'Grow a hosting desk', priceUsd: 39.99, interval: 'month', highlights: ['75 cPanel accounts', 'WHM + Softaculous'], whmPackage: 'onh_reseller_galaxy', suggestWhen: ['reseller'] },
  { id: 'email-starter', family: 'email', name: 'Business Mail', tagline: 'you@yourdomain', priceUsd: 1.25, interval: 'month', highlights: ['10 GB mailbox', 'Spam filter'], suggestWhen: ['domain', 'checkout', 'empty-mail'] },
  { id: 'ssl-dv', family: 'ssl', name: 'PositiveSSL DV', tagline: 'Padlock for one hostname', priceUsd: 11, interval: 'year', highlights: ['Domain validated', 'www + apex'], suggestWhen: ['domain', 'hosting', 'checkout'] },
  { id: 'ssl-wildcard', family: 'ssl', name: 'Wildcard SSL', tagline: 'Every subdomain', priceUsd: 78, interval: 'year', highlights: ['*.example.com'], suggestWhen: ['reseller', 'hosting'] },
  { id: 'sec-waf', family: 'security', name: 'Site Shield', tagline: 'WAF + malware cleanup', priceUsd: 4.99, interval: 'month', highlights: ['WAF', 'Daily scan'], suggestWhen: ['hosting', 'wordpress', 'checkout'] },
];

export function recommendPlans(context: string, owned: string[] = []): CatalogPlan[] {
  const ctx = context.toLowerCase();
  return CATALOG.filter((p) => p.suggestWhen.some((s) => ctx.includes(s) || s === 'checkout' && ctx === 'checkout'))
    .filter((p) => !owned.includes(p.id))
    .slice(0, 6);
}
