import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const adminRouter = Router();

// 1. Dynamic Computed KPI Stats & Overview
adminRouter.get('/stats', async (req: Request, res: Response) => {
  const stats = await db.computeStats();
  return res.json({
    success: true,
    data: stats,
  });
});

// 2. Clients & KYC Management
adminRouter.get('/clients', async (req: Request, res: Response) => {
  const clients = await db.usersRepo.list();
  const allDomains = await db.domainsRepo.list();
  const allRentals = await db.rentalsRepo.list();

  const enhancedClients = clients.map((c: any) => ({
    ...c,
    domainsCount: allDomains.filter((d) => d.userId === c.id).length,
    rentalsCount: allRentals.filter((r) => r.userId === c.id).length,
  }));
  return res.json({
    success: true,
    clients: enhancedClients,
  });
});

// 3. Domain Registry Overview
adminRouter.get('/domains', async (req: Request, res: Response) => {
  const domains = await db.domainsRepo.list();
  return res.json({
    success: true,
    domains,
  });
});

// 4. Suspend / Flag Domain for Abuse
adminRouter.post('/domains/:id/suspend', async (req: Request, res: Response) => {
  const { reason = 'Terms of Service violation' } = req.body;
  const updated = await db.domainsRepo.update(String(req.params.id), { status: 'suspended' });
  await db.auditLogsRepo.log('DOMAIN_SUSPENDED_BY_ADMIN', 'admin@oneallhost.com', String(req.params.id), { reason });

  return res.json({
    success: true,
    domain: updated,
    message: `Domain ${req.params.id} has been suspended`,
    reason,
    timestamp: new Date().toISOString(),
  });
});

// 5. Subdomain Rentals Management & Conversion Rebate Audits
adminRouter.get('/rentals', async (req: Request, res: Response) => {
  const rentals = await db.rentalsRepo.list();
  return res.json({
    success: true,
    rentals,
  });
});

// 6. Payment Ledger & Settlements (Dynamic Computed Records)
adminRouter.get('/payments', async (req: Request, res: Response) => {
  const payments = await db.paymentsRepo.list();
  return res.json({
    success: true,
    payments,
  });
});

// 7. Dynamic Immutable Audit Logs (Spec §8g)
adminRouter.get('/audit-logs', async (req: Request, res: Response) => {
  const logs = await db.auditLogsRepo.list();
  return res.json({
    success: true,
    logs,
  });
});

// 8. System Announcements
adminRouter.post('/announcements', async (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'Title and message are required' });
  }
  const record = await db.announcementsRepo.setActive(title, message, type || 'info');
  return res.json({ success: true, announcement: record });
});

adminRouter.delete('/announcements/active', async (req: Request, res: Response) => {
  await db.announcementsRepo.clearActive();
  return res.json({ success: true });
});

// 9. Pricing & Margins
adminRouter.get('/pricing', async (req: Request, res: Response) => {
  const pricing = await db.pricingRepo.get();
  return res.json({ success: true, pricing });
});

adminRouter.put('/pricing', async (req: Request, res: Response) => {
  const updated = await db.pricingRepo.update(req.body);
  return res.json({ success: true, pricing: updated });
});
