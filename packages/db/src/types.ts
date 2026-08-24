export type UserRole = 'client' | 'support' | 'admin';
export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type DomainStatus = 'active' | 'expiring_soon' | 'expired' | 'redemption' | 'transferred_out';
export type RentalDurationType = 'day' | 'week' | 'month';
export type RentalStatus = 'active' | 'expiring_soon' | 'expired' | 'converted_to_purchase' | 'cancelled';
export type HostingTier = 'starter' | 'professional' | 'business' | 'enterprise';
export type HostingStatus = 'waitlist' | 'provisioning' | 'active' | 'suspended';
export type OrderType = 'domain_purchase' | 'rental' | 'hosting' | 'domain_renewal';
export type PaymentMethod = 'card' | 'momo' | 'orange_money' | 'crypto';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DNSRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  country: string;
  role: UserRole;
  kyc_status: KYCStatus;
  kyc_document_url?: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  domain_name: string;
  tld: string;
  owner_id: string;
  registrar_ref_id: string;
  status: DomainStatus;
  registered_at: string;
  expires_at: string;
  auto_renew: boolean;
  whois_privacy: boolean;
  registrar_lock: boolean;
  transfer_lock_until?: string;
  nameservers: string[];
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  subdomain: string;
  full_domain: string;
  renter_id: string;
  duration_type: RentalDurationType;
  duration_value: number;
  price_paid_usd: number;
  price_paid_xaf: number;
  start_time: string;
  end_time: string;
  status: RentalStatus;
  target_url?: string;
  custom_records?: Record<string, string>;
  converted_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface HostingPlan {
  id: string;
  user_id: string;
  tier: HostingTier;
  status: HostingStatus;
  linked_domain_id?: string;
  disk_gb: number;
  bandwidth_gb: number;
  cpanel_username?: string;
  server_ip?: string;
  monthly_price_usd: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  type: OrderType;
  item_name: string;
  amount_usd: number;
  amount_xaf: number;
  currency_used: 'USD' | 'XAF' | 'USDT' | 'BTC';
  exchange_rate: number;
  tax_amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  altonixa_pay_ref: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  fee: number;
  payer_account?: string;
  status: PaymentStatus;
  raw_response?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  item_description: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  exchange_rate: number;
  payment_method: PaymentMethod;
  payment_reference: string;
  pdf_storage_path?: string;
  credit_note_id?: string;
  status: 'paid' | 'refunded' | 'void';
  issued_date: string;
  created_at: string;
}

export interface DNSRecord {
  id: string;
  domain_id: string;
  type: DNSRecordType;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_email: string;
  actor_role: UserRole;
  action: string;
  target_entity: string;
  target_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: 'domains' | 'rentals' | 'hosting' | 'billing' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  messages: Array<{
    id: string;
    sender_id: string;
    sender_name: string;
    sender_role: UserRole;
    message: string;
    attachments?: string[];
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}
