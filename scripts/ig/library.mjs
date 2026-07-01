/**
 * GTA 6 image library for carousel hero slides.
 *
 * Drop your own official GTA 6 images into assets/ig/library/ (key art,
 * screenshots). Optionally add assets/ig/library/manifest.json to tag them:
 *   { "keyart-lucia.jpg": { "tags": ["lucia","character","duo"], "role": "hero" } }
 * Without a manifest, the file name is used as tags (e.g. "vice-city-night.jpg"
 * → tags ["vice","city","night"]).
 *
 * The picker matches an image to a slide by tag/keyword overlap so hero slides
 * get relevant, authentic GTA art — and it avoids repeats within a carousel.
 */

import fs from "node:fs";
import path from "node:path";

const LIB_DIR = path.join("assets", "ig", "library");
const IMG_RE = /\.(jpe?g|png|webp)$/i;

export function loadLibrary(rootDir = process.cwd()) {
  const dir = path.join(rootDir, LIB_DIR);
  if (!fs.existsSync(dir)) return [];

  let manifest = {};
  const mPath = path.join(dir, "manifest.json");
  if (fs.existsSync(mPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(mPath, "utf8"));
    } catch {
      /* ignore malformed manifest */
    }
  }

  return fs
    .readdirSync(dir)
    .filter((f) => IMG_RE.test(f))
    .map((f) => {
      const m = manifest[f] || {};
      const fromName = f.replace(IMG_RE, "").split(/[-_ ]+/).filter(Boolean);
      const tags = (m.tags && m.tags.length ? m.tags : fromName).map((t) =>
        String(t).toLowerCase(),
      );
      return { file: path.join(dir, f), tags, role: (m.role || "any").toLowerCase() };
    });
}

/**
 * Pick the best-matching library image for a slide.
 * @returns {{file:string}|null}
 */
export function pickImage(lib, { text = "", role = "any", used = new Set() } = {}) {
  const words = new Set(
    String(text)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2),
  );

  let pool = lib.filter(
    (img) => !used.has(img.file) && (role === "any" || img.role === role || img.role === "any"),
  );
  if (!pool.length) pool = lib.filter((img) => !used.has(img.file));
  if (!pool.length) return null;

  let best = pool[0];
  let bestScore = -1;
  for (const img of pool) {
    let score = img.tags.reduce((s, t) => s + (words.has(t) ? 2 : 0), 0);
    if (role !== "any" && img.role === role) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = img;
    }
  }
  used.add(best.file);
  return best;
}
