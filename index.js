import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SalaryPPP - Real Purchasing Power Across the World</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0c0c0c; --surface: #161616; --surface2: #1e1e1e;
      --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
      --text: #f0ede6; --muted: #888; --accent: #c8f060;
      --danger: #ff6b6b; --success: #4ade80;
    }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; min-height: 100vh; line-height: 1.6; }
    nav { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: rgba(12,12,12,0.92); backdrop-filter: blur(12px); z-index: 100; }
    .logo { font-family: 'DM Serif Display', serif; font-size: 1.3rem; letter-spacing: -0.02em; }
    .logo span { color: var(--accent); }
    .nav-tag { font-size: 0.7rem; color: var(--muted); border: 1px solid var(--border2); padding: 3px 10px; border-radius: 20px; letter-spacing: 0.08em; text-transform: uppercase; }
    .hero { max-width: 860px; margin: 0 auto; padding: 5rem 2rem 3rem; text-align: center; }
    .hero-eyebrow { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 1.25rem; }
    .hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.25rem; }
    .hero h1 em { font-style: italic; color: var(--accent); }
    .hero p { font-size: 1.05rem; color: var(--muted); max-width: 540px; margin: 0 auto 3rem; line-height: 1.7; }
    .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; max-width: 760px; margin: 0 auto 3rem; }
    .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 14px; }
    .form-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 400; }
    input, select { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 300; outline: none; transition: border-color 0.2s; width: 100%; }
    input:focus, select:focus { border-color: var(--accent); }
    select option { background: #1e1e1e; }
    .examples { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .examples-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); width: 100%; margin-bottom: 2px; }
    .chip { font-size: 0.75rem; color: var(--muted); border: 1px solid var(--border); border-radius: 20px; padding: 5px 14px; cursor: pointer; transition: all 0.15s; background: none; font-family: 'DM Sans', sans-serif; }
    .chip:hover { border-color: var(--accent); color: var(--accent); }
    .compare-btn { width: 100%; padding: 14px; background: var(--accent); color: #0c0c0c; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .compare-btn:hover { background: #d4f570; transform: translateY(-1px); }
    .compare-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .status-bar { display: none; align-items: center; gap: 10px; padding: 14px 18px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; margin: 1rem auto; max-width: 760px; font-size: 0.88rem; color: var(--muted); }
    .status-bar.visible { display: flex; }
    .spinner { width: 16px; height: 16px; border: 2px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-box { display: none; padding: 14px 18px; background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.3); border-radius: 10px; font-size: 0.88rem; color: var(--danger); margin: 1rem auto; max-width: 760px; }
    .error-box.visible { display: block; }
    #result { display: none; max-width: 760px; margin: 0 auto 4rem; }
    #result.visible { display: block; animation: fadeUp 0.4s ease; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .result-header { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .res-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; }
    .res-card.highlight { border-color: rgba(200,240,96,0.3); background: rgba(200,240,96,0.04); }
    .res-label { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
    .res-city { font-size: 0.9rem; font-weight: 400; color: var(--muted); margin-bottom: 10px; }
    .res-salary { font-family: 'DM Serif Display', serif; font-size: 2.4rem; letter-spacing: -0.03em; margin-bottom: 4px; }
    .res-sub { font-size: 0.78rem; color: var(--muted); }
    .res-badge { display: inline-block; font-size: 0.7rem; padding: 3px 10px; border-radius: 20px; background: rgba(200,240,96,0.15); color: var(--accent); border: 1px solid rgba(200,240,96,0.25); margin-bottom: 10px; }
    .ratio-section { margin-bottom: 14px; }
    .ratio-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .ratio-lbl { font-size: 0.8rem; color: var(--muted); }
    .ratio-val { font-size: 0.9rem; font-weight: 500; color: var(--accent); }
    .bar-bg { height: 5px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
    .breakdown-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; margin-bottom: 14px; overflow-x: auto; }
    .section-title { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th { text-align: left; padding: 0 0 10px; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 400; }
    th:not(:first-child) { text-align: right; }
    td { padding: 10px 0; border-top: 1px solid var(--border); color: var(--text); }
    td:not(:first-child) { text-align: right; }
    td:first-child { color: var(--muted); }
    .savings-pct { color: var(--success); font-weight: 500; }
    .savings-pct.neg { color: var(--danger); }
    .verdict-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; margin-bottom: 14px; }
    .verdict-text { font-size: 0.95rem; line-height: 1.75; color: #ccc; }
    .caveat { margin-top: 14px; padding: 12px 16px; background: rgba(255,200,50,0.06); border-left: 2px solid rgba(255,200,50,0.4); border-radius: 0 6px 6px 0; font-size: 0.82rem; color: #aaa; line-height: 1.6; }
    .meta-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .meta-tag { font-size: 0.7rem; color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; border-radius: 20px; }
    footer { border-top: 1px solid var(--border); padding: 2rem; text-align: center; font-size: 0.78rem; color: var(--muted); }
    @media (max-width: 600px) {
      .form-row, .form-cols, .result-header { grid-template-columns: 1fr; }
      nav { padding: 1rem; }
      .hero { padding: 3rem 1.25rem 2rem; }
    }
  </style>
</head>
<body>
<nav>
  <div class="logo">Salary<span>PPP</span></div>
  <span class="nav-tag">Real-time · AI-powered</span>
</nav>
<main>
  <section class="hero">
    <p class="hero-eyebrow">Powered by Claude + live web search</p>
    <h1>Your salary is not the same<br/><em>everywhere in the world</em></h1>
    <p>$100k in San Francisco buys very different things than $100k in Hyderabad. Find the real equivalent salary adjusted for purchasing power using live data.</p>
  </section>
  <div class="form-card">
    <div class="examples">
      <span class="examples-label">Quick examples</span>
      <button class="chip" onclick="fill(100000,'USD','San Francisco, USA','Bangalore, India')">$100k SF to Bangalore</button>
      <button class="chip" onclick="fill(80000,'GBP','London, UK','Dubai, UAE')">80k London to Dubai</button>
      <button class="chip" onclick="fill(120000,'USD','New York, USA','Berlin, Germany')">$120k NYC to Berlin</button>
      <button class="chip" onclick="fill(2000000,'INR','Mumbai, India','Singapore')">20L Mumbai to Singapore</button>
    </div>
    <div class="form-row">
      <div class="field">
        <label>Annual gross salary</label>
        <input type="number" id="salary" value="100000" min="1" />
      </div>
      <div class="field">
        <label>Currency</label>
        <select id="currency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
          <option value="SGD">SGD</option>
          <option value="JPY">JPY</option>
          <option value="AED">AED</option>
          <option value="CHF">CHF</option>
        </select>
      </div>
    </div>
    <div class="form-cols">
      <div class="field">
        <label>Origin city / country</label>
        <input type="text" id="from" value="San Francisco, USA" placeholder="e.g. London, UK" />
      </div>
      <div class="field">
        <label>Target city / country</label>
        <input type="text" id="to" value="Bangalore, India" placeholder="e.g. Berlin, Germany" />
      </div>
    </div>
    <button class="compare-btn" id="compareBtn" onclick="compare()">Compare purchasing power</button>
  </div>
  <div class="status-bar" id="statusBar"><div class="spinner"></div><span id="statusMsg">Searching...</span></div>
  <div class="error-box" id="errorBox"></div>
  <div id="result">
    <div class="result-header">
      <div class="res-card">
        <p class="res-label">Origin</p>
        <p class="res-city" id="r-city1"></p>
        <p class="res-salary" id="r-sal1"></p>
        <p class="res-sub" id="r-col1"></p>
      </div>
      <div class="res-card highlight">
        <p class="res-label">Equivalent in target</p>
        <p class="res-city" id="r-city2"></p>
        <span class="res-badge" id="r-badge"></span>
        <p class="res-salary" id="r-sal2"></p>
        <p class="res-sub" id="r-col2"></p>
      </div>
    </div>
    <div class="ratio-section">
      <div class="ratio-top">
        <span class="ratio-lbl">Purchasing power ratio</span>
        <span class="ratio-val" id="r-ratio-val"></span>
      </div>
      <div class="bar-bg"><div class="bar-fill" id="r-bar" style="width:0%"></div></div>
    </div>
    <div class="breakdown-card">
      <p class="section-title">Monthly cost breakdown</p>
      <table>
        <thead><tr><th>Category</th><th id="th-origin">Origin</th><th id="th-target">Target</th><th>Difference</th></tr></thead>
        <tbody id="breakdown-body"></tbody>
      </table>
    </div>
    <div class="verdict-card">
      <p class="section-title">Analysis</p>
      <p class="verdict-text" id="r-verdict"></p>
      <div class="caveat" id="r-caveat"></div>
    </div>
    <div class="meta-row">
      <span class="meta-tag" id="r-source"></span>
      <span class="meta-tag" id="r-freshness"></span>
    </div>
  </div>
</main>
<footer>SalaryPPP · Real-time purchasing power estimates via Claude AI + web search · Not financial advice</footer>
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
  const statusMsg = document.getElementById('statusMsg');
  const errorBox = document.getElementById('errorBox');
  const result = document.getElementById('result');

  btn.disabled = true;
  statusBar.classList.add('visible');
  statusMsg.textContent = 'Searching for latest cost of living data...';
  errorBox.classList.remove('visible');
  result.classList.remove('visible');

  try {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary, currency, from, to })
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = JSON.parse(line.slice(6));
        if (payload.type === 'status') statusMsg.textContent = payload.message;
        else if (payload.type === 'error') showError(payload.message);
        else if (payload.type === 'result') renderResult(payload.data);
      }
    }
  } catch (err) {
    showError('Error: ' + err.message);
  } finally {
    btn.disabled = false;
    statusBar.classList.remove('visible');
  }
}

function renderResult(r) {
  document.getElementById('r-city1').textContent = r.origin.location;
  document.getElementById('r-sal1').textContent = r.origin.currency + ' ' + Number(r.origin.salary).toLocaleString();
  document.getElementById('r-col1').textContent = r.origin.col_index_label || '';
  document.getElementById('r-city2').textContent = r.target.location;
  document.getElementById('r-badge').textContent = r.ratio_label || '';
  document.getElementById('r-sal2').textContent = r.target.local_currency_symbol + ' ' + Math.round(r.target.equivalent_local).toLocaleString() + ' ' + r.target.local_currency_code;
  document.getElementById('r-col2').textContent = 'approx ' + r.origin.currency + ' ' + Math.round(r.target.equivalent_usd || 0).toLocaleString() + ' - ' + (r.target.col_index_label || '');
  const ratio = parseFloat(r.ratio) || 1;
  document.getElementById('r-ratio-val').textContent = r.ratio_label || ratio.toFixed(1) + 'x';
  document.getElementById('r-bar').style.width = Math.min(100, Math.max(4, Math.round((1 / ratio) * 100))) + '%';
  document.getElementById('th-origin').textContent = r.origin.location.split(',')[0];
  document.getElementById('th-target').textContent = r.target.location.split(',')[0];
  const tbody = document.getElementById('breakdown-body');
  tbody.innerHTML = '';
  const labels = { rent: 'Rent', groceries: 'Groceries', transport: 'Transport', healthcare: 'Healthcare' };
  if (r.breakdown) {
    Object.entries(r.breakdown).forEach(function(entry) {
      const key = entry[0];
      const val = entry[1];
      const p = parseInt(val.savings_pct) || 0;
      const neg = p < 0;
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (labels[key] || key) + '</td><td>' + val.origin + '</td><td>' + val.target + '</td><td class="savings-pct' + (neg ? ' neg' : '') + '">' + Math.abs(p) + '% ' + (neg ? 'more' : 'less') + '</td>';
      tbody.appendChild(tr);
    });
  }
  document.getElementById('r-verdict').textContent = r.verdict || '';
  const caveats = Array.isArray(r.caveats) ? r.caveats : (r.caveats ? [r.caveats] : []);
  document.getElementById('r-caveat').textContent = 'Note: ' + (caveats[0] || 'Actual purchasing power varies by lifestyle.');
  document.getElementById('r-source').textContent = r.data_source || 'Numbeo / PPP data';
  document.getElementById('r-freshness').textContent = r.data_freshness || 'Latest available';
  document.getElementById('result').classList.add('visible');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(msg) {
  const b = document.getElementById('errorBox');
  b.textContent = msg;
  b.classList.add('visible');
  document.getElementById('statusBar').classList.remove('visible');
  document.getElementById('compareBtn').disabled = false;
}
</script>
</body>
</html>`;

app.get("/", (req, res) => res.send(HTML));

app.post("/api/compare", async (req, res) => {
  const { salary, currency, from, to } = req.body;
  if (!salary || !currency || !from || !to) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  }

  const prompt = `You are a cost-of-living expert with access to web search.
A person earns ${Number(salary).toLocaleString()} ${currency}/year in ${from}. What salary in ${to} gives equivalent purchasing power?
Search for: cost of living comparison ${from} vs ${to} 2025 Numbeo
Reply ONLY with raw JSON, no markdown, no backticks, no explanation:
{"origin":{"location":"${from}","salary":${salary},"currency":"${currency}","col_index_label":"Cost of Living Index: XX"},"target":{"location":"${to}","local_currency_code":"XXX","local_currency_symbol":"X","equivalent_local":0,"equivalent_usd":0,"col_index_label":"Cost of Living Index: XX"},"ratio":1.0,"ratio_label":"Xx cheaper","verdict":"2-3 sentence explanation","breakdown":{"rent":{"origin":"$X/mo","target":"X/mo","savings_pct":0},"groceries":{"origin":"$X/mo","target":"X/mo","savings_pct":0},"transport":{"origin":"$X/mo","target":"X/mo","savings_pct":0},"healthcare":{"origin":"$X/mo","target":"X/mo","savings_pct":0}},"caveats":["one caveat"],"data_source":"Numbeo 2025","data_freshness":"May 2025"}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.write(`data: ${JSON.stringify({ type: "status", message: "Searching live cost of living data..." })}\n\n`);

  try {
    const messages = [{ role: "user", content: prompt }];
    let finalText = "";
    let searchCount = 0;

    while (true) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "web-search-1"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: messages
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        res.write(`data: ${JSON.stringify({ type: "error", message: "API error " + response.status + ": " + t })}\n\n`);
        return res.end();
      }

      const data = await response.json();
      const content = data.content || [];

      // Add assistant response to message history
      messages.push({ role: "assistant", content: content });

      // Collect text blocks
      content.filter(b => b.type === "text").forEach(b => { finalText += b.text; });

      // Count tool uses
      const toolUses = content.filter(b => b.type === "tool_use");
      searchCount += toolUses.length;
      if (searchCount > 0) {
        res.write(`data: ${JSON.stringify({ type: "status", message: "Searched " + searchCount + " source(s). Calculating..." })}\n\n`);
      }

      // If done, break
      if (data.stop_reason === "end_turn") break;

      // If there are tool results to send back
      if (toolUses.length > 0) {
        const toolResults = toolUses.map(tu => ({
          type: "tool_result",
          tool_use_id: tu.id,
          content: tu.output || ""
        }));
        messages.push({ role: "user", content: toolResults });
      } else {
        break;
      }
    }

    const js = finalText.indexOf("{");
    const je = finalText.lastIndexOf("}");
    if (js === -1) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "No JSON in response: " + finalText.slice(0, 300) })}\n\n`);
      return res.end();
    }

    const result = JSON.parse(finalText.slice(js, je + 1));
    res.write(`data: ${JSON.stringify({ type: "result", data: result })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, function() {
  console.log("Running on port " + PORT);
});
