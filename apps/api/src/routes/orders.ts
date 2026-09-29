import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireSettledPayment } from '../lib/settled-payment';
import { namecheapService } from '../services/namecheap';
import { db } from '@oneallhost/db';
import { CATALOG } from '../catalog/plans';
import { whmClient } from '../services/whm';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

ordersRouter.post('/fulfill', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { paymentReference, items = [] } = req.body || {};
  const pay = await requireSettledPayment(user.id, paymentReference);
  if (!pay.ok) return res.status(402).json({ error: pay.error });

  const results: any[] = [];
  for (const item of items) {
    const kind = String(item.kind || item.type || '');
    if (kind === 'domain' && item.domainName) {
      const nc = await namecheapService.register(item.domainName, Number(item.years) || 1);
      if (nc.success) {
        const domain = await db.domainsRepo.create({
          userId: user.id,
          name: String(item.domainName).toLowerCase(),
          registrar: 'Oneallhost / Namecheap',
          expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          status: 'active',
          whoisPrivacy: true,
          transferLock: true,
          autoRenew: true,
          nameservers: ['ns1.oneallhost.com', 'ns2.oneallhost.com'],
        });
        results.push({ kind, ok: true, domain, registrar: nc });
      } else {
        results.push({ kind, ok: false, error: nc.error });
      }
    } else if (kind === 'hosting' && item.planId && item.domain) {
      const plan = CATALOG.find((p) => p.id === item.planId);
      if (!plan) {
        results.push({ kind, ok: false, error: 'Unknown plan' });
        continue;
      }
      const username = String(item.domain).replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase() || 'site';
      const whm = await whmClient.createAccount({
        domain: String(item.domain).toLowerCase(),
        username,
        password: `OnH${Math.random().toString(36).slice(2, 10)}!1A`,
        contactEmail: user.email,
        package: plan.whmPackage || 'onh_starter',
      });
      results.push({ kind, ok: whm.success, queued: !whm.success, plan: plan.id, message: whm.message });
    } else if (kind === 'rental' && item.subdomain) {
      results.push({ kind, ok: false, error: 'Use POST /rentals/create with the same paymentReference' });
    } else {
      results.push({ kind: kind || 'unknown', ok: false, error: 'Unsupported cart item' });
    }
  }

  await db.auditLogsRepo.log('ORDER_FULFILL', user.email, paymentReference, { count: results.length });
  return res.json({ success: results.every((r) => r.ok), paymentReference, results });
});
