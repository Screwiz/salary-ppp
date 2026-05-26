import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/compare", async (req, res) => {
  const { salary, currency, from, to } = req.body;

  if (!salary || !currency || !from || !to) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in environment" });
  }

  const prompt = `You are a cost-of-living and purchasing power parity expert. Use web search to find the LATEST available data.

A person earns ${Number(salary).toLocaleString()} ${currency} per year in ${from}.
What annual salary in ${to} gives equivalent purchasing power?

Search for: current cost of living index comparison ${from} vs ${to} Numbeo 2025, and PPP/exchange rate data.

Find:
1. Cost of Living index for both cities (Numbeo or similar, most recent)
2. PPP-adjusted equivalent salary in ${to}'s LOCAL currency
3. Key cost differences: rent, groceries, transport, healthcare

Reply ONLY with raw JSON (no markdown, no backticks, no explanation):
{
  "origin": {
    "location": "full city, country",
    "salary": ${salary},
    "currency": "${currency}",
    "col_index": 0,
    "col_index_label": "Cost of Living Index: XX.X"
  },
  "target": {
    "location": "full city, country",
    "local_currency_code": "XXX",
    "local_currency_symbol": "X",
    "equivalent_local": 0,
    "equivalent_usd": 0,
    "col_index": 0,
    "col_index_label": "Cost of Living Index: XX.X"
  },
  "ratio": 1.0,
  "ratio_label": "X.Xx cheaper / more expensive",
  "verdict": "2-3 sentence plain English summary of what this means practically",
  "breakdown": {
    "rent": { "origin": "e.g. $3,200/mo", "target": "e.g. ₹22,000/mo", "savings_pct": 90 },
    "groceries": { "origin": "e.g. $600/mo", "target": "e.g. ₹8,000/mo", "savings_pct": 84 },
    "transport": { "origin": "e.g. $300/mo", "target": "e.g. ₹3,000/mo", "savings_pct": 88 },
    "healthcare": { "origin": "e.g. $511/mo", "target": "e.g. ₹2,500/mo", "savings_pct": 94 }
  },
  "caveats": ["one important caveat about this comparison"],
  "data_source": "e.g. Numbeo 2025, World Bank PPP",
  "data_freshness": "e.g. As of May 2025"
}`;

  try {
    // Set up SSE for streaming response to client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send status updates while Claude searches
    res.write(`data: ${JSON.stringify({ type: "status", message: "Searching for latest cost of living data..." })}\n\n`);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.write(`data: ${JSON.stringify({ type: "error", message: `Anthropic API error ${response.status}: ${errText}` })}\n\n`);
      return res.end();
    }

    const data = await response.json();

    // Check for search tool use
    const toolUses = (data.content || []).filter((b) => b.type === "tool_use");
    if (toolUses.length > 0) {
      res.write(`data: ${JSON.stringify({ type: "status", message: `Searched ${toolUses.length} source(s). Calculating...` })}\n\n`);
    }

    // Extract text content
    const textBlocks = (data.content || []).filter((b) => b.type === "text");
    if (!textBlocks.length) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "No response from model" })}\n\n`);
      return res.end();
    }

    let raw = textBlocks.map((b) => b.text).join("");
    const js = raw.indexOf("{");
    const je = raw.lastIndexOf("}");
    if (js === -1 || je === -1) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Could not parse response: " + raw.slice(0, 200) })}\n\n`);
      return res.end();
    }

    const jsonStr = raw.slice(js, je + 1);
    const result = JSON.parse(jsonStr);

    res.write(`data: ${JSON.stringify({ type: "result", data: result })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Salary PPP server running at http://localhost:${PORT}`);
  console.log(`   Set your API key: export ANTHROPIC_API_KEY=sk-ant-...`);
});
