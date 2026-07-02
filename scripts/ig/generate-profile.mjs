#!/usr/bin/env node
/**
 * Render the Instagram profile picture (1080x1080) — the brand mark (Vice City
 * synthwave sun + a detailed palm silhouette) on a dark sunset-glow background.
 * Crisp vector, matches leonidatips.com. Instagram crops to a circle.
 *
 * Run: npm run ig:profile   →   out/ig/profile/profile.png
 */

import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <radialGradient id="glow" cx="520" cy="440" r="560" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ff2d8e" stop-opacity="0.5"/>
      <stop offset="0.55" stop-color="#ff8a1f" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#07040f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sun" x1="520" y1="200" x2="520" y2="760" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffd15a"/>
      <stop offset="0.42" stop-color="#ff4fa0"/>
      <stop offset="1" stop-color="#ff7a1f"/>
    </linearGradient>
    <linearGradient id="palm" x1="560" y1="300" x2="820" y2="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4deff7"/>
      <stop offset="1" stop-color="#12b8d6"/>
    </linearGradient>
    <mask id="stripes">
      <rect width="1080" height="1080" fill="black"/>
      <circle cx="520" cy="450" r="260" fill="white"/>
      <rect x="230" y="470" width="580" height="26" fill="black"/>
      <rect x="230" y="524" width="580" height="34" fill="black"/>
      <rect x="230" y="590" width="580" height="46" fill="black"/>
      <rect x="230" y="672" width="580" height="58" fill="black"/>
    </mask>
  </defs>

  <rect width="1080" height="1080" fill="#0a0712"/>
  <rect width="1080" height="1080" fill="url(#glow)"/>

  <!-- Synthwave sun -->
  <rect width="1080" height="1080" fill="url(#sun)" mask="url(#stripes)"/>
  <line x1="200" y1="812" x2="840" y2="812" stroke="url(#sun)" stroke-width="40" stroke-linecap="round"/>

  <!-- Palm -->
  <g fill="url(#palm)">
    <!-- trunk (curved, tapering) -->
    <path d="M654 474 C 646 596, 664 726, 704 878 C 711 898, 744 894, 737 872 C 700 724, 684 596, 682 480 Z"/>
    <!-- fronds: arch up/out, tips droop, leaf-shaped -->
    <path d="M662 470 C 560 388, 430 372, 322 420 C 360 372, 470 356, 556 402 C 610 428, 646 452, 672 490 Z"/>
    <path d="M666 466 C 592 320, 500 244, 396 214 C 470 236, 566 300, 636 404 C 662 442, 676 468, 682 486 Z"/>
    <path d="M676 464 C 664 316, 686 214, 736 130 C 726 240, 716 356, 706 470 C 700 480, 692 484, 686 484 Z"/>
    <path d="M686 464 C 782 322, 884 258, 992 250 C 902 286, 806 356, 726 452 C 706 476, 694 484, 686 486 Z"/>
    <path d="M690 476 C 800 462, 902 486, 986 552 C 892 520, 792 512, 700 506 C 694 500, 690 490, 690 482 Z"/>
    <path d="M684 486 C 792 524, 878 604, 924 720 C 852 620, 760 550, 694 508 C 688 502, 684 494, 684 486 Z"/>
    <path d="M666 488 C 574 534, 502 610, 452 716 C 512 604, 596 536, 668 502 C 674 498, 672 492, 666 488 Z"/>
    <!-- coconuts -->
    <circle cx="682" cy="474" r="15"/>
    <circle cx="708" cy="488" r="12"/>
    <circle cx="660" cy="490" r="11"/>
  </g>
</svg>`;

const outDir = path.join(process.cwd(), "out", "ig", "profile");
fs.mkdirSync(outDir, { recursive: true });
const png = new Resvg(svg, { fitTo: { mode: "width", value: 1080 } }).render().asPng();
const file = path.join(outDir, "profile.png");
fs.writeFileSync(file, png);
console.log(`✔ Profile picture → ${path.relative(process.cwd(), file)} (1080x1080)`);
