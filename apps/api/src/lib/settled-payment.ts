import { db } from '@oneallhost/db';

export async function requireSettledPayment(userId: string, reference: string | undefined) {
  if (!reference) {
    return { ok: false as const, error: 'Settled paymentReference is required' };
  }
  const payments = await db.paymentsRepo.list(userId);
  const paid = payments.find(
    (p) => p.reference === reference && (p.status === 'settled' || p.status === 'completed')
  );
  if (!paid) {
    return { ok: false as const, error: 'No settled payment found for this reference' };
  }
  return { ok: true as const, payment: paid };
}
