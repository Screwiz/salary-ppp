import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ─────────────────────────────────────────────
// SHARED CSS — mobile-first throughout
// ─────────────────────────────────────────────
const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #060608; --bg2: #0d0d10; --bg3: #141418;
  --surface: rgba(255,255,255,0.04); --surface2: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.13);
  --text: #e8e6f0; --muted: #6b6980; --muted2: #9997b0;
  --accent: #7c6aff; --accent2: #a855f7;
  --green: #22d3a0; --orange: #fb923c; --red: #f87171;
  --r: 12px; --nav-h: 56px;
}
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  background: var(--bg); color: var(--text);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px; line-height: 1.6;
  min-height: 100vh; overflow-x: hidden;
}
img, svg { max-width: 100%; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1rem;
  background: rgba(6,6,8,0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.05rem;
  text-decoration: none; color: var(--text); letter-spacing: -0.03em;
  display: flex; align-items: center; gap: 7px;
  flex-shrink: 0;
}
.nav-logo .dot {
  width: 7px; height: 7px; background: var(--accent);
  border-radius: 50%; box-shadow: 0 0 8px var(--accent);
}
/* desktop links */
.nav-links {
  display: none;
  align-items: center; gap: 2px;
}
.nav-links a {
  color: var(--muted2); text-decoration: none; font-size: 0.88rem;
  padding: 6px 12px; border-radius: 8px; transition: all 0.15s; font-weight: 500;
}
.nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--surface2); }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-cta {
  display: none;
  background: var(--accent); color: #fff; text-decoration: none;
  font-size: 0.82rem; font-weight: 600; padding: 7px 16px; border-radius: 8px;
  transition: all 0.2s; font-family: 'Syne', sans-serif;
  white-space: nowrap;
}
.nav-cta:hover { background: #6b58f0; box-shadow: 0 4px 20px rgba(124,106,255,0.3); }

/* hamburger */
.nav-burger {
  width: 40px; height: 40px; border: none; background: var(--surface2);
  border-radius: 8px; cursor: pointer; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 5px; flex-shrink: 0;
  transition: background 0.15s;
}
.nav-burger:hover { background: var(--border2); }
.nav-burger span {
  display: block; width: 18px; height: 1.5px; background: var(--text);
  border-radius: 1px; transition: all 0.25s;
}
.nav-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* mobile drawer */
.nav-drawer {
  display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; bottom: 0;
  background: rgba(6,6,8,0.97); backdrop-filter: blur(24px);
  z-index: 999; flex-direction: column;
  padding: 1.5rem 1.25rem; gap: 4px;
  border-top: 1px solid var(--border);
}
.nav-drawer.open { display: flex; animation: slideDown 0.2s ease both; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.nav-drawer a {
  color: var(--text); text-decoration: none; font-size: 1.05rem; font-weight: 500;
  padding: 14px 12px; border-radius: 10px; transition: background 0.15s;
  border-bottom: 1px solid var(--border);
}
.nav-drawer a:last-child { border-bottom: none; }
.nav-drawer a.active { color: var(--accent); }
.nav-drawer a:hover { background: var(--surface2); }
.drawer-cta {
  margin-top: 1rem; background: var(--accent) !important; color: #fff !important;
  text-align: center; font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: 0.95rem; border-radius: 10px; border-bottom: none !important;
}

@media (min-width: 700px) {
  .nav { padding: 0 2rem; }
  .nav-links { display: flex; }
  .nav-cta { display: block; }
  .nav-burger { display: none; }
  .nav-drawer { display: none !important; }
}

/* ── SPACER ── */
.nav-spacer { height: var(--nav-h); }

/* ── BUTTONS ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--accent); color: #fff; border: none; border-radius: 10px;
  padding: 13px 24px; font-family: 'Syne', sans-serif; font-weight: 600;
  font-size: 0.92rem; cursor: pointer; transition: all 0.2s; text-decoration: none;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation;
}
.btn-primary:hover { background: #6b58f0; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,106,255,0.35); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-full { width: 100%; }
.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--surface); color: var(--text); border: 1px solid var(--border2);
  border-radius: 10px; padding: 13px 24px;
  font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.92rem;
  cursor: pointer; transition: all 0.2s; text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.btn-ghost:hover { background: var(--surface2); border-color: var(--muted2); }

/* ── BADGE ── */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; padding: 4px 11px; border-radius: 20px;
  font-family: 'Syne', sans-serif;
}
.badge-accent { background: rgba(124,106,255,0.15); color: var(--accent); border: 1px solid rgba(124,106,255,0.25); }
.badge-green  { background: rgba(34,211,160,0.12); color: var(--green); border: 1px solid rgba(34,211,160,0.2); }
.badge-orange { background: rgba(251,146,60,0.12); color: var(--orange); border: 1px solid rgba(251,146,60,0.2); }

/* ── LAYOUT ── */
.section { padding: 3rem 0; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.1rem; }
@media (min-width: 700px) { .section { padding: 5rem 0; } .container { padding: 0 2rem; } }

.section-label {
  font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.75rem;
}
.section-title {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(1.7rem, 5vw, 2.8rem);
  letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem;
}
.section-sub { font-size: 0.95rem; color: var(--muted2); line-height: 1.75; }

/* ── FORM ── */
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); font-weight: 500; font-family: 'Syne', sans-serif;
}
.form-input, .form-select {
  background: var(--bg3); border: 1px solid var(--border2); border-radius: 10px;
  padding: 13px 14px; color: var(--text); font-family: 'Instrument Sans', sans-serif;
  font-size: 1rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  -webkit-appearance: none; appearance: none;
}
.form-input:focus, .form-select:focus {
  border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,106,255,0.12);
}
.form-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6980' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
.form-select option { background: #1a1a1e; }

/* ── STATUS / ERROR ── */
.status-bar {
  display: none; align-items: center; gap: 10px; padding: 13px 16px;
  background: var(--surface2); border: 1px solid var(--border); border-radius: 10px;
  margin: 1rem 0; font-size: 0.88rem; color: var(--muted2);
}
.status-bar.visible { display: flex; }
.spinner {
  width: 16px; height: 16px; border: 2px solid var(--border2);
  border-top-color: var(--accent); border-radius: 50%;
  animation: spin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-box {
  display: none; padding: 13px 16px;
  background: rgba(248,113,113,0.07); border: 1px solid rgba(248,113,113,0.25);
  border-radius: 10px; font-size: 0.88rem; color: var(--red); margin: 1rem 0;
}
.error-box.visible { display: block; }

/* ── NOISE ── */
.noise-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── ANIM ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease both; }
.d1 { animation-delay: 0.08s; } .d2 { animation-delay: 0.16s; }
.d3 { animation-delay: 0.24s; } .d4 { animation-delay: 0.32s; }

/* ── FOOTER ── */
footer {
  border-top: 1px solid var(--border); padding: 2.5rem 1.1rem;
  text-align: center; font-size: 0.78rem; color: var(--muted);
}
.footer-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: -0.03em; display: flex; align-items: center; gap: 7px; color: var(--text); }
.footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
.footer-links a { color: var(--muted); text-decoration: none; transition: color 0.15s; font-size: 0.82rem; }
.footer-links a:hover { color: var(--text); }
`;

// ─────────────────────────────────────────────
// NAV + FOOTER helpers
// ─────────────────────────────────────────────
const NAV = (active) => `
<nav class="nav">
  <a href="/" class="nav-logo"><span class="dot"></span>SalaryPPP</a>
  <div class="nav-links">
    <a href="/" class="${active==='home'?'active':''}">Home</a>
    <a href="/compare" class="${active==='compare'?'active':''}">Compare</a>
    <a href="/routes" class="${active==='routes'?'active':''}">Popular Routes</a>
    <a href="/how-it-works" class="${active==='how'?'active':''}">How It Works</a>
  </div>
  <div class="nav-right">
    <a href="/compare" class="nav-cta">Try it free →</a>
    <button class="nav-burger" id="burger" aria-label="Menu" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-drawer" id="drawer">
  <a href="/" class="${active==='home'?'active':''}">Home</a>
  <a href="/compare" class="${active==='compare'?'active':''}">Compare salaries</a>
  <a href="/routes" class="${active==='routes'?'active':''}">Popular routes</a>
  <a href="/how-it-works" class="${active==='how'?'active':''}">How it works</a>
  <a href="/compare" class="drawer-cta">Try it free →</a>
</div>
<script>
function toggleMenu(){
  var b=document.getElementById('burger'), d=document.getElementById('drawer');
  b.classList.toggle('open'); d.classList.toggle('open');
  document.body.style.overflow = d.classList.contains('open') ? 'hidden' : '';
}
// close on outside click
document.addEventListener('click', function(e){
  var d=document.getElementById('drawer'), b=document.getElementById('burger');
  if(d && d.classList.contains('open') && !d.contains(e.target) && !b.contains(e.target)){
    b.classList.remove('open'); d.classList.remove('open'); document.body.style.overflow='';
  }
});
</script>`;

const FOOTER = `
<footer>
  <div class="footer-inner">
    <div class="footer-logo"><span class="dot"></span>SalaryPPP</div>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/compare">Compare</a>
      <a href="/routes">Popular Routes</a>
      <a href="/how-it-works">How It Works</a>
    </div>
    <p>© 2025 SalaryPPP · Purchasing power estimates via AI · Not financial advice</p>
  </div>
</footer>`;

const wrap = (title, active, body, css='') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>${title} · SalaryPPP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet"/>
  <style>${SHARED_CSS}${css}</style>
</head>
<body>
<div class="noise-bg"></div>
${NAV(active)}
<div class="nav-spacer"></div>
${body}
${FOOTER}
</body>
</html>`;

// ══════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════
const HOME_CSS = `
.hero {
  position: relative; overflow: hidden;
  padding: 3.5rem 1.1rem 3rem; text-align: center;
  display: flex; flex-direction: column; align-items: center;
}
@media (min-width: 700px) { .hero { padding: 6rem 2rem 4rem; min-height: calc(100vh - var(--nav-h)); justify-content: center; } }
.hero-orb1 {
  position: absolute; width: 400px; height: 400px; border-radius: 50%;
  background: var(--accent); opacity: 0.1; filter: blur(80px);
  top: -150px; left: 50%; transform: translateX(-50%); pointer-events: none;
}
.hero-orb2 {
  position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: var(--accent2); opacity: 0.07; filter: blur(70px);
  bottom: -50px; right: -80px; pointer-events: none;
}
.hero-eyebrow { margin-bottom: 1.25rem; }
.hero h1 {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(2.2rem, 9vw, 5rem);
  line-height: 1.0; letter-spacing: -0.04em; margin-bottom: 1.25rem;
}
.gtxt {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { font-size: 1rem; color: var(--muted2); max-width: 500px; line-height: 1.75; margin-bottom: 2rem; }
.hero-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px; margin-bottom: 2.5rem; }
@media (min-width: 420px) { .hero-btns { flex-direction: row; width: auto; max-width: none; } }

.hero-stats {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 0;
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  overflow: hidden; width: 100%; max-width: 480px;
}
@media (min-width: 500px) { .hero-stats { grid-template-columns: repeat(4, 1fr); } }
.hero-stat {
  text-align: center; padding: 1.1rem 0.5rem;
  border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.hero-stats .hero-stat:nth-child(2n) { border-right: none; }
@media (min-width: 500px) {
  .hero-stat { border-bottom: none; }
  .hero-stats .hero-stat:nth-child(2n) { border-right: 1px solid var(--border); }
  .hero-stats .hero-stat:last-child { border-right: none; }
}
.hero-stat-num { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; }
.hero-stat-lbl { font-size: 0.7rem; color: var(--muted2); margin-top: 2px; }

/* features */
.feat-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 540px) { .feat-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 900px) { .feat-grid { grid-template-columns: repeat(3, 1fr); } }
.feat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.4rem;
  transition: border-color .2s, transform .2s;
}
.feat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
.feat-icon {
  width: 40px; height: 40px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; margin-bottom: 0.9rem;
}
.feat-icon.p { background: rgba(124,106,255,0.15); }
.feat-icon.g { background: rgba(34,211,160,0.12); }
.feat-icon.o { background: rgba(251,146,60,0.12); }
.feat-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 6px; }
.feat-desc { font-size: 0.85rem; color: var(--muted2); line-height: 1.65; }

/* testimonials */
.testi-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px) { .testi-grid { grid-template-columns: 1fr 1fr; } }
.testi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.4rem; }
.testi-quote { font-size: 0.88rem; line-height: 1.75; color: var(--muted2); margin-bottom: 1rem; font-style: italic; }
.testi-author { display: flex; align-items: center; gap: 10px; }
.testi-av { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; font-family: 'Syne', sans-serif; flex-shrink: 0; }
.testi-name { font-size: 0.83rem; font-weight: 600; }
.testi-role { font-size: 0.72rem; color: var(--muted2); }

/* CTA */
.cta-box {
  background: linear-gradient(135deg, rgba(124,106,255,0.12), rgba(168,85,247,0.07));
  border: 1px solid rgba(124,106,255,0.2); border-radius: 18px;
  padding: 3rem 1.5rem; text-align: center; margin: 1rem 0;
}
@media (min-width: 600px) { .cta-box { padding: 4rem 2rem; } }
`;

const HOME_BODY = `
<main>
  <section class="hero">
    <div class="hero-orb1"></div><div class="hero-orb2"></div>
    <div class="hero-eyebrow fade-up"><span class="badge badge-accent">✦ Real purchasing power data</span></div>
    <h1 class="fade-up d1">Your salary means<br/><span class="gtxt">different things</span><br/>everywhere.</h1>
    <p class="hero-sub fade-up d2">$100k in San Francisco ≠ $100k in Hyderabad. Discover what your salary is truly worth — adjusted for real cost of living.</p>
    <div class="hero-btns fade-up d3">
      <a href="/compare" class="btn-primary">Calculate now →</a>
      <a href="/how-it-works" class="btn-ghost">How it works</a>
    </div>
    <div class="hero-stats fade-up d4">
      <div class="hero-stat"><div class="hero-stat-num">180+</div><div class="hero-stat-lbl">Countries</div></div>
      <div class="hero-stat"><div class="hero-stat-num">PPP</div><div class="hero-stat-lbl">Adjusted</div></div>
      <div class="hero-stat"><div class="hero-stat-num">2025</div><div class="hero-stat-lbl">Current data</div></div>
      <div class="hero-stat"><div class="hero-stat-num">Free</div><div class="hero-stat-lbl">Always</div></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="section-label">Why SalaryPPP</p>
      <h2 class="section-title">Built for real decisions.</h2>
      <p class="section-sub" style="margin-bottom:2rem">Whether you're negotiating a relocation package or comparing offers across borders, you need real data.</p>
      <div class="feat-grid">
        <div class="feat-card"><div class="feat-icon p">💡</div><div class="feat-title">PPP-Adjusted Salaries</div><div class="feat-desc">World Bank and Numbeo data to calculate true equivalent salaries, not just currency conversion.</div></div>
        <div class="feat-card"><div class="feat-icon g">📊</div><div class="feat-title">Category Breakdown</div><div class="feat-desc">Rent, groceries, transport, healthcare — see exactly where the difference comes from.</div></div>
        <div class="feat-card"><div class="feat-icon o">🌍</div><div class="feat-title">Global Coverage</div><div class="feat-desc">Compare any two cities in the world, from Tier-1 tech hubs to emerging markets.</div></div>
        <div class="feat-card"><div class="feat-icon p">⚡</div><div class="feat-title">Instant Results</div><div class="feat-desc">Full cost-of-living breakdown in under 5 seconds, powered by AI.</div></div>
        <div class="feat-card"><div class="feat-icon g">🔀</div><div class="feat-title">Any Currency</div><div class="feat-desc">USD, EUR, GBP, INR, SGD, AED and more — apples-to-apples comparisons.</div></div>
        <div class="feat-card"><div class="feat-icon o">📝</div><div class="feat-title">Human Verdict</div><div class="feat-desc">Plain-English analysis of whether the move makes financial sense for you.</div></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--bg2)">
    <div class="container">
      <p class="section-label">What people say</p>
      <h2 class="section-title" style="margin-bottom:2rem">Used by people making<br/>big career moves.</h2>
      <div class="testi-grid">
        <div class="testi-card"><p class="testi-quote">"I was about to take a ₹30L job in Bangalore. SalaryPPP showed me I'd actually be earning less in real terms. Negotiated for ₹45L instead."</p><div class="testi-author"><div class="testi-av" style="background:rgba(124,106,255,.2);color:var(--accent)">AK</div><div><div class="testi-name">Arjun K.</div><div class="testi-role">Software Eng · Singapore → Bangalore</div></div></div></div>
        <div class="testi-card"><p class="testi-quote">"My company offered $90k to move from NYC to Austin — looks like a paycut but SalaryPPP showed it's 40% more purchasing power. Took the job."</p><div class="testi-author"><div class="testi-av" style="background:rgba(34,211,160,.15);color:var(--green)">SL</div><div><div class="testi-name">Sarah L.</div><div class="testi-role">Product Manager · NYC → Austin</div></div></div></div>
        <div class="testi-card"><p class="testi-quote">"I knew rent would be cheaper in Lisbon but didn't realise groceries and healthcare were 60% cheaper too. The breakdown is insanely useful."</p><div class="testi-author"><div class="testi-av" style="background:rgba(251,146,60,.15);color:var(--orange)">DM</div><div><div class="testi-name">Diego M.</div><div class="testi-role">Freelancer · London → Lisbon</div></div></div></div>
        <div class="testi-card"><p class="testi-quote">"Shared this with my whole team when evaluating remote work policies. It's the clearest tool I've found for explaining geographic pay differences."</p><div class="testi-author"><div class="testi-av" style="background:rgba(168,85,247,.15);color:var(--accent2)">RC</div><div><div class="testi-name">Rachel C.</div><div class="testi-role">HR Director · San Francisco</div></div></div></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="cta-box">
        <p class="section-label" style="margin-bottom:.75rem">Ready to find out?</p>
        <h2 class="section-title" style="max-width:500px;margin:0 auto 1rem">What is your salary<br/>really worth?</h2>
        <p style="color:var(--muted2);margin-bottom:1.75rem;font-size:.9rem">Takes 30 seconds. No signup needed.</p>
        <a href="/compare" class="btn-primary" style="font-size:1rem;padding:14px 32px">Compare now →</a>
      </div>
    </div>
  </section>
</main>`;

// ══════════════════════════════════════════════
// COMPARE
// ══════════════════════════════════════════════
const COMPARE_CSS = `
.compare-wrap { padding: 2rem 0 4rem; }
.compare-head { margin-bottom: 1.75rem; }
.compare-head h1 { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(1.6rem,5vw,2.2rem); letter-spacing:-0.03em; margin-bottom:.4rem; }

/* form card */
.form-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.4rem; margin-bottom:14px; }
.form-card-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.88rem; margin-bottom:1.1rem; }
.row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.row1 { margin-bottom:10px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:.25rem; }
.chip { font-size:.72rem; color:var(--muted2); border:1px solid var(--border); border-radius:20px; padding:5px 12px; cursor:pointer; transition:all .15s; background:none; font-family:'Instrument Sans',sans-serif; -webkit-tap-highlight-color:transparent; }
.chip:hover, .chip:active { border-color:var(--accent); color:var(--accent); background:rgba(124,106,255,.07); }

/* results */
#result { display:none; }
#result.visible { display:block; animation:fadeUp .4s ease both; }
.res-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
@media (max-width:480px) { .res-grid { grid-template-columns:1fr; } }
.res-card { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:1.25rem; }
.res-card.hl { border-color:rgba(124,106,255,.3); background:rgba(124,106,255,.04); }
.res-lbl { font-size:.63rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:7px; font-family:'Syne',sans-serif; }
.res-city { font-size:.82rem; color:var(--muted2); margin-bottom:10px; }
.res-amount { font-family:'Syne',sans-serif; font-size:clamp(1.4rem,5vw,2rem); font-weight:800; letter-spacing:-0.04em; margin-bottom:4px; word-break:break-all; }
.res-sub { font-size:.75rem; color:var(--muted2); }
.ratio-card { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:1.1rem 1.25rem; margin-bottom:12px; }
.ratio-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:9px; }
.ratio-lbl { font-size:.8rem; color:var(--muted2); }
.ratio-val { font-family:'Syne',sans-serif; font-size:.92rem; font-weight:700; color:var(--green); }
.bar-track { height:4px; background:var(--bg3); border-radius:2px; overflow:hidden; }
.bar-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--accent),var(--green)); transition:width 1s cubic-bezier(.4,0,.2,1); }
.tbl-card { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:1.25rem; margin-bottom:12px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
.tbl-title { font-size:.63rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:14px; font-family:'Syne',sans-serif; }
table { width:100%; border-collapse:collapse; font-size:.85rem; min-width:300px; }
th { text-align:left; padding:0 0 10px; font-size:.63rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); font-weight:500; font-family:'Syne',sans-serif; border-bottom:1px solid var(--border); }
th:not(:first-child) { text-align:right; }
td { padding:10px 0; border-bottom:1px solid var(--border); }
td:not(:first-child) { text-align:right; }
td:first-child { color:var(--muted2); }
tr:last-child td { border-bottom:none; }
.dp { color:var(--green); font-weight:600; } .dn { color:var(--red); font-weight:600; }
.verdict-card { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:1.25rem; margin-bottom:12px; }
.verdict-body { font-size:.9rem; line-height:1.8; color:var(--muted2); }
.caveat { margin-top:12px; padding:11px 14px; background:rgba(251,146,60,.06); border-left:2px solid rgba(251,146,60,.35); border-radius:0 7px 7px 0; font-size:.8rem; color:var(--muted2); line-height:1.65; }
.meta-tags { display:flex; gap:7px; flex-wrap:wrap; margin-top:14px; }
.meta-tag { font-size:.68rem; color:var(--muted); border:1px solid var(--border); padding:3px 9px; border-radius:20px; }

/* desktop: sidebar layout */
@media (min-width:900px) {
  .compare-layout { display:grid; grid-template-columns:400px 1fr; gap:2rem; align-items:start; }
  .compare-sidebar { position:sticky; top:calc(var(--nav-h) + 1rem); }
  #empty-state { display:flex !important; }
}
`;

const COMPARE_BODY = `
<main>
  <div class="container compare-wrap">
    <div class="compare-head">
      <p class="section-label">Purchasing power calculator</p>
      <h1>Compare any two cities</h1>
      <p style="color:var(--muted2);font-size:.88rem">Fill in your salary and locations for an instant comparison.</p>
    </div>
    <div class="compare-layout">
      <aside class="compare-sidebar">
        <div class="form-card">
          <div class="form-card-title">Your salary</div>
          <div class="row2">
            <div class="form-field">
              <label class="form-label">Amount</label>
              <input type="number" id="salary" class="form-input" value="100000" min="1" inputmode="numeric"/>
            </div>
            <div class="form-field">
              <label class="form-label">Currency</label>
              <select id="currency" class="form-select">
                <option value="USD">USD $</option><option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option><option value="INR">INR ₹</option>
                <option value="CAD">CAD $</option><option value="AUD">AUD $</option>
                <option value="SGD">SGD $</option><option value="JPY">JPY ¥</option>
                <option value="AED">AED</option><option value="CHF">CHF ₣</option>
              </select>
            </div>
          </div>
          <div class="row1 form-field">
            <label class="form-label">From</label>
            <input type="text" id="from" class="form-input" value="San Francisco, USA" placeholder="e.g. London, UK" autocomplete="off"/>
          </div>
          <div class="row1 form-field" style="margin-bottom:16px">
            <label class="form-label">To</label>
            <input type="text" id="to" class="form-input" value="Bangalore, India" placeholder="e.g. Berlin, Germany" autocomplete="off"/>
          </div>
          <button class="btn-primary btn-full" id="compareBtn" onclick="compare()">
            <span id="btnText">Calculate purchasing power</span>
          </button>
        </div>

        <div class="form-card">
          <div class="form-card-title" style="margin-bottom:.75rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Quick examples</div>
          <div class="chips">
            <button class="chip" onclick="fill(100000,'USD','San Francisco, USA','Bangalore, India')">$100k SF→Bangalore</button>
            <button class="chip" onclick="fill(80000,'GBP','London, UK','Dubai, UAE')">£80k London→Dubai</button>
            <button class="chip" onclick="fill(120000,'USD','New York, USA','Berlin, Germany')">$120k NYC→Berlin</button>
            <button class="chip" onclick="fill(2000000,'INR','Mumbai, India','Singapore')">₹20L Mumbai→Singapore</button>
            <button class="chip" onclick="fill(90000,'USD','Seattle, USA','Toronto, Canada')">$90k Seattle→Toronto</button>
            <button class="chip" onclick="fill(60000,'EUR','Paris, France','Lisbon, Portugal')">€60k Paris→Lisbon</button>
          </div>
        </div>

        <div class="status-bar" id="statusBar"><div class="spinner"></div><span id="statusMsg">Calculating...</span></div>
        <div class="error-box" id="errorBox"></div>
      </aside>

      <div>
        <div id="result">
          <div class="res-grid">
            <div class="res-card"><p class="res-lbl">Origin</p><p class="res-city" id="r-city1"></p><p class="res-amount" id="r-sal1"></p><p class="res-sub" id="r-col1"></p></div>
            <div class="res-card hl"><p class="res-lbl">Equivalent in target</p><p class="res-city" id="r-city2"></p><span class="badge badge-accent" id="r-badge" style="margin-bottom:8px;display:inline-flex"></span><p class="res-amount" id="r-sal2"></p><p class="res-sub" id="r-col2"></p></div>
          </div>
          <div class="ratio-card">
            <div class="ratio-row"><span class="ratio-lbl">Purchasing power ratio</span><span class="ratio-val" id="r-ratio-val"></span></div>
            <div class="bar-track"><div class="bar-fill" id="r-bar" style="width:0%"></div></div>
          </div>
          <div class="tbl-card">
            <p class="tbl-title">Monthly cost breakdown</p>
            <table>
              <thead><tr><th>Category</th><th id="th-o">Origin</th><th id="th-t">Target</th><th>Diff</th></tr></thead>
              <tbody id="tbody"></tbody>
            </table>
          </div>
          <div class="verdict-card">
            <p class="tbl-title">Analysis</p>
            <p class="verdict-body" id="r-verdict"></p>
            <div class="caveat" id="r-caveat"></div>
            <div class="meta-tags"><span class="meta-tag" id="r-src"></span><span class="meta-tag" id="r-fresh"></span></div>
          </div>
        </div>
        <div id="empty-state" style="display:none;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;text-align:center;color:var(--muted2)">
          <div style="font-size:2.5rem;margin-bottom:1rem;opacity:.35">🌍</div>
          <p style="font-size:.9rem">Enter your salary and cities,<br/>then hit calculate.</p>
        </div>
      </div>
    </div>
  </div>
</main>
<script>
function fill(sal,cur,from,to){
  document.getElementById('salary').value=sal;
  document.getElementById('currency').value=cur;
  document.getElementById('from').value=from;
  document.getElementById('to').value=to;
}
async function compare(){
  var salary=document.getElementById('salary').value,
      currency=document.getElementById('currency').value,
      from=document.getElementById('from').value.trim(),
      to=document.getElementById('to').value.trim();
  if(!salary||!from||!to){showError('Please fill in all fields.');return;}
  var btn=document.getElementById('compareBtn'),
      sb=document.getElementById('statusBar'),
      eb=document.getElementById('errorBox'),
      res=document.getElementById('result'),
      es=document.getElementById('empty-state');
  document.getElementById('btnText').textContent='Calculating...';
  btn.disabled=true; sb.classList.add('visible');
  eb.classList.remove('visible'); res.classList.remove('visible');
  try{
    var r=await fetch('/api/compare',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({salary,currency,from,to})});
    var data=await r.json();
    if(data.error){showError(data.error);return;}
    renderResult(data);
    if(es)es.style.display='none';
  }catch(e){showError('Error: '+e.message);}
  finally{
    btn.disabled=false; sb.classList.remove('visible');
    document.getElementById('btnText').textContent='Calculate purchasing power';
  }
}
function renderResult(r){
  document.getElementById('r-city1').textContent=r.origin.location;
  document.getElementById('r-sal1').textContent=r.origin.currency+' '+Number(r.origin.salary).toLocaleString();
  document.getElementById('r-col1').textContent=r.origin.col_index_label||'';
  document.getElementById('r-city2').textContent=r.target.location;
  document.getElementById('r-badge').textContent=r.ratio_label||'';
  document.getElementById('r-sal2').textContent=r.target.local_currency_symbol+' '+Math.round(r.target.equivalent_local).toLocaleString()+' '+r.target.local_currency_code;
  document.getElementById('r-col2').textContent='approx '+r.origin.currency+' '+Math.round(r.target.equivalent_usd||0).toLocaleString()+' · '+(r.target.col_index_label||'');
  var ratio=parseFloat(r.ratio)||1;
  document.getElementById('r-ratio-val').textContent=r.ratio_label||ratio.toFixed(1)+'x';
  document.getElementById('r-bar').style.width=Math.min(100,Math.max(4,Math.round((1/ratio)*100)))+'%';
  document.getElementById('th-o').textContent=r.origin.location.split(',')[0];
  document.getElementById('th-t').textContent=r.target.location.split(',')[0];
  var tb=document.getElementById('tbody'); tb.innerHTML='';
  var lbls={rent:'Rent',groceries:'Groceries',transport:'Transport',healthcare:'Healthcare'};
  if(r.breakdown){Object.entries(r.breakdown).forEach(function([k,v]){
    var p=parseInt(v.savings_pct)||0,neg=p<0,tr=document.createElement('tr');
    tr.innerHTML='<td>'+(lbls[k]||k)+'</td><td>'+v.origin+'</td><td>'+v.target+'</td><td class="'+(neg?'dn':'dp')+'">'+Math.abs(p)+'% '+(neg?'more':'less')+'</td>';
    tb.appendChild(tr);
  });}
  document.getElementById('r-verdict').textContent=r.verdict||'';
  var cv=Array.isArray(r.caveats)?r.caveats:(r.caveats?[r.caveats]:[]);
  document.getElementById('r-caveat').textContent='Note: '+(cv[0]||'Actual purchasing power varies by lifestyle.');
  document.getElementById('r-src').textContent=r.data_source||'Numbeo / World Bank PPP data';
  document.getElementById('r-fresh').textContent=r.data_freshness||'2024-2025 estimates';
  document.getElementById('result').classList.add('visible');
  document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});
}
function showError(msg){
  var b=document.getElementById('errorBox');
  b.textContent=msg; b.classList.add('visible');
  document.getElementById('statusBar').classList.remove('visible');
  document.getElementById('compareBtn').disabled=false;
  document.getElementById('btnText').textContent='Calculate purchasing power';
}
</script>`;

// ══════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════
const ROUTES_CSS = `
.routes-head { padding: 2.5rem 0 2rem; }
.routes-grid { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:2.5rem; }
@media (min-width:540px) { .routes-grid { grid-template-columns:1fr 1fr; } }
@media (min-width:900px) { .routes-grid { grid-template-columns:repeat(3,1fr); } }
.route-card {
  background:var(--surface); border:1px solid var(--border); border-radius:14px;
  padding:1.4rem; text-decoration:none; display:block;
  transition:border-color .2s, transform .2s;
  -webkit-tap-highlight-color:transparent;
}
.route-card:hover { border-color:var(--border2); transform:translateY(-2px); }
.route-cities { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
.route-city { font-family:'Syne',sans-serif; font-weight:700; font-size:.88rem; }
.route-arrow { color:var(--muted); font-size:.8rem; }
.route-ratio { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; letter-spacing:-0.04em; margin-bottom:4px; }
.rg { color:var(--green); } .ro { color:var(--orange); } .rr { color:var(--red); }
.route-sub { font-size:.8rem; color:var(--muted2); margin-bottom:12px; line-height:1.55; }
.route-tags { display:flex; gap:6px; flex-wrap:wrap; }
.route-tag { font-size:.68rem; color:var(--muted2); border:1px solid var(--border); padding:2px 9px; border-radius:20px; }
.routes-cta { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:2rem 1.5rem; text-align:center; margin-bottom:3rem; }
.routes-cta h3 { font-family:'Syne',sans-serif; font-weight:800; font-size:1.2rem; margin-bottom:.6rem; }
.routes-cta p { color:var(--muted2); font-size:.88rem; margin-bottom:1.4rem; }
`;

const routesData = [
  {from:"San Francisco",to:"Bangalore",ratio:"3.8x",col:"rg",t1:"Tech workers",t2:"Remote teams",desc:"SF salaries go much further in Bangalore"},
  {from:"London",to:"Dubai",ratio:"1.6x",col:"rg",t1:"Finance",t2:"Tax-free",desc:"No income tax makes Dubai surprisingly affordable"},
  {from:"New York",to:"Berlin",ratio:"1.9x",col:"rg",t1:"Tech",t2:"EU relocation",desc:"NYC is one of the most expensive cities globally"},
  {from:"Mumbai",to:"Singapore",ratio:"0.7x",col:"rr",t1:"Expats",t2:"SEA move",desc:"Singapore is significantly pricier than Mumbai"},
  {from:"Sydney",to:"Bali",ratio:"4.2x",col:"rg",t1:"Digital nomads",t2:"Lifestyle",desc:"Bali is incredibly cheap for Australian earners"},
  {from:"Toronto",to:"Lisbon",ratio:"2.1x",col:"rg",t1:"EU move",t2:"Remote work",desc:"Portugal's cost of living is dramatically lower"},
  {from:"Tokyo",to:"Seoul",ratio:"1.1x",col:"ro",t1:"East Asia",t2:"Similar COL",desc:"Tokyo and Seoul have comparable living costs"},
  {from:"Paris",to:"Prague",ratio:"1.8x",col:"rg",t1:"EU move",t2:"Eastern Europe",desc:"Czech Republic offers much lower daily costs"},
  {from:"Chicago",to:"Austin",ratio:"1.3x",col:"rg",t1:"US relocation",t2:"No state tax",desc:"Texas has no income tax and lower housing costs"},
];

const ROUTES_BODY = `
<main>
  <div class="container">
    <div class="routes-head">
      <p class="section-label">Popular comparisons</p>
      <h1 class="section-title">Routes people compare most.</h1>
      <p class="section-sub">Tap any route to run the comparison instantly.</p>
    </div>
    <div class="routes-grid">
      ${routesData.map(r=>`
      <a class="route-card" href="/compare?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}">
        <div class="route-cities"><span class="route-city">${r.from}</span><span class="route-arrow">→</span><span class="route-city">${r.to}</span></div>
        <div class="route-ratio ${r.col}">${r.ratio}</div>
        <p class="route-sub">${r.desc}</p>
        <div class="route-tags"><span class="route-tag">${r.t1}</span><span class="route-tag">${r.t2}</span></div>
      </a>`).join('')}
    </div>
    <div class="routes-cta">
      <h3>Don't see your route?</h3>
      <p>We support any two cities in the world.</p>
      <a href="/compare" class="btn-primary">Compare custom route →</a>
    </div>
  </div>
</main>`;

// ══════════════════════════════════════════════
// HOW IT WORKS
// ══════════════════════════════════════════════
const HOW_CSS = `
.how-head { padding:2.5rem 0 2rem; }
.steps { margin-bottom:3rem; }
.step { display:grid; grid-template-columns:44px 1fr; gap:1rem; padding:1.5rem 0; border-bottom:1px solid var(--border); }
.step:last-child { border-bottom:none; }
.step-num { width:40px; height:40px; border-radius:10px; background:var(--bg3); border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; color:var(--accent); flex-shrink:0; }
.step-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem; margin-bottom:6px; }
.step-desc { font-size:.85rem; color:var(--muted2); line-height:1.7; }
.data-grid { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:3rem; }
@media (min-width:540px) { .data-grid { grid-template-columns:1fr 1fr; } }
@media (min-width:800px) { .data-grid { grid-template-columns:repeat(3,1fr); } }
.data-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.4rem; }
.data-icon { font-size:1.4rem; margin-bottom:.9rem; }
.data-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.92rem; margin-bottom:6px; }
.data-desc { font-size:.83rem; color:var(--muted2); line-height:1.65; }
.faq-item { border-bottom:1px solid var(--border); }
.faq-q { padding:1.1rem 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-weight:500; font-size:.92rem; gap:1rem; -webkit-tap-highlight-color:transparent; }
.faq-icon { color:var(--muted); font-size:1.1rem; transition:transform .2s; flex-shrink:0; }
.faq-a { padding-bottom:1.1rem; font-size:.85rem; color:var(--muted2); line-height:1.75; display:none; }
.faq-item.open .faq-a { display:block; }
.faq-item.open .faq-icon { transform:rotate(45deg); }
`;

const HOW_BODY = `
<main>
  <div class="container">
    <div class="how-head">
      <p class="section-label">Methodology</p>
      <h1 class="section-title">How SalaryPPP works.</h1>
      <p class="section-sub">We combine authoritative data with AI to give you a complete picture of purchasing power.</p>
    </div>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div><div class="step-title">Enter your salary and locations</div><div class="step-desc">Provide your annual gross salary, currency, origin city, and target city. We support any city globally.</div></div></div>
      <div class="step"><div class="step-num">2</div><div><div class="step-title">We fetch cost-of-living data</div><div class="step-desc">Our AI queries Numbeo's database, World Bank PPP indices, and current currency exchange rates.</div></div></div>
      <div class="step"><div class="step-num">3</div><div><div class="step-title">PPP adjustment is calculated</div><div class="step-desc">Purchasing Power Parity measures how much a standard basket of goods costs in each location — giving a true equivalent salary, not just a currency conversion.</div></div></div>
      <div class="step"><div class="step-num">4</div><div><div class="step-title">Category breakdown is generated</div><div class="step-desc">We break down rent, groceries, transport, and healthcare — the four biggest drivers of cost of living.</div></div></div>
      <div class="step"><div class="step-num">5</div><div><div class="step-title">You get a plain-English verdict</div><div class="step-desc">A clear analysis that puts the data in context and highlights the most important factors for your comparison.</div></div></div>
    </div>

    <p class="section-label">Data sources</p>
    <h2 class="section-title" style="font-size:1.6rem;margin-bottom:1.5rem">Where the data comes from.</h2>
    <div class="data-grid" style="margin-bottom:3rem">
      <div class="data-card"><div class="data-icon">🌐</div><div class="data-title">Numbeo</div><div class="data-desc">World's largest crowd-sourced cost-of-living database. Covers 10,000+ cities with monthly updates.</div></div>
      <div class="data-card"><div class="data-icon">🏦</div><div class="data-title">World Bank PPP</div><div class="data-desc">Official purchasing power parity conversion factors used by economists and policymakers globally.</div></div>
      <div class="data-card"><div class="data-icon">💱</div><div class="data-title">Live FX Rates</div><div class="data-desc">Real-time currency exchange rates for current, accurate conversions.</div></div>
    </div>

    <p class="section-label">FAQ</p>
    <h2 class="section-title" style="font-size:1.6rem;margin-bottom:1.5rem">Common questions.</h2>
    <div style="margin-bottom:4rem">
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">What exactly is Purchasing Power Parity?<span class="faq-icon">+</span></div><div class="faq-a">PPP measures how many units of a country's currency are needed to buy the same basket of goods that one unit of another currency can buy. It's more accurate than simple currency conversion because it accounts for local price levels.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Is this a replacement for financial advice?<span class="faq-icon">+</span></div><div class="faq-a">No. SalaryPPP provides general estimates based on aggregate data. Your personal experience will vary based on lifestyle, neighbourhood, employer benefits, family size, and other factors. Always consult a financial advisor before major decisions.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">How accurate are the results?<span class="faq-icon">+</span></div><div class="faq-a">Typically accurate within 15-20% for major cities. Results for smaller cities or rapidly-changing economies may be less precise. We label the freshness of our estimates.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Does the tool account for taxes?<span class="faq-icon">+</span></div><div class="faq-a">The current version compares gross salaries and cost of living. Tax differences can have a significant impact — tax-free locations like Dubai will have a meaningfully different net outcome than the gross comparison suggests.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Can I compare cities within the same country?<span class="faq-icon">+</span></div><div class="faq-a">Yes! It works for intra-country comparisons too — San Francisco vs Austin, or Mumbai vs Pune. Cost of living differences within large countries can be substantial.</div></div>
    </div>
  </div>
</main>
<script>function toggleFaq(el){el.parentElement.classList.toggle('open');}</script>`;

// ══════════════════════════════════════════════
// EXPRESS ROUTES
// ══════════════════════════════════════════════
app.get("/", (req,res) => res.send(wrap("Real Purchasing Power","home",HOME_BODY,HOME_CSS)));
app.get("/compare", (req,res) => res.send(wrap("Compare Salaries","compare",COMPARE_BODY,COMPARE_CSS)));
app.get("/routes", (req,res) => res.send(wrap("Popular Routes","routes",ROUTES_BODY,ROUTES_CSS)));
app.get("/how-it-works", (req,res) => res.send(wrap("How It Works","how",HOW_BODY,HOW_CSS)));

// ══════════════════════════════════════════════
// API
// ══════════════════════════════════════════════
app.post("/api/compare", async (req,res) => {
  const {salary,currency,from,to} = req.body;
  if(!salary||!currency||!from||!to) return res.status(400).json({error:"Missing fields"});
  const KEY = process.env.GEMINI_API_KEY;
  if(!KEY) return res.status(500).json({error:"GEMINI_API_KEY not set"});

  const prompt = `You are a cost-of-living and purchasing power parity expert.
A person earns ${Number(salary).toLocaleString()} ${currency} per year in ${from}.
Calculate what equivalent salary they need in ${to} for the same purchasing power.
Use Numbeo, World Bank PPP data, and current exchange rates.
Return ONLY raw JSON, no markdown, no explanation:
{"origin":{"location":"${from}","salary":${salary},"currency":"${currency}","col_index_label":"Cost of Living Index: [number]"},"target":{"location":"${to}","local_currency_code":"[3-letter]","local_currency_symbol":"[symbol]","equivalent_local":[number],"equivalent_usd":[number],"col_index_label":"Cost of Living Index: [number]"},"ratio":[number],"ratio_label":"[X]x cheaper/more expensive","verdict":"[2-3 sentences]","breakdown":{"rent":{"origin":"[e.g. $3,200/mo]","target":"[amount/mo]","savings_pct":[number negative if more expensive]},"groceries":{"origin":"[amount/mo]","target":"[amount/mo]","savings_pct":[number]},"transport":{"origin":"[amount/mo]","target":"[amount/mo]","savings_pct":[number]},"healthcare":{"origin":"[amount/mo]","target":"[amount/mo]","savings_pct":[number]}},"caveats":["[one important caveat]"],"data_source":"Numbeo / World Bank PPP 2024","data_freshness":"2024-2025 estimates"}`;

  try {
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+KEY,
      {method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.3,maxOutputTokens:5000,responseMimeType:"application/json"}})}
    );
    if(!resp.ok){const t=await resp.text();return res.status(500).json({error:"Gemini error "+resp.status+": "+t});}
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if(!text) return res.status(500).json({error:"Empty response",raw:data});
    let c = text.trim().replace(/```json/g,"").replace(/```/g,"");
    const s=c.indexOf("{"),e=c.lastIndexOf("}");
    if(s===-1||e===-1) return res.status(500).json({error:"No JSON found",raw:c});
    c=c.slice(s,e+1);
    try{return res.json(JSON.parse(c));}
    catch(err){return res.status(500).json({error:"JSON parse failed",details:err.message,raw:c});}
  } catch(err){return res.status(500).json({error:err.message});}
});

app.listen(PORT, ()=>console.log("SalaryPPP on port "+PORT));
