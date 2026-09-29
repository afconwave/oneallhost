/**
 * Namecheap domain XML cannot create cPanel accounts.
 * Reseller hosting is WHM createacct against the reseller server.
 */
export interface CreateHostingAccountInput {
  domain: string;
  username: string;
  password: string;
  contactEmail: string;
  package: string;
}

export class WhmResellerClient {
  private baseUrl = (process.env.WHM_BASE_URL || '').replace(/\/+$/, '');
  private user = process.env.WHM_USER || '';
  private token = process.env.WHM_API_TOKEN || '';

  configured() {
    return Boolean(this.baseUrl && this.user && this.token);
  }

  async createAccount(input: CreateHostingAccountInput) {
    if (!this.configured()) {
      return {
        success: false,
        queued: true,
        message: 'WHM is not configured. Set WHM_BASE_URL, WHM_USER, WHM_API_TOKEN. Account recorded as pending provision.',
      };
    }
    const params = new URLSearchParams({
      domain: input.domain,
      username: input.username,
      password: input.password,
      contactemail: input.contactEmail,
      plan: input.package,
    });
    const url = `${this.baseUrl}/json-api/createacct?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `whm ${this.user}:${this.token}` },
      signal: AbortSignal.timeout(20000),
    });
    const json = await res.json().catch(() => ({}));
    const ok = res.ok && (json?.metadata?.result === 1 || json?.result === 1);
    return {
      success: Boolean(ok),
      raw: json,
      message: ok ? 'cPanel account created' : json?.metadata?.reason || 'WHM createacct failed',
    };
  }
}

export const whmClient = new WhmResellerClient();
