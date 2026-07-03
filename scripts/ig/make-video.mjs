#!/usr/bin/env node
/**
 * Turn a carousel's slide PNGs into a single MP4 video (no audio — add it in
 * TikTok/Reels). Each slide shows for a few seconds with a simple crossfade
 * between slides.
 *
 * USAGE
 *   node scripts/ig/make-video.mjs out/tiktok/<name>
 *   npm run ig:video out/tiktok/<name>
 *   npm run ig:video out/tiktok/<name> -- --seconds 4 --transition 0.5
 *
 * Output → <folder>/video.mp4 (H.264, yuv420p, ready for TikTok/IG Reels).
 * Uses the bundled ffmpeg (no system install needed).
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else { args[key] = next; i += 1; }
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2);
  const dir = argv.find((a) => !a.startsWith("--"));
  const args = parseArgs(argv);
  if (!dir) {
    console.error("Usage: node scripts/ig/make-video.mjs <folder> [--seconds 4] [--transition 0.5] [--effect fade]");
    process.exit(1);
  }

  const folder = path.resolve(dir);
  const seconds = Number(args.seconds || 4); // per-slide screen time
  const T = Number(args.transition || 0.5); // crossfade duration
  const fps = Number(args.fps || 30);
  const effect = args.effect || "fade"; // simple crossfade dissolve

  const slides = fs
    .readdirSync(folder)
    .filter((f) => /^slide-\d+\.png$/.test(f))
    .sort();
  if (slides.length === 0) {
    console.error(`No slide-*.png in ${folder}`);
    process.exit(1);
  }
  const n = slides.length;

  // Inputs: each PNG looped for `seconds`.
  const inputs = [];
  for (const s of slides) inputs.push("-loop", "1", "-t", String(seconds), "-i", path.join(folder, s));

  // Normalise every input, then crossfade-chain them.
  const parts = [];
  for (let i = 0; i < n; i += 1) {
    parts.push(`[${i}:v]fps=${fps},format=yuv420p,setsar=1,settb=AVTB[v${i}]`);
  }
  let prev = "v0";
  for (let j = 1; j < n; j += 1) {
    const off = (j * (seconds - T)).toFixed(3);
    const out = j === n - 1 ? "vout" : `x${j}`;
    parts.push(`[${prev}][v${j}]xfade=transition=${effect}:duration=${T}:offset=${off}[${out}]`);
    prev = out;
  }
  const finalLabel = n > 1 ? "vout" : "v0";
  const filter = parts.join(";");

  const outFile = path.join(folder, "video.mp4");
  const ffArgs = [
    ...inputs,
    "-filter_complex", filter,
    "-map", `[${finalLabel}]`,
    "-r", String(fps),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "20",
    "-preset", "veryfast",
    "-movflags", "+faststart",
    "-y", outFile,
  ];

  const totalDur = (n * seconds - (n - 1) * T).toFixed(1);
  console.log(`▶ ${n} slides · ${seconds}s each · ${T}s crossfade → ${totalDur}s video`);

  const res = spawnSync(ffmpeg.path, ffArgs, { stdio: ["ignore", "ignore", "inherit"] });
  if (res.status !== 0) {
    console.error("✖ ffmpeg failed");
    process.exit(1);
  }
  console.log(`✅ ${path.relative(process.cwd(), outFile)}`);
}

main();
