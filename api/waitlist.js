import { db, clean } from './_lib.js';

const PLANS = ['Simple', 'Expert', 'Parallax', 'Custom coded', 'Not sure yet'];
const TIMING = ['As soon as possible', 'Within a month', 'Just exploring'];
const CONTACT = ['Yes', 'No'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot: bots fill this in
    const email = clean(b.email, 160).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    const { error } = await db.from('waitlist').insert({
      name: clean(b.name, 80),
      email,
      trade: clean(b.trade, 80),
      plan: PLANS.includes(b.plan) ? b.plan : 'Not sure yet',
      timing: TIMING.includes(b.timing) ? b.timing : 'Just exploring',
      contact_early: CONTACT.includes(b.contactEarly) ? b.contactEarly : 'No',
    });
    if (error?.code === '23505') return res.json({ ok: true, already: true }); // email already on the list
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
