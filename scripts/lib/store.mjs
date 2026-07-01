/**
 * Persistent "already processed" log so the pipeline never posts the same
 * source item twice. Committed to the repo (data/auto-post-log.json) so a
 * scheduled runner (GitHub Actions) remembers across runs.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const LOG_DIR = "data";
const LOG_FILE = "auto-post-log.json";

function logPath(rootDir) {
  return path.join(rootDir, LOG_DIR, LOG_FILE);
}

/** Stable id for a source item (prefers guid/link, falls back to hashed title). */
export function itemId(item) {
  const basis = item.id || item.link || item.title || "";
  return crypto.createHash("sha1").update(basis).digest("hex").slice(0, 16);
}

export function loadLog(rootDir = process.cwd()) {
  const p = logPath(rootDir);
  if (!fs.existsSync(p)) return { seen: {}, posts: [] };
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return { seen: data.seen ?? {}, posts: data.posts ?? [] };
  } catch {
    return { seen: {}, posts: [] };
  }
}

export function isSeen(log, id) {
  return Boolean(log.seen[id]);
}

export function recordPost(log, { id, slug, collection, title, source }) {
  log.seen[id] = new Date().toISOString();
  log.posts.unshift({
    id,
    slug,
    collection,
    title,
    source,
    postedAt: new Date().toISOString(),
  });
  // Keep the posts history bounded; `seen` map stays for dedupe.
  log.posts = log.posts.slice(0, 500);
  return log;
}

/** Mark an id as seen without creating a post (e.g. skipped/irrelevant). */
export function markSeen(log, id) {
  log.seen[id] = new Date().toISOString();
  return log;
}

export function saveLog(log, rootDir = process.cwd()) {
  const dir = path.join(rootDir, LOG_DIR);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(logPath(rootDir), JSON.stringify(log, null, 2) + "\n", "utf8");
}
