import crypto from 'crypto';

import { createClient } from '@supabase/supabase-js';

// Server-side only. Uses the secret key, which bypasses Row Level Security.
export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

export const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);

// Stateless admin sessions: a token is "expiry.signature", signed with a key derived from ADMIN_PASSWORD.
const key = () => crypto.createHash('sha256').update('wc-admin:' + process.env.ADMIN_PASSWORD).digest();
const sign = (exp) => crypto.createHmac('sha256', key()).update(String(exp)).digest('hex');
const same = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

export const passwordOk = (pw) => !!process.env.ADMIN_PASSWORD && same(pw ?? '', process.env.ADMIN_PASSWORD);
export const makeToken = () => {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  return `${exp}.${sign(exp)}`;
};
export const isAdmin = (req) => {
  if (!process.env.ADMIN_PASSWORD) return false;
  const [exp, sig] = (req.headers.authorization || '').replace('Bearer ', '').split('.');
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, sign(exp));
};
