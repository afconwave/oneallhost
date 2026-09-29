export interface SwychrPayoutMethod {
  payment_method: string;
  mobile_format: string;
  applicable_mobileno_length: string;
}

export interface SwychrCountryPayoutResponse {
  country: string;
  country_code: string;
  currency_name: string;
  currency_code: string;
  payment_methods: SwychrPayoutMethod[];
}

export interface CreatePaymentRequestParams {
  country_code: string;
  name: string;
  email?: string;
  mobile?: string;
  transaction_id: string;
  amount: number;
  payment_method?: string;
  description?: string;
  pass_digital_charge?: boolean;
  reason?: string;
  callback_url?: string;
  failed_callback_url?: string;
  source?: string;
  bank_code?: string;
  account_number?: string;
}

export interface CreatePaymentResponse {
  status: number;
  message: string;
  data?: {
    id?: number;
    transaction_id: string;
    name: string;
    email?: string;
    mobile?: string;
    amount: string;
    status: number;
    description?: string;
    created_at?: string;
  };
}

export interface AfricanCountryConfig {
  name: string;
  code: string;
  currencyName: string;
  currencyCode: string;
  exchangeRate: number;
  mobileCode: string;
  defaultMethods: SwychrPayoutMethod[];
}

export { SUPPORTED_AFRICAN_COUNTRIES } from './african-countries';

export class SwychrDirectApiClient {
  private baseUrl: string;
  private apiKey: string;
  private xafRate: number = 615.5;

  constructor(
    apiKey: string = process.env.SWYCHR_API_KEY || '',
    baseUrl: string = process.env.SWYCHR_BASE_URL || 'https://api.accountpe.com'
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    if (!this.apiKey) {
      console.warn('[Swychr API] SWYCHR_API_KEY is not set. Payment requests will fail until configured.');
    }
  }

  public convertUsdToXaf(usd: number): number {
    return Math.round(usd * this.xafRate);
  }

  public convertXafToUsd(xaf: number): number {
    return Number((xaf / this.xafRate).toFixed(2));
  }

  public async getPayoutMethods(countryCode: string = 'CM'): Promise<SwychrCountryPayoutResponse | null> {
    const code = countryCode.toUpperCase();
    try {
      const response = await fetch(`${this.baseUrl}/api/swychpay/payout_methods`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.warn(`[Swychr API] payout_methods returned status ${response.status}`);
        return this.getFallbackMethods(code);
      }
      const json = (await response.json()) as any;
      if (json && Array.isArray(json.data)) {
        const countryData = json.data.find((c: any) => c.country_code?.toUpperCase() === code);
        if (countryData) {
          return {
            country: countryData.country,
            country_code: countryData.country_code,
            currency_name: countryData.currency_name,
            currency_code: countryData.currency_code,
            payment_methods: countryData.payment_methods.map((pm: any) => ({
              payment_method: pm.payment_method,
              mobile_format: pm.mobile_format || '',
              applicable_mobileno_length: pm.applicable_mobileno_length || '',
            })),
          };
        }
      }
      return this.getFallbackMethods(code);
    } catch (error) {
      console.error('[Swychr API] Error querying payout methods:', error);
      return this.getFallbackMethods(code);
    }
  }

  public async createPaymentRequest(params: CreatePaymentRequestParams): Promise<CreatePaymentResponse> {
    try {
      const cleanMobile = params.mobile ? params.mobile.replace(/[^0-9]/g, '') : undefined;
      const body = {
        country_code: params.country_code.toUpperCase(),
        name: params.name,
        email: params.email,
        mobile: cleanMobile,
        transaction_id: params.transaction_id || `ONH-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: params.amount,
        payment_method: params.payment_method,
        description: params.description || 'Oneallhost Order',
        pass_digital_charge: params.pass_digital_charge ?? true,
        reason: params.reason,
        callback_url: params.callback_url || 'https://oneallhost.com/api/payments/webhook',
        failed_callback_url: params.failed_callback_url || 'https://oneallhost.com/api/payments/webhook-failed',
        source: params.source || 'API',
        bank_code: params.bank_code,
        account_number: params.account_number,
      };
      const response = await fetch(`${this.baseUrl}/api/payin/create_payment_request`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return (await response.json()) as CreatePaymentResponse;
    } catch (error: any) {
      console.error('[Swychr API] Error creating payment request:', error);
      return { status: 500, message: error.message || 'Payment initiation failed' };
    }
  }

  public async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/swychpay/get_user_info`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error: any) {
      console.error('[Swychr API] Error fetching user info:', error);
      return { status: 500, message: error.message };
    }
  }

  public async getNigeriaBanks(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payout/nigeria_banks`, {
        method: 'GET',
        headers: { 'Api-Key': this.apiKey },
      });
      if (!response.ok) return [];
      const json = (await response.json()) as any;
      return json.data || [];
    } catch (error: any) {
      console.error('[Swychr API] Error fetching Nigerian banks:', error);
      return [];
    }
  }

  private getFallbackMethods(countryCode: string): SwychrCountryPayoutResponse {
    const { SUPPORTED_AFRICAN_COUNTRIES } = require('./african-countries');
    const code = countryCode.toUpperCase();
    const config = SUPPORTED_AFRICAN_COUNTRIES[code];
    if (config) {
      return {
        country: config.name,
        country_code: config.code,
        currency_name: config.currencyName,
        currency_code: config.currencyCode,
        payment_methods: config.defaultMethods,
      };
    }
    return {
      country: countryCode,
      country_code: code,
      currency_name: 'Local Currency',
      currency_code: 'XAF',
      payment_methods: [
        { payment_method: 'MTN', mobile_format: 'XXXXXXXXX', applicable_mobileno_length: '9' },
        { payment_method: 'ORANGE', mobile_format: 'XXXXXXXXX', applicable_mobileno_length: '9' },
      ],
    };
  }
}

export const swychrClient = new SwychrDirectApiClient();
