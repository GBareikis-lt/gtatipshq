/**
 * Fetch and rank candidate stories from the configured RSS sources.
 *
 * Pure ingestion — no LLM, no API key needed. Filters by relevance keywords,
 * drops anything already in the log, ranks by signal + recency + source trust,
 * and returns the top candidates for the rewriter.
 */

import Parser from "rss-parser";
import { SOURCES, relevanceScore } from "./sources.mjs";
import { loadLog, isSeen, itemId } from "./lib/store.mjs";

const parser = new Parser({
  timeout: 15000,
  headers: {
    // Some feeds (e.g. Reddit) reject the default UA.
    "User-Agent": "GTATipsHQ-AutoPoster/1.0 (+https://leonidatips.com)",
  },
});

const MAX_AGE_DAYS = Number(process.env.AUTO_POST_MAX_AGE_DAYS || 4);

function ageDays(isoDate) {
  if (!isoDate) return Infinity;
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / 86_400_000;
}

async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => ({
      id: itemId({ id: item.guid, link: item.link, title: item.title }),
      title: (item.title || "").trim(),
      link: item.link || "",
      summary: (item.contentSnippet || item.content || item.summary || "").trim().slice(0, 1200),
      isoDate: item.isoDate || item.pubDate || null,
      source: source.name,
      topic: source.topic,
      trust: source.trust,
    }));
  } catch (err) {
    console.warn(`[fetch] ${source.name} failed: ${err.message}`);
    return [];
  }
}

/**
 * @returns {Promise<Array>} ranked candidates (newest/strongest first)
 */
export async function getCandidates({ max = 3, rootDir = process.cwd() } = {}) {
  const log = loadLog(rootDir);

  const batches = await Promise.all(SOURCES.map(fetchSource));
  const all = batches.flat();

  const scored = [];
  const seenIds = new Set();
  for (const item of all) {
    if (!item.title || !item.link) continue;
    if (seenIds.has(item.id)) continue; // in-run dedupe
    seenIds.add(item.id);
    if (isSeen(log, item.id)) continue; // cross-run dedupe
    if (ageDays(item.isoDate) > MAX_AGE_DAYS) continue;

    const rel = relevanceScore(`${item.title} ${item.summary}`);
    if (rel <= 0) continue;

    const trustBonus = item.trust === "high" ? 2 : 0;
    const recencyBonus = Math.max(0, 3 - ageDays(item.isoDate)); // fresher = higher
    scored.push({ ...item, score: rel + trustBonus + recencyBonus });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, max);
}

// CLI: print the ranked candidates as JSON.
if (import.meta.url === `file://${process.argv[1]}`) {
  const max = Number(process.argv[2] || 10);
  getCandidates({ max }).then((c) => {
    console.log(JSON.stringify(c, null, 2));
    console.log(`\n${c.length} candidate(s).`);
  });
}
