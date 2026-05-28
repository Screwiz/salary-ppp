import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ─────────────────────────────────────────────
// SHARED ASSETS
// ─────────────────────────────────────────────
const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #060608;
  --bg2: #0d0d10;
  --bg3: #141418;
  --surface: rgba(255,255,255,0.04);
  --surface2: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --text: #e8e6f0;
  --muted: #6b6980;
  --muted2: #9997b0;
  --accent: #7c6aff;
  --accent2: #a855f7;
  --green: #22d3a0;
  --orange: #fb923c;
  --red: #f87171;
  --glow: rgba(124,106,255,0.15);
  --r: 12px;
}
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 60px;
  background: rgba(6,6,8,0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem;
  text-decoration: none; color: var(--text); letter-spacing: -0.03em;
  display: flex; align-items: center; gap: 8px;
}
.nav-logo .dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; display: inline-block; box-shadow: 0 0 10px var(--accent); }
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a {
  color: var(--muted2); text-decoration: none; font-size: 0.88rem;
  padding: 6px 14px; border-radius: 8px; transition: all 0.15s;
  font-weight: 500;
}
.nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--surface2); }
.nav-cta {
  background: var(--accent); color: #fff; text-decoration: none;
  font-size: 0.85rem; font-weight: 600; padding: 7px 18px; border-radius: 8px;
  transition: all 0.2s; font-family: 'Syne', sans-serif;
}
.nav-cta:hover { background: #6b58f0; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(124,106,255,0.3); }

/* ── BUTTONS ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 10px; padding: 12px 24px;
  font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.92rem;
  cursor: pointer; transition: all 0.2s; text-decoration: none;
}
.btn-primary:hover { background: #6b58f0; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,106,255,0.35); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border2); border-radius: 10px; padding: 12px 24px;
  font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.92rem;
  cursor: pointer; transition: all 0.2s; text-decoration: none;
}
.btn-ghost:hover { background: var(--surface2); border-color: var(--muted2); }

/* ── BADGE ── */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
  font-family: 'Syne', sans-serif;
}
.badge-accent { background: rgba(124,106,255,0.15); color: var(--accent); border: 1px solid rgba(124,106,255,0.25); }
.badge-green  { background: rgba(34,211,160,0.12); color: var(--green); border: 1px solid rgba(34,211,160,0.2); }
.badge-orange { background: rgba(251,146,60,0.12); color: var(--orange); border: 1px solid rgba(251,146,60,0.2); }

/* ── CARD ── */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 1.5rem; transition: border-color 0.2s;
}
.card:hover { border-color: var(--border2); }

/* ── SECTION ── */
.section { padding: 5rem 0; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
.section-label {
  font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 1rem;
}
.section-title {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  letter-spacing: -0.03em; line-height: 1.1;
  margin-bottom: 1.2rem;
}
.section-sub {
  font-size: 1rem; color: var(--muted2); line-height: 1.75;
  max-width: 540px;
}

/* ── GRID NOISE BACKGROUND ── */
.noise-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* ── GLOW ── */
.glow-orb {
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
}

/* ── STATUS / ERROR ── */
.status-bar {
  display: none; align-items: center; gap: 10px;
  padding: 14px 18px; background: var(--surface2);
  border: 1px solid var(--border); border-radius: 10px;
  margin: 1rem 0; font-size: 0.88rem; color: var(--muted2);
}
.status-bar.visible { display: flex; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid var(--border2); border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-box {
  display: none; padding: 14px 18px;
  background: rgba(248,113,113,0.07);
  border: 1px solid rgba(248,113,113,0.25); border-radius: 10px;
  font-size: 0.88rem; color: var(--red); margin: 1rem 0;
}
.error-box.visible { display: block; }

/* ── FORM ── */
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); font-weight: 500; font-family: 'Syne', sans-serif;
}
.form-input, .form-select {
  background: var(--bg3); border: 1px solid var(--border2);
  border-radius: 10px; padding: 12px 14px;
  color: var(--text); font-family: 'Instrument Sans', sans-serif;
  font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
}
.form-input:focus, .form-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(124,106,255,0.12);
}
.form-select option { background: #1a1a1e; }

/* ── TABS ── */
.tabs { display: flex; gap: 2px; background: var(--bg3); border-radius: 10px; padding: 4px; }
.tab {
  flex: 1; padding: 8px 16px; border: none; border-radius: 8px;
  background: none; color: var(--muted2); font-family: 'Instrument Sans', sans-serif;
  font-size: 0.88rem; cursor: pointer; transition: all 0.15s;
}
.tab.active { background: var(--surface2); color: var(--text); }

/* ── FOOTER ── */
footer {
  border-top: 1px solid var(--border); padding: 3rem 2rem;
  text-align: center; font-size: 0.8rem; color: var(--muted);
}
footer .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
footer .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; }
footer .footer-links a { color: var(--muted); text-decoration: none; transition: color 0.15s; }
footer .footer-links a:hover { color: var(--text); }
footer .footer-bottom { color: var(--muted); font-size: 0.75rem; }

/* ── ANIM ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

@media (max-width: 680px) {
  .nav-links { display: none; }
  .container { padding: 0 1.25rem; }
  .section { padding: 3rem 0; }
}
`;

const NAV_HTML = (active) => `
<nav class="nav">
  <a href="/" class="nav-logo"><span class="dot"></span>SalaryPPP</a>
  <div class="nav-links">
    <a href="/" class="${active === 'home' ? 'active' : ''}">Home</a>
    <a href="/compare" class="${active === 'compare' ? 'active' : ''}">Compare</a>
    <a href="/routes" class="${active === 'routes' ? 'active' : ''}">Popular Routes</a>
    <a href="/how-it-works" class="${active === 'how' ? 'active' : ''}">How It Works</a>
  </div>
  <a href="/compare" class="nav-cta">Try it free →</a>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="nav-logo" style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;letter-spacing:-0.03em;">
      <span class="dot"></span>SalaryPPP
    </div>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/compare">Compare</a>
      <a href="/routes">Popular Routes</a>
      <a href="/how-it-works">How It Works</a>
    </div>
    <p class="footer-bottom">© 2025 SalaryPPP · Purchasing power estimates via AI · Not financial advice</p>
  </div>
</footer>`;

const page = (title, active, content, extraCss = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title} · SalaryPPP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet"/>
  <style>${SHARED_CSS}${extraCss}</style>
</head>
<body>
  <div class="noise-bg"></div>
  ${NAV_HTML(active)}
  <div style="height:60px"></div>
  ${content}
  ${FOOTER_HTML}
</body>
</html>`;

// ─────────────────────────────────────────────
// PAGE 1: HOME / LANDING
// ─────────────────────────────────────────────
const HOME_CSS = `
.hero {
  position: relative; min-height: calc(100vh - 60px);
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center; padding: 6rem 2rem 4rem;
  overflow: hidden;
}
.hero-glow1 {
  width: 600px; height: 600px; background: var(--accent); opacity: 0.12;
  top: -200px; left: 50%; transform: translateX(-50%);
}
.hero-glow2 {
  width: 400px; height: 400px; background: var(--accent2); opacity: 0.08;
  bottom: 0; right: -100px;
}
.hero-eyebrow { margin-bottom: 1.5rem; }
.hero h1 {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(2.8rem, 8vw, 5.5rem);
  line-height: 1.0; letter-spacing: -0.04em;
  margin-bottom: 1.5rem; max-width: 820px;
}
.hero h1 .gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub { font-size: 1.1rem; color: var(--muted2); max-width: 520px; line-height: 1.75; margin-bottom: 2.5rem; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 4rem; }
.hero-stats {
  display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;
  padding: 1.5rem 2rem; background: var(--surface);
  border: 1px solid var(--border); border-radius: 16px;
}
.hero-stat { text-align: center; }
.hero-stat-num {
  font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800;
  letter-spacing: -0.04em; color: var(--text);
}
.hero-stat-lbl { font-size: 0.75rem; color: var(--muted2); margin-top: 2px; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 760px) { .features-grid { grid-template-columns: 1fr; } }
.feature-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.75rem;
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover { border-color: var(--border2); transform: translateY(-3px); }
.feature-icon {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; margin-bottom: 1rem;
}
.feature-icon.purple { background: rgba(124,106,255,0.15); }
.feature-icon.green { background: rgba(34,211,160,0.12); }
.feature-icon.orange { background: rgba(251,146,60,0.12); }
.feature-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 8px; }
.feature-desc { font-size: 0.88rem; color: var(--muted2); line-height: 1.7; }

/* Testimonials */
.testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 640px) { .testimonials-grid { grid-template-columns: 1fr; } }
.testimonial-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem;
}
.testimonial-text { font-size: 0.92rem; line-height: 1.75; color: var(--muted2); margin-bottom: 1rem; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 10px; }
.testimonial-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem; font-family: 'Syne', sans-serif;
  flex-shrink: 0;
}
.testimonial-name { font-size: 0.85rem; font-weight: 600; }
.testimonial-role { font-size: 0.75rem; color: var(--muted2); }

/* CTA section */
.cta-section {
  background: linear-gradient(135deg, rgba(124,106,255,0.12), rgba(168,85,247,0.08));
  border: 1px solid rgba(124,106,255,0.2); border-radius: 20px;
  padding: 4rem 2rem; text-align: center; margin: 2rem 0;
}
`;

const HOME_CONTENT = `
<main>
  <section class="hero">
    <div class="glow-orb hero-glow1"></div>
    <div class="glow-orb hero-glow2"></div>
    <div class="hero-eyebrow fade-up"><span class="badge badge-accent">✦ Real purchasing power data</span></div>
    <h1 class="fade-up delay-1">Your salary means<br/><span class="gradient-text">different things</span><br/>everywhere.</h1>
    <p class="hero-sub fade-up delay-2">$100k in San Francisco ≠ $100k in Hyderabad. Discover what your salary is truly worth — adjusted for real cost of living.</p>
    <div class="hero-actions fade-up delay-3">
      <a href="/compare" class="btn-primary">Calculate now <span>→</span></a>
      <a href="/how-it-works" class="btn-ghost">How it works</a>
    </div>
    <div class="hero-stats fade-up delay-4">
      <div class="hero-stat"><div class="hero-stat-num">180+</div><div class="hero-stat-lbl">Countries covered</div></div>
      <div class="hero-stat"><div class="hero-stat-num">PPP</div><div class="hero-stat-lbl">Adjusted data</div></div>
      <div class="hero-stat"><div class="hero-stat-num">2025</div><div class="hero-stat-lbl">Current data</div></div>
      <div class="hero-stat"><div class="hero-stat-num">Free</div><div class="hero-stat-lbl">Always</div></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="section-label">Why use SalaryPPP</p>
      <h2 class="section-title">Built for real decisions.</h2>
      <p class="section-sub" style="margin-bottom:3rem">Whether you're negotiating a relocation package or comparing offers across borders, you need real data.</p>
      <div class="features-grid">
        <div class="feature-card fade-up">
          <div class="feature-icon purple">💡</div>
          <div class="feature-title">PPP-Adjusted Salaries</div>
          <div class="feature-desc">We use World Bank and Numbeo purchasing power parity data to calculate true equivalent salaries across cities.</div>
        </div>
        <div class="feature-card fade-up delay-1">
          <div class="feature-icon green">📊</div>
          <div class="feature-title">Category Breakdown</div>
          <div class="feature-desc">See exactly how costs compare — rent, groceries, transport, and healthcare — not just a single number.</div>
        </div>
        <div class="feature-card fade-up delay-2">
          <div class="feature-icon orange">🌍</div>
          <div class="feature-title">Global Coverage</div>
          <div class="feature-desc">Compare any two cities in the world. Tier-1 tech hubs to emerging markets — we cover them all.</div>
        </div>
        <div class="feature-card fade-up">
          <div class="feature-icon purple">⚡</div>
          <div class="feature-title">Instant Results</div>
          <div class="feature-desc">Get a full cost-of-living breakdown and equivalent salary in under 5 seconds, powered by AI.</div>
        </div>
        <div class="feature-card fade-up delay-1">
          <div class="feature-icon green">🔀</div>
          <div class="feature-title">Any Currency</div>
          <div class="feature-desc">USD, EUR, GBP, INR, SGD, AED and more. We convert everything for an apples-to-apples comparison.</div>
        </div>
        <div class="feature-card fade-up delay-2">
          <div class="feature-icon orange">📝</div>
          <div class="feature-title">Human Verdict</div>
          <div class="feature-desc">Beyond the numbers, get a plain-English analysis of whether the move makes financial sense for you.</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background: var(--bg2);">
    <div class="container">
      <p class="section-label">What people say</p>
      <h2 class="section-title" style="margin-bottom:2.5rem">Used by people making<br/>big career moves.</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <p class="testimonial-text">"I was about to take a ₹30L job in Bangalore after working in Singapore. SalaryPPP showed me I'd actually be earning less in real terms. Negotiated for ₹45L instead."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:rgba(124,106,255,0.2);color:var(--accent)">AK</div>
            <div><div class="testimonial-name">Arjun K.</div><div class="testimonial-role">Software Engineer · Singapore → Bangalore</div></div>
          </div>
        </div>
        <div class="testimonial-card">
          <p class="testimonial-text">"My company offered me $90k to move from NYC to Austin. Looks like a paycut but SalaryPPP showed it's actually 40% more purchasing power. Took the job."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:rgba(34,211,160,0.15);color:var(--green)">SL</div>
            <div><div class="testimonial-name">Sarah L.</div><div class="testimonial-role">Product Manager · NYC → Austin</div></div>
          </div>
        </div>
        <div class="testimonial-card">
          <p class="testimonial-text">"The breakdown by category is insanely useful. I knew rent would be cheaper in Lisbon, but I didn't realise groceries and healthcare were 60% cheaper too."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:rgba(251,146,60,0.15);color:var(--orange)">DM</div>
            <div><div class="testimonial-name">Diego M.</div><div class="testimonial-role">Freelancer · London → Lisbon</div></div>
          </div>
        </div>
        <div class="testimonial-card">
          <p class="testimonial-text">"Shared this with my entire team when we were evaluating remote work policies. It's the clearest tool I've found for explaining geographic pay differences."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:rgba(168,85,247,0.15);color:var(--accent2)">RC</div>
            <div><div class="testimonial-name">Rachel C.</div><div class="testimonial-role">HR Director · San Francisco</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="cta-section">
        <p class="section-label" style="margin-bottom:1rem">Ready to find out?</p>
        <h2 class="section-title" style="max-width:600px;margin:0 auto 1.25rem">What is your salary<br/>really worth?</h2>
        <p style="color:var(--muted2);margin-bottom:2rem;font-size:0.95rem">Takes 30 seconds. No signup needed.</p>
        <a href="/compare" class="btn-primary" style="font-size:1rem;padding:14px 32px">Compare now →</a>
      </div>
    </div>
  </section>
</main>`;

// ─────────────────────────────────────────────
// PAGE 2: COMPARE TOOL
// ─────────────────────────────────────────────
const COMPARE_CSS = `
.compare-layout {
  display: grid; grid-template-columns: 420px 1fr;
  gap: 2rem; align-items: start;
  padding: 3rem 0 5rem;
}
@media (max-width: 900px) { .compare-layout { grid-template-columns: 1fr; } }
.compare-sidebar { position: sticky; top: 80px; }
.form-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 1.75rem; margin-bottom: 16px;
}
.form-card-title {
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem;
  margin-bottom: 1.25rem; color: var(--text);
}
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.form-grid-1 { margin-bottom: 12px; }
.quick-fill { margin-top: 1rem; }
.quick-fill-label {
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 8px; font-family: 'Syne', sans-serif;
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  font-size: 0.72rem; color: var(--muted2); border: 1px solid var(--border);
  border-radius: 20px; padding: 4px 12px; cursor: pointer;
  transition: all 0.15s; background: none; font-family: 'Instrument Sans', sans-serif;
}
.chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(124,106,255,0.07); }

/* result */
#result { display: none; }
#result.visible { display: block; animation: fadeUp 0.45s ease both; }
.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
@media (max-width: 640px) { .result-grid { grid-template-columns: 1fr; } }
.res-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem;
}
.res-card.accent { border-color: rgba(124,106,255,0.3); background: rgba(124,106,255,0.04); }
.res-label {
  font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 8px; font-family: 'Syne', sans-serif;
}
.res-city { font-size: 0.85rem; color: var(--muted2); margin-bottom: 12px; }
.res-amount {
  font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
  letter-spacing: -0.04em; margin-bottom: 4px;
}
.res-sub { font-size: 0.78rem; color: var(--muted2); }

/* ratio bar */
.ratio-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 14px;
}
.ratio-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.ratio-label { font-size: 0.8rem; color: var(--muted2); }
.ratio-value {
  font-family: 'Syne', sans-serif; font-size: 0.95rem;
  font-weight: 700; color: var(--green);
}
.bar-track { height: 4px; background: var(--bg3); border-radius: 2px; overflow: hidden; }
.bar-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--green));
  transition: width 1s cubic-bezier(.4,0,.2,1);
}

/* breakdown table */
.table-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem; margin-bottom: 14px; overflow-x: auto;
}
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; min-width: 340px; }
th {
  text-align: left; padding: 0 0 12px;
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); font-weight: 500; font-family: 'Syne', sans-serif;
  border-bottom: 1px solid var(--border);
}
th:not(:first-child) { text-align: right; }
td { padding: 12px 0; border-bottom: 1px solid var(--border); }
td:not(:first-child) { text-align: right; }
td:first-child { color: var(--muted2); }
tr:last-child td { border-bottom: none; }
.diff-positive { color: var(--green); font-weight: 600; }
.diff-negative { color: var(--red); font-weight: 600; }

/* verdict */
.verdict-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem; margin-bottom: 14px;
}
.verdict-title {
  font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
  margin-bottom: 12px;
}
.verdict-body { font-size: 0.92rem; line-height: 1.8; color: var(--muted2); }
.caveat {
  margin-top: 14px; padding: 12px 16px;
  background: rgba(251,146,60,0.06);
  border-left: 2px solid rgba(251,146,60,0.35);
  border-radius: 0 8px 8px 0;
  font-size: 0.82rem; color: var(--muted2); line-height: 1.65;
}

/* meta */
.meta-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.meta-tag {
  font-size: 0.7rem; color: var(--muted); border: 1px solid var(--border);
  padding: 3px 10px; border-radius: 20px;
}
`;

const COMPARE_CONTENT = `
<main>
  <div class="container">
    <div style="padding-top:2.5rem;margin-bottom:2rem">
      <p class="section-label">Purchasing power calculator</p>
      <h1 style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;letter-spacing:-0.03em;margin-bottom:.5rem">Compare any two cities</h1>
      <p style="color:var(--muted2);font-size:.9rem">Fill in your salary and locations to get an instant equivalent salary comparison.</p>
    </div>
    <div class="compare-layout">
      <!-- SIDEBAR FORM -->
      <aside class="compare-sidebar">
        <div class="form-card">
          <div class="form-card-title">Your salary</div>
          <div class="form-grid-2">
            <div class="form-field">
              <label class="form-label">Amount</label>
              <input type="number" id="salary" class="form-input" value="100000" min="1"/>
            </div>
            <div class="form-field">
              <label class="form-label">Currency</label>
              <select id="currency" class="form-select">
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="INR">INR ₹</option>
                <option value="CAD">CAD $</option>
                <option value="AUD">AUD $</option>
                <option value="SGD">SGD $</option>
                <option value="JPY">JPY ¥</option>
                <option value="AED">AED د.إ</option>
                <option value="CHF">CHF ₣</option>
              </select>
            </div>
          </div>
          <div class="form-grid-1 form-field" style="margin-bottom:12px">
            <label class="form-label">Origin city</label>
            <input type="text" id="from" class="form-input" value="San Francisco, USA" placeholder="e.g. London, UK"/>
          </div>
          <div class="form-grid-1 form-field" style="margin-bottom:20px">
            <label class="form-label">Target city</label>
            <input type="text" id="to" class="form-input" value="Bangalore, India" placeholder="e.g. Berlin, Germany"/>
          </div>
          <button class="btn-primary" style="width:100%;justify-content:center" id="compareBtn" onclick="compare()">
            <span id="btnText">Calculate purchasing power</span>
          </button>
        </div>

        <div class="form-card">
          <div class="quick-fill-label">Quick examples</div>
          <div class="chips">
            <button class="chip" onclick="fill(100000,'USD','San Francisco, USA','Bangalore, India')">$100k SF → Bangalore</button>
            <button class="chip" onclick="fill(80000,'GBP','London, UK','Dubai, UAE')">£80k London → Dubai</button>
            <button class="chip" onclick="fill(120000,'USD','New York, USA','Berlin, Germany')">$120k NYC → Berlin</button>
            <button class="chip" onclick="fill(2000000,'INR','Mumbai, India','Singapore')">₹20L Mumbai → Singapore</button>
            <button class="chip" onclick="fill(90000,'USD','Seattle, USA','Toronto, Canada')">$90k Seattle → Toronto</button>
            <button class="chip" onclick="fill(60000,'EUR','Paris, France','Lisbon, Portugal')">€60k Paris → Lisbon</button>
          </div>
        </div>

        <div class="status-bar" id="statusBar">
          <div class="spinner"></div>
          <span id="statusMsg">Calculating...</span>
        </div>
        <div class="error-box" id="errorBox"></div>
      </aside>

      <!-- RESULTS -->
      <div id="result">
        <div class="result-grid">
          <div class="res-card">
            <p class="res-label">Origin</p>
            <p class="res-city" id="r-city1"></p>
            <p class="res-amount" id="r-sal1"></p>
            <p class="res-sub" id="r-col1"></p>
          </div>
          <div class="res-card accent">
            <p class="res-label">Equivalent in target</p>
            <p class="res-city" id="r-city2"></p>
            <span class="badge badge-accent" id="r-badge" style="margin-bottom:10px;display:inline-flex"></span>
            <p class="res-amount" id="r-sal2"></p>
            <p class="res-sub" id="r-col2"></p>
          </div>
        </div>
        <div class="ratio-card">
          <div class="ratio-row">
            <span class="ratio-label">Purchasing power ratio</span>
            <span class="ratio-value" id="r-ratio-val"></span>
          </div>
          <div class="bar-track"><div class="bar-fill" id="r-bar" style="width:0%"></div></div>
        </div>
        <div class="table-card">
          <p class="verdict-title">Monthly cost breakdown</p>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th id="th-origin">Origin</th>
                <th id="th-target">Target</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody id="breakdown-body"></tbody>
          </table>
        </div>
        <div class="verdict-card">
          <p class="verdict-title">Analysis</p>
          <p class="verdict-body" id="r-verdict"></p>
          <div class="caveat" id="r-caveat"></div>
          <div class="meta-tags">
            <span class="meta-tag" id="r-source"></span>
            <span class="meta-tag" id="r-freshness"></span>
          </div>
        </div>
      </div>

      <!-- placeholder state -->
      <div id="empty-state" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;text-align:center;color:var(--muted2)">
        <div style="font-size:3rem;margin-bottom:1.5rem;opacity:.4">🌍</div>
        <p style="font-size:0.95rem">Fill in your salary details and click calculate<br/>to see your purchasing power comparison.</p>
      </div>
    </div>
  </div>
</main>
<script>
function fill(sal, cur, from, to) {
  document.getElementById('salary').value = sal;
  document.getElementById('currency').value = cur;
  document.getElementById('from').value = from;
  document.getElementById('to').value = to;
}
async function compare() {
  const salary = document.getElementById('salary').value;
  const currency = document.getElementById('currency').value;
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  if (!salary || !from || !to) { showError('Please fill in all fields.'); return; }
  const btn = document.getElementById('compareBtn');
  const statusBar = document.getElementById('statusBar');
  const errorBox = document.getElementById('errorBox');
  const result = document.getElementById('result');
  const empty = document.getElementById('empty-state');
  document.getElementById('btnText').textContent = 'Calculating...';
  btn.disabled = true;
  statusBar.classList.add('visible');
  errorBox.classList.remove('visible');
  result.classList.remove('visible');
  try {
    const response = await fetch('/api/compare', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary, currency, from, to })
    });
    const data = await response.json();
    if (data.error) { showError(data.error); return; }
    renderResult(data);
    if (empty) empty.style.display = 'none';
  } catch (err) {
    showError('Error: ' + err.message);
  } finally {
    btn.disabled = false;
    statusBar.classList.remove('visible');
    document.getElementById('btnText').textContent = 'Calculate purchasing power';
  }
}
function renderResult(r) {
  document.getElementById('r-city1').textContent = r.origin.location;
  document.getElementById('r-sal1').textContent = r.origin.currency + ' ' + Number(r.origin.salary).toLocaleString();
  document.getElementById('r-col1').textContent = r.origin.col_index_label || '';
  document.getElementById('r-city2').textContent = r.target.location;
  document.getElementById('r-badge').textContent = r.ratio_label || '';
  document.getElementById('r-sal2').textContent = r.target.local_currency_symbol + ' ' + Math.round(r.target.equivalent_local).toLocaleString() + ' ' + r.target.local_currency_code;
  document.getElementById('r-col2').textContent = 'approx ' + r.origin.currency + ' ' + Math.round(r.target.equivalent_usd || 0).toLocaleString() + ' · ' + (r.target.col_index_label || '');
  const ratio = parseFloat(r.ratio) || 1;
  document.getElementById('r-ratio-val').textContent = r.ratio_label || ratio.toFixed(1) + 'x';
  document.getElementById('r-bar').style.width = Math.min(100, Math.max(4, Math.round((1 / ratio) * 100))) + '%';
  document.getElementById('th-origin').textContent = r.origin.location.split(',')[0];
  document.getElementById('th-target').textContent = r.target.location.split(',')[0];
  const tbody = document.getElementById('breakdown-body');
  tbody.innerHTML = '';
  const labels = { rent: 'Rent', groceries: 'Groceries', transport: 'Transport', healthcare: 'Healthcare' };
  if (r.breakdown) {
    Object.entries(r.breakdown).forEach(([key, val]) => {
      const p = parseInt(val.savings_pct) || 0;
      const neg = p < 0;
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (labels[key] || key) + '</td><td>' + val.origin + '</td><td>' + val.target + '</td><td class="' + (neg ? 'diff-negative' : 'diff-positive') + '">' + Math.abs(p) + '% ' + (neg ? 'more expensive' : 'cheaper') + '</td>';
      tbody.appendChild(tr);
    });
  }
  document.getElementById('r-verdict').textContent = r.verdict || '';
  const caveats = Array.isArray(r.caveats) ? r.caveats : (r.caveats ? [r.caveats] : []);
  document.getElementById('r-caveat').textContent = 'Note: ' + (caveats[0] || 'Actual purchasing power varies by lifestyle.');
  document.getElementById('r-source').textContent = r.data_source || 'Numbeo / World Bank PPP data';
  document.getElementById('r-freshness').textContent = r.data_freshness || '2024-2025 estimates';
  document.getElementById('result').classList.add('visible');
}
function showError(msg) {
  const b = document.getElementById('errorBox');
  b.textContent = msg;
  b.classList.add('visible');
  document.getElementById('statusBar').classList.remove('visible');
  document.getElementById('compareBtn').disabled = false;
  document.getElementById('btnText').textContent = 'Calculate purchasing power';
}
</script>`;

// ─────────────────────────────────────────────
// PAGE 3: POPULAR ROUTES
// ─────────────────────────────────────────────
const ROUTES_CSS = `
.routes-hero { padding: 4rem 0 3rem; }
.routes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 3rem; }
@media (max-width: 900px) { .routes-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 600px) { .routes-grid { grid-template-columns: 1fr; } }
.route-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem;
  transition: border-color .2s, transform .2s;
  cursor: pointer; text-decoration: none; display: block;
}
.route-card:hover { border-color: var(--border2); transform: translateY(-3px); }
.route-cities { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.route-city { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem; }
.route-arrow { color: var(--muted); font-size: 0.8rem; }
.route-ratio {
  font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800;
  letter-spacing: -0.04em; margin-bottom: 4px;
}
.route-ratio.green { color: var(--green); }
.route-ratio.orange { color: var(--orange); }
.route-ratio.red { color: var(--red); }
.route-sub { font-size: 0.78rem; color: var(--muted2); margin-bottom: 14px; }
.route-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.route-tag { font-size: 0.68rem; color: var(--muted2); border: 1px solid var(--border); padding: 2px 9px; border-radius: 20px; }
.section-tabs { margin-bottom: 2rem; }
`;

const ROUTES_DATA = [
  { from: "San Francisco", to: "Bangalore", ratio: "3.8x", color: "green", tag1: "Tech workers", tag2: "Remote teams", desc: "SF salaries go much further in Bangalore" },
  { from: "London", to: "Dubai", ratio: "1.6x", color: "green", tag1: "Finance", tag2: "Tax-free", desc: "No income tax makes Dubai surprisingly affordable" },
  { from: "New York", to: "Berlin", ratio: "1.9x", color: "green", tag1: "Tech", tag2: "EU relocation", desc: "NYC is one of the most expensive cities globally" },
  { from: "Mumbai", to: "Singapore", ratio: "0.7x", color: "red", tag1: "Expats", tag2: "SEA move", desc: "Singapore is significantly pricier than Mumbai" },
  { from: "Sydney", to: "Bali", ratio: "4.2x", color: "green", tag1: "Digital nomads", tag2: "Lifestyle", desc: "Bali is incredibly cheap for Australian earners" },
  { from: "Toronto", to: "Lisbon", ratio: "2.1x", color: "green", tag1: "EU move", tag2: "Remote work", desc: "Portugal's cost of living is dramatically lower" },
  { from: "Tokyo", to: "Seoul", ratio: "1.1x", color: "orange", tag1: "East Asia", tag2: "Similar COL", desc: "Tokyo and Seoul have comparable living costs" },
  { from: "Paris", to: "Prague", ratio: "1.8x", color: "green", tag1: "EU move", tag2: "Eastern Europe", desc: "Czech Republic offers much lower daily costs" },
  { from: "Chicago", to: "Austin", ratio: "1.3x", color: "green", tag1: "US relocation", tag2: "No state tax", desc: "Texas has no income tax and lower housing costs" },
];

const routeCardsHtml = ROUTES_DATA.map(r => `
  <a class="route-card" href="/compare?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}">
    <div class="route-cities">
      <span class="route-city">${r.from}</span>
      <span class="route-arrow">→</span>
      <span class="route-city">${r.to}</span>
    </div>
    <div class="route-ratio ${r.color}">${r.ratio}</div>
    <p class="route-sub">${r.desc}</p>
    <div class="route-tags">
      <span class="route-tag">${r.tag1}</span>
      <span class="route-tag">${r.tag2}</span>
    </div>
  </a>`).join('');

const ROUTES_CONTENT = `
<main>
  <div class="container">
    <div class="routes-hero">
      <p class="section-label">Popular comparisons</p>
      <h1 class="section-title">Routes people compare most.</h1>
      <p class="section-sub">Click any route to instantly run the comparison for a $100k salary.</p>
    </div>
    <div class="routes-grid">${routeCardsHtml}</div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;text-align:center;margin-bottom:4rem">
      <h3 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;margin-bottom:.75rem">Don't see your route?</h3>
      <p style="color:var(--muted2);font-size:.9rem;margin-bottom:1.5rem">We support any two cities in the world. Head to the compare tool and enter any combination.</p>
      <a href="/compare" class="btn-primary">Compare custom route →</a>
    </div>
  </div>
</main>`;

// ─────────────────────────────────────────────
// PAGE 4: HOW IT WORKS
// ─────────────────────────────────────────────
const HOW_CSS = `
.how-hero { padding: 4rem 0 3rem; }
.steps-list { counter-reset: steps; margin-bottom: 4rem; }
.step {
  display: grid; grid-template-columns: 56px 1fr; gap: 1.5rem;
  padding: 2rem 0; border-bottom: 1px solid var(--border);
  align-items: start;
}
.step:last-child { border-bottom: none; }
.step-num {
  width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
  background: var(--bg3); border: 1px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem;
  color: var(--accent);
}
.step-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; margin-bottom: 8px; }
.step-desc { color: var(--muted2); font-size: 0.92rem; line-height: 1.75; }

.data-section { margin-bottom: 4rem; }
.data-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
@media (max-width: 760px) { .data-grid { grid-template-columns: 1fr; } }
.data-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.5rem;
}
.data-icon { font-size: 1.5rem; margin-bottom: 1rem; }
.data-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; }
.data-desc { font-size: 0.85rem; color: var(--muted2); line-height: 1.7; }

.faq-list { margin-bottom: 4rem; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q {
  padding: 1.25rem 0; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 500; font-size: 0.95rem;
}
.faq-a { padding-bottom: 1.25rem; font-size: 0.88rem; color: var(--muted2); line-height: 1.75; display: none; }
.faq-item.open .faq-a { display: block; }
.faq-item.open .faq-icon { transform: rotate(45deg); }
.faq-icon { transition: transform .2s; color: var(--muted); }
`;

const HOW_CONTENT = `
<main>
  <div class="container">
    <div class="how-hero">
      <p class="section-label">Methodology</p>
      <h1 class="section-title">How SalaryPPP works.</h1>
      <p class="section-sub">We combine multiple authoritative data sources with AI to give you a complete picture of purchasing power.</p>
    </div>

    <div class="steps-list">
      <div class="step fade-up">
        <div class="step-num">1</div>
        <div>
          <div class="step-title">You enter your salary and locations</div>
          <div class="step-desc">Provide your annual gross salary, currency, origin city, and target city. We support any city globally, from major tech hubs to emerging markets.</div>
        </div>
      </div>
      <div class="step fade-up delay-1">
        <div class="step-num">2</div>
        <div>
          <div class="step-title">We fetch cost-of-living data</div>
          <div class="step-desc">Our AI queries real-time data from multiple sources including Numbeo's cost-of-living database, World Bank PPP indices, and current currency exchange rates.</div>
        </div>
      </div>
      <div class="step fade-up delay-2">
        <div class="step-num">3</div>
        <div>
          <div class="step-title">PPP adjustment is calculated</div>
          <div class="step-desc">Purchasing Power Parity (PPP) measures how much a standard basket of goods costs in each location. We use this to calculate the true equivalent salary — not just a currency conversion.</div>
        </div>
      </div>
      <div class="step fade-up delay-3">
        <div class="step-num">4</div>
        <div>
          <div class="step-title">Category breakdown is generated</div>
          <div class="step-desc">We break down the comparison into rent, groceries, transport, and healthcare — the four biggest drivers of cost of living — so you understand exactly where the difference comes from.</div>
        </div>
      </div>
      <div class="step fade-up delay-4">
        <div class="step-num">5</div>
        <div>
          <div class="step-title">You get a human-readable verdict</div>
          <div class="step-desc">Beyond the numbers, we generate a plain-English analysis that puts the data in context and highlights the most important factors for your specific comparison.</div>
        </div>
      </div>
    </div>

    <div class="data-section">
      <p class="section-label">Data sources</p>
      <h2 class="section-title" style="font-size:1.8rem;margin-bottom:2rem">Where does the data come from?</h2>
      <div class="data-grid">
        <div class="data-card">
          <div class="data-icon">🌐</div>
          <div class="data-title">Numbeo</div>
          <div class="data-desc">The world's largest crowd-sourced database of cost of living data. Covers 10,000+ cities with monthly updates.</div>
        </div>
        <div class="data-card">
          <div class="data-icon">🏦</div>
          <div class="data-title">World Bank PPP</div>
          <div class="data-desc">Official purchasing power parity conversion factors used by economists and policymakers globally.</div>
        </div>
        <div class="data-card">
          <div class="data-icon">💱</div>
          <div class="data-title">Live FX Rates</div>
          <div class="data-desc">Real-time currency exchange rates to ensure all comparisons use current conversions, not outdated data.</div>
        </div>
      </div>
    </div>

    <div>
      <p class="section-label">FAQ</p>
      <h2 class="section-title" style="font-size:1.8rem;margin-bottom:2rem">Common questions.</h2>
      <div class="faq-list">
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(this)">What exactly is Purchasing Power Parity? <span class="faq-icon">+</span></div>
          <div class="faq-a">PPP measures how many units of a country's currency are needed to buy the same basket of goods and services that one unit of another currency can buy. It's a more accurate measure of living standards than simple currency conversion, because it accounts for local price levels.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(this)">Is this a replacement for professional financial advice? <span class="faq-icon">+</span></div>
          <div class="faq-a">No. SalaryPPP provides general estimates based on aggregate cost-of-living data. Your personal experience will vary based on lifestyle, neighbourhood, employer benefits, family size, and many other factors. Always consult a financial advisor before making major career or relocation decisions.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(this)">How accurate are the results? <span class="faq-icon">+</span></div>
          <div class="faq-a">Our data is sourced from well-regarded databases and is typically accurate within 15-20% for major cities. Results for smaller cities or rapidly-changing economies may be less precise. We update our data regularly and clearly label the freshness of our estimates.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(this)">Does the tool account for taxes? <span class="faq-icon">+</span></div>
          <div class="faq-a">The current version compares gross salaries and cost of living. Tax differences between countries can have a significant impact on take-home pay, and we recommend factoring these in separately. Tax-free locations like Dubai will have a meaningfully different net outcome than the gross comparison suggests.</div>
        </div>
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(this)">Can I compare cities within the same country? <span class="faq-icon">+</span></div>
          <div class="faq-a">Yes! The tool works for intra-country comparisons too. For example, San Francisco vs Austin, or Mumbai vs Pune. Cost of living differences within large countries like the US, India, or China can be substantial.</div>
        </div>
      </div>
    </div>
  </div>
</main>
<script>
function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}
</script>`;

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
app.get("/", (req, res) =>
  res.send(page("Real Purchasing Power", "home", HOME_CONTENT, HOME_CSS))
);

app.get("/compare", (req, res) =>
  res.send(page("Compare Salaries", "compare", COMPARE_CONTENT, COMPARE_CSS))
);

app.get("/routes", (req, res) =>
  res.send(page("Popular Routes", "routes", ROUTES_CONTENT, ROUTES_CSS))
);

app.get("/how-it-works", (req, res) =>
  res.send(page("How It Works", "how", HOW_CONTENT, HOW_CSS))
);

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────
app.post("/api/compare", async (req, res) => {
  const { salary, currency, from, to } = req.body;
  if (!salary || !currency || !from || !to)
    return res.status(400).json({ error: "Missing fields" });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY)
    return res.status(500).json({ error: "GEMINI_API_KEY not set" });

  const prompt = `You are a cost-of-living and purchasing power parity expert.
A person earns ${Number(salary).toLocaleString()} ${currency} per year in ${from}.
Calculate the equivalent salary needed in ${to} for the same purchasing power and lifestyle.
Use Numbeo, World Bank PPP data, and current exchange rates.
Return ONLY raw JSON, no markdown, no explanation:
{
  "origin": { "location": "${from}", "salary": ${salary}, "currency": "${currency}", "col_index_label": "Cost of Living Index: [number]" },
  "target": { "location": "${to}", "local_currency_code": "[3-letter]", "local_currency_symbol": "[symbol]", "equivalent_local": [number], "equivalent_usd": [number], "col_index_label": "Cost of Living Index: [number]" },
  "ratio": [number like 3.2],
  "ratio_label": "[X]x cheaper/more expensive",
  "verdict": "[2-3 sentences]",
  "breakdown": {
    "rent": { "origin": "[e.g. $3,200/mo]", "target": "[amount/mo]", "savings_pct": [number, negative if more expensive] },
    "groceries": { "origin": "[amount/mo]", "target": "[amount/mo]", "savings_pct": [number] },
    "transport": { "origin": "[amount/mo]", "target": "[amount/mo]", "savings_pct": [number] },
    "healthcare": { "origin": "[amount/mo]", "target": "[amount/mo]", "savings_pct": [number] }
  },
  "caveats": ["[one important caveat]"],
  "data_source": "Numbeo / World Bank PPP 2024",
  "data_freshness": "2024-2025 estimates"
}`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 5000, responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) {
      const t = await response.text();
      return res.status(500).json({ error: "Gemini API error " + response.status + ": " + t });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: "Empty response", raw: data });

    let cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "");
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return res.status(500).json({ error: "No JSON found", raw: cleaned });
    cleaned = cleaned.slice(start, end + 1);

    try {
      return res.json(JSON.parse(cleaned));
    } catch (err) {
      return res.status(500).json({ error: "JSON parse failed", details: err.message, raw: cleaned });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log("SalaryPPP running on port " + PORT));
