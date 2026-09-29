import { Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { requireSettledPayment } from '../lib/settled-payment';
import { namecheapService } from '../services/namecheap';

export async function registerDomainPaid(req: Request, res: Response) {
  const user = (req as any).user;
  const { domainName, years = 1, paymentReference, contact } = req.body || {};
  if (!domainName) return res.status(400).json({ error: 'domainName is required' });
  const pay = await requireSettledPayment(user.id, paymentReference);
  if (!pay.ok) return res.status(402).json({ error: pay.error });
  const result = await namecheapService.register(String(domainName), Number(years) || 1, contact);
  if (!result.success) {
    return res.status(502).json({ error: result.error || 'Registrar rejected the create', result });
  }
  const expiryDate = new Date(Date.now() + Number(years) * 365 * 86400000).toISOString().split('T')[0];
  const domain = await db.domainsRepo.create({
    userId: user.id,
    name: String(domainName).toLowerCase(),
    registrar: 'Oneallhost / Namecheap',
    expiresAt: expiryDate,
    status: 'active',
    whoisPrivacy: true,
    transferLock: true,
    autoRenew: true,
    nameservers: ['ns1.oneallhost.com', 'ns2.oneallhost.com'],
  });
  await db.auditLogsRepo.log('DOMAIN_REGISTERED', user.email, domain.name, { paymentReference });
  return res.status(201).json({ success: true, domain, result });
}

export async function renewDomainPaid(req: Request, res: Response) {
  const user = (req as any).user;
  const { domainName, years = 1, paymentReference } = req.body || {};
  if (!domainName) return res.status(400).json({ error: 'domainName is required' });
  const pay = await requireSettledPayment(user.id, paymentReference);
  if (!pay.ok) return res.status(402).json({ error: pay.error });
  const owned = (await db.domainsRepo.list(user.id)).find((d) => d.name === String(domainName).toLowerCase());
  if (!owned && !user.isStaff) return res.status(404).json({ error: 'Domain not in this account' });
  return res.status(501).json({
    error: 'namecheap.domains.renew is not wired. Payment accepted as credit only until that command is implemented.',
    domainName,
    years,
    paymentReference,
  });
}

export async function transferDomainPaid(req: Request, res: Response) {
  const user = (req as any).user;
  const { domainName, authCode, paymentReference } = req.body || {};
  if (!domainName || !authCode) return res.status(400).json({ error: 'domainName and authCode are required' });
  const pay = await requireSettledPayment(user.id, paymentReference);
  if (!pay.ok) return res.status(402).json({ error: pay.error });
  return res.status(501).json({
    error: 'namecheap.domains.transfer is not wired. Do not treat this as an initiated transfer.',
    domainName,
    paymentReference,
  });
}
