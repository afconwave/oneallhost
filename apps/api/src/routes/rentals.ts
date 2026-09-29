import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { requireAuth } from '../middleware/auth';

export const rentalRouter = Router();

const BASE_ZONE = process.env.RENTAL_BASE_ZONE || 'oah.link';

function quotePrice(days: number, weeklyBase = 7.99) {
  const d = Math.max(1, Number(days) || 7);
  if (d <= 1) return 1.99;
  if (d <= 3) return 3.99;
  if (d <= 7) return weeklyBase;
  if (d <= 30) return Number((weeklyBase * (d / 7)).toFixed(2));
  return Number((d * (weeklyBase / 7)).toFixed(2));
}

function normalizeLabel(raw: string) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

rentalRouter.get('/quote', async (req: Request, res: Response) => {
  const days = Number(req.query.days || 7);
  const pricing = await db.pricingRepo.get();
  const weekly = Number(pricing?.rental_base || 7.99);
  const priceUsd = quotePrice(days, weekly);
  return res.json({
    success: true,
    days,
    priceUsd,
    rebateCreditUsd: priceUsd,
    zone: BASE_ZONE,
  });
});

rentalRouter.use(requireAuth);

rentalRouter.get('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const list = await db.rentalsRepo.list(user.isStaff ? undefined : user.id);
  return res.json({ success: true, data: list, rentals: list, total: list.length });
});

rentalRouter.post('/create', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    subdomain,
    baseDomain = BASE_ZONE,
    clientName,
    durationValue = 7,
    durationType = 'day',
    targetUrl,
    paymentReference,
  } = req.body || {};

  const label = normalizeLabel(subdomain);
  if (!label) return res.status(400).json({ error: 'Subdomain name is required' });
  if (!paymentReference) {
    return res.status(402).json({ error: 'Settled paymentReference is required before the lease goes live' });
  }

  const payments = await db.paymentsRepo.list(user.id);
  const paid = payments.find(
    (p) => p.reference === paymentReference && (p.status === 'settled' || p.status === 'completed')
  );
  if (!paid) return res.status(402).json({ error: 'No settled payment found for this rental' });

  const fullDomain = `${label}.${String(baseDomain).replace(/^\.+/, '')}`;
  const existing = await db.rentalsRepo.list();
  const taken = existing.find(
    (r) => r.subdomain.toLowerCase() === fullDomain && r.status === 'active' && new Date(r.expiresAt) > new Date()
  );
  if (taken) return res.status(409).json({ error: `${fullDomain} is already leased` });

  const pricing = await db.pricingRepo.get();
  const priceUsd = quotePrice(Number(durationValue), Number(pricing?.rental_base || 7.99));
  const end = new Date();
  end.setDate(end.getDate() + Number(durationValue));

  const rental = await db.rentalsRepo.create({
    userId: user.id,
    subdomain: fullDomain,
    targetDomain: fullDomain,
    clientName: clientName || user.name || 'Client',
    durationHours: Number(durationValue) * 24,
    durationType,
    durationValue: Number(durationValue),
    priceUsd,
    rebateCreditUsd: priceUsd,
    status: 'active',
    targetUrl: targetUrl || `https://${fullDomain}`,
    expiresAt: end.toISOString(),
  });

  await db.auditLogsRepo.log('RENTAL_CREATED', user.email, fullDomain, { paymentReference, priceUsd });
  return res.status(201).json({
    success: true,
    rental,
    dns: {
      type: 'CNAME',
      host: label,
      zone: baseDomain,
      value: targetUrl || 'cname.oneallhost.com',
      note: 'Point this CNAME on the parent zone. Live DNS write needs nameserver API credentials.',
    },
  });
});

rentalRouter.get('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const list = await db.rentalsRepo.list(user.isStaff ? undefined : user.id);
  const rental = list.find((r) => r.id === String(req.params.id));
  if (!rental) return res.status(404).json({ error: 'Rental not found' });
  return res.json({ success: true, rental });
});

rentalRouter.post('/convert-to-purchase', async (req: Request, res: Response) => {
  const { rentalId, targetDomain, domainPriceUsd } = req.body || {};
  if (!rentalId || !targetDomain || domainPriceUsd == null) {
    return res.status(400).json({ error: 'rentalId, targetDomain, and domainPriceUsd are required' });
  }
  const user = (req as any).user;
  const existing = (await db.rentalsRepo.list(user.isStaff ? undefined : user.id)).find((r) => r.id === rentalId);
  if (!existing) return res.status(404).json({ error: 'Rental not found' });
  if (existing.status !== 'active') return res.status(400).json({ error: 'Only an active lease can convert' });

  const converted = await db.rentalsRepo.convert(rentalId);
  if (!converted) return res.status(404).json({ error: 'Conversion failed' });

  const rebateCreditUsd = Number(converted.rebateCreditUsd || 0);
  const netDueUsd = Math.max(0, Number((Number(domainPriceUsd) - rebateCreditUsd).toFixed(2)));
  await db.auditLogsRepo.log('RENTAL_CONVERTED', user.email, targetDomain, { rentalId, rebateCreditUsd, netDueUsd });
  return res.json({
    success: true,
    rentalId,
    targetDomain,
    domainPriceUsd: Number(domainPriceUsd),
    rebateCreditUsd,
    netDueUsd,
    netDueXaf: Math.round(netDueUsd * 615.5),
    next: 'Pay netDue then POST /domains/register with the settled paymentReference',
  });
});
