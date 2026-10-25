import { useState } from 'react';
import { PLANS } from './plans.js';

const FEATURES = [
  ['Search-friendly', 'Titles, descriptions, structured data and clean markup are added for you.'],
  ['Live "Open now"', 'Your opening hours turn into a badge that updates itself.'],
  ['WhatsApp form', 'Customers message you straight from your site.'],
  ['Always different', 'Palettes, fonts and layouts are picked per business, so no two sites match.'],
  ['Real reviews only', 'We never invent testimonials – you add genuine ones.'],
  ['Social and maps', 'Facebook, Instagram and map links where you want them.'],
  ['Your own address', 'A .vercel.app address, or connect your own domain with step-by-step DNS help.'],
  ['Visitor stats', 'Optional Google Analytics (with a cookie notice built in) and Vercel Analytics.'],
  ['Mobile first', 'A tap-to-call bar and layouts that work on any phone.'],
  ['Yours to keep', 'Download a standalone HTML page whenever you like.'],
];

const DESIGNS = [
  ['Simple', 'Clean and quick', 'mock-simple'],
  ['Expert', 'Animated, every section', 'mock-expert'],
  ['Parallax', 'Scroll-driven showpiece', 'mock-parallax'],
];

const go = (e) => { e.preventDefault(); document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' }); };

function Waitlist() {
  const [f, setF] = useState({ name: '', email: '', trade: '', plan: 'Expert', timing: 'Within a month', contactEarly: 'Yes', website: '' });
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', msg: '' });
    try {
      const r = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong.');
      setState({ status: 'done', msg: d.already ? 'You are already on the list. We will be in touch.' : 'You are on the list. We will email you when your spot opens.' });
    } catch (err) {
      setState({ status: 'error', msg: err.message });
    }
  }

  if (state.status === 'done') return <div className="card thanks"><h3>You are in.</h3><p>{state.msg}</p></div>;

  return (
    <form className="card form" onSubmit={submit}>
      <label>Your name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label>Email<input type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
      <label>What is your business or trade?<input value={f.trade} onChange={set('trade')} placeholder="e.g. joiner, plumber, hair salon" /></label>
      <label>Which plan interests you most?
        <select value={f.plan} onChange={set('plan')}>
          {PLANS.map((p) => <option key={p.name}>{p.name}</option>)}
          <option>Not sure yet</option>
        </select>
      </label>
      <label>How soon do you need a website?
        <select value={f.timing} onChange={set('timing')}>
          <option>As soon as possible</option><option>Within a month</option><option>Just exploring</option>
        </select>
      </label>
      <label>Are you happy for us to contact you if you need it before our launch date?
        <select value={f.contactEarly} onChange={set('contactEarly')}>
          <option>Yes</option><option>No</option>
        </select>
      </label>
      <label className="check">
        <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>I have read the <a href="/terms" target="_blank" rel="noopener">Terms</a> and <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</span>
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} name="website" />
      {state.status === 'error' && <p className="err" role="alert">{state.msg}</p>}
      <button className="btn" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Joining…' : 'Join the waitlist'}</button>
    </form>
  );
}

export default function Landing() {
  return (
    <>
      <header className="nav">
        <a className="logo" href="/">webCircuitUK</a>
        <nav>
          <a href="#how">How it works</a><a href="#designs">Designs</a><a href="#pricing">Pricing</a><a href="#custom">Custom</a>
          <a className="btn sm" href="#waitlist" onClick={go}>Join waitlist</a>
        </nav>
      </header>

      <section className="hero">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
        <span className="badge">Launching soon</span>
        <h1>Your business online in minutes</h1>
        <p className="lead">Answer a few friendly questions. We build a fast, search-friendly website that fits your trade – with your logo, photos, reviews and a WhatsApp message form. No code, no AI guesswork.</p>
        <div className="cta">
          <a className="btn" href="#waitlist" onClick={go}>Join the waitlist</a>
          <a className="btn ghost" href="#custom">Custom coded website</a>
        </div>
        <ul className="pills"><li>No AI</li><li>SEO built in</li><li>3 designs</li><li>Edit any time</li></ul>
      </section>

      <section className="stats">
        {[['3', 'Designs to choose from'], ['5', 'Hero styles'], ['12', 'Colour palettes (plus generated)'], ['0', 'AI guesses']].map(([n, l]) => (
          <div key={l}><strong>{n}</strong><span>{l}</span></div>
        ))}
      </section>

      <section id="how" className="light">
        <div className="wrap">
          <h2>How it works</h2>
          <ol className="steps">
            <li><b>Answer a few questions</b>Tell us your trade, opening hours and how customers should reach you.</li>
            <li><b>Pick a design</b>Choose a layout, hero style and colour palette.</li>
            <li><b>Add your own bits</b>Upload your logo, photos and genuine reviews.</li>
            <li><b>Go live</b>Get a .vercel.app address or connect your own domain.</li>
          </ol>
        </div>
      </section>

      <section id="designs" className="light alt">
        <div className="wrap">
          <h2>Pick your design</h2>
          <p className="muted">These are made-up examples showing what your content could look like.</p>
          <div className="grid3">
            {DESIGNS.map(([n, d, c]) => (
              <div className="design" key={n}>
                <div className={`mock ${c}`}><i /><i /><i /><i /></div>
                <h3>{n}</h3><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark">
        <div className="wrap">
          <h2>Everything you need, nothing you do not</h2>
          <div className="features">
            {FEATURES.map(([t, d], i) => (
              <div className="card" key={t}><small>{String(i + 1).padStart(2, '0')}</small><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="light">
        <div className="wrap">
          <h2>Pricing</h2>
          <p className="muted">Simple monthly pricing. Join the waitlist to be first in line at launch.</p>
          <div className="plans">
            {PLANS.map((p) => (
              <div className={`card plan${p.featured ? ' featured' : ''}`} key={p.name}>
                <h3>{p.name}</h3><p className="muted-d">{p.tag}</p>
                <div className="price">{p.price}{p.price !== 'Quote' && <small>/month</small>}</div>
                <ul>{p.perks.map((x) => <li key={x}>{x}</li>)}</ul>
                <a className="btn" href="#waitlist" onClick={go}>{p.name === 'Custom coded' ? 'Get a quote' : 'Join waitlist'}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="custom" className="dark">
        <div className="wrap narrow">
          <h2>Need something bespoke?</h2>
          <p className="lead">Hand-written code, 3D, advanced animation – anything you can imagine. Tell us what you are after on the waitlist form and choose Custom coded.</p>
        </div>
      </section>

      <section id="waitlist" className="dark form-sec">
        <div className="wrap narrow">
          <h2>Join the waitlist</h2>
          <p className="lead">Early members get first access at launch, and a say in what we build next.</p>
          <Waitlist />
        </div>
      </section>

      <footer><span className="logo">webCircuitUK</span><span className="flinks"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><span>© {new Date().getFullYear()} webCircuitUK</span></span></footer>
    </>
  );
}
