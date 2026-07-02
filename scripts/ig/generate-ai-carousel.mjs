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
import {
  generateImage, IMAGE_COST, IMAGE_COST_HERO, IMAGE_COST_REF, HERO_STYLE, HERO_MODEL,
} from "./image-fal.mjs";
import { loadLibrary, pickImage } from "./library.mjs";
import { slugify } from "../lib/create-post.mjs";

/** Read a local image file into a data URI (for fal.ai img2img reference). */
function toDataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
}
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

FOR EACH SLIDE also give "imagePrompt" for an AI image generator (make each one DIFFERENT for variety):
- FIRST and LAST slide: an ORIGINAL GTA-style CHARACTER portrait — a fictional persona that fits the vibe (e.g. "a confident woman in a floral shirt and sunglasses on a neon Miami street at dusk", "a rugged guy leaning on a muscle car"). Invent a NEW character.
- All other slides: a vivid ATMOSPHERIC scene — cinematic Vice City / neon-noir (cityscapes, cars, beaches, sunsets, streets, rain, money, interiors).
IMPORTANT for every image: NO real celebrities, NO Lucia/Jason or any copyrighted game character, NO brand logos, NO text in the image.

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

  // Backgrounds: hero slides (first + last) use real GTA art from the library;
  // info slides (the middle) get a unique fal.ai image. Anything without a
  // source falls back to the Vice City gradient.
  const falKey = process.env.FAL_KEY;
  const wantImages = !args["no-images"];
  const lib = loadLibrary(rootDir);
  const used = new Set();
  const heroIdx = new Set([0, slides.length - 1]);
  const bgDir = path.join(rootDir, "assets", "ig", name);
  fs.mkdirSync(bgDir, { recursive: true });

  // Hero slides default to clean text-to-image GTA art. Pass --ref to instead
  // style-seed them from your library images (img2img) — only worth it if those
  // images are clean, full-bleed art (borders/text in a reference leak through).
  const useRef = Boolean(args.ref);
  if (!falKey) {
    console.log("ℹ No FAL_KEY set → slides use the Vice City gradient. Add FAL_KEY to .env for AI images.");
  } else if (useRef && lib.length === 0) {
    console.log("ℹ --ref set but no images in assets/ig/library/ → hero slides use text-to-image.");
  }

  let imgSpend = 0;
  if (wantImages && falKey) {
    console.log("▶ Generating backgrounds…");
    for (let i = 0; i < slides.length; i += 1) {
      const s = slides[i];
      const isHero = heroIdx.has(i);
      const styleAnchor = isHero ? HERO_STYLE : undefined; // undefined → scene style
      const prompt =
        s.imagePrompt ||
        (isHero ? "a confident original character on a neon-lit Vice City street" : "Vice City neon sunset skyline");
      const rel = `assets/ig/${name}/${String(i + 1).padStart(2, "0")}.jpg`;

      // Hero slides: optionally seed the AI with one of your uploaded images
      // (img2img) so the generated character matches your art style.
      let refUri = null;
      if (isHero && useRef && lib.length) {
        const pick = pickImage(lib, { text: `${s.headline} ${s.imagePrompt}`, role: "hero", used });
        if (pick) refUri = toDataUri(pick.file);
      }

      // Hero characters use the higher-quality FLUX dev model (txt2img).
      const heroTxtModel = isHero && !refUri ? HERO_MODEL : null;
      const txtCost = isHero ? IMAGE_COST_HERO : IMAGE_COST;

      try {
        const img = await generateImage(prompt, { key: falKey, imageUrl: refUri, styleAnchor, model: heroTxtModel });
        fs.writeFileSync(path.join(rootDir, rel), img);
        s.background = rel;
        { const c = refUri ? IMAGE_COST_REF : txtCost; imgSpend += c; addUsage(budget, c, { key, calls: 0 }); }
        console.log(`  ✔ slide ${i + 1}: ${isHero ? "hero art" : "scene"}${refUri ? " (styled from your art)" : ""}`);
        continue;
      } catch (err) {
        // img2img can fail → retry as plain text-to-image before giving up.
        if (refUri) {
          try {
            const img = await generateImage(prompt, { key: falKey, styleAnchor, model: HERO_MODEL });
            fs.writeFileSync(path.join(rootDir, rel), img);
            s.background = rel;
            imgSpend += IMAGE_COST_HERO;
            addUsage(budget, IMAGE_COST_HERO, { key, calls: 0 });
            console.log(`  ✔ slide ${i + 1}: hero art (ref failed → txt2img)`);
            continue;
          } catch (e2) {
            console.warn(`  ✖ slide ${i + 1} failed (${e2.message}) → gradient`);
          }
        } else {
          console.warn(`  ✖ slide ${i + 1} failed (${err.message}) → gradient`);
        }
      }
      s.background = null; // gradient fallback
    }
    saveBudget(budget, rootDir);
  }

  // Save editable spec.
  const spec = {
    name,
    handle,
    theme: {
      highlight: "#ff8a1f",
      highlightGradient: "linear-gradient(120deg, #ff2d8e 0%, #ff8a1f 100%)",
      bg: "#0a0a0a",
    },
    caption: data.caption,
    hashtags: data.hashtags || [],
    slides,
  };
  fs.mkdirSync(path.join(rootDir, "content", "ig"), { recursive: true });
  fs.writeFileSync(path.join(rootDir, "content", "ig", `${name}.json`), JSON.stringify(spec, null, 2) + "\n");

  // Render — post (4:5, out/ig) and/or reel (9:16, out/tiktok).
  const FORMAT_DIRS = { post: ["out", "ig"], reel: ["out", "tiktok"] };
  const fmtArg = args.format || "post";
  const formats = fmtArg === "both" ? ["post", "reel"] : [fmtArg];

  for (const format of formats) {
    const outDir = path.join(rootDir, ...FORMAT_DIRS[format], name);
    fs.mkdirSync(outDir, { recursive: true });
    const dims = format === "reel" ? "9:16" : "4:5";
    console.log(`▶ Rendering ${slides.length} slides [${format} ${dims}]…`);
    for (let i = 0; i < slides.length; i += 1) {
      const png = await renderSlide(slides[i], { handle, theme: spec.theme, format });
      fs.writeFileSync(path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), png);
    }
    fs.writeFileSync(
      path.join(outDir, "caption.txt"),
      `${data.caption}\n\n${(data.hashtags || []).join(" ")}\n`,
    );
    fs.writeFileSync(
      path.join(outDir, "backgrounds.txt"),
      slides.map((s, i) => `Slide ${i + 1}: ${s.imagePrompt}`).join("\n") + "\n",
    );
    console.log(`  ✔ ${path.relative(rootDir, outDir)}`);
  }

  console.log(`\n✅ Done → out/ig/${name}/`);
  console.log(`   Cost ~$${(cost + imgSpend).toFixed(3)} (text $${cost.toFixed(4)} + images $${imgSpend.toFixed(3)}) · month $${getMonthUsd(budget, key).toFixed(2)}/$${cap.toFixed(2)}`);
  console.log("\n--- CAPTION (copy-paste) ---");
  console.log(data.caption);
  console.log((data.hashtags || []).join(" "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
