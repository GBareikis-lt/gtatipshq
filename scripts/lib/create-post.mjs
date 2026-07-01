/**
 * Core content-creation logic shared by the manual CLI (`new-post.mjs`) and the
 * automated pipeline (`auto-post.mjs`). Turns a validated payload into a
 * frontmatter-complete `.mdx` file under content/<collection>/.
 */

import fs from "node:fs";
import path from "node:path";

export const VALID_COLLECTIONS = new Set(["news", "tips"]);

export const ALLOWED_CATEGORIES = {
  news: ["release", "trailer", "update", "world", "online", "rumor", "hardware", "general"],
  tips: ["money", "beginner", "vehicles", "secrets", "missions", "general"],
};

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/** Escape a value for safe single-line YAML. */
function yamlString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function validatePayload(p) {
  const errors = [];
  if (!VALID_COLLECTIONS.has(p.collection)) {
    errors.push(`collection must be one of: ${[...VALID_COLLECTIONS].join(", ")}`);
  }
  if (!p.title) errors.push("title is required");
  if (!p.description) errors.push("description is required");
  if (!p.body) errors.push("body is required");
  if (p.difficulty && !["easy", "medium", "hard"].includes(p.difficulty)) {
    errors.push("difficulty must be easy | medium | hard");
  }
  return errors;
}

function buildFrontmatter(p, date) {
  const lines = ["---"];
  lines.push(`title: ${yamlString(p.title)}`);
  lines.push(`description: ${yamlString(p.description)}`);
  lines.push(`date: ${yamlString(date)}`);
  lines.push(`category: ${yamlString(p.category || "general")}`);

  const tags = asArray(p.tags);
  if (tags.length) {
    lines.push(`tags: [${tags.map((t) => yamlString(t)).join(", ")}]`);
  }
  if (p.collection === "tips" && p.difficulty) {
    lines.push(`difficulty: ${yamlString(p.difficulty)}`);
  }
  lines.push(`author: ${yamlString(p.author || "GTATipsHQ Team")}`);
  if (p.source) lines.push(`source: ${yamlString(p.source)}`);
  if (p.featured) lines.push("featured: true");
  if (p.draft) lines.push("draft: true");
  lines.push("---");
  return lines.join("\n");
}

/**
 * Create an MDX post file.
 * @returns {{ filePath: string, relPath: string, slug: string }}
 * @throws if the payload is invalid or the file exists (unless force).
 */
export function createPost(payload, { rootDir = process.cwd(), force = false } = {}) {
  const errors = validatePayload(payload);
  if (errors.length) {
    throw new Error(`Invalid post payload:\n  - ${errors.join("\n  - ")}`);
  }

  const date =
    payload.date && /^\d{4}-\d{2}-\d{2}$/.test(payload.date)
      ? payload.date
      : new Date().toISOString().slice(0, 10);

  const slug = slugify(payload.slug || payload.title);
  const dir = path.join(rootDir, "content", payload.collection);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.mdx`);
  const relPath = path.relative(rootDir, filePath);
  if (fs.existsSync(filePath) && !force) {
    throw new Error(`${relPath} already exists (use force to overwrite)`);
  }

  const frontmatter = buildFrontmatter(payload, date);
  const body = String(payload.body).trim();
  fs.writeFileSync(filePath, `${frontmatter}\n\n${body}\n`, "utf8");

  return { filePath, relPath, slug };
}
