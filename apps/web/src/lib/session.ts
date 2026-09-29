export function clientAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  try {
    const raw = localStorage.getItem('oneallhost_user_session');
    const session = raw ? JSON.parse(raw) : null;
    return {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}
