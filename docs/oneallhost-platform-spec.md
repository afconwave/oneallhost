# Oneallhost — platform specification

Domain selling, short-term domain/site rental, and hosting, unified under one Altonixa Group product. This document is the single source of truth for design, architecture, and build sequencing — hand it to any designer, frontend, or backend engineer joining the project.

---

## 1. Brand

**Name:** Oneallhost
**Wordmark:** "One" (black) + "all" (green) + "host" (blue), set in a single medium weight
**Mark:** circular ring in a green→blue gradient, with a black "1" forming the O

### Color system (derived from the logo, white-first)

| Token | Hex | Use |
|---|---|---|
| `--brand-blue-deep` | `#0D3B85` | Primary buttons, header accents, links |
| `--brand-blue` | `#1B6FC9` | Secondary actions, hover states, chart accents |
| `--brand-green` | `#7CB342` | Success, "available", active status — never decorative |
| `--ink` | `#111111` | All body text and headings — true black, not a tinted gray |
| `--surface-0` | `#FFFFFF` | Page canvas — the base every screen sits on |
| `--surface-1` | `#FAFAF9` | Cards, panels, sidebar — barely-there lift off the page |
| `--surface-2` | `#F3F4F1` | Nested/inset elements — zebra rows, input backgrounds, hover states |
| `--border-hairline` | `#EBEBE7` | 1px dividers — barely visible, structural only |
| `--border-strong` | `#DCDDD8` | Input borders, card outlines — still light, never heavy |
| `--text-secondary` | `#6B6E68` | Muted labels, captions |

**Rules:**
- The page is white. Elements *on* the page get a whisper of elevation via `--surface-1`/`--surface-2`, never a visible drop shadow and never a hard gray block — the difference between page and card should be felt more than seen. Flat white on every single element, with no elevation step at all, reads as flat and templated at scale — vary it subtly instead.
- Blue carries almost all interactive weight. Green is rationed strictly to positive/success states so it stays meaningful.
- No gradients outside the logomark itself. No drop shadows — hairline borders only.
- Black stays black. No softened near-black grays for body text.

### Thin, light-weight UI — not thick/blocky

Avoid the "generated app" look of oversized buttons, heavy rounded cards, and thick borders:

- **Borders:** 1px hairlines everywhere, never 2px+ except the single 2px accent border reserved for a highlighted/featured state.
- **Buttons:** compact height (36–40px, not 48px+), medium-weight label, generous horizontal padding rather than a tall block. Ghost/outline as the default; solid blue reserved for the one primary action per screen.
- **Cards:** thin border or barely-there `--surface-1` fill instead of a bordered box with heavy padding — let whitespace do the separating, not thick containers.
- **Corner radius:** small and consistent (6–8px) — not the oversized 16–24px rounding that reads as a template default.
- **Type weight:** two weights only, 400 and 500 — never 600/700 anywhere, which reads heavy against a light surface system.
- **Icons:** thin/outline stroke weight only, never filled or bold icon sets.
- **Density:** favor a compact, information-dense layout (especially in the dashboard and admin panel) over generous "SaaS landing page" whitespace between every element — this is a working tool, not a hero section.

### What "no AI feel" means here, concretely

Avoid the three current AI-design defaults entirely:
1. Warm cream background + high-contrast serif + terracotta/clay accent.
2. Near-black background + single acid-green or vermilion accent.
3. Zero-radius broadsheet layout with dense hairline columns.

Concrete rules to enforce instead:
- **No gradient buttons or gradient cards.** Flat fills only.
- **No glassmorphism, no blur, no glow.**
- **One accent doing the interactive work (blue), one reserved for meaning (green).** Never a rainbow of accent colors on one screen.
- **Icons: one family, one stroke weight, throughout.** Pick Phosphor or a licensed premium set over default Font Awesome/Heroicons — mixing icon families is the fastest tell of a stitched-together product.
- **Typography carries personality — don't default to system UI font everywhere.** Pair a confident sans for headings with a clean workhorse sans for body/data (see §2).
- **Numbered steps (01/02/03) only when order is real** (onboarding, a checkout flow) — never as decoration.
- **Motion is restrained and purposeful:** a subtle fade/slide on page load, hover states on interactive elements, nothing ambient or looping in the dashboard. Respect `prefers-reduced-motion`.
- **Copy is plain and specific**, written from the user's side: "Domain registered" not "Your domain has been successfully registered!" No exclamation points in system copy. Errors say what happened and what to do — never apologize, never show a raw exception.

### Logo usage

| Context | Variant | Notes |
|---|---|---|
| Site header / dashboard header | Horizontal lockup (ring + "Oneallhost" wordmark side by side) | ~28–32px mark height, left-aligned, always on white |
| Browser favicon / tab icon | Ring mark alone, no wordmark | Simplify to the ring + "1" only — the three-color wordmark won't read at 16–32px |
| Mobile app icon / social avatar | Stacked lockup (ring above wordmark) or ring alone | Use the stacked version already produced; ring alone if the square needs to stay uncluttered |
| Invoices & transactional email | Horizontal lockup, small, top-left | No decorative use elsewhere in the email — see §7 |
| Footer (marketing site) | Horizontal lockup, muted/smaller than header | Pair with legal links, not restated taglines |
| Loading states / splash | Ring mark alone, static — do not spin or animate it as a loading spinner | An animated ring reads as generic/templated; use a plain progress bar instead |
| Partner/press mentions | Horizontal lockup only, untouched | Never recolor, outline, or place on a busy background |

**Clearspace:** minimum clearspace around the mark equal to the height of the "O" ring on all sides — never let text, borders, or other UI elements enter that zone.

**Minimum size:** ring mark never below 16px (favicon floor); horizontal lockup never below ~90px wide — below that, drop to ring-only rather than shrinking the wordmark until it's illegible.

**Backgrounds:** logo only ever sits on `--surface-0` (white) or `--surface-1` from §1. Never place it on a colored fill, photo, or gradient background — if a colored header background is ever needed for a special page, use a reversed/white-only version of the mark, not the full-color version.

**What not to do:** no recoloring the wordmark to match a themed section, no stretching/distorting the ring, no adding drop shadows or glow behind it, no cropping the ring.

- **Display / headings:** a confident geometric or grotesk sans with real character (e.g. a licensed face like "General Sans," "Söhne," or "Inter Display" at weight 500–600) — not the default system font stack.
- **Body / UI:** a clean, highly legible sans at weight 400/500 only (e.g. "Inter" or "IBM Plex Sans"). Two weights maximum in the whole product.
- **Data / code / invoices:** a monospace for anything tabular-numeric (prices, domain expiry countdowns, API keys) — e.g. "IBM Plex Mono."

---

## 2. System overview

```
                     ┌─────────────────────────┐
                     │   Marketing site (SSR)   │
                     └────────────┬─────────────┘
                                  │
┌────────────┐     ┌─────────────▼─────────────┐     ┌──────────────────┐
│  Client     │────▶│      Web app (SPA/SSR)     │────▶│   API gateway      │
│  dashboard  │     │  domains · rentals · hosting│     │  (backend service)│
└────────────┘     └────────────────────────────┘     └─────────┬─────────┘
                                                                  │
        ┌─────────────────────┬─────────────────┬────────────────┼─────────────────┬───────────────┐
        ▼                     ▼                 ▼                ▼                 ▼               ▼
   Supabase (DB,        Redis (cache,      ResellerClub      Altonixa Pay      SMTP (transactional  Hosting
   auth, storage)        queues, rate      API (domains,     (card, MoMo,      email — receipts,     control plane
                          limiting)          DNS)              crypto)          renewal notices)      (WHM/Plesk
                                                                                                        reseller or
                                                                                                        custom later)
```

### Monorepo layout

```
oneallhost/
├── apps/
│   ├── web/                 # marketing site + client dashboard (Next.js)
│   ├── admin/                # internal admin/ops dashboard
│   └── api/                  # backend service (Node/NestJS or similar)
├── packages/
│   ├── ui/                   # shared design system components
│   ├── config/                # shared eslint, tsconfig, tailwind tokens
│   ├── db/                    # Supabase schema, migrations, generated types
│   └── payments/               # Altonixa Pay SDK wrapper (card, MoMo, crypto)
├── infra/
│   ├── supabase/               # local dev config, migrations
│   ├── redis/                   # queue/cache config
│   └── deploy/                   # CI/CD, environment configs
└── docs/
    └── oneallhost-platform-spec.md   # this file
```

Use a workspace tool (pnpm workspaces or Turborepo) so `apps/*` share `packages/ui` and `packages/config` without duplication — this keeps the dashboard, admin panel, and marketing site visually and structurally identical.

---

## 3. Core stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js (React) | SSR for marketing/SEO, client-side for dashboard interactivity, one framework for both |
| Styling | Tailwind CSS, tokens mapped to the brand palette in §1 | Fast, consistent, easy to enforce the token system across apps |
| Database / Auth / Storage | Supabase (Postgres) | Auth (email, magic link, OAuth), row-level security per client, file storage for invoices/certs |
| Cache / Queue / Rate limit | Redis | Domain-availability search result caching, background job queue (renewals, rental expiry, DNS propagation checks), API rate limiting |
| Backend API | Node.js service (NestJS or Fastify) | Talks to ResellerClub API, Altonixa Pay, Supabase, and Redis; the only thing with the ResellerClub reseller credentials |
| Email | SMTP (transactional) | Receipts, renewal reminders, rental-expiry warnings, password resets |
| Payments | Altonixa Pay | Unified card, MTN MoMo / Orange Money, and crypto payment — single checkout component reused across domains, rentals, and hosting |
| Domain registry | Namecheap API & ResellerClub API | Live XML/JSON integration for availability checking (`namecheap.domains.check`), automated registrations (`namecheap.domains.create`), renewals, and Anycast DNS management |

---

## 4. Data model (core entities)

- `users` — Supabase auth users, extended with `profiles` (name, phone, country, KYC status if needed for crypto)
- `domains` — domain name, owner (user_id), registrar reference id, status, expiry date, auto_renew
- `rentals` — domain/subdomain being rented, renter (user_id), start/end timestamp, duration_type (day/week/month), status
- `hosting_plans` — plan tier, provisioning status, linked domain_id (nullable at first, since hosting launches after domains/rentals)
- `orders` — polymorphic: type (domain_purchase / rental / hosting), amount, payment_method (card/momo/crypto), status
- `payments` — Altonixa Pay transaction reference, order_id, status, method
- `invoices` — invoice number (sequential, per §8f), order_id, PDF storage path, issued_date, currency, amount, tax_amount if applicable
- `dns_records` — cached mirror of DNS state per domain for fast dashboard reads (source of truth is still the registrar)

---

## 5. Dashboards

### 5.1 Client dashboard (`apps/web`, authenticated)

Sidebar: **Overview · Domains · Rentals · Hosting · Billing · Support**

- **Overview** — stat cards (active domains, active rentals, hosting plans, next renewal due), recent activity table.
- **Domains** — search bar (calls ResellerClub availability), owned domains list with expiry/auto-renew toggle, DNS record management per domain.
- **Rentals** — active rentals with countdown to expiry, "extend" and "convert to full domain purchase" actions (the upsell path from §1 of the product idea).
- **Hosting** — empty/invitation state until hosting launches ("Hosting is coming — join the waitlist"), then plan management once live.
- **Billing** — order history, invoices (downloadable), saved payment methods, Altonixa Pay transaction log.
- **Support** — ticket form, FAQ.

### 5.2 Admin dashboard (`apps/admin`, internal/ops)

Sidebar: **Overview · Clients · Domains · Rentals · Hosting · Payments · System health**

- **Overview** — revenue, active clients, domains under management, rental utilization.
- **Clients** — full client list, impersonate-for-support action, KYC status if applicable.
- **Domains / Rentals / Hosting** — full inventory views with override actions (manual renew, force-expire, refund).
- **Payments** — Altonixa Pay reconciliation view across card/MoMo/crypto, failed payment retries.
- **System health** — Redis queue status, ResellerClub API error rate, SMTP delivery status.

### 5.3 Marketing site (`apps/web`, public)

Home → domain search (the primary CTA, GoDaddy-pattern but restyled per §1) → pricing → rentals explainer → hosting waitlist → about (Altonixa Group).

---

## 6. Build sequencing

1. Monorepo scaffold + design tokens/component library (`packages/ui`) — build once, reuse everywhere.
2. Supabase schema + auth (users, domains, orders, payments tables).
3. ResellerClub API integration behind the backend service (search, register, renew, DNS).
4. Client dashboard: Domains tab end-to-end (search → checkout → manage).
5. Altonixa Pay integration (card + MoMo first, crypto can follow once the checkout component is stable).
6. Rentals tab (subdomain/landing-page leasing layer, timed expiry via Redis-backed jobs).
7. Admin dashboard.
8. SMTP transactional flows (receipts, renewal/expiry reminders).
9. Hosting layer (reseller hosting account behind the scenes, own control plane later).

---

## 7. Imagery

Where images appear, and the rule for each — imagery is one of the fastest places a product reads as templated or AI-generated, so treat it as deliberately as color.

| Area | What goes there | Rule |
|---|---|---|
| Marketing home — hero | No stock photo of "a person smiling at a laptop." Either a real product screenshot (the domain search bar in action) or an abstract mark built from the brand system (the ring motif, extended into a simple graphic) | Product-first, not lifestyle-stock-first |
| Marketing — feature sections | Actual UI screenshots/mockups of the dashboard, cropped tight to the relevant panel | Never generic icon-in-a-circle illustrations for every feature — that's a template tell |
| Marketing — "how rentals work" explainer | A simple custom diagram (timeline: rent → use → convert to purchase), built in the brand palette | Not a stock photo of a calendar or clock |
| Pricing page | No imagery — type and a table do the job | — |
| Dashboard — empty states (no domains yet, no rentals yet) | A single-color line illustration in `--brand-blue` or `--ink`, matching the icon set's stroke weight | Never a generic "empty box" clipart or a stock photo |
| Dashboard — avatars | Initials-in-a-circle (as in the mockup) by default; real photo only if the client uploads one | Never a placeholder stock headshot |
| Client onboarding / KYC (crypto) | Real document capture UI only — no decorative imagery on these screens, they should feel secure and minimal | — |
| Transactional email (SMTP) | Wordmark only in the header, no banner photography | Keep emails text-forward and fast to scan |
| Admin dashboard | No decorative imagery anywhere — data density over visual flourish | — |
| 404 / error pages | A single simple line-art mark in brand colors, not a generic "lost astronaut" or "broken robot" illustration | Avoid the illustration-pack cliché entirely |

**Sourcing rule:** if a real photo is ever needed (about page, team, physical office), it must be an actual photo of the actual thing — never generic stock photography of unrelated people/offices. Generic stock is as strong a "not a real company" signal as a gradient button.

**Icon-vs-illustration boundary:** the icon set from §1 (one family, one stroke weight) covers all functional UI (nav, buttons, status). Illustrations are reserved for empty states and the marketing explainer only, and must be built in the same stroke weight and palette as the icon set — never a mismatched illustration style dropped in from a generic pack.

---

## 8a. Compliance & legal

- **WHOIS privacy** on by default for every registration (ResellerClub supports this per-TLD — confirm coverage per TLD you sell).
- **60-day registrar lock** after initial registration and after any transfer — surface this in the dashboard so clients aren't confused when a transfer is blocked.
- **Expiry lifecycle must be explicit**, not just a "renew" button:
  - 30 / 15 / 1 day-before-expiry reminders (email via SMTP)
  - grace period after expiry (domain still renewable at normal price)
  - redemption period after that (higher fee, registry-dependent)
  - final loss/release — state this plainly in the dashboard's domain detail view, not buried in a tooltip
- **Required legal pages before accepting any payment:** Terms of Service, Privacy Policy, Refund/Cancellation Policy. None of these exist yet — draft before launch, not after.
- **Payment compliance in Cameroon:** confirm requirements for mobile money and crypto payment processing, and whether VAT or other tax applies to digital services sold locally — check with a local accountant/lawyer, this spec is not a substitute for that.
- **Crypto-specific:** if Altonixa Pay's crypto option is live at launch, decide the KYC threshold (if any) and transaction monitoring approach before enabling it, not after volume arrives.

## 8b. Localization

- **English is primary** (international default), **French is required as a strong secondary** — the company is headquartered in Yaoundé and Cameroon is bilingual, but the product is international in reach, so the marketing site and dashboard should default to English with a clear language switch to French, not the reverse.
- Build i18n into the frontend from the start (e.g. `next-intl` or similar) — retrofitting translated routes and copy later is expensive. Every UI string from day one goes through the i18n layer, even before French copy is written.
- Additional languages are a fast-follow decision based on where real customer demand actually shows up, not built speculatively at launch.

## 8c. Currency & billing details

- **USD as the customer-facing default**, given international reach — with regional local-currency display where it matters most (XAF for Cameroon/CEMAC customers, since that's where mobile money payment happens) rather than XAF as the global default.
- **XAF or USD as the internal accounting/base currency** (a company decision independent of what customers see) for tracking ResellerClub wholesale cost, margin, and tax reporting — decide this with your accountant given the Yaoundé tax residency.
- Wholesale prices from ResellerClub typically come back in USD — the backend needs a defined conversion/markup step before display, not an ad hoc one, and this is simpler if USD is already the customer-facing default.
- Invoices must show the currency and, if conversion happened, the rate used at time of purchase (for dispute resolution).

## 8d. Security & operations

- **Secrets management:** ResellerClub API keys, Altonixa Pay keys, and SMTP credentials live in a secrets manager (not committed `.env` files, not hardcoded) — one line in CI/CD setup, easy to skip if not stated explicitly.
- **Backups & disaster recovery:** define a Supabase backup schedule once real client domains and payment records are stored — this is client financial and ownership data, not disposable.
- **Observability:** add error tracking (e.g. Sentry) and structured logging from the start, especially around ResellerClub API calls — a silent failed domain registration after payment is the worst-case support ticket.
- **Audit log:** admin actions (manual renew, force-expire, refund) should be logged with who/when — needed for support disputes and eventually for compliance.

## 8e. Product gaps to decide before build

- **Rental cancellation/refund policy** — what happens if a client rents a subdomain and wants out early? Define before the Rentals tab ships, not after the first support ticket.
- **Support/ticketing for v1** — decide now whether the "Support" tab is a real ticketing system or email-to-inbox for launch; don't let it stay an undefined stub through to release.
- **Domain transfer-in flow** — clients bringing an existing domain from another registrar isn't currently in the data model or dashboard; decide if this is in scope for v1 or a fast-follow.

## 8f. Invoices & receipts

Every paid order (domain purchase, rental, hosting) generates a matching invoice — this needs its own defined pipeline, not an afterthought bolted onto the payments table.

**Generation**
- Trigger: on payment success (Altonixa Pay webhook confirms → backend generates the invoice), not on order creation — never invoice an unpaid order.
- Rendering: generate as PDF server-side (e.g. a headless HTML-to-PDF step in the backend service, styled with the same brand tokens from §1 — wordmark top-left per the logo usage rules, `--ink` text, thin hairline table borders, no decorative imagery per §7).
- Numbering: sequential invoice numbers per your accounting requirements (e.g. `ONH-2026-000142`) — not the raw order UUID, which isn't acceptable on a legal financial document in most jurisdictions.

**Content, minimum required fields**
- Oneallhost/Altonixa Group legal entity name, address, tax ID (if applicable)
- Client name and billing details
- Line items: what was purchased (domain name / rental period / hosting plan), unit price, quantity, subtotal
- Currency and, if a conversion happened (per §8c), the rate used at time of purchase
- Tax line if VAT or other tax applies — zero-rated shown explicitly if not applicable, not just omitted
- Payment method used (card / MoMo / crypto) and transaction reference from Altonixa Pay
- Issue date and, for renewals, the service period covered

**Storage & delivery**
- Store the generated PDF in Supabase Storage, one file per invoice, referenced by the `invoices` table — never regenerate on every view, generate once and serve the stored file.
- Email the PDF as an attachment via SMTP immediately on generation (the receipt).
- Also list every invoice in the dashboard's **Billing** tab (§5.1) with a download link — clients should never have to search their email for a past invoice.
- Admin dashboard's **Payments** view (§5.2) needs a matching invoice lookup for support/reconciliation.

**Credit notes / refunds**
- A refund (full or partial) issues a linked credit note referencing the original invoice number — don't silently edit or delete the original invoice record; financial documents are append-only.

## 8g. Auth & access control

- **Roles:** client, support staff, and admin as distinct Supabase roles with row-level security policies — not one flat "user" table with an `is_admin` boolean checked ad hoc in application code.
- **2FA:** required for all admin and support-staff accounts (they can see client data and issue refunds); optional but encouraged for clients, given the account controls real domains and payment methods.
- **Session policy:** define token expiry and refresh behavior now — shorter sessions for admin, standard for clients — and force re-authentication before sensitive actions (refund, DNS change, account email change).
- **Support impersonation** (mentioned in §5.2) needs an explicit audit trail — every impersonated session logged with which staff member, which client, when.

## 8h. Deployment & environments

- **Where each piece runs is undefined** — decide now: Next.js apps and the API service on Vercel/a managed platform, or self-hosted from the start since this is meant to grow into your own hosting company? Either is valid, but the spec needs to say which.
- **Three separate environments minimum:** local dev, staging (for testing against ResellerClub's sandbox and Altonixa Pay's test mode), and production. Never test against live ResellerClub or live payment rails.
- **Managed Redis and Supabase project separation per environment** — staging and production must not share a database or cache instance.
- **CI/CD:** Turborepo's caching (per the stack discussion) plus a defined pipeline — lint/test/build on every PR, deploy to staging on merge, manual promote to production.

## 8i. Fraud & abuse prevention

- **Rate limiting per account/IP** on domain search and checkout (Redis-backed) — bulk automated registration attempts are a known abuse pattern in domain reselling.
- **Card-testing detection:** small, rapid, repeated failed-then-successful charges on a new account is a common fraud signature — flag for manual review before the domain registers, not after.
- **Manual review queue in the admin dashboard** for orders flagged as suspicious (new account + high-value domain + first-time payment method), rather than auto-approving everything that clears payment.
- **Mobile money fraud patterns** are region-specific — worth a conversation with Altonixa Pay's own fraud tooling (since it's your in-house processor) about what's already covered versus what this platform needs to add.

## 8j. Domain search UX

The spec currently just says "search bar" — real behavior needed:
- **Alternative TLD suggestions** when the exact `.com` (or requested TLD) is taken — e.g. suggest `.co`, `.io`, or a local ccTLD alternative.
- **Premium/aftermarket domain handling** — some available domains carry a premium price far above standard registration; the search results and checkout need to show and honor that distinctly, not apply your standard markup formula to a premium-priced domain.
- **Bulk search** — let a client check multiple names at once (useful for agencies/businesses naming-brainstorming), not just one at a time.

## 8k. Notifications beyond email

- SMTP (§3) covers email, but renewal/expiry/rental-ending reminders should not rely on email alone in a mobile-money-heavy market where people check phones more than inboxes.
- **In-app notifications** (bell icon already in the dashboard header mockup) — surface renewal-due, rental-ending, and payment-failed events there, not just in an inbox.
- **SMS as a fast-follow, not v1** — worth planning for even if not built immediately, since it's likely the highest-open-rate channel for this market; note it as a planned integration point rather than building it day one.

## 8l. Accessibility specifics

§9's "keyboard-navigable" needs concrete targets, not just a stated intention:
- **Color contrast:** verify `--brand-green` (#7CB342) and `--brand-blue` (#1B6FC9) against white and against `--surface-1`/`--surface-2` meet WCAG AA (4.5:1 for body text, 3:1 for large text/UI components) — green in particular tends to fail contrast checks at lighter tints.
- **Visible focus states** on every interactive element, styled in the brand system (not the browser default blue outline, but not removed either).
- **Icon-only buttons** (search, notification bell, etc.) need `aria-label`s — nothing conveyed by icon alone without a text alternative.
- **Form errors** announced to screen readers, not just shown visually in red.

## 8m. Analytics

- No product analytics defined yet. At minimum, track the core conversion funnel: search → domain added to cart → checkout started → payment completed — per channel (card/MoMo/crypto) and per domain type (standard/premium/rental).
- Decide on a tool (e.g. PostHog, Plausible, or similar) and whether client-level analytics data needs to stay within Cameroon/regional hosting for any compliance reason (revisit alongside §8a).

## 8n. Business & market analysis

This document has been entirely technical/design so far — no competitive positioning or cost structure has been captured anywhere. Adding it here since it should drive some of the technical decisions above (pricing display, markup engine in §2, which TLDs to prioritize).

**Competitive positioning**
- Direct competitors for the domain+rental+hosting bundle in your market: GoDaddy, Hostinger, Namecheap (global, card-only or weak local payment support), plus any Cameroon/CEMAC-region hosting providers already operating locally.
- Your stated differentiators from earlier in this conversation: mobile money at checkout (MTN MoMo, Orange Money), the rental product (no major competitor offers short-term domain/site leasing), and Altonixa Pay's crypto option. Worth explicitly naming a fourth if one exists — e.g. French-language support, or being an Altonixa Group product with existing client trust from 360Class/GIVAM/Njango.
- Decide and document your actual value proposition sentence — the spec should be able to answer "why Oneallhost over Hostinger" in one line, and that line should shape the marketing site's hero copy in §1.

**Cost structure & margin**
- ResellerClub wholesale cost per TLD (varies by TLD — `.com` differs from `.africa` or `.cm`) minus what you charge = your margin per domain sale. This needs modeling before the markup engine (§2) is built, not decided ad hoc later.
- Altonixa Pay processing fees per method (card vs MoMo vs crypto likely differ) eat into that margin — factor them into pricing, not just registrar cost.
- Rental pricing needs its own margin model — you're not paying ResellerClub per rental (it's your own subdomain/landing infrastructure), so the pricing logic here is closer to a SaaS pricing decision than a resale markup.
- Eventual hosting margin, once that layer launches, depends on which reseller hosting tier you start on (per the earlier no-fee-entry discussion) — revisit cost modeling at that stage rather than guessing now.

**Market sizing (directional, worth a real look before launch)**
- This is an international product headquartered in Yaoundé, Cameroon — not a Cameroon-only play. That changes several earlier sections:
  - **§8b Localization:** French and English cover the home base, but international reach likely means English needs to be the default/primary language for the marketing site and dashboard, with French as the strong secondary — not the reverse. Add further languages only where real demand shows up.
  - **§8c Currency:** international customers will expect USD or their own local currency options, not XAF as the default. Reconsider XAF as the *base* currency for internal accounting/ResellerClub cost tracking, while the customer-facing price defaults to USD (or auto-detected by region) with local currency shown where relevant.
  - **§8a Compliance:** Cameroon-specific payment/tax rules (mobile money, VAT) still apply to Cameroon-based customers and to the company's own tax residency, but don't assume they're the only jurisdiction that matters — international card and crypto payments may trigger other countries' consumer protection or tax obligations depending on where customers are. Worth broader legal review, not just local.
- Addressable market is therefore two-tiered: **home market** (Cameroon/CEMAC — mobile money is the differentiator, rental product likely resonates most) and **international market** (global — differentiators are more likely pricing, crypto payment option, and service quality, since MoMo/Orange Money aren't relevant outside the region).
- Given the mobile-money-first home market plus a global reach, expect the rental product and eventual hosting layer to be the differentiators locally, while price and crypto payment support are more likely to be what wins international customers away from GoDaddy/Hostinger/Namecheap.

**Not something to guess in a spec document** — this section is a placeholder for real numbers (actual ResellerClub & Namecheap per-TLD costs, actual payment fee schedules, actual local market data) that should replace the directional notes above before they inform pricing decisions.

## 8o. Namecheap API integration specifications

- **API Architecture:** Direct HTTP-GET XML service endpoint for automated domain operations:
  - **Sandbox:** `https://api.sandbox.namecheap.com/xml.response`
  - **Production:** `https://api.namecheap.com/xml.response`
- **Core Commands Implemented:**
  - `namecheap.domains.check`: Live batch domain availability checking across requested TLDs.
  - `namecheap.domains.create`: Instant domain registration with contact parameters.
  - `namecheap.domains.renew`: Domain renewal and expiration extension.
  - `namecheap.domains.dns.setHosts`: DNS zone file host management (A, CNAME, MX, TXT).
  - `namecheap.domains.dns.setCustom`: Nameserver delegation.
- **Security & Whitelisting:**
  - Namecheap API access requires whitelisting the server's public IPv4 address in the Namecheap dashboard (`Profile > Tools > Business & Dev Tools > Namecheap API Access > Whitelisted IPs`).
  - Secrets stored server-side via `NAMECHEAP_API_KEY`, `NAMECHEAP_API_USER`, `NAMECHEAP_CLIENT_IP`, and `NAMECHEAP_SANDBOX`.

---

## 10. Non-negotiables

- Every screen: white page canvas with subtle layered surfaces (never flat-white-on-flat-white, never heavy gray blocks), thin 1px hairline borders, one accent color doing interactive work, black text.
- No screen ships with a gradient background, drop shadow, or mixed icon family.
- Every button label is a verb ("Register domain," not "Submit").
- Every error names what happened and what to do next — no raw stack traces, no apologies.
- Mobile-responsive and keyboard-navigable from day one, not retrofitted.
