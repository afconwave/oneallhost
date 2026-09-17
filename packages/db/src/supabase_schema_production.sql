-- ==============================================================================
-- Oneallhost Production Database Schema (Supabase PostgreSQL)
-- Description: Unified ICANN domain registrar, subdomain staging leases,
--              hosting waitlist, payments ledger, and immutable audit logs.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT ('usr-' || substr(md5(random()::text), 1, 12)),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    country_code VARCHAR(5) DEFAULT 'CM',
    preferred_currency VARCHAR(5) DEFAULT 'USD',
    balance_usd NUMERIC(12, 2) DEFAULT 0.00,
    balance_xaf NUMERIC(14, 0) DEFAULT 0,
    auto_debit_enabled BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    kyc_status VARCHAR(20) DEFAULT 'verified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_country ON public.users (country_code);

-- 2. DOMAINS TABLE
CREATE TABLE IF NOT EXISTS public.domains (
    id TEXT PRIMARY KEY DEFAULT ('dom-' || substr(md5(random()::text), 1, 12)),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT UNIQUE NOT NULL,
    registrar TEXT DEFAULT 'Oneallhost Enterprise Registry',
    registered_at DATE DEFAULT CURRENT_DATE,
    expires_at DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expiring_soon', 'expired', 'suspended', 'transferred_out')),
    whois_privacy BOOLEAN DEFAULT true,
    transfer_lock BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    nameservers TEXT[] DEFAULT ARRAY['ns1.oneallhost.com', 'ns2.oneallhost.com'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domains_user ON public.domains (user_id);
CREATE INDEX IF NOT EXISTS idx_domains_name ON public.domains (name);
CREATE INDEX IF NOT EXISTS idx_domains_status ON public.domains (status);

-- 3. SUBDOMAIN RENTALS TABLE
CREATE TABLE IF NOT EXISTS public.subdomain_rentals (
    id TEXT PRIMARY KEY DEFAULT ('rnt-' || substr(md5(random()::text), 1, 12)),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subdomain TEXT NOT NULL,
    target_domain TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT 'Account Owner',
    duration_hours INTEGER NOT NULL DEFAULT 168,
    duration_type VARCHAR(10) DEFAULT 'day',
    duration_value INTEGER DEFAULT 7,
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 7.99,
    rebate_credit_usd NUMERIC(10, 2) NOT NULL DEFAULT 7.99,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'converted_to_purchase', 'expired', 'cancelled')),
    target_url TEXT DEFAULT 'https://default.oneallhost.com',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rentals_user ON public.subdomain_rentals (user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_subdomain ON public.subdomain_rentals (subdomain);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.subdomain_rentals (status);

-- 4. PAYMENTS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT ('ONH-TXN-' || substr(md5(random()::text), 1, 12)),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    client TEXT NOT NULL,
    method TEXT NOT NULL,
    amount_usd NUMERIC(12, 2) NOT NULL,
    amount_xaf NUMERIC(14, 0) NOT NULL,
    status VARCHAR(20) DEFAULT 'settled' CHECK (status IN ('pending', 'settled', 'completed', 'failed', 'refunded')),
    item TEXT NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments (reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);

-- 5. PAYMENT METHODS TABLE
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id TEXT PRIMARY KEY DEFAULT ('pm-' || substr(md5(random()::text), 1, 12)),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'card' CHECK (type IN ('card', 'momo')),
    card_holder TEXT NOT NULL,
    brand VARCHAR(30) NOT NULL DEFAULT 'Visa',
    last4 VARCHAR(4) NOT NULL,
    expiry VARCHAR(7) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods (user_id);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('log-' || substr(md5(random()::text), 1, 14)),
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    target TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs (timestamp DESC);

-- 7. CLOUD HOSTING WAITLIST TABLE
CREATE TABLE IF NOT EXISTS public.hosting_waitlist (
    id TEXT PRIMARY KEY DEFAULT ('hwl-' || substr(md5(random()::text), 1, 12)),
    email TEXT NOT NULL UNIQUE,
    tier VARCHAR(30) NOT NULL DEFAULT 'professional',
    queue_number INTEGER NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.hosting_waitlist (email);

