// Fill these in before you launch. They appear in the Terms and Privacy Policy.
const COMPANY = 'webCircuitUK';      // your registered business name
const EMAIL = 'info@webcircuituk.com';   // where people can reach you, including to be removed
const UPDATED = '25 October 2026';

function Shell({ title, children }) {
  return (
    <main className="legal">
      <a className="logo" href="/">webCircuitUK</a>
      <h1>{title}</h1>
      <p className="muted-d">Last updated {UPDATED}</p>
      {children}
      <p><a href="/">Back to the waitlist</a></p>
    </main>
  );
}

export function Privacy() {
  return (
    <Shell title="Privacy Policy">
      <p>{COMPANY} ("we", "us") runs this waitlist. We only store what you type into the waitlist form, and nothing else.</p>
      <h2>What we store</h2>
      <ul>
        <li>Your name and email address</li>
        <li>Your business or trade</li>
        <li>The plan you are most interested in</li>
        <li>How soon you need a website</li>
        <li>Whether you are happy for us to contact you before launch</li>
        <li>The date you joined</li>
      </ul>
      <p>We do not use analytics, advertising trackers or cookies on the waitlist site.</p>
      <h2>Why we store it</h2>
      <p>To tell you when we launch, and to understand which plans people want. If you said yes to being contacted before launch, we may also email you earlier if a site you need becomes available. We do not sell your details or share them for marketing.</p>
      <h2>Who can see it</h2>
      <p>Only our team, through a password-protected admin page. Our hosting and database providers (Vercel and Supabase) store and process it on our behalf, only to run the service.</p>
      <h2>How long we keep it</h2>
      <p>Until we launch and have contacted you, or until you ask us to remove you, whichever is sooner. If you later become a customer, we will explain how we handle your details at that point.</p>
      <h2>Your rights</h2>
      <p>Under UK data protection law you can ask to see, correct or delete your details, or withdraw your consent at any time. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will act on it. If you are unhappy with how we handle your data, you can complain to the Information Commissioner's Office (ico.org.uk).</p>
    </Shell>
  );
}

export function Terms() {
  return (
    <Shell title="Terms and Conditions">
      <p>These terms apply to joining the {COMPANY} waitlist.</p>
      <h2>Joining the waitlist</h2>
      <p>Joining is not an order and does not create a contract to supply a website. It only registers your interest and lets us contact you about launch. You can ask to be removed at any time.</p>
      <h2>Plans and prices</h2>
      <p>The plans, features and monthly prices shown are what we plan to offer. They may change before launch, and we do not promise a launch date. Nothing is charged by joining the waitlist.</p>
      <h2>Your details</h2>
      <p>Please give accurate information and only your own email address. How we use your details is explained in our <a href="/privacy">Privacy Policy</a>.</p>
      <h2>Contact before launch</h2>
      <p>If you tick yes to being contacted before our launch date, we may email you if you need a site sooner. You can say no, or change your mind, by emailing us.</p>
      <h2>Liability</h2>
      <p>The waitlist is provided as is. We are not liable for losses arising from delays to launch or changes to plans or prices. Nothing in these terms limits liability that cannot be limited by law.</p>
      <h2>Changes and law</h2>
      <p>We may update these terms, and the date above will change when we do. They are governed by the law of England and Wales.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </Shell>
  );
}
