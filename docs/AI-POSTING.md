# AI Auto-Posting Guide

GTATipsHQ publishes content as `.mdx` files in `content/`. The auto-poster
**fetches reliable sources → rewrites them in original words with Claude →
writes an MDX file → commits it**. No database or CMS.

Everything is git-versioned, so a new post is just a new file + a commit, which
triggers a rebuild/deploy.

---

## 1. Pipeline overview

```
scripts/
  sources.mjs            Whitelisted RSS feeds + relevance keywords
  fetch-candidates.mjs   Fetch feeds, filter by relevance, rank, dedupe
  rewrite.mjs            Claude API: rewrite a source item into an original article
  auto-post.mjs          Orchestrator: fetch -> rewrite -> write MDX -> log -> commit
  lib/create-post.mjs    Shared MDX writer (also used by new-post.mjs)
  lib/store.mjs          Dedupe log (data/auto-post-log.json)
```

**What gets posted:** GTA 6 news plus adjacent topics that matter to players —
PS6 / next-gen Xbox / hardware & graphics. Sources are reputable outlets
(IGN, GameSpot, Eurogamer, VGC, Push Square, Pure Xbox…). Community/rumor
sources are marked `trust: "medium"` and their posts default to `draft: true`
for human review.

**Originality & safety:** the model summarises in its own words (never copies),
must not invent facts, attributes the `source`, and flags rumours/unconfirmed
items as drafts. See the system prompt in `scripts/rewrite.mjs`.

---

## 2. Running it

Requires `ANTHROPIC_API_KEY` (see `.env.example`).

```bash
# Preview candidates only (no API key, no writes):
node scripts/auto-post.mjs --dry-run --max 8

# Test the file/log pipeline without the API (fabricates a draft stub):
node scripts/auto-post.mjs --mock --max 1

# Real run (needs the key). Locally you can load .env:
node --env-file=.env scripts/auto-post.mjs --max 3
# …or pass inline:
ANTHROPIC_API_KEY=sk-ant-... npm run auto:post

# Also commit (and push) the new files:
node --env-file=.env scripts/auto-post.mjs --max 3 --commit --push
```

Env vars: `AUTO_POST_MODEL` (default `claude-sonnet-4-6`), `AUTO_POST_MAX`
(default 3), `AUTO_POST_MAX_AGE_DAYS` (default 4).

---

## 3. Scheduling (GitHub Actions)

`.github/workflows/auto-post.yml` runs the pipeline every 6 hours and commits
new posts. To enable it:

1. Push this repo to GitHub.
2. Add a repo **secret** `ANTHROPIC_API_KEY` (Settings → Secrets and variables →
   Actions).
3. (Optional) Add a repo **variable** `AUTO_POST_MODEL` to override the model.
4. That's it — it also runs on demand via **Run workflow** (workflow_dispatch).

The workflow has `contents: write` permission and pushes commits with the
built-in `GITHUB_TOKEN`. New commits to `content/` can trigger your Hostinger
deploy (see [`DEPLOY.md`](DEPLOY.md)).

> Prefer a different runner? The same command works from any cron (local machine
> or Hostinger cron). Just export `ANTHROPIC_API_KEY` and run
> `node scripts/auto-post.mjs --max 3 --commit --push`.

---

## 3b. Cost & spend limits (avoid surprise bills)

Two layers protect you:

1. **Console spend limit (hard backstop — do this).** In the
   [Anthropic Console](https://console.anthropic.com/) → Settings → Limits /
   Billing, set a monthly spend cap. This is enforced by Anthropic and is your
   real safety net.

2. **Built-in monthly budget guard.** The auto-poster estimates cost from actual
   token usage and stops making API calls once `AUTO_POST_MONTHLY_USD` (default
   **$5**) is reached for the current month. Spend is tracked in
   `data/budget.json` (committed, so a scheduled runner remembers).

Extra caps already in place:

- `AUTO_POST_MAX` posts per run (default 3).
- `max_tokens` bounded per call in `scripts/rewrite.mjs`.
- Prompt caching lowers cost on repeat runs.

**Rough cost:** a typical article is ~$0.015–0.02 on `claude-sonnet-4-6`
(~3× cheaper on `claude-haiku-4-5`). At the default $5/month cap that's roughly
250+ articles — far more than you'll publish. Set a lower cap if you want.

> The built-in guard is a client-side *estimate*, not your invoice. Always set
> the Console limit too.

## 4. Tuning

- **Sources:** edit `scripts/sources.mjs` — add/remove feeds, change `trust`.
- **Relevance:** edit the `KEYWORDS` list (and weights) in the same file to
  broaden or narrow what counts as on-topic.
- **Editorial rules / tone / SEO:** edit the system prompt in
  `scripts/rewrite.mjs`.
- **Categories:** allowed values live in `scripts/lib/create-post.mjs`
  (`ALLOWED_CATEGORIES`). The homepage tip categories are in
  `lib/tip-categories.ts`.
- **Dedupe:** `data/auto-post-log.json` remembers processed items. It is
  committed so a scheduled runner never re-posts. Delete an entry to allow a
  re-post.

---

## 5. Manual posting

To write a post by hand (or from another agent), use the same contract:

```bash
node scripts/new-post.mjs --json '{
  "collection": "tips",
  "title": "GTA 6 Money Guide: Fast Early Cash",
  "description": "Beginner-friendly ways to stack cash quickly in GTA 6.",
  "category": "money",
  "difficulty": "easy",
  "tags": ["money", "beginner"],
  "body": "## Step one\n\nDo this..."
}'
```

Field reference: header comment in `scripts/lib/create-post.mjs`.
Set `"draft": true` to keep a post hidden in production until reviewed.
