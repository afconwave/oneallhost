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

export const SUPPORTED_AFRICAN_COUNTRIES: Record<string, AfricanCountryConfig> = {
  BJ: {
    name: 'Benin',
    code: 'BJ',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+229',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'MOOV', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  BF: {
    name: 'Burkina Faso',
    code: 'BF',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+226',
    defaultMethods: [
      { payment_method: 'ORANGE', mobile_format: '7XXXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'MOOV', mobile_format: '6XXXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  CM: {
    name: 'Cameroon',
    code: 'CM',
    currencyName: 'Central African CFA Franc',
    currencyCode: 'XAF',
    exchangeRate: 615.5,
    mobileCode: '+237',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'ORANGE', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  GN: {
    name: 'Guinea Conakry',
    code: 'GN',
    currencyName: 'West African Franc',
    currencyCode: 'GNF',
    exchangeRate: 8600.0,
    mobileCode: '+224',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'Orange', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  CI: {
    name: 'Côte d’Ivoire',
    code: 'CI',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+225',
    defaultMethods: [
      { payment_method: 'ORANGE', mobile_format: '07XXXXXXXX', applicable_mobileno_length: '10' },
      { payment_method: 'MTN', mobile_format: '05XXXXXXXX', applicable_mobileno_length: '10' },
      { payment_method: 'WAVE', mobile_format: '01XXXXXXXX', applicable_mobileno_length: '10' },
    ],
  },
  CD: {
    name: 'Democratic Republic of the Congo (DRC)',
    code: 'CD',
    currencyName: 'Congolese Franc',
    currencyCode: 'CDF',
    exchangeRate: 2800.0,
    mobileCode: '+243',
    defaultMethods: [
      { payment_method: 'VODACOM', mobile_format: '81XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTEL', mobile_format: '99XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'ORANGE', mobile_format: '84XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  GA: {
    name: 'Gabon',
    code: 'GA',
    currencyName: 'Central African CFA Franc',
    currencyCode: 'XAF',
    exchangeRate: 615.5,
    mobileCode: '+241',
    defaultMethods: [
      { payment_method: 'AIRTEL', mobile_format: '77XXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'MOOV', mobile_format: '66XXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  GH: {
    name: 'Ghana',
    code: 'GH',
    currencyName: 'Ghanaian Cedi',
    currencyCode: 'GHS',
    exchangeRate: 15.5,
    mobileCode: '+233',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '24XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'VODAFONE', mobile_format: '20XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTELTIGO', mobile_format: '26XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  KE: {
    name: 'Kenya',
    code: 'KE',
    currencyName: 'Kenyan Shilling',
    currencyCode: 'KES',
    exchangeRate: 129.0,
    mobileCode: '+254',
    defaultMethods: [
      { payment_method: 'MPESA', mobile_format: '7XXXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTEL', mobile_format: '73XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  ML: {
    name: 'Mali',
    code: 'ML',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+223',
    defaultMethods: [
      { payment_method: 'ORANGE', mobile_format: '7XXXXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'MOOV', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  NE: {
    name: 'Niger',
    code: 'NE',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+227',
    defaultMethods: [
      { payment_method: 'AIRTEL', mobile_format: '9XXXXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'MOOV', mobile_format: '8XXXXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  NG: {
    name: 'Nigeria',
    code: 'NG',
    currencyName: 'Nigerian Naira',
    currencyCode: 'NGN',
    exchangeRate: 1600.0,
    mobileCode: '+234',
    defaultMethods: [
      { payment_method: 'BANK_TRANSFER', mobile_format: '80XXXXXXXX', applicable_mobileno_length: '10' },
      { payment_method: 'USSD', mobile_format: '80XXXXXXXX', applicable_mobileno_length: '10' },
    ],
  },
  RW: {
    name: 'Rwanda',
    code: 'RW',
    currencyName: 'Rwandan Franc',
    currencyCode: 'RWF',
    exchangeRate: 1350.0,
    mobileCode: '+250',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '78XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTEL', mobile_format: '73XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  SN: {
    name: 'Senegal',
    code: 'SN',
    currencyName: 'West African CFA Franc',
    currencyCode: 'XOF',
    exchangeRate: 615.5,
    mobileCode: '+221',
    defaultMethods: [
      { payment_method: 'ORANGE', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'WAVE', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'FREE', mobile_format: '76XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  TG: {
    name: 'Togo',
    code: 'TG',
    currencyName: 'West African Franc',
    currencyCode: 'XOFT',
    exchangeRate: 615.5,
    mobileCode: '+228',
    defaultMethods: [
      { payment_method: 'Tmoney', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' },
      { payment_method: 'Moov', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' },
    ],
  },
  TZ: {
    name: 'Tanzania',
    code: 'TZ',
    currencyName: 'Tanzanian Shilling',
    currencyCode: 'TZS',
    exchangeRate: 2700.0,
    mobileCode: '+255',
    defaultMethods: [
      { payment_method: 'VODACOM', mobile_format: '75XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'TIGO', mobile_format: '71XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTEL', mobile_format: '78XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
  UG: {
    name: 'Uganda',
    code: 'UG',
    currencyName: 'Ugandan Shilling',
    currencyCode: 'UGX',
    exchangeRate: 3700.0,
    mobileCode: '+256',
    defaultMethods: [
      { payment_method: 'MTN', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' },
      { payment_method: 'AIRTEL', mobile_format: '70XXXXXXX', applicable_mobileno_length: '9' },
    ],
  },
};

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
        const countryData = json.data.find(
          (c: any) => c.country_code?.toUpperCase() === code
        );
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

  /**
   * Create direct mobile money / digital cash payment request
   */
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

  /**
   * Fetch list of supported Nigerian banks
   */
  public async getNigeriaBanks(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payout/nigeria_banks`, {
        method: 'GET',
        headers: {
          'Api-Key': this.apiKey,
        },
      });
      if (!response.ok) {
        console.warn(`[Swychr API] nigeria_banks returned status ${response.status}`);
        return [];
      }
      const json = (await response.json()) as any;
      return json.data || [];
    } catch (error: any) {
      console.error('[Swychr API] Error fetching Nigerian banks:', error);
      return [];
    }
  }

  private getFallbackMethods(countryCode: string): SwychrCountryPayoutResponse {
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

