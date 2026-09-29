/** In-process + optional column store for password hashes until every mapper is updated. */
const hashes = new Map<string, { passwordHash?: string; totpSecret?: string }>();

export function rememberAuthSecrets(userId: string, secrets: { passwordHash?: string; totpSecret?: string }) {
  const prev = hashes.get(userId) || {};
  hashes.set(userId, { ...prev, ...secrets });
}

export function getAuthSecrets(userId: string) {
  return hashes.get(userId);
}

export function attachAuthSecrets<T extends { id: string }>(user: T): T & { passwordHash?: string; totpSecret?: string } {
  const extra = hashes.get(user.id);
  return extra ? { ...user, ...extra } : user;
}
