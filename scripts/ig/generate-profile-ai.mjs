#!/usr/bin/env node
/**
 * Generate the Instagram profile picture with fal.ai (FLUX). Produces several
 * square variants so you can pick the best one. Needs FAL_KEY in .env.
 *
 * Run:
 *   npm run ig:profile:ai
 *   npm run ig:profile:ai -- --n 6
 *   npm run ig:profile:ai -- --prompt "your own emblem idea"
 *
 * Output → out/ig/profile/ai-01.png … (1024x1024). Instagram crops to a circle.
 */

import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "../lib/load-env.mjs";
import { generateImage, IMAGE_COST_HERO, HERO_MODEL } from "./image-fal.mjs";
import { loadBudget, saveBudget, getMonthUsd, addUsage, monthKey } from "../lib/budget.mjs";

loadEnv();

const DEFAULT_PROMPT =
  "Bold circular emblem logo for a GTA 6 fan brand: a retro synthwave sunset — a glowing striped sun setting behind a detailed palm tree silhouette over calm water, Miami / Vice City vibe, dark navy background, centered symmetrical composition";

const STYLE =
  "vibrant neon magenta, hot pink, orange and cyan, clean modern flat vector icon, bold sticker style, high contrast, crisp, professional logo. Absolutely no text, no letters, no numbers, no watermark, no signatures.";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else { args[key] = next; i += 1; }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const n = Number(args.n || 4);
  const prompt = args.prompt || DEFAULT_PROMPT;

  const key = process.env.FAL_KEY;
  if (!key) {
    console.error("✖ FAL_KEY is not set (see .env.example)");
    process.exit(1);
  }

  const cap = Number(process.env.AUTO_POST_MONTHLY_USD || 5);
  const budget = loadBudget(rootDir);
  const mKey = monthKey();
  if (getMonthUsd(budget, mKey) >= cap) {
    console.error(`⛔ Monthly budget reached ($${getMonthUsd(budget, mKey).toFixed(2)}/$${cap.toFixed(2)}).`);
    process.exit(1);
  }

  const outDir = path.join(rootDir, "out", "ig", "profile");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`▶ Generating ${n} profile variant(s) with fal.ai (FLUX dev)…`);
  let made = 0;
  for (let i = 1; i <= n; i += 1) {
    try {
      const img = await generateImage(prompt, {
        key,
        size: "square_hd",
        styleAnchor: STYLE,
        model: HERO_MODEL,
      });
      const file = path.join(outDir, `ai-${String(i).padStart(2, "0")}.png`);
      fs.writeFileSync(file, img);
      addUsage(budget, IMAGE_COST_HERO, { key: mKey, calls: 0 });
      made += 1;
      console.log(`  ✔ ai-${String(i).padStart(2, "0")}.png`);
    } catch (err) {
      console.warn(`  ✖ variant ${i} failed: ${err.message}`);
    }
  }
  saveBudget(budget, rootDir);

  console.log(`\n✅ ${made} variant(s) → out/ig/profile/  (~$${(made * IMAGE_COST_HERO).toFixed(3)}, month $${getMonthUsd(budget, mKey).toFixed(2)}/$${cap.toFixed(2)})`);
  console.log("Pick your favourite and upload it as the Instagram profile photo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
