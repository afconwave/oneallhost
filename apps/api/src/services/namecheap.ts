import { DomainSearchResult } from './resellerclub';
import dns from 'dns';

export interface NamecheapConfig {
  apiKey: string;
  apiUser: string;
  userName: string;
  clientIp: string;
  email: string;
  name: string;
  baseUrl: string;
}

export class NamecheapService {
  private config: NamecheapConfig;
  private markupPercent = 30;
  private xafRate = 615.5;

  private wholesalePrices: Record<string, number> = {
    com: 9.85, net: 11.20, org: 10.50, io: 36.00, cm: 28.00, africa: 14.50,
    co: 22.00, tech: 6.90, app: 14.00, store: 4.80, dev: 12.00, ai: 68.00, online: 3.99,
  };

  constructor() {
    this.config = {
      apiKey: process.env.NAMECHEAP_API_KEY || '',
      apiUser: process.env.NAMECHEAP_API_USER || '',
      userName: process.env.NAMECHEAP_USERNAME || '',
      email: process.env.NAMECHEAP_EMAIL || '',
      name: process.env.NAMECHEAP_NAME || '',
      clientIp: process.env.NAMECHEAP_CLIENT_IP || '',
      baseUrl: process.env.NAMECHEAP_BASE_URL || 'https://api.namecheap.com/xml.response',
    };
  }

  configured() {
    return Boolean(this.config.apiKey && this.config.apiUser);
  }

  private async checkDnsRegistry(domain: string): Promise<boolean> {
    return new Promise((resolve) => {
      dns.resolveNs(domain, (err, addresses) => {
        if (!err && addresses && addresses.length > 0) return resolve(false);
        dns.resolveSoa(domain, (soaErr, record) => {
          if (!soaErr && record) return resolve(false);
          dns.resolve(domain, (aErr, aRecs) => {
            if (!aErr && aRecs && aRecs.length > 0) return resolve(false);
            return resolve(true);
          });
        });
      });
    });
  }

  public async checkDomains(domainList: string[]): Promise<Record<string, { available: boolean; isPremium: boolean }>> {
    if (!this.configured()) return {};
    const url = `${this.config.baseUrl}?ApiUser=${encodeURIComponent(this.config.apiUser)}&ApiKey=${encodeURIComponent(
      this.config.apiKey
    )}&UserName=${encodeURIComponent(this.config.userName)}&ClientIp=${encodeURIComponent(
      this.config.clientIp
    )}&Command=namecheap.domains.check&DomainList=${encodeURIComponent(domainList.join(','))}`;
    try {
      const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(4000) });
      const xmlText = await response.text();
      const results: Record<string, { available: boolean; isPremium: boolean }> = {};
      const regex = /<DomainCheckResult\s+Domain="([^"]+)"\s+Available="(true|false)"(?:\s+IsPremiumName="(true|false)")?/gi;
      let match;
      while ((match = regex.exec(xmlText)) !== null) {
        results[match[1].toLowerCase()] = {
          available: match[2].toLowerCase() === 'true',
          isPremium: match[3] ? match[3].toLowerCase() === 'true' : false,
        };
      }
      return results;
    } catch {
      return {};
    }
  }

  public async searchAvailability(query: string): Promise<DomainSearchResult[]> {
    const clean = query.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    const parts = clean.split('.');
    const base = parts[0] || 'domain';
    const requestedTld = parts[1] || 'com';
    const tlds = Array.from(new Set([requestedTld, 'com', 'cm', 'africa', 'net', 'org', 'io', 'co', 'app', 'dev', 'store', 'tech', 'ai', 'online', 'site']));
    const domainList = tlds.map((tld) => `${base}.${tld}`);
    const [liveNcResults, dnsAvailabilityList] = await Promise.all([
      this.checkDomains(domainList),
      Promise.all(domainList.map((d) => this.checkDnsRegistry(d))),
    ]);
    return tlds.map((tld, idx) => {
      const fullDomain = domainList[idx];
      const ncCheck = liveNcResults[fullDomain];
      const dnsAvailable = dnsAvailabilityList[idx];
      let isAvailable = dnsAvailable;
      if (ncCheck !== undefined) isAvailable = ncCheck.available && dnsAvailable;
      const isPremium = ncCheck !== undefined ? ncCheck.isPremium : base.length <= 3 && (tld === 'io' || tld === 'ai');
      const wholesale = isPremium ? (tld === 'ai' ? 180.0 : 99.0) : this.wholesalePrices[tld] || 12.0;
      const retailUsd = isPremium ? wholesale : Math.floor(wholesale * (1 + this.markupPercent / 100)) + 0.99;
      return {
        domainName: fullDomain, tld, isAvailable, isPremium,
        wholesaleCostUsd: wholesale, retailPriceUsd: retailUsd,
        retailPriceXaf: Math.round(retailUsd * this.xafRate),
        renewalPriceUsd: retailUsd, renewalPriceXaf: Math.round(retailUsd * this.xafRate),
        whoisPrivacySupported: tld !== 'cm', currency: 'USD',
      };
    });
  }

  public async register(domainName: string, years = 1, contact?: Record<string, string>) {
    const cleanDomain = domainName.toLowerCase().trim();
    const refId = `ONH-NC-${Date.now()}-${cleanDomain.replace(/[^a-z0-9]/g, '')}`;
    if (!this.configured()) {
      return { success: false, refId, error: 'NAMECHEAP_API_KEY / NAMECHEAP_API_USER are not configured' };
    }
    const firstName = contact?.firstName || 'Account';
    const lastName = contact?.lastName || 'Owner';
    const address = contact?.address || 'Avenue Kennedy, Centre Ville';
    const city = contact?.city || 'Yaounde';
    const state = contact?.state || 'Centre';
    const zip = contact?.zip || '00237';
    const country = contact?.country || 'CM';
    const phone = contact?.phone || '+237.670000000';
    const email = contact?.email || this.config.email || 'support@oneallhost.com';
    const contacts = ['Registrant', 'Tech', 'Admin', 'AuxBilling'];
    const contactParams = contacts.map((c) =>
      `${c}FirstName=${encodeURIComponent(firstName)}&${c}LastName=${encodeURIComponent(lastName)}&${c}Address1=${encodeURIComponent(address)}&${c}City=${encodeURIComponent(city)}&${c}StateProvince=${encodeURIComponent(state)}&${c}PostalCode=${encodeURIComponent(zip)}&${c}Country=${encodeURIComponent(country)}&${c}Phone=${encodeURIComponent(phone)}&${c}EmailAddress=${encodeURIComponent(email)}`
    ).join('&');
    const url = `${this.config.baseUrl}?ApiUser=${encodeURIComponent(this.config.apiUser)}&ApiKey=${encodeURIComponent(this.config.apiKey)}&UserName=${encodeURIComponent(this.config.userName)}&ClientIp=${encodeURIComponent(this.config.clientIp)}&Command=namecheap.domains.create&DomainName=${encodeURIComponent(cleanDomain)}&Years=${years}&Nameservers=ns1.oneallhost.com,ns2.oneallhost.com&WGEnabled=yes&AddFreePositiveSSL=no&${contactParams}`;
    try {
      const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(15000) });
      const xmlText = await response.text();
      if (xmlText.includes('<Errors>') && !xmlText.includes('<Errors />')) {
        const errorMatch = /<Error\s+Number="([^"]+)">([^<]+)<\/Error>/i.exec(xmlText);
        return { success: false, refId, error: errorMatch ? `[Namecheap ${errorMatch[1]}] ${errorMatch[2]}` : 'Registrar rejected create' };
      }
      return {
        success: true,
        refId,
        domainId: /DomainID="([^"]+)"/i.exec(xmlText)?.[1],
        orderId: /OrderID="([^"]+)"/i.exec(xmlText)?.[1],
        transactionId: /TransactionID="([^"]+)"/i.exec(xmlText)?.[1],
        chargedAmount: /ChargedAmount="([^"]+)"/i.exec(xmlText)?.[1],
      };
    } catch (err: any) {
      return { success: false, refId, error: err.message || 'Registrar unreachable' };
    }
  }
}

export const namecheapService = new NamecheapService();
