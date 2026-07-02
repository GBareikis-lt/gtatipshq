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

// Where each format is written.
const FORMAT_DIRS = { post: ["out", "ig"], reel: ["out", "tiktok"] };

async function renderFormat(spec, name, format) {
  const outDir = path.join(process.cwd(), ...FORMAT_DIRS[format], name);
  fs.mkdirSync(outDir, { recursive: true });
  const total = spec.slides.length;
  const dims = format === "reel" ? "1080x1920" : "1080x1350";
  console.log(`▶ Rendering "${name}" [${format} ${dims}] — ${total} slides…`);

  for (let i = 0; i < total; i += 1) {
    const slide = spec.slides[i];
    const png = await renderSlide(slide, { handle: spec.handle, theme: spec.theme, format });
    fs.writeFileSync(path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), png);
  }

  if (spec.caption || spec.hashtags) {
    const caption = [spec.caption || "", "", (spec.hashtags || []).join(" ")].join("\n");
    fs.writeFileSync(path.join(outDir, "caption.txt"), caption.trim() + "\n", "utf8");
  }
  console.log(`  ✔ ${path.relative(process.cwd(), outDir)} (${total} slides + caption)`);
}

async function main() {
  const args = process.argv.slice(2);
  const specPath = args.find((a) => !a.startsWith("--"));
  const fmtArg = (() => {
    const idx = args.indexOf("--format");
    return idx !== -1 ? args[idx + 1] : "post";
  })();
  if (!specPath) {
    console.error("Usage: node scripts/ig/generate-carousel.mjs <spec.json> [--format post|reel|both]");
    process.exit(1);
  }

  const formats = fmtArg === "both" ? ["post", "reel"] : [fmtArg];
  const spec = JSON.parse(fs.readFileSync(path.resolve(specPath), "utf8"));
  const name = spec.name || path.basename(specPath, ".json");

  for (const format of formats) {
    await renderFormat(spec, name, format);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
