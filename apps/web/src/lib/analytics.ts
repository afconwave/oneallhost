export type FunnelEvent =
  | 'domain_searched'
  | 'domain_selected'
  | 'rental_configured'
  | 'checkout_started'
  | 'payment_method_selected'
  | 'payment_completed'
  | 'invoice_downloaded'
  | 'waitlist_joined';

export interface EventPayload {
  domainName?: string;
  tld?: string;
  amountUsd?: number;
  amountXaf?: number;
  paymentMethod?: 'momo_direct' | 'card' | 'crypto';
  orderType?: 'domain_purchase' | 'rental' | 'hosting';
  [key: string]: any;
}

class AnalyticsTracker {
  private isClient = typeof window !== 'undefined';

  public track(event: FunnelEvent, payload?: EventPayload) {
    const timestamp = new Date().toISOString();
    const eventData = {
      event,
      timestamp,
      ...payload,
    };

    if (this.isClient) {
      // In-browser client event dispatch & structured logging
      console.log(`%c[Oneallhost Analytics: ${event}]`, 'color: #1B6FC9; font-weight: bold;', eventData);
      
      // Store in session funnel ledger
      try {
        const history = JSON.parse(sessionStorage.getItem('oah_analytics_funnel') || '[]');
        history.push(eventData);
        sessionStorage.setItem('oah_analytics_funnel', JSON.stringify(history));
      } catch (e) {
        // Storage quota safe fallback
      }
    }
  }

  public getFunnelHistory(): any[] {
    if (!this.isClient) return [];
    try {
      return JSON.parse(sessionStorage.getItem('oah_analytics_funnel') || '[]');
    } catch {
      return [];
    }
  }
}

export const analytics = new AnalyticsTracker();
