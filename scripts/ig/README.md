# Instagram Carousel Generator

Turns a JSON spec into ready-to-post **1080×1350 PNG slides** (bold text over a
photo, white with yellow highlights, `@handle` watermark) — the faceless-IG
carousel look. Same render engine as the site's OG image (Satori → PNG).

## Usage

```bash
node scripts/ig/generate-carousel.mjs content/ig/gta6-by-the-numbers.json
# or
npm run ig:carousel content/ig/gta6-by-the-numbers.json
```

Output → `out/ig/<name>/slide-01.png …` + `caption.txt`.
Open the PNGs, upload to Instagram as a carousel, paste `caption.txt`.

## Writing a carousel spec

Create `content/ig/<name>.json`:

```json
{
  "name": "my-carousel",
  "handle": "@leonidatips",
  "theme": { "highlight": "#FFD400", "bg": "#0a0a0a" },
  "caption": "Your caption…",
  "hashtags": ["#GTA6", "#GTAVI"],
  "slides": [
    { "background": "assets/ig/my-carousel/01.jpg",
      "headline": "GTA 6 is the *biggest* game in *history*." }
  ]
}
```

- **`*asterisks*`** around words = highlighted (yellow) — use for the punchy bits.
- **`background`** = path to a photo (GTA screenshot / render). If the file is
  missing, a solid brand color is used so you can preview first.
- **`counter`** auto-fills (`1/8`, `2/8`, …) unless you set it.
- **`fontSize`** per slide is optional (default 74) — lower it for long headlines.

## Backgrounds

Put photos in `assets/ig/<carousel-name>/` (e.g. `01.jpg` … `08.jpg`). Best
sources: official GTA 6 trailer screenshots (highest quality) or AI-rendered
Vice City / Leonida scenes. Any aspect ratio works — they're cropped to cover
the top of the slide.

## Tips

- Keep headlines short and punchy — 1 idea per slide.
- Slide 1 = hook, last slide = CTA ("Follow @… for more").
- Reuse a spec, swap `headline`/`background`, re-run.
