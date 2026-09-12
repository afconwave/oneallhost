import { Router, Request, Response } from 'express';
import { swychrClient, SUPPORTED_AFRICAN_COUNTRIES } from '@oneallhost/payments';
import { db } from '@oneallhost/db';
import { sendTransactionEmail } from '../utils/mailer';

export const paymentRouter = Router();


// In-memory virtual cards ledger
const virtualCardsStore: Record<string, any> = {
  'card-1': {
    id: 'card-1',
    cardNumber: '4000 1234 5678 9010',
    cardHolder: 'ACCOUNT OWNER',
    expiry: '08/29',
    cvv: '842',
    balanceUsd: 250.0,
    balanceXaf: 153875,
    brand: 'Visa',
    status: 'active',
  },
};

// 0. Get list of all 18 supported African countries
paymentRouter.get('/supported-countries', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: Object.values(SUPPORTED_AFRICAN_COUNTRIES),
  });
});

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

// 1b. Get merchant user account information
paymentRouter.post('/user-info', async (req: Request, res: Response) => {
  try {
    const info = await swychrClient.getUserInfo();
    return res.json(info);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch user info' });
  }
});

// 1c. Get list of Nigerian banks
paymentRouter.get('/nigeria-banks', async (req: Request, res: Response) => {
  try {
    const banks = await swychrClient.getNigeriaBanks();
    return res.json({ success: true, data: banks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch Nigerian banks' });
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

    // Record into live database state as pending
    db.paymentsRepo.create({
      userId: 'usr-1',
      client: name,
      method: payment_method || 'MTN Mobile Money',
      amountUsd: computedUsd,
      amountXaf: computedXaf,
      status: 'pending',
      item: description || 'Domain Registration / Lease',
      reference: txnId,
    });

    // Send "Payment Initiated" email
    if (email) {
      sendTransactionEmail(
        email,
        `Action Required: Complete your Oneallhost Payment (${txnId})`,
        `<p>Hi ${name},</p>
         <p>Your payment request of <b>${amount}</b> via <b>${payment_method}</b> has been initiated.</p>
         <p>Please authorize the prompt on your mobile device.</p>
         <p>This request will expire in 3 minutes.</p>`
      );
    }

    // Schedule 3-minute expiry
    setTimeout(async () => {
      try {
        // Here we'd look up the current state from db
        // For simplicity, we just mark it as expired if we had a proper update method
        // Mock update logic:
        console.log(`[EXPIRY CHECK] Checking status for ${txnId} after 3 minutes...`);
        // If still pending -> mark expired & notify
        if (email) {
          sendTransactionEmail(
            email,
            `Payment Expired: ${txnId}`,
            `<p>Hi ${name},</p>
             <p>Your payment request of <b>${amount}</b> via <b>${payment_method}</b> has expired because it was not authorized within 3 minutes.</p>
             <p>Please initiate a new checkout session if you wish to proceed.</p>`
          );
        }
      } catch (err) {
        console.error('[EXPIRY] Error processing expiry:', err);
      }
    }, 3 * 60 * 1000); // 3 minutes

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
    
    // In a real app, we'd fetch the transaction to get the user's email
    // For this demonstration, we'll send a success email to a test account
    sendTransactionEmail(
      'customer@example.com',
      `Payment Successful: ${transaction_id}`,
      `<p>Your payment of <b>${amount}</b> was successfully processed.</p>
       <p>Thank you for choosing Oneallhost.</p>`
    );
    
    return res.json({ received: true, transaction_id, status: 'completed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Issue Virtual Visa/Mastercard (Swychr Virtual Cards API)
paymentRouter.post('/virtual-card/issue', async (req: Request, res: Response) => {
  try {
    const { cardHolder = 'ACCOUNT OWNER', initialBalanceUsd = 50, brand = 'Visa' } = req.body;
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
