#!/usr/bin/env node
/**
 * Generate a full Instagram carousel (PNG slides + caption) from a JSON spec.
 *
 * USAGE
 *   node scripts/ig/generate-carousel.mjs content/ig/gta6-by-the-numbers.json
 *
 * SPEC SHAPE (see content/ig/*.json)
 *   {
 *     "name": "gta6-by-the-numbers",
 *     "handle": "@leonidatips",
 *     "theme": { "highlight": "#FFD400", "bg": "#0a0a0a" },
 *     "caption": "…",
 *     "hashtags": ["#GTA6", …],
 *     "slides": [
 *       { "background": "assets/ig/1.jpg", "headline": "GTA 6 in *history*", "counter": "1/8" }
 *     ]
 *   }
 *
 * Output: out/ig/<name>/slide-01.png … + caption.txt
 * Missing background files fall back to a solid brand color, so you can render
 * and preview before you've sourced the photos.
 */

import fs from "node:fs";
import path from "node:path";
import { renderSlide } from "./render-slide.mjs";

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error("Usage: node scripts/ig/generate-carousel.mjs <spec.json>");
    process.exit(1);
  }

  const spec = JSON.parse(fs.readFileSync(path.resolve(specPath), "utf8"));
  const name = spec.name || path.basename(specPath, ".json");
  const outDir = path.join(process.cwd(), "out", "ig", name);
  fs.mkdirSync(outDir, { recursive: true });

  const total = spec.slides.length;
  console.log(`▶ Rendering "${name}" — ${total} slides…`);

  for (let i = 0; i < total; i += 1) {
    const slide = spec.slides[i];
    // Auto-fill the counter if not provided.
    if (!slide.counter) slide.counter = `${i + 1}/${total}`;
    const png = await renderSlide(slide, { handle: spec.handle, theme: spec.theme });
    const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(file, png);
    const missing = slide.background && !fs.existsSync(path.resolve(slide.background));
    console.log(`  ✔ slide-${String(i + 1).padStart(2, "0")}.png${missing ? "  (bg missing → fallback)" : ""}`);
  }

  // Write the caption + hashtags for easy copy-paste.
  if (spec.caption || spec.hashtags) {
    const caption = [
      spec.caption || "",
      "",
      (spec.hashtags || []).join(" "),
    ].join("\n");
    fs.writeFileSync(path.join(outDir, "caption.txt"), caption.trim() + "\n", "utf8");
    console.log("  ✔ caption.txt");
  }

  console.log(`\nDone → ${path.relative(process.cwd(), outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
