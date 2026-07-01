#!/usr/bin/env node
/**
 * Create a new MDX post (news or tip) from structured input.
 *
 * This is the manual entry point. The automated pipeline (`auto-post.mjs`)
 * reuses the same core (`scripts/lib/create-post.mjs`).
 *
 * USAGE
 *   node scripts/new-post.mjs --json '{"collection":"news","title":"...", ...}'
 *   node scripts/new-post.mjs --file ./draft.json
 *   node scripts/new-post.mjs --collection tips --title "..." --category money \
 *     --description "..." --tags "money,beginner" --body "## Step one\nDo this..."
 *
 * See scripts/lib/create-post.mjs for the full field reference.
 */

import fs from "node:fs";
import path from "node:path";
import { createPost } from "./lib/create-post.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

function buildPayload(args) {
  if (args.json) return JSON.parse(args.json);
  if (args.file) return JSON.parse(fs.readFileSync(path.resolve(args.file), "utf8"));
  return {
    collection: args.collection,
    title: args.title,
    description: args.description,
    body: typeof args.body === "string" ? args.body.replace(/\\n/g, "\n") : args.body,
    category: args.category,
    difficulty: args.difficulty,
    tags: args.tags,
    author: args.author,
    source: args.source,
    featured: args.featured === true || args.featured === "true",
    draft: args.draft === true || args.draft === "true",
    date: args.date,
    slug: args.slug,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = buildPayload(args);

  try {
    const { relPath, slug } = createPost(payload, { force: args.force === true });
    console.log(`✔ Created ${relPath}`);
    console.log(`  → /${payload.collection}/${slug}`);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}

main();
