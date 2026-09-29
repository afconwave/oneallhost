import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { requireAuth, requireStaff } from '../middleware/auth';
import { CATALOG, recommendPlans } from '../catalog/plans';
import { whmClient } from '../services/whm';

export const hostingRouter = Router();

hostingRouter.get('/catalog', (req: Request, res: Response) => {
  const context = String(req.query.context || 'checkout');
  const owned = String(req.query.owned || '').split(',').filter(Boolean);
  return res.json({
    success: true,
    source: 'oneallhost-catalog',
    note: 'Plans are catalog-driven. Live cPanel create needs WHM env. Namecheap XML is domains-only.',
    all: CATALOG,
    suggested: recommendPlans(context, owned),
    whmReady: whmClient.configured(),
  });
});

hostingRouter.post('/waitlist', async (req: Request, res: Response) => {
  try {
    const { email, tier = 'professional' } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const result = await db.waitlistRepo.join(email, tier, ip);
    return res.status(201).json({
      success: true,
      message: `Enrolled for ${tier.toUpperCase()} Cloud Tier`,
      queueNumber: result.queueNumber,
      email,
      tier,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to join waitlist' });
  }
});

hostingRouter.get('/waitlist', requireStaff, async (_req: Request, res: Response) => {
  const list = await db.waitlistRepo.list();
  return res.json({ success: true, total: list.length, waitlist: list });
});

hostingRouter.post('/provision', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { domain, planId, paymentReference } = req.body || {};
  const plan = CATALOG.find((p) => p.id === planId);
  if (!domain || !plan) {
    return res.status(400).json({ error: 'domain and a valid planId are required' });
  }
  if (!paymentReference) {
    return res.status(402).json({ error: 'Settled paymentReference is required before WHM createacct' });
  }
  const payments = await db.paymentsRepo.list(user.id);
  const paid = payments.find((p) => p.reference === paymentReference && (p.status === 'settled' || p.status === 'completed'));
  if (!paid) {
    return res.status(402).json({ error: 'No settled payment for this provision' });
  }
  const username = String(domain).replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase() || 'site';
  const result = await whmClient.createAccount({
    domain: String(domain).toLowerCase(),
    username,
    password: `OnH${Math.random().toString(36).slice(2, 10)}!1A`,
    contactEmail: user.email,
    package: plan.whmPackage || 'onh_starter',
  });
  await db.auditLogsRepo.log('HOSTING_PROVISION', user.email, `${plan.id} for ${domain}: ${result.message}`);
  return res.status(result.success ? 201 : 202).json({ success: result.success, queued: !result.success, plan, result });
});
