import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const adminRouter = Router();

// 1. Dynamic Computed KPI Stats & Overview
adminRouter.get('/stats', (req: Request, res: Response) => {
  const stats = db.computeStats();
  return res.json({
    success: true,
    data: stats,
  });
});

// 2. Clients & KYC Management
adminRouter.get('/clients', (req: Request, res: Response) => {
  const clients = db.usersRepo.list();
  const enhancedClients = clients.map((c: any) => ({
    ...c,
    domainsCount: db.domainsRepo.list(c.id).length,
    rentalsCount: db.rentalsRepo.list(c.id).length,
  }));
  return res.json({
    success: true,
    clients: enhancedClients,
  });
});

// 3. Domain Registry Overview
adminRouter.get('/domains', (req: Request, res: Response) => {
  const domains = db.domainsRepo.list();
  return res.json({
    success: true,
    domains,
  });
});

// 4. Suspend / Flag Domain for Abuse
adminRouter.post('/domains/:id/suspend', (req: Request, res: Response) => {
  const { reason = 'Terms of Service violation' } = req.body;
  const updated = db.domainsRepo.update(String(req.params.id), { status: 'suspended' });
  db.auditLogsRepo.log('DOMAIN_SUSPENDED_BY_ADMIN', 'admin@oneallhost.com', String(req.params.id), { reason });

  return res.json({
    success: true,
    domain: updated,
    message: `Domain ${req.params.id} has been suspended`,
    reason,
    timestamp: new Date().toISOString(),
  });
});

// 5. Subdomain Rentals Management & Conversion Rebate Audits
adminRouter.get('/rentals', (req: Request, res: Response) => {
  const rentals = db.rentalsRepo.list();
  return res.json({
    success: true,
    rentals,
  });
});

// 6. Payment Ledger & Settlements (Dynamic Computed Records)
adminRouter.get('/payments', (req: Request, res: Response) => {
  const payments = db.paymentsRepo.list();
  return res.json({
    success: true,
    payments,
  });
});

// 7. Dynamic Immutable Audit Logs (Spec §8g)
adminRouter.get('/audit-logs', (req: Request, res: Response) => {
  const logs = db.auditLogsRepo.list();
  return res.json({
    success: true,
    logs,
  });
});
