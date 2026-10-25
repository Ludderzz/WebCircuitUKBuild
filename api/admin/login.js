import { passwordOk, makeToken } from '../_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server.' });
  if (!passwordOk(req.body?.password)) {
    await new Promise((r) => setTimeout(r, 1000)); // slows down guessing
    return res.status(401).json({ error: 'Wrong password.' });
  }
  res.json({ token: makeToken() });
}
