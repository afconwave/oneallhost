import { Request, Response } from 'express';
import { namecheapService } from '../services/namecheap';
import { db } from '@oneallhost/db';
import { requireSettledPayment } from '../lib/settled-payment';

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
  const newDomain = await db.domainsRepo.create({
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
  await db.auditLogsRepo.log('DOMAIN_REGISTERED', user.email, newDomain.name, { paymentReference, orderId: result.orderId });
  return res.status(201).json({ success: true, domain: newDomain, result });
}
