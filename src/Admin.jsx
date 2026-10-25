import { useEffect, useMemo, useState } from 'react';
import { PLANS } from './plans.js';

const call = (url, token, opts = {}) =>
  fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) } });

function Login({ onToken }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    const r = await call('/api/admin/login', null, { method: 'POST', body: JSON.stringify({ password: pw }) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    sessionStorage.setItem('wc_admin', d.token);
    onToken(d.token);
  }
  return (
    <main className="admin login">
      <form className="card form" onSubmit={submit}>
        <h2>Admin</h2>
        <label>Password<input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn">Sign in</button>
      </form>
    </main>
  );
}

const count = (rows, key) => rows.reduce((m, r) => ((m[r[key]] = (m[r[key]] || 0) + 1), m), {});

function Bars({ title, data, order }) {
  const max = Math.max(1, ...Object.values(data));
  return (
    <div className="card">
      <h3>{title}</h3>
      {order.map((k) => (
        <div className="bar" key={k}><span>{k}</span><div><i style={{ width: `${((data[k] || 0) / max) * 100}%` }} /></div><b>{data[k] || 0}</b></div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem('wc_admin') || '');
  const [rows, setRows] = useState(null);

  async function load(t = token) {
    const r = await call('/api/admin/entries', t);
    if (r.status === 401) { sessionStorage.removeItem('wc_admin'); setToken(''); return; }
    setRows(await r.json());
  }
  useEffect(() => { if (token) load(token); }, [token]);

  const stats = useMemo(() => rows && { plan: count(rows, 'plan'), timing: count(rows, 'timing') }, [rows]);

  if (!token) return <Login onToken={setToken} />;
  if (!rows) return <main className="admin"><p>Loading…</p></main>;

  async function remove(id) {
    if (!confirm('Remove this person from the waitlist?')) return;
    await call(`/api/admin/entries?id=${id}`, token, { method: 'DELETE' });
    load();
  }

  function exportCsv() {
    const cols = ['createdAt', 'name', 'email', 'trade', 'plan', 'timing', 'contactEarly'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'waitlist.csv';
    a.click();
  }

  const urgent = stats.timing['As soon as possible'] || 0;
  return (
    <main className="admin">
      <header>
        <h1>Waitlist</h1>
        <div>
          <button className="btn sm" onClick={exportCsv}>Export CSV</button>{' '}
          <button className="btn sm ghost" onClick={() => { sessionStorage.removeItem('wc_admin'); setToken(''); }}>Sign out</button>
        </div>
      </header>

      <div className="grid3">
        <div className="card big"><strong>{rows.length}</strong><span>Signups</span></div>
        <div className="card big"><strong>{urgent}</strong><span>Need a site ASAP ({rows.length ? Math.round((urgent / rows.length) * 100) : 0}%)</span></div>
        <div className="card big"><strong>{rows.filter((r) => r.contactEarly === 'Yes').length}</strong><span>OK to contact before launch</span></div>
        <div className="card big"><strong>{rows.filter((r) => Date.now() - new Date(r.createdAt) < 7 * 864e5).length}</strong><span>Last 7 days</span></div>
      </div>

      <div className="grid2">
        <Bars title="Plan interest" data={stats.plan} order={[...PLANS.map((p) => p.name), 'Not sure yet']} />
        <Bars title="How soon they need a site" data={stats.timing} order={['As soon as possible', 'Within a month', 'Just exploring']} />
      </div>

      <div className="card tablewrap">
        <table>
          <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Trade</th><th>Plan</th><th>Timing</th><th>Contact early?</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.createdAt).toLocaleDateString('en-GB')}</td>
                <td>{r.name}</td><td>{r.email}</td><td>{r.trade}</td><td>{r.plan}</td><td>{r.timing}</td><td>{r.contactEarly || 'No'}</td>
                <td><button className="link" onClick={() => remove(r.id)}>Remove</button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="8">No signups yet. Share your link to get the first one.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
