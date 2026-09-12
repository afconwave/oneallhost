# Oneallhost: Enterprise African Domain Registrar & Cloud Infrastructure Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)
[![Turbo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444.svg)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) 

**Oneallhost** is a high-performance, ICANN-compliant domain registrar, cloud hosting, and staging infrastructure platform purpose-built for African and global entrepreneurs. It bridges international top-level domains (gTLDs, ccTLDs) with seamless African Mobile Money rails (MTN MoMo, Orange Money, Wave), Anycast DNS routing, developer staging rentals with 100% purchase rebates, and automated account wallets.

---

## 1. Monorepo Architecture

The repository is structured as a Turborepo monorepo powered by PNPM workspaces:

```
oneallhost/
├── apps/
│   ├── api/                    # Express API Gateway (Port 4000)
│   │   ├── src/
│   │   │   ├── middleware/     # Rate limiting, idempotency, security headers
│   │   │   ├── routes/         # Domains, tools, users, payments, rentals, invoices
│   │   │   ├── services/       # Namecheap XML registrar & DNS adapters
│   │   │   └── server.ts       # Main API entrypoint
│   └── web/                    # Next.js 16 App Router Frontend (Port 3000)
│       ├── public/             # Static assets, branding, payment icons
│       └── src/
│           ├── app/            # 81+ full-featured routes & tools
│           ├── components/     # Design system, navigation, search bars, footer
│           └── lib/            # Geo-currency detection & payment registries
├── packages/
│   ├── config/                 # Shared TypeScript and ESLint configurations
│   ├── db/                     # In-process computed state engine & real ledgers
│   ├── payments/               # Swychr Direct API & 18-country currency rates
│   └── ui/                     # Reusable design tokens, buttons, badges, tables
├── SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md # Master audit & completion blueprint
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 2. Core Platform Capabilities

### 🌐 Real-Time Domain Registration & Anycast Search
- Real-time availability checks across **400+ TLDs** (.com, .cm, .org, .net, .io, .ai, .tech, .store, .africa, etc.).
- Sub-3-minute Anycast DNS propagation with integrated WHOIS privacy masking.
- Live Namecheap XML API client with automatic Anycast fallback generation.

### 🔍 WHOIS & RDAP Diagnostics Suite (`/domains/whois`, `/whois`)
- Live RDAP protocol querying authoritative root and registry servers.
- Returns clean parsed registrar names, registration/expiration timestamps, nameservers, domain status codes, and raw JSON payloads.

### ⚡ "Is WP Site" WordPress & Tech Stack Detector (`/tools/is-it-wp`, `/is-it-wordpress`)
- Deep DOM inspection engine detecting WordPress core version, active themes, installed plugins, caching headers (LiteSpeed, Cloudflare, WP Rocket), and web server technologies.
- Protected by built-in **SSRF mitigation** against private and cloud metadata endpoints.

### 🔄 Developer Subdomain Staging Rentals (`/domains/rentals`, `/rentals`)
- Hourly staging domain leasing (`*.oneall.app`) for development and client approvals.
- **100% Purchase Rebate Engine**: Every dollar spent on staging leases is automatically credited toward the permanent purchase of the domain name.

### 💳 Native African Mobile Money & Multi-Rail Checkout (`/checkout`)
- Live checkout integration supporting **18 African nations** via Swychr Direct API:
  - **Cameroon (CM)**: MTN Mobile Money & Orange Money (XAF)
  - **Ivory Coast (CI), Senegal (SN), Benin (BJ), Togo (TG)**: Wave & Orange Money (XOF)
  - **Nigeria (NG)**: Bank Transfer & NGN Rails
  - **Ghana (GH)**: MTN MoMo & AirtelTigo (GHS)
  - **Kenya (KE), Uganda (UG), Rwanda (RW), Tanzania (TZ)**: M-Pesa, MTN, Airtel (KES, UGX, RWF, TZS)
- Credit/Debit Cards (Visa, Mastercard, AMEX) and **Tether USDT (TRC-20)**.

### 💰 Account Wallet & Auto-Debit Engine (`/dashboard/billing`)
- Real-time user wallet balance in both USD and XAF.
- Interactive **Top-Up Balance** modal (Mobile Money, Card, USDT).
- Direct **Pay with Account Balance** option at checkout.
- **Auto-Debit for Renewals**: Automated debit toggle renewing domains 7 days prior to expiry.
- Official itemized PDF tax receipts with verified VAT/NIU identifiers.

### 🛡️ Production Security & Threat Protection
- **SSRF Defense**: Strict filtering preventing requests to `localhost`, `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, and cloud metadata (`169.254.169.254`).
- **Security Headers**: Injected `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Zero Console Logging in Production**: Build pipeline strips client console statements.
- **Safe Global Error Handling**: Suppresses internal stack traces from client responses.

---

## 3. Quick Start & Development Setup

### Prerequisites
- **Node.js**: v20.x or v24.x LTS
- **PNPM**: v9.x or v10.x (`npm install -g pnpm`)

### Installation & Build

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/oneallhost/oneallhost.git
   cd oneallhost
   pnpm install
   ```

2. Compile all shared workspace packages and applications:
   ```bash
   pnpm build
   ```

3. Launch development servers:
   ```bash
   # Terminal 1: Launch Next.js Web Frontend (Port 3000)
   pnpm dev:web

   # Terminal 2: Launch Express API Gateway (Port 4000)
   pnpm dev:api
   ```

4. Open your browser and navigate to:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **API Gateway**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
   - **API Health Check**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 4. Environment Variables

Create `.env` in `apps/api` (and optionally `apps/web`):

```ini
# --- API Gateway Configuration ---
PORT=4000
NODE_ENV=development

# --- Namecheap Live Registrar Credentials ---
NAMECHEAP_API_USER=your_api_user
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_USERNAME=your_username
NAMECHEAP_CLIENT_IP=your_whitelisted_ip
NAMECHEAP_BASE_URL=https://api.namecheap.com/xml.response

# --- Swychr African Payment Gateway Credentials ---
SWYCHR_CLIENT_ID=your_swychr_client_id
SWYCHR_CLIENT_SECRET=your_swychr_client_secret
SWYCHR_BASE_URL=https://auth.swychr.com

# --- Email & Transaction Notifications ---
SMTP_HOST=mail.oneallhost.com
SMTP_PORT=587
SMTP_USER=billing@oneallhost.com
SMTP_PASS=your_secure_password
```

---

## 5. API Gateway Reference (`/api/v1`)

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/domains/search` | `GET` | Multi-TLD real-time domain availability search |
| `/api/v1/domains/register` | `POST` | Execute live ICANN domain registration |
| `/api/v1/domains/whois/lookup` | `GET` | Live RDAP/WHOIS registry query |
| `/api/v1/tools/is-wp` | `GET` | WordPress, theme, plugin, and stack inspector (SSRF-guarded) |
| `/api/v1/tools/dns-lookup` | `GET` | Live DNS zone record resolver (A, AAAA, CNAME, MX, NS, TXT, SOA) |
| `/api/v1/tools/ssl-checker` | `GET` | TLS socket certificate expiration and issuer inspector |
| `/api/v1/users/me` | `GET` | Get authenticated user profile, wallet balance, and auto-debit status |
| `/api/v1/users/wallet/topup` | `POST` | Top-up account wallet balance via Mobile Money, Card, or USDT |
| `/api/v1/users/wallet/pay` | `POST` | Settle domain or service order using account wallet balance |
| `/api/v1/users/wallet/auto-debit`| `PUT` | Toggle automated renewal debit status |
| `/api/v1/payments/create-direct-payment`| `POST` | Initiate African Mobile Money PIN push collection |
| `/api/v1/payments/webhook` | `POST` | Idempotent payment settlement callback |
| `/api/v1/rentals/create` | `POST` | Provision developer staging subdomain lease |
| `/api/v1/rentals/convert` | `POST` | Convert staging lease to domain registration with 100% rebate |
| `/api/v1/health` | `GET` | Gateway liveness, memory, and uptime heartbeat |

---

## 6. Legal & Operating Policies

Oneallhost operates under strict ICANN consensus policies and international data protection standards:

- **[Terms and Conditions](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/terms/page.tsx)** (`/terms`): Universal Master Services Agreement governing domain registrations, cloud hosting, and developer leases.
- **[Privacy Policy](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/privacy/page.tsx)** (`/privacy`): GDPR & African Data Protection compliance framework.
- **[Refund & Cancellation Policy](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/refund-policy/page.tsx)** (`/refund-policy`): 30-day hosting money-back guarantee and non-refundable registry fee guidelines.
- **[UDRP Policy](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/udrp/page.tsx)** (`/udrp`): ICANN Uniform Domain-Name Dispute-Resolution Policy.
- **[Domain Registration Data Disclosure Policy](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/domain-registration-data-disclosure-policy/page.tsx)** (`/domain-registration-data-disclosure-policy`): Protocol for legal and trademark WHOIS data disclosures.
- **[Cookie Preferences](file:///c:/Users/DELL/Desktop/PRJ/oneallhost/apps/web/src/app/cookie-preferences/page.tsx)** (`/cookie-preferences`): Interactive client privacy and cookie consent preferences.

---

## 7. License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

Copyright © 2026 Oneallhost, Inc. All rights reserved.
