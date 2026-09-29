export interface SwychrPayoutMethod {
  payment_method: string;
  mobile_format: string;
  applicable_mobileno_length: string;
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
  BJ: { name: 'Benin', code: 'BJ', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+229', defaultMethods: [{ payment_method: 'MTN', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'MOOV', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' }] },
  BF: { name: 'Burkina Faso', code: 'BF', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+226', defaultMethods: [{ payment_method: 'ORANGE', mobile_format: '7XXXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'MOOV', mobile_format: '6XXXXXXX', applicable_mobileno_length: '8' }] },
  CM: { name: 'Cameroon', code: 'CM', currencyName: 'Central African CFA Franc', currencyCode: 'XAF', exchangeRate: 615.5, mobileCode: '+237', defaultMethods: [{ payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'ORANGE', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' }] },
  GN: { name: 'Guinea Conakry', code: 'GN', currencyName: 'West African Franc', currencyCode: 'GNF', exchangeRate: 8600.0, mobileCode: '+224', defaultMethods: [{ payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'Orange', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' }] },
  CI: { name: "Cote d'Ivoire", code: 'CI', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+225', defaultMethods: [{ payment_method: 'ORANGE', mobile_format: '07XXXXXXXX', applicable_mobileno_length: '10' }, { payment_method: 'MTN', mobile_format: '05XXXXXXXX', applicable_mobileno_length: '10' }, { payment_method: 'WAVE', mobile_format: '01XXXXXXXX', applicable_mobileno_length: '10' }] },
  CD: { name: 'DRC', code: 'CD', currencyName: 'Congolese Franc', currencyCode: 'CDF', exchangeRate: 2800.0, mobileCode: '+243', defaultMethods: [{ payment_method: 'VODACOM', mobile_format: '81XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTEL', mobile_format: '99XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'ORANGE', mobile_format: '84XXXXXXX', applicable_mobileno_length: '9' }] },
  GA: { name: 'Gabon', code: 'GA', currencyName: 'Central African CFA Franc', currencyCode: 'XAF', exchangeRate: 615.5, mobileCode: '+241', defaultMethods: [{ payment_method: 'AIRTEL', mobile_format: '77XXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'MOOV', mobile_format: '66XXXXXX', applicable_mobileno_length: '8' }] },
  GH: { name: 'Ghana', code: 'GH', currencyName: 'Ghanaian Cedi', currencyCode: 'GHS', exchangeRate: 15.5, mobileCode: '+233', defaultMethods: [{ payment_method: 'MTN', mobile_format: '24XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'VODAFONE', mobile_format: '20XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTELTIGO', mobile_format: '26XXXXXXX', applicable_mobileno_length: '9' }] },
  KE: { name: 'Kenya', code: 'KE', currencyName: 'Kenyan Shilling', currencyCode: 'KES', exchangeRate: 129.0, mobileCode: '+254', defaultMethods: [{ payment_method: 'MPESA', mobile_format: '7XXXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTEL', mobile_format: '73XXXXXXX', applicable_mobileno_length: '9' }] },
  ML: { name: 'Mali', code: 'ML', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+223', defaultMethods: [{ payment_method: 'ORANGE', mobile_format: '7XXXXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'MOOV', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '8' }] },
  NE: { name: 'Niger', code: 'NE', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+227', defaultMethods: [{ payment_method: 'AIRTEL', mobile_format: '9XXXXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'MOOV', mobile_format: '8XXXXXXXX', applicable_mobileno_length: '8' }] },
  NG: { name: 'Nigeria', code: 'NG', currencyName: 'Nigerian Naira', currencyCode: 'NGN', exchangeRate: 1600.0, mobileCode: '+234', defaultMethods: [{ payment_method: 'BANK_TRANSFER', mobile_format: '80XXXXXXXX', applicable_mobileno_length: '10' }, { payment_method: 'USSD', mobile_format: '80XXXXXXXX', applicable_mobileno_length: '10' }] },
  RW: { name: 'Rwanda', code: 'RW', currencyName: 'Rwandan Franc', currencyCode: 'RWF', exchangeRate: 1350.0, mobileCode: '+250', defaultMethods: [{ payment_method: 'MTN', mobile_format: '78XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTEL', mobile_format: '73XXXXXXX', applicable_mobileno_length: '9' }] },
  SN: { name: 'Senegal', code: 'SN', currencyName: 'West African CFA Franc', currencyCode: 'XOF', exchangeRate: 615.5, mobileCode: '+221', defaultMethods: [{ payment_method: 'ORANGE', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'WAVE', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'FREE', mobile_format: '76XXXXXXX', applicable_mobileno_length: '9' }] },
  TG: { name: 'Togo', code: 'TG', currencyName: 'West African Franc', currencyCode: 'XOFT', exchangeRate: 615.5, mobileCode: '+228', defaultMethods: [{ payment_method: 'Tmoney', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' }, { payment_method: 'Moov', mobile_format: '9XXXXXXX', applicable_mobileno_length: '8' }] },
  TZ: { name: 'Tanzania', code: 'TZ', currencyName: 'Tanzanian Shilling', currencyCode: 'TZS', exchangeRate: 2700.0, mobileCode: '+255', defaultMethods: [{ payment_method: 'VODACOM', mobile_format: '75XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'TIGO', mobile_format: '71XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTEL', mobile_format: '78XXXXXXX', applicable_mobileno_length: '9' }] },
  UG: { name: 'Uganda', code: 'UG', currencyName: 'Ugandan Shilling', currencyCode: 'UGX', exchangeRate: 3700.0, mobileCode: '+256', defaultMethods: [{ payment_method: 'MTN', mobile_format: '77XXXXXXX', applicable_mobileno_length: '9' }, { payment_method: 'AIRTEL', mobile_format: '70XXXXXXX', applicable_mobileno_length: '9' }] },
};
