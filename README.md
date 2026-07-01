# GTATipsHQ

The modern hub for **GTA 6** — live release countdown, breaking news,
money-making guides, hidden tips and an interactive map of Leonida.
Built to be **fast, responsive, beautiful and SEO-optimised**, with an
**AI auto-posting** content pipeline.

🌐 Production: [leonidatips.com](https://leonidatips.com)

## Tech stack

- **Next.js 15** (App Router, React 19) — SSG/ISR, great SEO defaults
- **TypeScript**
- **Tailwind CSS v4** — Vice City "Miami sunset" theme
- **MDX content** (`content/`) parsed with `gray-matter` + `next-mdx-remote`
- File-based, git-versioned content — no database or CMS

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build & run production:

```bash
npm run build
npm start
```

## Project structure

```
app/                 Routes (home, news, tips, map, about, sitemap, robots)
components/          UI: header, footer, hero, countdown, cards, icons, logo
content/
  news/*.mdx         News articles
  tips/*.mdx         Tips & guides
lib/
  site-config.ts     Brand, nav, and the GTA 6 release date (edit here)
  content.ts         MDX reading/parsing layer
  gta-facts.ts       Homepage facts + FAQ
scripts/
  new-post.mjs       Create a new MDX post (used by the AI auto-poster)
prompts/
  auto-poster.md     Ready-to-run agent prompt for scheduled posting
docs/
  AI-POSTING.md      How automated content posting works
  DEPLOY.md          Hostinger deployment guide
```

## Key things to edit

- **Release date / brand / nav:** `lib/site-config.ts`
- **Homepage facts & FAQ:** `lib/gta-facts.ts`
- **Theme colours:** `app/globals.css` (`@theme` block)

## Adding content

Manually:

```bash
node scripts/new-post.mjs \
  --collection tips --title "GTA 6 fast money" \
  --category money --difficulty easy \
  --description "Earn cash quickly" --tags "money,beginner" \
  --body "## Step one\nDo this..."
```

…or let the AI agent do it — see [`docs/AI-POSTING.md`](docs/AI-POSTING.md).

## SEO features

- Per-page metadata, Open Graph & Twitter cards
- `sitemap.xml` and `robots.txt` (auto-generated, includes all posts)
- JSON-LD structured data: `WebSite`, `FAQPage`, `NewsArticle`/`Article`,
  `BreadcrumbList`
- Semantic HTML, fast static pages, responsive + accessible UI

## Disclaimer

Fan-made project. Not affiliated with Rockstar Games or Take-Two Interactive.
Grand Theft Auto and GTA are trademarks of Take-Two Interactive.
