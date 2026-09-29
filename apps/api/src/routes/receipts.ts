import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { requireAuth } from '../middleware/auth';

export const receiptsRouter = Router();
receiptsRouter.use(requireAuth);

receiptsRouter.get('/:reference', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const ref = String(req.params.reference);
  const payments = await db.paymentsRepo.list(user.isStaff ? undefined : user.id);
  const payment = payments.find((p) => p.reference === ref || p.id === ref);
  if (!payment) return res.status(404).json({ error: 'Receipt not found' });
  return res.json({
    success: true,
    receipt: {
      brand: 'Oneallhost',
      legal: 'Oneallhost Inc. — Yaoundé, Cameroon',
      email: 'billing@oneallhost.com',
      number: payment.reference,
      issuedAt: payment.timestamp,
      status: payment.status,
      payer: { name: payment.client, email: user.email, id: payment.userId },
      method: payment.method,
      item: payment.item,
      amountUsd: payment.amountUsd,
      amountXaf: payment.amountXaf,
    },
  });
});
