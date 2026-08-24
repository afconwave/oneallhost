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
  mobile: string;
  transaction_id: string;
  amount: number;
  payment_method?: string;
  description?: string;
  pass_digital_charge?: boolean;
  reason?: string;
  callback_url?: string;
  failed_callback_url?: string;
  source?: string;
}

export interface CreatePaymentResponse {
  status: number;
  message: string;
  data?: {
    id?: number;
    transaction_id: string;
    name: string;
    email?: string;
    mobile: string;
    amount: string;
    status: number;
    description?: string;
    created_at?: string;
  };
}

export class SwychrDirectApiClient {
  private baseUrl: string;
  private apiKey: string;
  private xafRate: number = 615.5;

  constructor(
    apiKey: string = process.env.SWYCHR_API_KEY || 'ae0532737f07d578d7daea3e2d3b80984bc99ee9fe4b93e0e0d0c51a7550f73c',
    baseUrl: string = process.env.SWYCHR_BASE_URL || 'https://api.accountpe.com'
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public convertUsdToXaf(usd: number): number {
    return Math.round(usd * this.xafRate);
  }

  public convertXafToUsd(xaf: number): number {
    return Number((xaf / this.xafRate).toFixed(2));
  }

  /**
   * Query supported payment methods & mobile format for a given country code
   */
  public async getPayoutMethods(countryCode: string = 'CM'): Promise<SwychrCountryPayoutResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payout/payout_methods`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country_code: countryCode.toUpperCase() }),
      });

      if (!response.ok) {
        console.warn(`[Swychr API] payout_methods returned status ${response.status}`);
        return this.getFallbackMethods(countryCode);
      }

      const json = (await response.json()) as any;
      return json.data || this.getFallbackMethods(countryCode);
    } catch (error) {
      console.error('[Swychr API] Error querying payout methods:', error);
      return this.getFallbackMethods(countryCode);
    }
  }

  /**
   * Create direct mobile money / digital cash payment request
   */
  public async createPaymentRequest(params: CreatePaymentRequestParams): Promise<CreatePaymentResponse> {
    try {
      const cleanMobile = params.mobile.replace(/[^0-9]/g, '');
      const body = {
        country_code: params.country_code.toUpperCase(),
        name: params.name,
        email: params.email,
        mobile: cleanMobile,
        transaction_id: params.transaction_id || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: params.amount,
        payment_method: params.payment_method || 'MTN',
        description: params.description || 'Oneallhost Order',
        pass_digital_charge: params.pass_digital_charge ?? true,
        callback_url: params.callback_url || 'https://oneallhost.com/api/payments/webhook',
        failed_callback_url: params.failed_callback_url || 'https://oneallhost.com/api/payments/webhook-failed',
        source: params.source || 'Oneallhost-Web',
      };

      const response = await fetch(`${this.baseUrl}/api/payin/create_payment_request`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const json = (await response.json()) as CreatePaymentResponse;
      return json;
    } catch (error: any) {
      console.error('[Swychr API] Error creating payment request:', error);
      return {
        status: 500,
        message: error.message || 'Payment initiation failed',
      };
    }
  }

  /**
   * Verify merchant user information
   */
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

  private getFallbackMethods(countryCode: string): SwychrCountryPayoutResponse {
    if (countryCode.toUpperCase() === 'CM') {
      return {
        country: 'Cameroon',
        country_code: 'CM',
        currency_name: 'Central African CFA Franc',
        currency_code: 'XAF',
        payment_methods: [
          { payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
          { payment_method: 'ORANGE', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
        ],
      };
    }
    return {
      country: countryCode,
      country_code: countryCode.toUpperCase(),
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
