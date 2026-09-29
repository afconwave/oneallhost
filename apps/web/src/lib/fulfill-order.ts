import { clientAuthHeaders } from './session';

export type CartItem =
  | { kind: 'domain'; domainName: string; years?: number }
  | { kind: 'hosting'; planId: string; domain: string }
  | { kind: 'rental'; subdomain: string };

export async function fulfillPaidOrder(paymentReference: string, items: CartItem[]) {
  const res = await fetch('/api/orders/fulfill', {
    method: 'POST',
    headers: clientAuthHeaders(),
    body: JSON.stringify({ paymentReference, items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Fulfillment failed');
  return data;
}
