import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'data', 'waitlist.json');
const PASSWORD = process.env.ADMIN_PASSWORD;
const PORT = process.env.PORT || 3001;

if (!PASSWORD) {
  console.error('Missing ADMIN_PASSWORD. Copy .env.example to .env and set it.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(FILE), { recursive: true });
const load = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const save = (rows) => fs.writeFileSync(FILE, JSON.stringify(rows, null, 2));
const hash = (s) => crypto.createHash('sha256').update(String(s)).digest();
const sessions = new Set();
const fails = new Map(); // ip -> { n, until }

const app = express();
app.use(express.json({ limit: '10kb' }));

const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);
const PLANS = ['Simple', 'Expert', 'Parallax', 'Custom coded', 'Not sure yet'];
const TIMING = ['As soon as possible', 'Within a month', 'Just exploring'];

app.post('/api/waitlist', (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot: bots fill this in
  const email = clean(b.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  const rows = load();
  if (rows.some((r) => r.email === email)) return res.json({ ok: true, already: true });
  rows.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: clean(b.name, 80),
    email,
    trade: clean(b.trade, 80),
    plan: PLANS.includes(b.plan) ? b.plan : 'Not sure yet',
    timing: TIMING.includes(b.timing) ? b.timing : 'Just exploring',
  });
  save(rows);
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const ip = req.ip;
  const f = fails.get(ip) || { n: 0, until: 0 };
  if (Date.now() < f.until) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  const ok = crypto.timingSafeEqual(hash(req.body?.password ?? ''), hash(PASSWORD));
  if (!ok) {
    f.n += 1;
    if (f.n >= 5) { f.n = 0; f.until = Date.now() + 5 * 60 * 1000; }
    fails.set(ip, f);
    return res.status(401).json({ error: 'Wrong password.' });
  }
  fails.delete(ip);
  const token = crypto.randomBytes(32).toString('hex');
  sessions.add(token);
  res.json({ token });
});

const auth = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  if (!sessions.has(t)) return res.status(401).json({ error: 'Not signed in.' });
  next();
};

app.get('/api/admin/entries', auth, (_req, res) => res.json(load().reverse()));
app.delete('/api/admin/entries/:id', auth, (req, res) => {
  save(load().filter((r) => r.id !== req.params.id));
  res.json({ ok: true });
});

// Production: serve the built site
const dist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
