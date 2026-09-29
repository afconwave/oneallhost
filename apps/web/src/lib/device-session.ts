import { clientAuthHeaders } from './session';

const DEVICE_KEY = 'oneallhost_device_id';

export function getDeviceId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export async function rememberThisDevice() {
  await fetch('/api/sessions/remember-device', {
    method: 'POST',
    headers: clientAuthHeaders(),
    body: JSON.stringify({ deviceId: getDeviceId() }),
  });
}

export async function requestEmailOtp(email: string) {
  const res = await fetch('/api/sessions/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, deviceId: getDeviceId() }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not send email code');
  return data;
}

export async function resumeWithOtp(email: string, otp: string) {
  const res = await fetch('/api/sessions/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, deviceId: getDeviceId(), otp }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) throw new Error(data.error || 'OTP resume failed');
  const raw = localStorage.getItem('oneallhost_user_session');
  const prev = raw ? JSON.parse(raw) : {};
  localStorage.setItem(
    'oneallhost_user_session',
    JSON.stringify({ ...prev, token: data.token, username: email, loggedIn: true, loginTime: new Date().toISOString() })
  );
  return data;
}
