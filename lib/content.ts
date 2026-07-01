import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

/**
 * Lightweight file-based content layer.
 *
 * Content lives as `.mdx` files under `content/<collection>/`. Each file has
 * YAML frontmatter (see types below) plus an MDX body. This keeps the whole
 * site static + git-versioned, which is exactly what the AI auto-poster needs:
 * it just writes a new `.mdx` file and commits it.
 */

export type Collection = "news" | "tips";

export interface BaseFrontmatter {
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-06-28". */
  date: string;
  category: string;
  tags?: string[];
  cover?: string;
  author?: string;
  featured?: boolean;
  /** Optional source URL the AI used (shown as attribution). */
  source?: string;
  /** For tips: easy | medium | hard. */
  difficulty?: "easy" | "medium" | "hard";
  /** Set draft: true to keep a file out of production listings. */
  draft?: boolean;
}

export interface ContentDoc {
  slug: string;
  collection: Collection;
  frontmatter: BaseFrontmatter;
  body: string;
  readingMinutes: number;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function collectionDir(collection: Collection): string {
  return path.join(CONTENT_ROOT, collection);
}

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Read and parse a single file. Returns null if it cannot be parsed. */
function parseFile(collection: Collection, fileName: string): ContentDoc | null {
  const fullPath = path.join(collectionDir(collection), fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const fm = data as Partial<BaseFrontmatter>;
  if (!fm.title || !fm.date) {
    // Skip malformed files instead of crashing the whole build.
    console.warn(`[content] Skipping ${collection}/${fileName}: missing title/date`);
    return null;
  }

  return {
    slug: fileName.replace(/\.mdx?$/, ""),
    collection,
    frontmatter: {
      title: fm.title,
      description: fm.description ?? "",
      date: fm.date,
      category: fm.category ?? "general",
      tags: fm.tags ?? [],
      cover: fm.cover,
      author: fm.author ?? "GTATipsHQ Team",
      featured: fm.featured ?? false,
      source: fm.source,
      difficulty: fm.difficulty,
      draft: fm.draft ?? false,
    },
    body: content,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

/** Return all published docs in a collection, newest first. */
export function getAllDocs(collection: Collection): ContentDoc[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => parseFile(collection, f))
    .filter((d): d is ContentDoc => d !== null)
    .filter((d) => !(isProd() && d.frontmatter.draft))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getDocBySlug(
  collection: Collection,
  slug: string,
): ContentDoc | null {
  const mdx = path.join(collectionDir(collection), `${slug}.mdx`);
  const md = path.join(collectionDir(collection), `${slug}.md`);
  const file = fs.existsSync(mdx) ? `${slug}.mdx` : fs.existsSync(md) ? `${slug}.md` : null;
  if (!file) return null;
  const doc = parseFile(collection, file);
  if (!doc) return null;
  if (isProd() && doc.frontmatter.draft) return null;
  return doc;
}

export function getAllSlugs(collection: Collection): string[] {
  return getAllDocs(collection).map((d) => d.slug);
}

export function getFeatured(collection: Collection, limit = 1): ContentDoc[] {
  const docs = getAllDocs(collection);
  const featured = docs.filter((d) => d.frontmatter.featured);
  return (featured.length ? featured : docs).slice(0, limit);
}

export function getLatest(collection: Collection, limit = 3): ContentDoc[] {
  return getAllDocs(collection).slice(0, limit);
}

/** Human-friendly date, e.g. "June 28, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
