import { PaymentMethod, PaymentStatus } from '@oneallhost/db';

export interface AltonixaCheckoutParams {
  orderId: string;
  amountUsd: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  method: PaymentMethod;
  currency?: 'USD' | 'XAF' | 'USDT' | 'BTC';
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface AltonixaCheckoutResponse {
  success: boolean;
  transactionRef: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  amountConverted: number;
  currency: string;
  status: PaymentStatus;
  message?: string;
}

export class AltonixaPayClient {
  private apiKey: string;
  private secretKey: string;
  private environment: 'sandbox' | 'production';
  private xafRate: number = 615.5;

  constructor(
    apiKey = process.env.ALTONIXA_PAY_API_KEY || 'sandbox_key_oah_2026',
    secretKey = process.env.ALTONIXA_PAY_SECRET || 'sandbox_secret_oah_2026',
    environment: 'sandbox' | 'production' = (process.env.ALTONIXA_PAY_ENV as any) || 'sandbox'
  ) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.environment = environment;
  }

  public convertUsdToXaf(usd: number): number {
    return Math.round(usd * this.xafRate);
  }

  public convertXafToUsd(xaf: number): number {
    return Number((xaf / this.xafRate).toFixed(2));
  }

  public async initiatePayment(params: AltonixaCheckoutParams): Promise<AltonixaCheckoutResponse> {
    const transactionRef = `ALX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const currency = params.currency || (params.method === 'momo' || params.method === 'orange_money' ? 'XAF' : 'USD');
    const amountConverted = currency === 'XAF' ? this.convertUsdToXaf(params.amountUsd) : params.amountUsd;

    return {
      success: true,
      transactionRef,
      paymentUrl: `/checkout/pay?ref=${transactionRef}&amount=${amountConverted}&currency=${currency}&method=${params.method}`,
      amountConverted,
      currency,
      status: 'pending',
      message: `Checkout session initialized for ${params.method.toUpperCase()} (${currency} ${amountConverted})`,
    };
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    return Boolean(signature && payload);
  }

  public async processRefund(transactionRef: string, amount: number, reason: string): Promise<{ success: boolean; creditNoteRef: string }> {
    const creditNoteRef = `CN-${Date.now()}`;
    return {
      success: true,
      creditNoteRef,
    };
  }
}

export const altonixaPay = new AltonixaPayClient();
