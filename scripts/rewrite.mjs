/**
 * Rewrite a source item into an original GTATipsHQ article using the Claude API.
 *
 * The model summarises in its own words (never copies), classifies the post
 * (news vs tips + category), and returns a strict JSON payload matching the
 * content contract. The long system prompt is cached to cut cost on repeat runs.
 */

import Anthropic from "@anthropic-ai/sdk";
import { ALLOWED_CATEGORIES } from "./lib/create-post.mjs";

const MODEL = process.env.AUTO_POST_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are the editorial writer for GTATipsHQ (leonidatips.com), an independent GTA 6 news & tips site. You turn a single source item into ONE original article.

HARD RULES
- Write entirely in your own words. Summarise and add context; never copy sentences or phrasing from the source. Aim for a genuinely original, useful piece.
- Be accurate. Do NOT invent facts, quotes, dates, or "confirmed" details. If the source is a rumour or unconfirmed, say so and set "draft": true.
- The official GTA 6 release date is November 19, 2026. Never contradict it.
- English only. Neutral, informative, lightly enthusiastic tone. No clickbait.
- This is a fan site, not official. Do not imply affiliation with Rockstar/Take-Two.
- Flag story spoilers in the description if relevant.

CLASSIFICATION
- collection "news": announcements, updates, rumours, hardware/next-gen (PS6, next Xbox) that affects GTA 6.
- collection "tips": guides, how-tos, money methods, walkthroughs, secrets.
- Choose the single best category:
  - news: ${ALLOWED_CATEGORIES.news.join(", ")}
  - tips: ${ALLOWED_CATEGORIES.tips.join(", ")}
- If the item is only loosely related to GTA 6, still frame it around what it means for GTA 6 / its players.

SEO
- title: <= 60 chars, include "GTA 6" and the primary keyword near the front.
- description: 120-160 chars, one honest sentence with the main keyword.
- body: MDX. Start at "##". Use 2-4 short sections with "##" headings, bullet lists, and at most one "> " callout. 180-320 words. You may link internally to /news, /tips, or /map when natural.

OUTPUT
Respond with ONLY a JSON object (no markdown, no code fence) of this exact shape:
{
  "publish": true,
  "collection": "news" | "tips",
  "category": string,
  "title": string,
  "description": string,
  "tags": string[],
  "difficulty": "easy" | "medium" | "hard" | null,
  "draft": boolean,
  "body": string
}
Set "publish": false (and explain nothing else) if the item is not worth posting or is not genuinely about GTA 6 or its adjacent hardware.`;

/** Strip code fences and pull the first JSON object out of a string. */
function extractJson(text) {
  const cleaned = text.replace(/```json\s*|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * @returns {Promise<{ article: object|null, usage: object, model: string }>}
 * article is null if the model declined to publish. usage carries token counts
 * for cost tracking.
 */
export async function rewriteCandidate(candidate, { model = MODEL } = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });

  const userContent = `SOURCE ITEM
Outlet: ${candidate.source} (trust: ${candidate.trust}, topic: ${candidate.topic})
Title: ${candidate.title}
URL: ${candidate.link}
Published: ${candidate.isoDate || "unknown"}
Summary: ${candidate.summary || "(none provided)"}

Write the article now.`;

  const response = await client.messages.create({
    model,
    max_tokens: 1600,
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const usage = response.usage || {};
  const parsed = extractJson(text);
  if (parsed.publish === false) return { article: null, usage, model };

  // Attach source attribution; medium-trust sources default to draft.
  const article = {
    collection: parsed.collection,
    category: parsed.category,
    title: parsed.title,
    description: parsed.description,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    difficulty: parsed.difficulty || undefined,
    draft: Boolean(parsed.draft) || candidate.trust === "medium",
    body: parsed.body,
    source: candidate.link,
    author: "GTATipsHQ Editorial",
  };
  return { article, usage, model };
}
