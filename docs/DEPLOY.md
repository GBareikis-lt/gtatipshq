# Deploying GTATipsHQ to Hostinger

The site is a standard **Next.js (App Router)** app with `output: "standalone"`,
so it runs as a Node process. Two solid options on Hostinger:

## Option A — Node app (recommended, supports ISR/SSR)

1. **Build locally or in CI:**

   ```bash
   npm ci
   npm run build
   ```

   This produces `.next/standalone` (server) and `.next/static` (assets).

2. **Upload** the project (or the `.next/standalone` output plus `.next/static`
   and `public/`) to your Hostinger Node hosting.

3. **Set the Node app entry point** to the standalone server:

   ```bash
   node .next/standalone/server.js
   ```

   Make sure `.next/static` and `public/` sit next to it (Next copies `public/`
   into standalone automatically; copy `.next/static` into
   `.next/standalone/.next/static`).

4. **Environment:** set `NODE_ENV=production` and the port Hostinger expects
   (usually via `PORT`).

5. Point the **`leonidatips.com`** domain at the app.

## Option B — Static export (simplest, no SSR)

The site is mostly static. If you prefer pure static hosting, you can switch to
`output: "export"` in `next.config.mjs` and run `npm run build` to emit an `out/`
folder you upload to `public_html`. Note: `robots`/`sitemap` route handlers and
any future server features need the Node setup in Option A, so Option A is
preferred.

## Updating content (the AI auto-poster flow)

1. The agent writes new `.mdx` files into `content/` and pushes to git.
2. A new build picks them up: `npm run build`.
3. Redeploy the rebuilt output (CI can automate steps 2–3 on every push).

> Tip: Hook up a GitHub Action that runs `npm ci && npm run build` on push to
> `main` and deploys via SSH/FTP to Hostinger so new posts go live automatically.

## Quick checklist

- [ ] `npm run build` succeeds locally
- [ ] `leonidatips.com` DNS points to the host
- [ ] `lib/site-config.ts` `url` is `https://leonidatips.com`
- [ ] HTTPS enabled
- [ ] Release date in `lib/site-config.ts` is current
