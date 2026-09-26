import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const rentalRouter = Router();

// 0. List all available / active subdomain leases
rentalRouter.get('/', async (req: Request, res: Response) => {
  try {
    const list = await db.rentalsRepo.list();
    return res.json({
      success: true,
      data: list,
      rentals: list,
      total: list.length,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve rentals' });
  }
});

// 1. Create short-term subdomain lease (24h/72h/7d/30d) (§4 / §8b)
rentalRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const { subdomain, baseDomain = 'oah.link', renterId, clientName, durationType = 'day', durationValue = 7, targetUrl } = req.body;
    const resolvedRenterId = renterId || (req.headers['x-user-id'] as string);
    
    if (!subdomain) {
      return res.status(400).json({ error: 'Subdomain name is required' });
    }
    if (!resolvedRenterId) {
      return res.status(400).json({ error: 'User ID is required to create a lease' });
    }

    const fullDomain = `${subdomain}.${baseDomain}`;
    const startTime = new Date();
    const endTime = new Date(startTime);
    
    let priceUsd = 7.99;
    if (durationValue === 1) priceUsd = 1.99;
    else if (durationValue === 3) priceUsd = 3.99;
    else if (durationValue === 7) priceUsd = 7.99;
    else if (durationValue === 30) priceUsd = 24.99;
    else priceUsd = Number((durationValue * 1.15).toFixed(2));

    endTime.setDate(endTime.getDate() + Number(durationValue));

    const newRental = await db.rentalsRepo.create({
      userId: resolvedRenterId,
      subdomain: fullDomain,
      targetDomain: fullDomain,
      clientName: clientName || 'Client',
      durationHours: Number(durationValue) * 24,
      durationType,
      durationValue: Number(durationValue),
      priceUsd,
      rebateCreditUsd: priceUsd,
      status: 'active',
      targetUrl: targetUrl || `https://${fullDomain}`,
      expiresAt: endTime.toISOString(),
    });

    return res.status(201).json({
      success: true,
      rental: newRental,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Rental creation failed' });
  }
});

// 2. Fetch specific rental status & live time remaining
rentalRouter.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const list = await db.rentalsRepo.list();
  const rental = list.find((r) => r.id === id);
  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }
  return res.json({ success: true, rental });
});

// 3. Convert rental to full domain purchase with 100% rebate (§4 / §8b)
rentalRouter.post('/convert-to-purchase', async (req: Request, res: Response) => {
  try {
    const { rentalId, targetDomain, domainPriceUsd } = req.body;
    if (!rentalId || !targetDomain || !domainPriceUsd) {
      return res.status(400).json({ error: 'rentalId, targetDomain, and domainPriceUsd are required' });
    }

    const converted = await db.rentalsRepo.convert(rentalId);
    if (!converted) {
      return res.status(404).json({ error: 'Active rental record not found for conversion' });
    }
    
    const rebateCreditUsd = Number(converted.rebateCreditUsd || 0);
    const netDueUsd = Math.max(0, Number((Number(domainPriceUsd) - rebateCreditUsd).toFixed(2)));
    const netDueXaf = Math.round(netDueUsd * 615.5);

    return res.json({
      success: true,
      rentalId,
      targetDomain,
      domainPriceUsd: Number(domainPriceUsd),
      rebateCreditUsd,
      netDueUsd,
      netDueXaf,
      message: `100% rebate of $${rebateCreditUsd.toFixed(2)} applied. Amount due for permanent ownership: $${netDueUsd.toFixed(2)}`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Conversion calculation failed' });
  }
});
