export function adminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('oneallhost_admin_session');
    const session = raw ? JSON.parse(raw) : null;
    if (!session?.token) return {};
    return { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

export async function adminFetch(path: string, init: RequestInit = {}) {
  return fetch(path, {
    ...init,
    headers: { ...adminAuthHeaders(), ...(init.headers || {}) },
  });
}
