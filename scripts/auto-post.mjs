#!/usr/bin/env node
/**
 * Auto-poster orchestrator: fetch candidates -> rewrite with Claude -> write
 * MDX -> log -> (optionally) commit. Designed to run headless on a schedule
 * (GitHub Actions / cron).
 *
 * USAGE
 *   node scripts/auto-post.mjs                # fetch + rewrite + publish
 *   node scripts/auto-post.mjs --max 3        # cap posts this run (default 3)
 *   node scripts/auto-post.mjs --dry-run      # show candidates only, no API/writes
 *   node scripts/auto-post.mjs --mock         # skip the API, fabricate stubs (pipeline test)
 *   node scripts/auto-post.mjs --commit       # git add + commit new files
 *   node scripts/auto-post.mjs --commit --push # also push
 *
 * ENV
 *   ANTHROPIC_API_KEY   required (unless --dry-run / --mock)
 *   AUTO_POST_MODEL     default "claude-sonnet-4-6"
 *   AUTO_POST_MAX       default 3
 */

import { execSync } from "node:child_process";
import { loadEnv } from "./lib/load-env.mjs";
import { getCandidates } from "./fetch-candidates.mjs";

loadEnv();
import { rewriteCandidate } from "./rewrite.mjs";
import { createPost, ALLOWED_CATEGORIES } from "./lib/create-post.mjs";
import { loadLog, recordPost, markSeen, saveLog, itemId } from "./lib/store.mjs";
import {
  loadBudget,
  saveBudget,
  getMonthUsd,
  addUsage,
  estimateUsd,
  monthKey,
} from "./lib/budget.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function normalizeCategory(collection, category) {
  const allowed = ALLOWED_CATEGORIES[collection] || [];
  return allowed.includes(category) ? category : "general";
}

/** Fabricate a minimal article for --mock (no API call). */
function mockArticle(candidate) {
  return {
    collection: "news",
    category: "general",
    title: `GTA 6 Update: ${candidate.title}`.slice(0, 60),
    description: `A quick GTATipsHQ summary of the latest around GTA 6 and ${candidate.source}.`.slice(0, 160),
    tags: ["gta 6", candidate.topic],
    draft: true,
    body: `## What happened\n\nThis is a mock article generated for pipeline testing (no AI call).\n\n> Replace by running without --mock and with ANTHROPIC_API_KEY set.`,
    source: candidate.link,
    author: "GTATipsHQ Editorial",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const max = Number(args.max || process.env.AUTO_POST_MAX || 3);
  const rootDir = process.cwd();

  console.log(`▶ Auto-poster: fetching candidates (max ${max})…`);
  const candidates = await getCandidates({ max, rootDir });
  console.log(`  found ${candidates.length} candidate(s).`);

  if (args["dry-run"]) {
    for (const c of candidates) {
      console.log(`  • [${c.score}] ${c.source}: ${c.title}\n    ${c.link}`);
    }
    console.log("Dry run — no articles written.");
    return;
  }

  const log = loadLog(rootDir);
  const created = [];

  // --- Spend guard ---------------------------------------------------------
  const monthlyCap = Number(process.env.AUTO_POST_MONTHLY_USD || 5);
  const key = monthKey();
  const budget = loadBudget(rootDir);
  let monthSpent = getMonthUsd(budget, key);
  const usingApi = !args.mock;

  if (usingApi && monthSpent >= monthlyCap) {
    console.warn(
      `⛔ Monthly budget reached: $${monthSpent.toFixed(2)} / $${monthlyCap.toFixed(2)} for ${key}. Skipping all API calls.`,
    );
    console.warn("   Raise AUTO_POST_MONTHLY_USD to allow more this month.");
    return;
  }
  if (usingApi) {
    console.log(
      `  budget: $${monthSpent.toFixed(2)} / $${monthlyCap.toFixed(2)} used this month (${key}).`,
    );
  }

  for (const candidate of candidates) {
    const id = candidate.id || itemId(candidate);

    // Stop before spending past the cap.
    if (usingApi && monthSpent >= monthlyCap) {
      console.warn(`⛔ Budget cap hit mid-run ($${monthSpent.toFixed(2)}). Stopping.`);
      break;
    }

    try {
      let article;
      if (args.mock) {
        article = mockArticle(candidate);
      } else {
        const res = await rewriteCandidate(candidate);
        article = res.article;
        const cost = estimateUsd(res.usage, res.model);
        monthSpent += cost;
        addUsage(budget, cost, { key, calls: 1, posts: article ? 1 : 0 });
        console.log(`    ~$${cost.toFixed(4)} (month total $${monthSpent.toFixed(2)})`);
      }

      if (!article) {
        console.log(`  – skipped (model declined): ${candidate.title}`);
        markSeen(log, id);
        continue;
      }

      article.category = normalizeCategory(article.collection, article.category);
      const { relPath, slug } = createPost(article, { rootDir });
      recordPost(log, {
        id,
        slug,
        collection: article.collection,
        title: article.title,
        source: candidate.link,
      });
      created.push({ relPath, slug, title: article.title, draft: article.draft });
      console.log(`  ✔ ${relPath}${article.draft ? " (draft)" : ""}`);
    } catch (err) {
      console.warn(`  ✖ ${candidate.title}: ${err.message}`);
      // Do not mark seen on hard failures, so it can be retried next run.
    }
  }

  saveLog(log, rootDir);
  if (usingApi) saveBudget(budget, rootDir);

  if (created.length === 0) {
    console.log("Nothing new to publish.");
    return;
  }

  console.log(`\nPublished ${created.length} article(s).`);

  if (args.commit) {
    try {
      execSync("git add content data", { stdio: "inherit", cwd: rootDir });
      const msg = `feat: auto-post ${created.length} GTA 6 update(s) [skip ci]`;
      execSync(`git commit -m ${JSON.stringify(msg)}`, { stdio: "inherit", cwd: rootDir });
      if (args.push) execSync("git push", { stdio: "inherit", cwd: rootDir });
      console.log("Committed.");
    } catch (err) {
      console.warn(`Commit step failed: ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
