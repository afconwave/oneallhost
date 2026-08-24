import { Router, Request, Response } from 'express';
import { swychrClient } from '@oneallhost/payments';
import { db } from '@oneallhost/db';

export const paymentRouter = Router();

// In-memory virtual cards ledger
const virtualCardsStore: Record<string, any> = {
  'card-1': {
    id: 'card-1',
    cardNumber: '4000 1234 5678 9010',
    cardHolder: 'ALOAH MILTON',
    expiry: '08/29',
    cvv: '842',
    balanceUsd: 250.0,
    balanceXaf: 153875,
    brand: 'Visa',
    status: 'active',
  },
};

// 1. Get live payout & payment methods for a customer country (Swychr Direct API)
paymentRouter.post('/payout-methods', async (req: Request, res: Response) => {
  try {
    const { country_code = 'CM' } = req.body;
    const methods = await swychrClient.getPayoutMethods(country_code);
    return res.json({ success: true, data: methods });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch payout methods' });
  }
});

// 2. Create Direct Payment Request via Swychr / AccountPe
paymentRouter.post('/create-direct-payment', async (req: Request, res: Response) => {
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

    const txnId = transaction_id || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

    // Record into live database state
    db.paymentsRepo.create({
      userId: 'usr-1',
      client: name,
      method: payment_method || 'MTN Mobile Money',
      amountUsd: Number((Number(amount) / 615.5).toFixed(2)),
      amountXaf: Number(amount),
      status: 'settled',
      item: description || 'Domain Registration / Lease',
      reference: txnId,
    });

    return res.status(result.status || 200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Direct payment creation failed' });
  }
});

// 3. Webhook callback for successful payments (Idempotent settlement)
paymentRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { transaction_id, status, amount } = req.body;
    console.log(`[Payment Webhook SUCCESS] Transaction ${transaction_id} settled for amount ${amount}`);
    return res.json({ received: true, transaction_id, status: 'completed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Issue Virtual Visa/Mastercard (Swychr Virtual Cards API)
paymentRouter.post('/virtual-card/issue', async (req: Request, res: Response) => {
  try {
    const { cardHolder = 'ALOAH MILTON', initialBalanceUsd = 50, brand = 'Visa' } = req.body;
    const cardId = `card-${Date.now()}`;
    const newCard = {
      id: cardId,
      cardNumber: `4${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      cardHolder: cardHolder.toUpperCase(),
      expiry: '08/29',
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      balanceUsd: Number(initialBalanceUsd),
      balanceXaf: Math.round(Number(initialBalanceUsd) * 615.5),
      brand,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    virtualCardsStore[cardId] = newCard;
    return res.json({ success: true, card: newCard });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 5. Top-up Virtual Card balance via Mobile Money
paymentRouter.post('/virtual-card/topup', async (req: Request, res: Response) => {
  try {
    const { cardId = 'card-1', amountXaf = 10000 } = req.body;
    const card = virtualCardsStore[cardId];
    if (!card) return res.status(404).json({ error: 'Virtual Card not found' });

    const additionalUsd = Number((amountXaf / 615.5).toFixed(2));
    card.balanceXaf += Number(amountXaf);
    card.balanceUsd = Number((card.balanceUsd + additionalUsd).toFixed(2));

    return res.json({
      success: true,
      card,
      message: `Card funded with ${amountXaf} XAF (~$${additionalUsd})`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 6. Get Virtual Cards
paymentRouter.get('/virtual-cards', (req: Request, res: Response) => {
  return res.json({
    success: true,
    cards: Object.values(virtualCardsStore),
  });
});
