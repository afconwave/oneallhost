# Website security threat checklist

A general-purpose reference of what an attacker will try against any website or app — vibe-coded, hand-built, or otherwise. Not tied to any specific stack. Use it as a pre-launch and pre-release checklist for any project.

---

## 1. Injection attacks

- **SQL injection** — malicious input in a form field reaches a raw database query and manipulates it.
- **NoSQL/query injection** — crafted input manipulates a document-database query or filter.
- **Command injection** — user input gets passed into a server-side shell command.
- **Header/log injection** — special characters in input pollute HTTP headers, emails, or log files.

*Defense:* always use parameterized queries / an ORM, never build queries by string-concatenating user input, validate and type-check every input server-side, never shell out with user-controlled strings.

## 2. Cross-site scripting (XSS)

- **Stored XSS** — malicious script saved (in a comment, profile field, message) and served to other users later.
- **Reflected XSS** — malicious script in a URL parameter echoed back into the page.
- **DOM-based XSS** — client-side JavaScript writes untrusted data into the page without sanitizing it.

*Defense:* escape all output by default (most modern frameworks do this automatically), avoid raw HTML injection (`innerHTML`, `dangerouslySetInnerHTML`) unless the content is sanitized, set a Content-Security-Policy header.

## 3. Cross-site request forgery (CSRF)

An attacker's page tricks a logged-in user's browser into submitting a request to your site without their knowledge or consent.

*Defense:* SameSite cookies, CSRF tokens on state-changing requests, never let a GET request perform a write/mutation.

## 4. Broken authentication & session management

- Credential stuffing (breached password lists tried at scale).
- Brute-force login attempts.
- Session hijacking or fixation.
- Weak, predictable, or non-expiring password reset tokens.

*Defense:* rate limit login attempts, use short-lived sessions with refresh, enforce strong password rules, make reset tokens single-use and time-limited, offer (or require, for privileged accounts) two-factor authentication.

## 5. Broken access control

- **IDOR (Insecure Direct Object Reference)** — changing an ID in a URL to access someone else's data.
- **Privilege escalation** — a regular user finding a way to trigger admin-only actions.
- **Missing function-level checks** — an endpoint that's just not linked in the UI, but still reachable and unprotected.

*Defense:* enforce authorization on the server for every request, never rely on the frontend hiding a button as the only protection, apply database-level row security where your database supports it.

## 6. Security misconfiguration

Exposed `.env` files, default credentials left in place, verbose error/stack traces shown to users, unnecessary open ports or services, publicly readable cloud storage buckets, directory listing left enabled.

*Defense:* generic error messages in production, a pre-launch configuration review, all storage private-by-default with access granted explicitly.

## 7. Sensitive data exposure

Unencrypted data in transit or at rest, weak or missing password hashing, API keys or secrets shipped inside frontend JavaScript, over-collection of personal data.

*Defense:* HTTPS everywhere with HSTS enabled, strong hashing for any stored credentials, secrets live only server-side, collect only what you actually need.

## 8. Insecure deserialization

Crafted serialized data (in a cookie, a webhook payload, a token) executes unintended code or bypasses checks when the server parses it.

*Defense:* verify signatures on anything you deserialize from an external source, never blindly `eval()` or deserialize untrusted input.

## 9. Vulnerable or outdated dependencies (supply chain)

A library with a known vulnerability, or a compromised package published under a trusted name — a real and recurring attack pattern.

*Defense:* automated dependency scanning in CI, keep dependencies patched, review new dependencies before adding them, minimize how many you pull in.

## 10. Insufficient logging & monitoring

An attacker operates undetected because failed logins, permission errors, and unusual admin actions aren't logged or alerted on.

*Defense:* log authentication failures and permission-denied events, alert on unusual patterns, keep an audit trail of privileged actions — don't just log passively into a file nobody reads.

## 11. Server-side request forgery (SSRF)

If your server ever fetches a URL supplied by a user, an attacker can point it at internal infrastructure instead of the intended external target.

*Defense:* never let user input directly determine a server-side request destination without an allowlist; block internal/private IP ranges explicitly if user-supplied URLs are ever fetched.

## 12. API-specific vulnerabilities

- **Excessive data exposure** — an endpoint returns a full internal object when the frontend only needed a few fields.
- **Mass assignment** — a client sends extra fields in a request (e.g. a hidden `role` field) that the backend accepts and writes without restriction.
- **Missing rate limiting** on any endpoint, not just login.

*Defense:* explicit response shapes (never return raw database rows), explicit allowlists of writable fields per endpoint, rate limiting broadly applied.

## 13. Business logic flaws

The vulnerabilities generic scanners miss because they're specific to what your product actually does:
- Trusting a price or amount sent from the client instead of recalculating it server-side.
- Race conditions — two near-simultaneous requests causing a double-charge, double-booking, or inconsistent state.
- Discount/coupon codes reused beyond their intended limit.
- Workflow steps skipped by calling a later-stage API directly instead of going through the intended sequence.

*Defense:* server always recalculates anything financial from source-of-truth data, use database transactions and uniqueness constraints to close race windows, validate that workflow steps happened in order.

## 14. Payment-specific attacks (if you process payments)

- **Webhook spoofing** — a fake request pretending to be a payment provider's success callback.
- **Replay attacks** — a captured legitimate webhook resent to trigger duplicate fulfillment.
- **Card testing** — small, rapid transactions used to validate stolen card numbers.

*Defense:* verify webhook signatures cryptographically, use idempotency keys so a replayed event can't double-fulfill, watch for and flag repeated small failed/successful transaction patterns.

## 15. Clickjacking

Your login or a sensitive action page is loaded invisibly inside an iframe on a malicious site, tricking a user into clicking something they didn't intend to.

*Defense:* `X-Frame-Options: DENY` or a CSP `frame-ancestors` restriction on any page that performs sensitive actions.

## 16. Open redirect

A `?redirect=` or similar parameter is used to send an authenticated user to an attacker-controlled page after a legitimate action, often for phishing.

*Defense:* only allow redirects to an internal allowlist of paths, never to an arbitrary URL taken from a query parameter.

## 17. File upload vulnerabilities

Malicious file types, oversized files, path traversal via crafted filenames, or uploaded files served in a way that lets a browser execute them.

*Defense:* strict server-side file type and size validation, store uploads outside any execute path, serve via signed/expiring URLs rather than direct public paths.

## 18. Secrets in source control

API keys or credentials accidentally committed to a repository — and still recoverable from git history even after being "removed" in a later commit.

*Defense:* strict `.gitignore` discipline from the first commit, automated secret-scanning in CI, and if a secret does leak — rotate it immediately rather than just deleting the line.

## 19. Bot & scraping abuse

Automated bots scraping content at scale, or hammering a checkout/login endpoint to test stolen credentials or cards.

*Defense:* rate limiting, and adaptive challenges (like a CAPTCHA) triggered by suspicious patterns rather than shown to every user.

## 20. Email spoofing / phishing using your domain

Without proper email authentication, attackers can send phishing emails that appear to come from your own domain.

*Defense:* SPF, DKIM, and DMARC records configured on your sending domain — do this before launch, not after an incident.

## 21. Denial of service (DoS/DDoS)

Volumetric traffic floods, or a cheap-to-send request that's expensive for your server to process, repeated at scale.

*Defense:* rate limiting, a CDN/edge layer in front of the site for volumetric protection, caching expensive operations instead of recomputing them on every request.

## 22. Clickable social engineering surface

Not a technical vulnerability, but the most common real-world way sites actually get breached: a phishing email or fake support call convincing an employee/admin to hand over credentials or approve an action.

*Defense:* security awareness for anyone with privileged access, mandatory 2FA on admin accounts, a verification process for any request to change payment details, credentials, or access levels — even one that appears to come from a colleague.

---

## Priorities that matter most, in general

If building all of this at once isn't realistic, these are the ones cheapest to build in from day one and most expensive to retrofit after a real incident:

1. Server-side authorization checks on every request — never trust the frontend alone.
2. Server-side recalculation of anything financial — never trust a client-submitted amount.
3. Rate limiting on login, search, and any checkout/write-heavy endpoint.
4. Secrets kept out of source control, with scanning in CI from the first commit.
5. HTTPS/HSTS everywhere, private-by-default storage.
6. Two-factor authentication mandatory for any admin/privileged account.
7. SPF/DKIM/DMARC on your sending domain.
8. Generic error messages in production — never expose stack traces or internals to users.
