#!/usr/bin/env node
/**
 * Fully AI-generated Instagram carousel — topic, slide copy, caption, hashtags,
 * and rendered PNGs. Just run it, then copy-paste into Instagram.
 *
 * USAGE
 *   node scripts/ig/generate-ai-carousel.mjs                 # AI picks the topic
 *   node scripts/ig/generate-ai-carousel.mjs --topic "GTA 6 money methods"
 *   node scripts/ig/generate-ai-carousel.mjs --slides 7 --handle "@leonidatips"
 *   npm run ig:ai -- --topic "GTA 6 map secrets"
 *
 * ENV: ANTHROPIC_API_KEY (required), AUTO_POST_MODEL (default claude-sonnet-4-6),
 *      AUTO_POST_MONTHLY_USD (shared spend cap, default 5).
 *
 * Output → out/ig/<name>/slide-01.png … + caption.txt + backgrounds.txt
 * Also saves the editable spec to content/ig/<name>.json.
 * Slides render on a Vice City gradient, so they're postable without photos;
 * drop images into assets/ig/<name>/NN.jpg to use real backgrounds.
 */

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { loadEnv } from "../lib/load-env.mjs";
import { renderSlide } from "./render-slide.mjs";
import { generateImage, IMAGE_COST } from "./image-fal.mjs";
import { slugify } from "../lib/create-post.mjs";
import {
  loadBudget, saveBudget, getMonthUsd, addUsage, estimateUsd, monthKey,
} from "../lib/budget.mjs";

loadEnv();

const MODEL = process.env.AUTO_POST_MODEL || "claude-sonnet-4-6";
const DEFAULT_HANDLE = "@leonidatips";

const SYSTEM_PROMPT = `You are a viral faceless Instagram content creator for a GTA 6 fan account. You produce ONE swipe carousel per request.

TOPIC
- If given a topic, build the carousel around it. Otherwise pick a fresh, engaging GTA 6 angle: news, facts, map secrets, money/tips, character lore, history, hype, or "why GTA 6 will…".

SLIDES
- Slide 1 = a scroll-stopping HOOK.
- Middle slides = one punchy idea each (a fact, number, tip, or reveal).
- Final slide = a call to action to follow the account.
- Each headline: short and punchy (≤ 14 words), works in ALL CAPS.
- Wrap the 1–3 most important words/numbers of each headline in *asterisks* to highlight them (e.g. "GTA 6 cost over *$1 billion* to *make*.").

ACCURACY
- GTA 6 releases November 19, 2026 (PS5, Xbox Series X|S). Never contradict this.
- Do NOT invent "confirmed" facts, quotes, or numbers. Mark unconfirmed things as "reportedly" or "leaked". Flag story spoilers.

FOR EACH SLIDE also give "imagePrompt": a vivid ATMOSPHERIC background scene for an AI image generator that fits the slide's topic — cinematic Miami / Vice City / neon-noir vibe (cityscapes, cars, beaches, sunsets, streets, rain, interiors, money, etc.). Make each slide's scene DIFFERENT for variety. IMPORTANT: no real celebrities, no copyrighted game characters, no logos, no text in the image.

CAPTION: 1–2 engaging sentences + a question to drive comments + "Follow {HANDLE} for daily GTA 6 news & tips."
HASHTAGS: 8–12 relevant, mixing broad (#GTA6, #gaming) and niche (#Leonida, #ViceCity).

OUTPUT: respond with ONLY this JSON (no prose, no code fence):
{
  "name": "short-kebab-case-slug",
  "caption": "…",
  "hashtags": ["#GTA6", "…"],
  "slides": [ { "headline": "…with *highlights*", "imagePrompt": "vivid Vice City scene, no text" } ]
}`;

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

function extractJson(text) {
  const cleaned = text.replace(/```json\s*|```/g, "").trim();
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");
  if (s === -1 || e === -1) throw new Error("No JSON in model response");
  return JSON.parse(cleaned.slice(s, e + 1));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const handle = args.handle || DEFAULT_HANDLE;
  const slideCount = Number(args.slides || 8);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("✖ ANTHROPIC_API_KEY is not set (see .env.example)");
    process.exit(1);
  }

  // Shared spend guard.
  const cap = Number(process.env.AUTO_POST_MONTHLY_USD || 5);
  const budget = loadBudget(rootDir);
  const key = monthKey();
  if (getMonthUsd(budget, key) >= cap) {
    console.error(`⛔ Monthly budget reached ($${getMonthUsd(budget, key).toFixed(2)}/$${cap.toFixed(2)}). Raise AUTO_POST_MONTHLY_USD.`);
    process.exit(1);
  }

  const userMsg = `${args.topic ? `Topic: ${args.topic}\n` : "Pick a great GTA 6 topic.\n"}Make a ${slideCount}-slide carousel. Handle: ${handle}.`;

  console.log("▶ Asking Claude for a carousel…");
  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1600,
    system: [{ type: "text", text: SYSTEM_PROMPT.replace(/{HANDLE}/g, handle), cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMsg }],
  });

  const cost = estimateUsd(res.usage, MODEL);
  addUsage(budget, cost, { key, calls: 1 });
  saveBudget(budget, rootDir);

  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const data = extractJson(text);

  const name = slugify(data.name || args.topic || "gta6-carousel");
  const slides = (data.slides || []).map((s, i) => ({
    headline: s.headline,
    imagePrompt: s.imagePrompt || "",
    background: `assets/ig/${name}/${String(i + 1).padStart(2, "0")}.jpg`,
    counter: `${i + 1}/${data.slides.length}`,
  }));

  // Generate a unique AI background per slide (fal.ai), unless disabled/no key.
  const falKey = process.env.FAL_KEY;
  const wantImages = falKey && !args["no-images"];
  if (wantImages) {
    const bgDir = path.join(rootDir, "assets", "ig", name);
    fs.mkdirSync(bgDir, { recursive: true });
    console.log("▶ Generating AI backgrounds (fal.ai)…");
    for (let i = 0; i < slides.length; i += 1) {
      const prompt = slides[i].imagePrompt || `Vice City neon sunset, GTA 6 aesthetic`;
      try {
        const img = await generateImage(prompt, { key: falKey });
        fs.writeFileSync(path.join(bgDir, `${String(i + 1).padStart(2, "0")}.jpg`), img);
        addUsage(budget, IMAGE_COST, { key, calls: 0 });
        console.log(`  ✔ image ${i + 1}/${slides.length}`);
      } catch (err) {
        console.warn(`  ✖ image ${i + 1} failed (${err.message}) → gradient fallback`);
      }
    }
    saveBudget(budget, rootDir);
  } else if (!falKey) {
    console.log("ℹ No FAL_KEY set → using gradient backgrounds. Add FAL_KEY to .env for AI images.");
  }

  // Save editable spec.
  const spec = {
    name,
    handle,
    theme: { highlight: "#FFD400", bg: "#0a0a0a" },
    caption: data.caption,
    hashtags: data.hashtags || [],
    slides,
  };
  fs.mkdirSync(path.join(rootDir, "content", "ig"), { recursive: true });
  fs.writeFileSync(path.join(rootDir, "content", "ig", `${name}.json`), JSON.stringify(spec, null, 2) + "\n");

  // Render.
  const outDir = path.join(rootDir, "out", "ig", name);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`▶ Rendering ${slides.length} slides for "${name}"…`);
  for (let i = 0; i < slides.length; i += 1) {
    const png = await renderSlide(slides[i], { handle, theme: spec.theme });
    fs.writeFileSync(path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), png);
    console.log(`  ✔ slide-${String(i + 1).padStart(2, "0")}.png`);
  }

  // Caption + hashtags (copy-paste) and background ideas.
  fs.writeFileSync(
    path.join(outDir, "caption.txt"),
    `${data.caption}\n\n${(data.hashtags || []).join(" ")}\n`,
  );
  fs.writeFileSync(
    path.join(outDir, "backgrounds.txt"),
    slides.map((s, i) => `Slide ${i + 1}: ${s.imagePrompt}`).join("\n") + "\n",
  );

  console.log(`\n✅ Done → out/ig/${name}/`);
  console.log(`   Cost ~$${cost.toFixed(4)} (month $${getMonthUsd(budget, key).toFixed(2)}/$${cap.toFixed(2)})`);
  console.log("\n--- CAPTION (copy-paste) ---");
  console.log(data.caption);
  console.log((data.hashtags || []).join(" "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
