#!/usr/bin/env node
/**
 * Render the Instagram profile picture (1080x1080) — the brand mark (Vice City
 * synthwave sun + palm) on a dark sunset-glow background. Crisp vector, matches
 * leonidatips.com. Instagram crops it to a circle, so the mark is centered.
 *
 * Run: npm run ig:profile   →   out/ig/profile/profile.png
 */

import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="glow" cx="32" cy="27" r="34" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ff2d8e" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="#ff8a1f" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#07040f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sun" x1="32" y1="14" x2="32" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffd15a"/>
      <stop offset="0.42" stop-color="#ff4fa0"/>
      <stop offset="1" stop-color="#ff7a1f"/>
    </linearGradient>
    <linearGradient id="palm" x1="20" y1="18" x2="40" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#38e1f0"/>
      <stop offset="1" stop-color="#16c7e0"/>
    </linearGradient>
    <mask id="stripes">
      <rect width="64" height="64" fill="black"/>
      <circle cx="32" cy="27" r="15.5" fill="white"/>
      <rect x="12" y="28.5" width="40" height="1.7" fill="black"/>
      <rect x="12" y="32.3" width="40" height="2.2" fill="black"/>
      <rect x="12" y="36.6" width="40" height="2.9" fill="black"/>
      <rect x="12" y="41.5" width="40" height="3.6" fill="black"/>
    </mask>
  </defs>
  <rect width="64" height="64" fill="#0a0712"/>
  <rect width="64" height="64" fill="url(#glow)"/>
  <rect width="64" height="64" fill="url(#sun)" mask="url(#stripes)"/>
  <line x1="11" y1="49.5" x2="53" y2="49.5" stroke="url(#sun)" stroke-width="2.6" stroke-linecap="round"/>
  <g stroke="url(#palm)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M43 49.5c-.6-6-1.4-11-2.4-16"/>
    <path d="M40.6 33.5c-2.6-2-5.6-2.7-8.9-2"/>
    <path d="M40.6 33.5c-1.4-3-1.6-6 .1-9.2"/>
    <path d="M40.6 33.5c2.9-1.6 6-1.9 9.4-.7"/>
    <path d="M40.6 33.5c.6-2.6 2.3-4.7 5-6.3"/>
  </g>
  <circle cx="40.7" cy="33.2" r="1.5" fill="url(#palm)"/>
</svg>`;

const outDir = path.join(process.cwd(), "out", "ig", "profile");
fs.mkdirSync(outDir, { recursive: true });
const png = new Resvg(svg, { fitTo: { mode: "width", value: 1080 } }).render().asPng();
const file = path.join(outDir, "profile.png");
fs.writeFileSync(file, png);
console.log(`✔ Profile picture → ${path.relative(process.cwd(), file)} (1080x1080)`);
