/**
 * Auto-poster source configuration.
 *
 * A curated whitelist of reputable gaming outlets. None are GTA-only feeds, so
 * every item is filtered by the relevance keywords below — that keeps us to
 * GTA 6 news plus the adjacent topics we care about (PS6 / next-gen Xbox /
 * hardware & graphics that affect GTA 6).
 *
 * `trust`: "high" = established outlet; "medium" = community/rumor-leaning
 * (items from medium sources default to draft for human review).
 */

export const SOURCES = [
  // GTA 6 / general gaming — high trust
  { name: "IGN", url: "https://feeds.ign.com/ign/all", topic: "gaming", trust: "high" },
  { name: "GameSpot News", url: "https://www.gamespot.com/feeds/news/", topic: "gaming", trust: "high" },
  { name: "Eurogamer", url: "https://www.eurogamer.net/feed", topic: "gaming", trust: "high" },
  { name: "VG247", url: "https://www.vg247.com/feed", topic: "gaming", trust: "high" },
  { name: "VideoGamesChronicle", url: "https://www.videogameschronicle.com/feed/", topic: "gaming", trust: "high" },
  { name: "PC Gamer", url: "https://www.pcgamer.com/rss/", topic: "hardware", trust: "high" },

  // Platform-focused — high trust (for PS6 / next Xbox coverage)
  { name: "Push Square (PlayStation)", url: "https://www.pushsquare.com/feeds/latest", topic: "playstation", trust: "high" },
  { name: "Pure Xbox", url: "https://www.purexbox.com/feeds/latest", topic: "xbox", trust: "high" },

  // Community signal — medium trust (defaults to draft)
  { name: "r/GTA6", url: "https://www.reddit.com/r/GTA6/top/.rss?t=day", topic: "gta", trust: "medium" },
];

/**
 * Relevance keywords. An item is a candidate only if its title or summary
 * contains at least one of these. `weight` boosts ranking for stronger signals.
 */
export const KEYWORDS = [
  { term: "gta 6", weight: 5 },
  { term: "gta vi", weight: 5 },
  { term: "grand theft auto 6", weight: 5 },
  { term: "grand theft auto vi", weight: 5 },
  { term: "gta6", weight: 5 },
  { term: "vice city", weight: 4 },
  { term: "leonida", weight: 4 },
  { term: "rockstar games", weight: 3 },
  { term: "rockstar", weight: 2 },
  { term: "take-two", weight: 2 },
  { term: "gta online", weight: 2 },
  // Adjacent hardware / next-gen
  { term: "ps6", weight: 3 },
  { term: "playstation 6", weight: 3 },
  { term: "next-gen xbox", weight: 3 },
  { term: "next xbox", weight: 3 },
  { term: "xbox next", weight: 3 },
];

/** Returns a relevance score (0 = not relevant). */
export function relevanceScore(text) {
  const hay = String(text).toLowerCase();
  let score = 0;
  for (const { term, weight } of KEYWORDS) {
    if (hay.includes(term)) score += weight;
  }
  return score;
}
