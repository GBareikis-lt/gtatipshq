# GTA 6 art library (hero slides)

Drop your **official GTA 6 images** here (key art, character renders,
screenshots). The AI carousel generator uses them for **hero slides** (the first
and last slide of each carousel) so those look authentic — the middle "info"
slides get fresh fal.ai images.

```
assets/ig/library/
  keyart-lucia-jason.jpg
  vice-city-skyline-night.jpg
  muscle-car-beach.jpg
  manifest.json        ← optional, for better matching
```

## Naming / tags

The picker matches an image to a slide by keyword. Two ways to tag:

1. **File name** (simplest): `vice-city-night.jpg` → tags `vice`, `city`, `night`.
2. **manifest.json** (better): map each file to tags + a role. See
   `manifest.example.json`. `role: "hero"` marks strong key-art shots for the
   first/last slide.

## Where to get images

Use Rockstar's **official** GTA 6 media (official site press/downloads and the
official trailers). These are Rockstar's copyrighted assets — standard practice
for fan/news accounts, but they are not yours. Avoid random re-uploads; prefer
official sources, and keep the fan-account disclaimer clear.

Tip: 15–20 varied images is plenty — the picker rotates them and avoids repeats
within a single carousel.
