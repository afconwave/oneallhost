# Oneallhost security status

Date: 2026-09-29  
Ref: `main` after follow-up hardening.

This file replaces the previous “production ready” system audit. That document overstated live hosting, mail, VPS, and payment status and is removed from the tree.

## Do this first (ops, not code)

1. Rotate the Swychr API key that was previously committed. Treat every historical clone as compromised.
2. Set runtime secrets: `JWT_SECRET`, `SWYCHR_API_KEY`, `SWYCHR_WEBHOOK_SECRET`, `CORS_ORIGINS`, Namecheap credentials.
3. Run `infra/sql/001_auth_columns.sql` on Supabase so `password_hash` and `totp_secret` exist.
4. Git history still contains the old key. Removing it from HEAD is not enough. Use `git filter-repo` / BFG and force-push only if you accept rewriting `main`. Rotation is mandatory either way.

## Closed in code (this pass + prior hardening)

- Staff routes require a signed JWT (`requireStaff`).
- Customer register/login require a real password. Tokens are HMAC-signed.
- Customer login UI sends the password and no longer invents `onh_jwt_*` or writes a session on failure.
- Wallet top-up stays pending until a verified webhook.
- Payment webhook requires a shared secret in production.
- Swychr client has no hardcoded API key fallback.
- Domain register requires auth plus a settled `paymentReference` before Namecheap spend.
- Domain mutate routes (renew, transfer, DNS, lock, EPP) require auth.
- WHOIS/site probes go through `assertSafePublicHost` / `safeFetch`.
- Seed wallets start at zero.
- Password hash and TOTP secret persist on create/update/map when the SQL columns exist.
- CORS is allowlisted. Example env files no longer ship live keys.

## Still not a hosting company

These are product gaps, not leftover auth bugs:

- No cPanel / WHM account create.
- No Proxmox / KVM provisioner.
- No mailbox provisioner.
- No ACME/SSL order pipeline.
- Admin UI login is separate from the public site session store.
- TOTP is implemented server-side; confirm the admin app actually calls `/2fa/confirm`.

## Honest runtime contract

| Area | State |
| --- | --- |
| Auth | Passwords + signed JWT if `JWT_SECRET` and SQL columns are set |
| Admin API | Staff JWT only |
| Wallet credit | Webhook-gated |
| Domain buy | Auth + settled payment ref |
| Payments | Env key required |
| Shared/VPS/email | UI only |
