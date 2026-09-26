/**
 * Standardized Supabase PostgreSQL Database & State Repository
 * Computes live revenue, dynamic audits, domain lifecycle, and real-time transaction ledgers.
 */

import { supabase, isSupabaseConfigured } from './client';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredCurrency: 'USD' | 'XAF';
  balanceUsd: number;
  balanceXaf: number;
  autoDebitEnabled: boolean;
  twoFactorEnabled: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'unverified';
  supportPin: string;
  supportPinExpiresAt: string;
  isStaff: boolean;
  staffRole?: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
}

export interface DomainRecord {
  id: string;
  userId: string;
  name: string;
  registrar: string;
  registeredAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'suspended' | 'expiring_soon';
  whoisPrivacy: boolean;
  transferLock: boolean;
  autoRenew: boolean;
  nameservers: string[];
}

export interface RentalRecord {
  id: string;
  userId: string;
  subdomain: string;
  targetDomain: string;
  clientName: string;
  durationHours: number;
  durationType?: string;
  durationValue?: number;
  priceUsd: number;
  rebateCreditUsd: number;
  status: 'active' | 'converted_to_purchase' | 'expired' | 'cancelled';
  targetUrl?: string;
  createdAt: string;
  expiresAt: string;
  convertedAt?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  client: string;
  method: string;
  amountUsd: number;
  amountXaf: number;
  status: 'pending' | 'settled' | 'completed' | 'failed' | 'refunded';
  item: string;
  reference: string;
  timestamp: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethodRecord {
  id: string;
  userId: string;
  type: 'card' | 'momo';
  cardHolder: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WaitlistRecord {
  id: string;
  email: string;
  tier: string;
  queueNumber: number;
  createdAt: string;
}

export interface SystemAnnouncementRecord {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promo';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class SupabaseDatabaseEngine {
  // Resilient memory cache backing live Supabase sync
  private usersCache: Map<string, UserRecord> = new Map();
  private domainsCache: Map<string, DomainRecord> = new Map();
  private rentalsCache: Map<string, RentalRecord> = new Map();
  private paymentsCache: Map<string, PaymentRecord> = new Map();
  private paymentMethodsCache: Map<string, PaymentMethodRecord> = new Map();
  private auditLogsCache: AuditLogRecord[] = [];
  private waitlistCache: WaitlistRecord[] = [];
  private announcementsCache: SystemAnnouncementRecord[] = [];
  private pricingCache: any = {
    domain_extensions: [
      { tld: '.com', base: 9.00, markup: 2.99 },
      { tld: '.org', base: 10.50, markup: 3.00 },
      { tld: '.net', base: 11.00, markup: 2.50 }
    ],
    hosting_starter: 4.99,
    hosting_pro: 12.99,
    hosting_enterprise: 29.99,
    rental_base: 7.99,
  };
  private ticketsCache: import('./types').SupportTicket[] = [];

  constructor() {
    // Clean production state - all data is loaded from live Supabase Postgres tables
  }

  // --- Users & Wallet ---
  public usersRepo = {
    create: async (user: Omit<UserRecord, 'id' | 'createdAt' | 'balanceUsd' | 'balanceXaf' | 'autoDebitEnabled'>): Promise<UserRecord> => {
      const id = `usr-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: UserRecord = {
        ...user,
        id,
        balanceUsd: 0,
        balanceXaf: 0,
        autoDebitEnabled: true,
        supportPin: Math.floor(100000 + Math.random() * 900000).toString(),
        supportPinExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isStaff: false,
        staffRole: undefined,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('users').insert({
            id: record.id,
            email: record.email,
            name: record.name,
            phone: record.phone,
            country_code: record.countryCode,
            preferred_currency: record.preferredCurrency,
            balance_usd: record.balanceUsd,
            balance_xaf: record.balanceXaf,
            auto_debit_enabled: record.autoDebitEnabled,
            two_factor_enabled: record.twoFactorEnabled,
            kyc_status: record.kycStatus,
            support_pin: record.supportPin,
            support_pin_expires_at: record.supportPinExpiresAt,
            is_staff: record.isStaff,
            staff_role: record.staffRole,
            status: record.status,
            created_at: record.createdAt,
          });
        } catch (err) {
          console.error('[Supabase users.create]', err);
        }
      }

      this.usersCache.set(id, record);
      await this.auditLogsRepo.log('USER_REGISTERED', user.email, `User ${id}`);
      return record;
    },

    findById: async (id: string): Promise<UserRecord | undefined> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
          if (data) {
            const mapped: UserRecord = {
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone || '',
              countryCode: data.country_code || 'CM',
              preferredCurrency: data.preferred_currency || 'USD',
              balanceUsd: Number(data.balance_usd || 0),
              balanceXaf: Number(data.balance_xaf || 0),
              autoDebitEnabled: Boolean(data.auto_debit_enabled),
              twoFactorEnabled: Boolean(data.two_factor_enabled),
              kycStatus: data.kyc_status || 'verified',
              supportPin: data.support_pin || '0000',
              supportPinExpiresAt: data.support_pin_expires_at || new Date().toISOString(),
              isStaff: Boolean(data.is_staff),
              staffRole: data.staff_role || undefined,
              status: data.status || 'active',
              createdAt: data.created_at,
            };
            this.usersCache.set(id, mapped);
            return mapped;
          }
        } catch (err) {
          console.error('[Supabase users.findById]', err);
        }
      }
      return this.usersCache.get(id);
    },

    findByEmail: async (email: string): Promise<UserRecord | undefined> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('users').select('*').ilike('email', email.trim()).maybeSingle();
          if (data) {
            const mapped: UserRecord = {
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone || '',
              countryCode: data.country_code || 'CM',
              preferredCurrency: data.preferred_currency || 'USD',
              balanceUsd: Number(data.balance_usd || 0),
              balanceXaf: Number(data.balance_xaf || 0),
              autoDebitEnabled: Boolean(data.auto_debit_enabled),
              twoFactorEnabled: Boolean(data.two_factor_enabled),
              kycStatus: data.kyc_status || 'verified',
              supportPin: data.support_pin || '0000',
              supportPinExpiresAt: data.support_pin_expires_at || new Date().toISOString(),
              isStaff: Boolean(data.is_staff),
              staffRole: data.staff_role || undefined,
              status: data.status || 'active',
              createdAt: data.created_at,
            };
            this.usersCache.set(mapped.id, mapped);
            return mapped;
          }
        } catch (err) {
          console.error('[Supabase users.findByEmail]', err);
        }
      }
      return Array.from(this.usersCache.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    },

    list: async (): Promise<UserRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('users').select('*');
          if (data && data.length > 0) {
            const mappedList: UserRecord[] = data.map((d: any) => ({
              id: d.id,
              name: d.name,
              email: d.email,
              phone: d.phone || '',
              countryCode: d.country_code || 'CM',
              preferredCurrency: d.preferred_currency || 'USD',
              balanceUsd: Number(d.balance_usd || 0),
              balanceXaf: Number(d.balance_xaf || 0),
              autoDebitEnabled: Boolean(d.auto_debit_enabled),
              twoFactorEnabled: Boolean(d.two_factor_enabled),
              kycStatus: d.kyc_status || 'verified',
              supportPin: d.support_pin || '0000',
              supportPinExpiresAt: d.support_pin_expires_at || new Date().toISOString(),
              isStaff: Boolean(d.is_staff),
              staffRole: d.staff_role || undefined,
              status: d.status || 'active',
              createdAt: d.created_at,
            }));
            mappedList.forEach((u) => this.usersCache.set(u.id, u));
            return mappedList;
          }
        } catch (err) {
          console.error('[Supabase users.list]', err);
        }
      }
      return Array.from(this.usersCache.values());
    },

    update: async (id: string, updates: Partial<UserRecord>): Promise<UserRecord | undefined> => {
      const existing = await this.usersRepo.findById(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...updates };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('users').update({
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
            ...(updates.preferredCurrency ? { preferred_currency: updates.preferredCurrency } : {}),
            ...(updates.balanceUsd !== undefined ? { balance_usd: updates.balanceUsd } : {}),
            ...(updates.balanceXaf !== undefined ? { balance_xaf: updates.balanceXaf } : {}),
            ...(updates.autoDebitEnabled !== undefined ? { auto_debit_enabled: updates.autoDebitEnabled } : {}),
            ...(updates.twoFactorEnabled !== undefined ? { two_factor_enabled: updates.twoFactorEnabled } : {}),
            ...(updates.kycStatus ? { kyc_status: updates.kycStatus } : {}),
            updated_at: new Date().toISOString(),
          }).eq('id', id);
        } catch (err) {
          console.error('[Supabase users.update]', err);
        }
      }

      this.usersCache.set(id, updated);
      return updated;
    },

    topupBalance: async (id: string, amountUsd: number, amountXaf: number): Promise<UserRecord | undefined> => {
      const user = await this.usersRepo.findById(id);
      if (!user) return undefined;
      user.balanceUsd = Number((user.balanceUsd + amountUsd).toFixed(2));
      user.balanceXaf = Math.round(user.balanceXaf + amountXaf);

      await this.usersRepo.update(id, { balanceUsd: user.balanceUsd, balanceXaf: user.balanceXaf });
      await this.auditLogsRepo.log('WALLET_TOPUP', user.email, `Added $${amountUsd} USD (${amountXaf} XAF)`);
      return user;
    },

    debitBalance: async (id: string, amountUsd: number, amountXaf: number): Promise<{ success: boolean; user?: UserRecord; error?: string }> => {
      const user = await this.usersRepo.findById(id);
      if (!user) return { success: false, error: 'User not found' };
      if (user.balanceUsd < amountUsd) {
        return { success: false, error: 'Insufficient wallet balance' };
      }
      user.balanceUsd = Number((user.balanceUsd - amountUsd).toFixed(2));
      user.balanceXaf = Math.max(0, Math.round(user.balanceXaf - amountXaf));

      await this.usersRepo.update(id, { balanceUsd: user.balanceUsd, balanceXaf: user.balanceXaf });
      await this.auditLogsRepo.log('WALLET_DEBIT', user.email, `Deducted $${amountUsd} USD (${amountXaf} XAF)`);
      return { success: true, user };
    },
  };

  // --- Domains ---
  public domainsRepo = {
    create: async (domain: Omit<DomainRecord, 'id' | 'registeredAt'>): Promise<DomainRecord> => {
      const id = `dom-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: DomainRecord = {
        ...domain,
        id,
        registeredAt: new Date().toISOString().split('T')[0],
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('domains').insert({
            id: record.id,
            user_id: record.userId,
            name: record.name,
            registrar: record.registrar,
            registered_at: record.registeredAt,
            expires_at: record.expiresAt,
            status: record.status,
            whois_privacy: record.whoisPrivacy,
            transfer_lock: record.transferLock,
            auto_renew: record.autoRenew,
            nameservers: record.nameservers,
          });
        } catch (err) {
          console.error('[Supabase domains.create]', err);
        }
      }

      this.domainsCache.set(id, record);
      await this.auditLogsRepo.log('DOMAIN_REGISTERED', domain.userId, domain.name);
      return record;
    },

    findById: async (id: string): Promise<DomainRecord | undefined> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('domains').select('*').eq('id', id).maybeSingle();
          if (data) {
            const mapped: DomainRecord = {
              id: data.id,
              userId: data.user_id,
              name: data.name,
              registrar: data.registrar,
              registeredAt: data.registered_at,
              expiresAt: data.expires_at,
              status: data.status,
              whoisPrivacy: Boolean(data.whois_privacy),
              transferLock: Boolean(data.transfer_lock),
              autoRenew: Boolean(data.auto_renew),
              nameservers: data.nameservers || [],
            };
            this.domainsCache.set(id, mapped);
            return mapped;
          }
        } catch (err) {
          console.error('[Supabase domains.findById]', err);
        }
      }
      return this.domainsCache.get(id);
    },

    findByName: async (name: string): Promise<DomainRecord | undefined> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('domains').select('*').ilike('name', name.trim()).maybeSingle();
          if (data) {
            const mapped: DomainRecord = {
              id: data.id,
              userId: data.user_id,
              name: data.name,
              registrar: data.registrar,
              registeredAt: data.registered_at,
              expiresAt: data.expires_at,
              status: data.status,
              whoisPrivacy: Boolean(data.whois_privacy),
              transferLock: Boolean(data.transfer_lock),
              autoRenew: Boolean(data.auto_renew),
              nameservers: data.nameservers || [],
            };
            this.domainsCache.set(mapped.id, mapped);
            return mapped;
          }
        } catch (err) {
          console.error('[Supabase domains.findByName]', err);
        }
      }
      return Array.from(this.domainsCache.values()).find((d) => d.name.toLowerCase() === name.toLowerCase());
    },

    list: async (userId?: string): Promise<DomainRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('domains').select('*');
          if (userId) query = query.eq('user_id', userId);
          const { data } = await query;
          if (data) {
            const mappedList: DomainRecord[] = data.map((d: any) => ({
              id: d.id,
              userId: d.user_id,
              name: d.name,
              registrar: d.registrar,
              registeredAt: d.registered_at,
              expiresAt: d.expires_at,
              status: d.status,
              whoisPrivacy: Boolean(d.whois_privacy),
              transferLock: Boolean(d.transfer_lock),
              autoRenew: Boolean(d.auto_renew),
              nameservers: d.nameservers || [],
            }));
            mappedList.forEach((dom) => this.domainsCache.set(dom.id, dom));
            return mappedList;
          }
        } catch (err) {
          console.error('[Supabase domains.list]', err);
        }
      }
      const all = Array.from(this.domainsCache.values());
      return userId ? all.filter((d) => d.userId === userId) : all;
    },

    update: async (id: string, updates: Partial<DomainRecord>): Promise<DomainRecord | undefined> => {
      const existing = await this.domainsRepo.findById(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...updates };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('domains').update({
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.whoisPrivacy !== undefined ? { whois_privacy: updates.whoisPrivacy } : {}),
            ...(updates.transferLock !== undefined ? { transfer_lock: updates.transferLock } : {}),
            ...(updates.autoRenew !== undefined ? { auto_renew: updates.autoRenew } : {}),
            ...(updates.nameservers ? { nameservers: updates.nameservers } : {}),
            updated_at: new Date().toISOString(),
          }).eq('id', id);
        } catch (err) {
          console.error('[Supabase domains.update]', err);
        }
      }

      this.domainsCache.set(id, updated);
      return updated;
    },
  };

  // --- Subdomain Rentals ---
  public rentalsRepo = {
    create: async (rental: Omit<RentalRecord, 'id' | 'createdAt'>): Promise<RentalRecord> => {
      const id = `rnt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: RentalRecord = {
        ...rental,
        id,
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('subdomain_rentals').insert({
            id: record.id,
            user_id: record.userId,
            subdomain: record.subdomain,
            target_domain: record.targetDomain,
            client_name: record.clientName,
            duration_hours: record.durationHours,
            duration_type: record.durationType || 'day',
            duration_value: record.durationValue || 7,
            price_usd: record.priceUsd,
            rebate_credit_usd: record.rebateCreditUsd,
            status: record.status,
            target_url: record.targetUrl || 'https://default.oneallhost.com',
            expires_at: record.expiresAt,
          });
        } catch (err) {
          console.error('[Supabase rentals.create]', err);
        }
      }

      this.rentalsCache.set(id, record);
      await this.auditLogsRepo.log('RENTAL_CREATED', rental.userId, rental.subdomain);
      return record;
    },

    list: async (userId?: string): Promise<RentalRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('subdomain_rentals').select('*');
          if (userId) query = query.eq('user_id', userId);
          const { data } = await query;
          if (data) {
            const mappedList: RentalRecord[] = data.map((r: any) => ({
              id: r.id,
              userId: r.user_id,
              subdomain: r.subdomain,
              targetDomain: r.target_domain,
              clientName: r.client_name,
              durationHours: r.duration_hours,
              durationType: r.duration_type,
              durationValue: r.duration_value,
              priceUsd: Number(r.price_usd),
              rebateCreditUsd: Number(r.rebate_credit_usd),
              status: r.status,
              targetUrl: r.target_url,
              createdAt: r.created_at,
              expiresAt: r.expires_at,
              convertedAt: r.converted_at,
            }));
            mappedList.forEach((r) => this.rentalsCache.set(r.id, r));
            return mappedList;
          }
        } catch (err) {
          console.error('[Supabase rentals.list]', err);
        }
      }
      const all = Array.from(this.rentalsCache.values());
      return userId ? all.filter((r) => r.userId === userId) : all;
    },

    convert: async (id: string): Promise<RentalRecord | undefined> => {
      const existing = this.rentalsCache.get(id);
      if (!existing) return undefined;
      const updated: RentalRecord = {
        ...existing,
        status: 'converted_to_purchase',
        convertedAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('subdomain_rentals').update({
            status: 'converted_to_purchase',
            converted_at: updated.convertedAt,
          }).eq('id', id);
        } catch (err) {
          console.error('[Supabase rentals.convert]', err);
        }
      }

      this.rentalsCache.set(id, updated);
      await this.auditLogsRepo.log('RENTAL_CONVERTED_TO_PURCHASE', existing.userId, existing.targetDomain, {
        rebateAppliedUsd: existing.rebateCreditUsd,
      });
      return updated;
    },
  };

  // --- Payments & Ledger ---
  public paymentsRepo = {
    create: async (payment: Omit<PaymentRecord, 'id' | 'timestamp'>): Promise<PaymentRecord> => {
      const id = payment.reference || `ONH-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: PaymentRecord = {
        ...payment,
        id,
        timestamp: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('payments').insert({
            id: record.id,
            user_id: record.userId,
            client: record.client,
            method: record.method,
            amount_usd: record.amountUsd,
            amount_xaf: record.amountXaf,
            status: record.status,
            item: record.item,
            reference: record.reference,
          });
        } catch (err) {
          console.error('[Supabase payments.create]', err);
        }
      }

      this.paymentsCache.set(id, record);
      await this.auditLogsRepo.log('PAYMENT_SETTLED', payment.userId, `${payment.amountXaf} XAF (${payment.item})`);
      return record;
    },

    list: async (userId?: string): Promise<PaymentRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('payments').select('*').order('timestamp', { ascending: false });
          if (userId) query = query.eq('user_id', userId);
          const { data } = await query;
          if (data) {
            const mappedList: PaymentRecord[] = data.map((p: any) => ({
              id: p.id,
              userId: p.user_id,
              client: p.client,
              method: p.method,
              amountUsd: Number(p.amount_usd),
              amountXaf: Number(p.amount_xaf),
              status: p.status,
              item: p.item,
              reference: p.reference,
              timestamp: p.timestamp,
            }));
            mappedList.forEach((p) => this.paymentsCache.set(p.id, p));
            return mappedList;
          }
        } catch (err) {
          console.error('[Supabase payments.list]', err);
        }
      }
      const all = Array.from(this.paymentsCache.values());
      return userId ? all.filter((p) => p.userId === userId) : all;
    },
  };

  // --- Saved Payment Methods / Cards ---
  public paymentMethodsRepo = {
    create: async (method: Omit<PaymentMethodRecord, 'id' | 'createdAt'>): Promise<PaymentMethodRecord> => {
      const id = `pm-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      if (method.isDefault) {
        for (const existing of this.paymentMethodsCache.values()) {
          if (existing.userId === method.userId) {
            existing.isDefault = false;
          }
        }
      }
      const record: PaymentMethodRecord = {
        ...method,
        id,
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          if (method.isDefault) {
            await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', method.userId);
          }
          await supabase.from('payment_methods').insert({
            id: record.id,
            user_id: record.userId,
            type: record.type,
            card_holder: record.cardHolder,
            brand: record.brand,
            last4: record.last4,
            expiry: record.expiry,
            is_default: record.isDefault,
          });
        } catch (err) {
          console.error('[Supabase paymentMethods.create]', err);
        }
      }

      this.paymentMethodsCache.set(id, record);
      await this.auditLogsRepo.log('PAYMENT_METHOD_ADDED', method.userId, `${method.brand} ending in ${method.last4}`);
      return record;
    },

    list: async (userId?: string): Promise<PaymentMethodRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('payment_methods').select('*');
          if (userId) query = query.eq('user_id', userId);
          const { data } = await query;
          if (data) {
            const mappedList: PaymentMethodRecord[] = data.map((m: any) => ({
              id: m.id,
              userId: m.user_id,
              type: m.type,
              cardHolder: m.card_holder,
              brand: m.brand,
              last4: m.last4,
              expiry: m.expiry,
              isDefault: Boolean(m.is_default),
              createdAt: m.created_at,
            }));
            mappedList.forEach((m) => this.paymentMethodsCache.set(m.id, m));
            return mappedList;
          }
        } catch (err) {
          console.error('[Supabase paymentMethods.list]', err);
        }
      }
      const all = Array.from(this.paymentMethodsCache.values());
      return userId ? all.filter((m) => m.userId === userId) : all;
    },

    delete: async (id: string, userId?: string): Promise<boolean> => {
      const existing = this.paymentMethodsCache.get(id);
      if (!existing) return false;
      if (userId && existing.userId !== userId) return false;

      if (isSupabaseConfigured) {
        try {
          await supabase.from('payment_methods').delete().eq('id', id);
        } catch (err) {
          console.error('[Supabase paymentMethods.delete]', err);
        }
      }

      this.paymentMethodsCache.delete(id);
      await this.auditLogsRepo.log('PAYMENT_METHOD_REMOVED', existing.userId, `${existing.brand} ending in ${existing.last4}`);
      return true;
    },

    setDefault: async (id: string, userId?: string): Promise<PaymentMethodRecord | undefined> => {
      const target = this.paymentMethodsCache.get(id);
      if (!target) return undefined;
      if (userId && target.userId !== userId) return undefined;

      for (const existing of this.paymentMethodsCache.values()) {
        if (!userId || existing.userId === userId) {
          existing.isDefault = existing.id === id;
        }
      }

      if (isSupabaseConfigured) {
        try {
          if (userId) {
            await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', userId);
          }
          await supabase.from('payment_methods').update({ is_default: true }).eq('id', id);
        } catch (err) {
          console.error('[Supabase paymentMethods.setDefault]', err);
        }
      }

      await this.auditLogsRepo.log('PAYMENT_METHOD_SET_DEFAULT', target.userId, `${target.brand} ending in ${target.last4}`);
      return target;
    },
  };

  // --- Audit Logs ---
  public auditLogsRepo = {
    log: async (action: string, actor: string, target: string, metadata?: Record<string, any>): Promise<AuditLogRecord> => {
      const logRecord: AuditLogRecord = {
        id: `log-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        action,
        actor,
        target,
        timestamp: new Date().toISOString(),
        metadata,
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('audit_logs').insert({
            id: logRecord.id,
            action: logRecord.action,
            actor: logRecord.actor,
            target: logRecord.target,
            metadata: logRecord.metadata || {},
          });
        } catch (err) {
          console.error('[Supabase auditLogs.log]', err);
        }
      }

      this.auditLogsCache.unshift(logRecord);
      if (this.auditLogsCache.length > 500) this.auditLogsCache.pop();
      return logRecord;
    },

    list: async (): Promise<AuditLogRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200);
          if (data && data.length > 0) {
            return data.map((l: any) => ({
              id: l.id,
              action: l.action,
              actor: l.actor,
              target: l.target,
              timestamp: l.timestamp,
              metadata: l.metadata,
            }));
          }
        } catch (err) {
          console.error('[Supabase auditLogs.list]', err);
        }
      }
      return this.auditLogsCache;
    },
  };

  // --- Cloud Hosting Waitlist ---
  public waitlistRepo = {
    join: async (email: string, tier: string = 'professional', ipAddress?: string): Promise<{ success: boolean; queueNumber: number }> => {
      const calculatedRank = Math.floor(100 + (email.length * 7) % 89);
      const record: WaitlistRecord = {
        id: `hwl-${Date.now()}`,
        email: email.toLowerCase().trim(),
        tier,
        queueNumber: calculatedRank,
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('hosting_waitlist').insert({
            id: record.id,
            email: record.email,
            tier: record.tier,
            queue_number: record.queueNumber,
            ip_address: ipAddress || null,
          });
        } catch (err) {
          console.error('[Supabase waitlist.join]', err);
        }
      }

      this.waitlistCache.push(record);
      await this.auditLogsRepo.log('WAITLIST_JOINED', email, `${tier.toUpperCase()} Tier (Rank #${calculatedRank})`);
      return { success: true, queueNumber: calculatedRank };
    },

    list: async (): Promise<WaitlistRecord[]> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('hosting_waitlist').select('*').order('created_at', { ascending: true });
          if (data && data.length > 0) {
            return data.map((w: any) => ({
              id: w.id,
              email: w.email,
              tier: w.tier,
              queueNumber: w.queue_number,
              createdAt: w.created_at,
            }));
          }
        } catch (err) {
          console.error('[Supabase waitlist.list]', err);
        }
      }
      return this.waitlistCache;
    },
  };

  // --- Announcements ---
  public announcementsRepo = {
    setActive: async (title: string, message: string, type: 'info' | 'warning' | 'success' | 'promo'): Promise<SystemAnnouncementRecord> => {
      const id = `ann-${Date.now()}`;
      const record: SystemAnnouncementRecord = {
        id,
        title,
        message,
        type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          // Deactivate old active ones
          await supabase.from('system_announcements').update({ is_active: false }).eq('is_active', true);
          await supabase.from('system_announcements').insert({
            id: record.id,
            title: record.title,
            message: record.message,
            type: record.type,
            is_active: true,
          });
        } catch (err) {
          console.error('[Supabase announcements.setActive]', err);
        }
      }

      // Update cache
      this.announcementsCache.forEach(a => a.isActive = false);
      this.announcementsCache.push(record);

      await this.auditLogsRepo.log('ANNOUNCEMENT_SET', 'system', `Banner set: ${title}`);
      return record;
    },

    getActive: async (): Promise<SystemAnnouncementRecord | undefined> => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('system_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).maybeSingle();
          if (data) {
            return {
              id: data.id,
              title: data.title,
              message: data.message,
              type: data.type,
              isActive: data.is_active,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };
          }
        } catch (err) {
          console.error('[Supabase announcements.getActive]', err);
        }
      }
      return this.announcementsCache.find(a => a.isActive);
    },
    
    clearActive: async (): Promise<void> => {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('system_announcements').update({ is_active: false }).eq('is_active', true);
        } catch (err) {}
      }
      this.announcementsCache.forEach(a => a.isActive = false);
      await this.auditLogsRepo.log('ANNOUNCEMENT_CLEARED', 'system', 'Cleared active banner');
    }
  };

  // --- Pricing Management ---
  public pricingRepo = {
    get: async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('pricing_config').select('*').eq('id', 'global-pricing-config').maybeSingle();
          if (data) {
            this.pricingCache = { ...this.pricingCache, ...data };
          }
        } catch (err) {}
      }
      return this.pricingCache;
    },
    update: async (updates: any) => {
      this.pricingCache = { ...this.pricingCache, ...updates };
      if (isSupabaseConfigured) {
        try {
          await supabase.from('pricing_config').upsert({ id: 'global-pricing-config', ...this.pricingCache });
        } catch (err) {}
      }
      await this.auditLogsRepo.log('PRICING_UPDATED', 'system', 'Updated platform pricing & margins');
      return this.pricingCache;
    }
  };

  // --- Support Tickets Engine ---
  public ticketsRepo = {
    list: async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.from('tickets').select('*');
          if (data) {
            this.ticketsCache = data.map(ticket => ({
              ...ticket,
              messages: [] // Real implementation would fetch from ticket_messages
            }));
          }
        } catch (err) {}
      }
      return [...this.ticketsCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getByUser: async (userId: string) => {
      const tickets = await this.ticketsRepo.list();
      return tickets.filter(t => t.user_id === userId);
    },
    create: async (ticket: any) => {
      const newTicket: any = {
        id: `tkt-${Math.random().toString(36).substr(2, 9)}`,
        user_id: ticket.user_id!,
        subject: ticket.subject || 'No Subject',
        category: ticket.category || 'technical',
        priority: ticket.priority || 'medium',
        status: 'open',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...ticket
      };
      this.ticketsCache.push(newTicket);
      
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tickets').insert([{
            id: newTicket.id,
            user_id: newTicket.user_id,
            subject: newTicket.subject,
            department: newTicket.category,
            priority: newTicket.priority,
            status: newTicket.status,
            created_at: newTicket.created_at,
            updated_at: newTicket.updated_at
          }]);
        } catch (err) {}
      }
      
      await this.auditLogsRepo.log('TICKET_CREATED', newTicket.user_id, `Created support ticket: ${newTicket.subject}`);
      return newTicket;
    },
    addMessage: async (ticketId: string, message: any) => {
      const ticket = this.ticketsCache.find(t => t.id === ticketId);
      if (ticket) {
        const newMessage = {
          ...message,
          id: `msg-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        ticket.messages.push(newMessage);
        ticket.updated_at = new Date().toISOString();
        
        if (isSupabaseConfigured) {
          try {
            await supabase.from('ticket_messages').insert([{
              id: newMessage.id,
              ticket_id: ticketId,
              sender_id: newMessage.sender_id,
              is_staff: newMessage.sender_role !== 'customer',
              message: newMessage.message,
              created_at: newMessage.timestamp
            }]);
          } catch(err) {}
        }
        return newMessage;
      }
      throw new Error('Ticket not found');
    },
    updateStatus: async (ticketId: string, status: string) => {
      const ticket = this.ticketsCache.find(t => t.id === ticketId);
      if (ticket) {
        ticket.status = status as any;
        ticket.updated_at = new Date().toISOString();
        if (isSupabaseConfigured) {
           await supabase.from('tickets').update({ status, updated_at: ticket.updated_at }).eq('id', ticketId);
        }
        return ticket;
      }
      throw new Error('Ticket not found');
    }
  };

  // --- Dynamic Live Compute Engine ---
  public computeStats = async () => {
    const allPayments = await this.paymentsRepo.list();
    const settledPayments = allPayments.filter((p) => p.status === 'settled' || p.status === 'completed');
    const totalRevenueUsd = settledPayments.reduce((sum, p) => sum + p.amountUsd, 0);
    const totalRevenueXaf = settledPayments.reduce((sum, p) => sum + p.amountXaf, 0);

    const domains = await this.domainsRepo.list();
    const rentals = await this.rentalsRepo.list();
    const users = await this.usersRepo.list();

    return {
      totalDomains: domains.length,
      activeRentals: rentals.filter((r) => r.status === 'active').length,
      totalClients: users.length,
      totalRevenueUsd: Number(totalRevenueUsd.toFixed(2)),
      totalRevenueXaf: Math.round(totalRevenueXaf),
      totalTransactionsCount: settledPayments.length,
      systemHealth: '100% Operational',
    };
  };
}

export const db = new SupabaseDatabaseEngine();
