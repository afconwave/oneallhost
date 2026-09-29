import { Router, Request, Response } from 'express';
import dns from 'dns';
import { namecheapService } from '../services/namecheap';
import { db } from '@oneallhost/db';

export const domainRouter = Router();

const dnsRecordsStore: Map<string, Array<{ id: string; type: string; host: string; value: string; ttl: number; priority?: number }>> = new Map();

async function ownedDomain(req: Request, domainId: string) {
  const user = (req as any).user;
  const list = await db.domainsRepo.list(user?.isStaff ? undefined : user?.id);
  return list.find((d) => d.id === domainId);
}

domainRouter.get('/dns/probe', async (_req: Request, res: Response) => {
  const host = process.env.NS1_HOSTNAME || 'ns1.oneallhost.com';
  const started = Date.now();
  try {
    const addresses = await dns.promises.resolve4(host);
    return res.json({
      nameserver: host,
      resolvedIp: addresses[0] || null,
      latencyMs: Date.now() - started,
      invented: false,
    });
  } catch (err: any) {
    return res.status(502).json({
      nameserver: host,
      error: err.message || 'NS lookup failed',
      invented: false,
    });
  }
});

domainRouter.get('/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) return res.status(400).json({ error: 'Query parameter q is required' });
  const results = await namecheapService.searchAvailability(query);
  return res.json({ query, results });
});

domainRouter.get('/whois', async (req: Request, res: Response) => {
  const rawDomain = (req.query.domain as string || '').toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
  if (!rawDomain) return res.status(400).json({ error: 'domain query parameter is required' });

  const dnsPromises = dns.promises;
  let nameservers: string[] = [];
  let aRecords: string[] = [];
  let aaaaRecords: string[] = [];
  let mxRecords: any[] = [];
  let txtRecords: string[][] = [];
  let soaRecord: any = null;

  const [nsRes, aRes, aaaaRes, mxRes, txtRes, soaRes] = await Promise.allSettled([
    dnsPromises.resolveNs(rawDomain),
    dnsPromises.resolve4(rawDomain),
    dnsPromises.resolve6(rawDomain),
    dnsPromises.resolveMx(rawDomain),
    dnsPromises.resolveTxt(rawDomain),
    dnsPromises.resolveSoa(rawDomain),
  ]);

  if (nsRes.status === 'fulfilled') nameservers = nsRes.value;
  if (aRes.status === 'fulfilled') aRecords = aRes.value;
  if (aaaaRes.status === 'fulfilled') aaaaRecords = aaaaRes.value;
  if (mxRes.status === 'fulfilled') mxRecords = mxRes.value;
  if (txtRes.status === 'fulfilled') txtRecords = txtRes.value;
  if (soaRes.status === 'fulfilled') soaRecord = soaRes.value;

  const isDnsRegistered = nameservers.length > 0 || aRecords.length > 0 || soaRecord !== null;
  let isRegistered = isDnsRegistered;
  let rdapRegistrar: string | null = null;
  let rdapCreationDate: string | null = null;
  let rdapExpiryDate: string | null = null;
  let rdapUpdatedDate: string | null = null;
  let rdapStatus: string[] = [];

  try {
    const rdapRes = await fetch(`https://rdap.org/domain/${rawDomain}`, {
      method: 'GET',
      headers: { Accept: 'application/rdap+json,application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (rdapRes.ok) {
      isRegistered = true;
      const rdapData: any = await rdapRes.json();
      if (Array.isArray(rdapData.status)) rdapStatus = rdapData.status;
      if (Array.isArray(rdapData.events)) {
        for (const ev of rdapData.events) {
          if (ev.eventAction === 'registration') rdapCreationDate = ev.eventDate?.split('T')[0];
          if (ev.eventAction === 'expiration') rdapExpiryDate = ev.eventDate?.split('T')[0];
          if (ev.eventAction === 'last changed' || ev.eventAction === 'last update') rdapUpdatedDate = ev.eventDate?.split('T')[0];
        }
      }
      if (Array.isArray(rdapData.entities)) {
        for (const ent of rdapData.entities) {
          if (ent.roles?.includes('registrar') && ent.vcardArray?.[1]) {
            for (const prop of ent.vcardArray[1]) {
              if (prop[0] === 'fn' && prop[3]) {
                rdapRegistrar = prop[3];
                break;
              }
            }
          }
        }
      }
      if (nameservers.length === 0 && Array.isArray(rdapData.nameservers)) {
        nameservers = rdapData.nameservers.map((n: any) => n.ldhName || n.handle).filter(Boolean);
      }
    } else if (rdapRes.status === 404 && !isDnsRegistered) {
      isRegistered = false;
    }
  } catch {
    /* DNS-only fallback */
  }

  return res.json({
    success: true,
    domain: rawDomain,
    isRegistered,
    status: isRegistered ? (rdapStatus.join(', ') || 'registered') : 'available',
    registrar: isRegistered ? (rdapRegistrar || null) : null,
    nameservers,
    ipAddresses: aRecords,
    dns: { a: aRecords, aaaa: aaaaRecords, ns: nameservers, mx: mxRecords, txt: txtRecords, soa: soaRecord },
    whois: {
      creationDate: rdapCreationDate,
      expiryDate: rdapExpiryDate,
      updatedDate: rdapUpdatedDate,
    },
  });
});

domainRouter.get('/:id/dns', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  return res.json({ success: true, domainId: domain.id, records: dnsRecordsStore.get(domain.id) || [] });
});

domainRouter.post('/:id/dns', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  const { type, host, value, ttl = 3600, priority } = req.body || {};
  if (!type || !host || !value) return res.status(400).json({ error: 'type, host, and value are required' });
  const record = { id: `rec-${Date.now()}`, type, host, value, ttl: Number(ttl), priority: priority ? Number(priority) : undefined };
  const existing = dnsRecordsStore.get(domain.id) || [];
  existing.push(record);
  dnsRecordsStore.set(domain.id, existing);
  await db.auditLogsRepo.log('DNS_RECORD_ADDED', (req as any).user.email, `${domain.name} ${type} ${host}`);
  return res.status(201).json({
    success: true,
    record,
    note: 'Stored locally. Live zone publish needs nameserver API credentials.',
  });
});

domainRouter.delete('/:id/dns/:recId', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  const existing = dnsRecordsStore.get(domain.id) || [];
  dnsRecordsStore.set(domain.id, existing.filter((r) => r.id !== String(req.params.recId)));
  return res.json({ success: true });
});

domainRouter.put('/:id/whois', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  const updated = await db.domainsRepo.update(domain.id, { whoisPrivacy: Boolean(req.body?.enabled) });
  return res.json({ success: true, domain: updated });
});

domainRouter.put('/:id/lock', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  const updated = await db.domainsRepo.update(domain.id, { transferLock: Boolean(req.body?.enabled) });
  return res.json({ success: true, domain: updated });
});

domainRouter.post('/:id/epp', async (req: Request, res: Response) => {
  const domain = await ownedDomain(req, String(req.params.id));
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  return res.status(501).json({
    error: 'namecheap.domains.getContacts / EPP retrieve is not wired. No auth code was generated.',
    domainId: domain.id,
  });
});
