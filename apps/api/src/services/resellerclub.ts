export interface DomainSearchResult {
  domainName: string;
  tld: string;
  isAvailable: boolean;
  isPremium: boolean;
  wholesaleCostUsd: number;
  retailPriceUsd: number;
  retailPriceXaf: number;
  renewalPriceUsd: number;
  renewalPriceXaf: number;
  whoisPrivacySupported: boolean;
  currency: 'USD';
}

export class ResellerClubService {
  private markupPercent = 30;
  private xafRate = 615.5;

  private wholesalePrices: Record<string, number> = {
    com: 9.85,
    net: 11.20,
    org: 10.50,
    io: 36.00,
    cm: 28.00,
    africa: 14.50,
    co: 22.00,
    tech: 6.90,
    app: 14.00,
    store: 4.80,
    dev: 12.00,
    ai: 68.00,
    online: 3.99,
  };

  private takenDomains = new Set([
    'google.com', 'apple.com', 'microsoft.com', 'amazon.com', 'netflix.com',
    'facebook.com', 'altonixa.com', 'oneallhost.com', 'orange.cm', 'mtn.cm',
    'tech.io', 'cloud.com', 'host.com', 'shop.com', 'bank.com'
  ]);

  public async searchAvailability(query: string): Promise<DomainSearchResult[]> {
    const clean = query.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    const parts = clean.split('.');
    const base = parts[0] || 'domain';
    const requestedTld = parts[1] || 'com';

    const tlds = Array.from(new Set([requestedTld, 'com', 'cm', 'africa', 'net', 'org', 'io', 'tech', 'app', 'store', 'ai']));

    return tlds.map((tld) => {
      const fullDomain = `${base}.${tld}`;
      const isTaken = this.takenDomains.has(fullDomain) || (base.length <= 3 && tld === 'com');
      const isPremium = base.length <= 4 && !isTaken && (tld === 'io' || tld === 'ai');
      
      const wholesale = isPremium ? (tld === 'ai' ? 180.0 : 99.0) : (this.wholesalePrices[tld] || 12.00);
      const retailUsd = isPremium ? wholesale : Math.floor(wholesale * (1 + this.markupPercent / 100)) + 0.99;
      const retailXaf = Math.round(retailUsd * this.xafRate);

      return {
        domainName: fullDomain,
        tld,
        isAvailable: !isTaken,
        isPremium,
        wholesaleCostUsd: wholesale,
        retailPriceUsd: retailUsd,
        retailPriceXaf: retailXaf,
        renewalPriceUsd: retailUsd,
        renewalPriceXaf: retailXaf,
        whoisPrivacySupported: tld !== 'cm',
        currency: 'USD',
      };
    });
  }

  public async register(domainName: string, customerId: string): Promise<{ success: boolean; refId: string }> {
    return {
      success: true,
      refId: `RC-${Date.now()}-${domainName.replace(/[^a-z0-9]/g, '')}`,
    };
  }
}

export const resellerClubService = new ResellerClubService();
