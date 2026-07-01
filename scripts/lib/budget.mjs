/**
 * Spend guard for the auto-poster.
 *
 * Tracks estimated USD spent per calendar month (from real token usage returned
 * by the API) in data/budget.json, committed so a scheduled runner remembers
 * across runs. The orchestrator refuses to make more API calls once the monthly
 * cap is reached — a hard stop against runaway bills.
 *
 * NOTE: prices are per 1M tokens and are estimates/defaults. Verify against
 * https://www.anthropic.com/pricing and override via AUTO_POST_PRICE_* if needed.
 * This is a safety estimate, NOT your actual invoice — always also set a spend
 * limit in the Anthropic Console.
 */

import fs from "node:fs";
import path from "node:path";

const BUDGET_FILE = path.join("data", "budget.json");

// USD per 1,000,000 tokens.
const PRICING = {
  "claude-haiku-4-5-20251001": { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
  "claude-sonnet-4-6": { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  "claude-opus-4-8": { input: 15, output: 75, cacheWrite: 18.75, cacheRead: 1.5 },
};

const DEFAULT_PRICING = PRICING["claude-sonnet-4-6"];

export function monthKey(d = new Date()) {
  return d.toISOString().slice(0, 7); // YYYY-MM
}

/** Estimate the USD cost of a single API response from its usage object. */
export function estimateUsd(usage = {}, model) {
  const p = PRICING[model] || DEFAULT_PRICING;
  const input = usage.input_tokens || 0;
  const output = usage.output_tokens || 0;
  const cacheWrite = usage.cache_creation_input_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;
  return (
    (input * p.input +
      output * p.output +
      cacheWrite * p.cacheWrite +
      cacheRead * p.cacheRead) /
    1_000_000
  );
}

export function loadBudget(rootDir = process.cwd()) {
  const p = path.join(rootDir, BUDGET_FILE);
  if (!fs.existsSync(p)) return { months: {} };
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return { months: data.months ?? {} };
  } catch {
    return { months: {} };
  }
}

export function getMonthUsd(budget, key = monthKey()) {
  return budget.months[key]?.usd ?? 0;
}

export function addUsage(budget, usd, { key = monthKey(), posts = 0, calls = 1 } = {}) {
  const cur = budget.months[key] || { usd: 0, posts: 0, calls: 0 };
  budget.months[key] = {
    usd: Number((cur.usd + usd).toFixed(6)),
    posts: cur.posts + posts,
    calls: cur.calls + calls,
  };
  return budget;
}

export function saveBudget(budget, rootDir = process.cwd()) {
  const dir = path.join(rootDir, "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, BUDGET_FILE),
    JSON.stringify(budget, null, 2) + "\n",
    "utf8",
  );
}
