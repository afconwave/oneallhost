import { Router, Request, Response } from 'express';
import { swychrClient, SUPPORTED_AFRICAN_COUNTRIES } from '@oneallhost/payments';
import { db } from '@oneallhost/db';
import { sendTransactionEmail } from '../utils/mailer';
import { requireAuth, requireWebhookSecret } from '../middleware/auth';

export const paymentRouter = Router();

paymentRouter.get('/supported-countries', (req: Request, res: Response) => {
  return res.json({ success: true, data: Object.values(SUPPORTED_AFRICAN_COUNTRIES) });
});

paymentRouter.post('/payout-methods', async (req: Request, res: Response) => {
  try {
    const { country_code = 'CM' } = req.body;
    const methods = await swychrClient.getPayoutMethods(country_code);
    return res.json({ success: true, data: methods });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch payout methods' });
  }
});

paymentRouter.post('/user-info', requireAuth, async (req: Request, res: Response) => {
  try {
    const info = await swychrClient.getUserInfo();
    return res.json(info);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch user info' });
  }
});

paymentRouter.get('/nigeria-banks', async (req: Request, res: Response) => {
  try {
    const banks = await swychrClient.getNigeriaBanks();
    return res.json({ success: true, data: banks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch Nigerian banks' });
  }
});

paymentRouter.post('/create-direct-payment', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      country_code = 'CM',
      name,
      email,
      mobile,
      transaction_id,
      amount,
      payment_method,
      description,
      pass_digital_charge = true,
    } = req.body;

    if (!name || !mobile || !amount) {
      return res.status(400).json({ error: 'name, mobile, and amount are required' });
    }

    const txnId = transaction_id || `ONH-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const result = await swychrClient.createPaymentRequest({
      country_code,
      name,
      email,
      mobile,
      transaction_id: txnId,
      amount: Number(amount),
      payment_method,
      description: description || 'Oneallhost Order',
      pass_digital_charge,
      callback_url: 'https://oneallhost.com/api/v1/payments/webhook',
      failed_callback_url: 'https://oneallhost.com/api/v1/payments/webhook-failed',
    });

    const config = SUPPORTED_AFRICAN_COUNTRIES[country_code.toUpperCase()];
    const rate = config ? config.exchangeRate : 615.5;
    const computedUsd = Number((Number(amount) / rate).toFixed(2));
    const computedXaf = Math.round(computedUsd * 615.5);
    const resolvedUserId = (req as any).user.id;

    await db.paymentsRepo.create({
      userId: resolvedUserId,
      client: name,
      method: payment_method || 'MTN Mobile Money',
      amountUsd: computedUsd,
      amountXaf: computedXaf,
      status: 'pending',
      item: description || 'Domain Registration / Lease',
      reference: txnId,
    });

    return res.status(result.status || 200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Direct payment creation failed' });
  }
});

paymentRouter.post('/webhook', requireWebhookSecret, async (req: Request, res: Response) => {
  try {
    const transactionId = String(req.body.transaction_id || req.body.reference || '');
    const incomingStatus = String(req.body.status || 'settled').toLowerCase();
    if (!transactionId) {
      return res.status(400).json({ error: 'transaction_id is required' });
    }
    const payment = await db.paymentsRepo.findByReference(transactionId);
    if (!payment) {
      return res.status(404).json({ error: 'Unknown transaction' });
    }
    if (payment.status === 'settled' || payment.status === 'completed') {
      return res.json({ received: true, transaction_id: transactionId, status: payment.status, replay: true });
    }
    const success = ['success', 'successful', 'settled', 'completed', 'paid'].includes(incomingStatus);
    const nextStatus = success ? 'settled' : 'failed';
    await db.paymentsRepo.updateStatus(transactionId, nextStatus);
    if (success && payment.item.toLowerCase().includes('wallet top-up')) {
      await db.usersRepo.topupBalance(payment.userId, payment.amountUsd, payment.amountXaf);
    }
    return res.json({ received: true, transaction_id: transactionId, status: nextStatus });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Webhook processing failed' });
  }
});

const resolveUserId = (req: Request): string => (req as any).user?.id || '';

paymentRouter.use(requireAuth);

paymentRouter.get('/methods', async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const methods = userId ? await db.paymentMethodsRepo.list(userId) : [];
  return res.json({ success: true, methods });
});

paymentRouter.post('/methods', async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required to save payment method' });
  const { cardNumber, cardHolder = 'Card Holder', expiry = '12/28', brand, isDefault = false } = req.body;
  if (!cardNumber) return res.status(400).json({ error: 'Card number is required' });
  const cleanCard = String(cardNumber).replace(/\s+/g, '');
  const last4 = cleanCard.slice(-4) || '0000';
  let detectedBrand = brand;
  if (!detectedBrand) {
    if (cleanCard.startsWith('4')) detectedBrand = 'Visa';
    else if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) detectedBrand = 'Mastercard';
    else if (cleanCard.startsWith('3')) detectedBrand = 'Amex';
    else detectedBrand = 'Card';
  }
  const newMethod = await db.paymentMethodsRepo.create({
    userId,
    type: 'card',
    cardHolder: String(cardHolder).toUpperCase(),
    brand: detectedBrand,
    last4,
    expiry,
    isDefault: Boolean(isDefault),
  });
  return res.status(201).json({ success: true, method: newMethod });
});

paymentRouter.delete('/methods/:id', async (req: Request, res: Response) => {
  const success = await db.paymentMethodsRepo.delete(String(req.params.id), resolveUserId(req));
  if (!success) return res.status(404).json({ error: 'Payment method not found' });
  return res.json({ success: true, message: 'Payment method removed successfully' });
});

paymentRouter.put('/methods/:id/default', async (req: Request, res: Response) => {
  const updated = await db.paymentMethodsRepo.setDefault(String(req.params.id), resolveUserId(req));
  if (!updated) return res.status(404).json({ error: 'Payment method not found' });
  return res.json({ success: true, method: updated });
});
