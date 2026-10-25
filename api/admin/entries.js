import { db, isAdmin } from '../_lib.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not signed in.' });
  try {
    if (req.method === 'GET') {
      const { data, error } = await db
        .from('waitlist')
        .select('id, created_at, name, email, trade, plan, timing, contact_early')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data.map(({ created_at, contact_early, ...r }) => ({ ...r, createdAt: created_at, contactEarly: contact_early })));
    }
    if (req.method === 'DELETE') {
      const { error } = await db.from('waitlist').delete().eq('id', String(req.query.id));
      if (error) throw error;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
