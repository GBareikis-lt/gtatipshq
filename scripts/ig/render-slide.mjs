/**
 * Render one Instagram carousel slide (1080x1350) to a PNG buffer.
 *
 * Uses Satori (JSX-like layout -> SVG) + resvg (SVG -> PNG) — the same engine as
 * the site's OG image. Produces the "photo on top, bold text on black below"
 * faceless-carousel look with white text and highlighted (yellow) keywords.
 *
 * Highlight markup: wrap words in *asterisks* in the headline to color them.
 *   "GTA 6 is the *biggest* game in *history*."
 */

import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const W = 1080;
const H = 1350;
const IMG_H = 760;

const FONT_PATH = path.join(import.meta.dirname, "fonts", "Anton-Regular.ttf");
const fontData = fs.readFileSync(FONT_PATH);

/** Tiny hyperscript helper for Satori's element shape. */
function el(type, style, children) {
  return { type, props: { style, children } };
}

/** Parse "*highlighted* words" into [{ text, hl }] word tokens. */
function parseHeadline(text) {
  const segments = [];
  let hl = false;
  let buf = "";
  const flush = () => {
    if (buf) segments.push({ text: buf, hl });
    buf = "";
  };
  for (const ch of text) {
    if (ch === "*") {
      flush();
      hl = !hl;
    } else {
      buf += ch;
    }
  }
  flush();

  const words = [];
  for (const seg of segments) {
    for (const w of seg.text.split(/\s+/)) {
      if (w) words.push({ text: w, hl: seg.hl });
    }
  }
  // Attach punctuation-only tokens to the previous word (no leading space).
  const merged = [];
  for (const w of words) {
    if (merged.length && /^[.,!?:;"')\]]+$/.test(w.text)) {
      merged[merged.length - 1].text += w.text;
    } else {
      merged.push({ ...w });
    }
  }
  return merged;
}

function toDataUri(filePath) {
  if (!filePath) return null;
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) return null;
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(abs).toString("base64")}`;
}

export async function renderSlide(slide, { handle = "@leonidatips", theme = {} } = {}) {
  const highlight = theme.highlight || "#FFD400";
  const bg = theme.bg || "#0a0a0a";
  const fontSize = slide.fontSize || 74;

  const bgUri = toDataUri(slide.background);

  const words = parseHeadline(slide.headline || "");
  const headlineChildren = words.map((w, i) =>
    el(
      "span",
      {
        color: w.hl ? highlight : "#ffffff",
        marginRight: 16,
        display: "flex",
      },
      w.text,
    ),
  );

  // Image area: background (or fallback), counter, handle watermark.
  const imageChildren = [];
  if (bgUri) {
    imageChildren.push({
      type: "img",
      props: {
        src: bgUri,
        width: W,
        height: IMG_H,
        style: { objectFit: "cover" },
      },
    });
  }
  // dark scrim at the bottom of the image so it blends into the text band
  imageChildren.push(
    el("div", {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: W,
      height: 160,
      display: "flex",
      backgroundColor: bg,
      opacity: 0.35,
    }),
  );
  if (slide.counter) {
    imageChildren.push(
      el(
        "div",
        {
          position: "absolute",
          top: 28,
          right: 28,
          display: "flex",
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: 30,
        },
        slide.counter,
      ),
    );
  }
  // handle watermark chip (bottom-left over image)
  imageChildren.push(
    el(
      "div",
      {
        position: "absolute",
        left: 28,
        bottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingLeft: 16,
        paddingRight: 22,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 999,
        backgroundColor: "rgba(0,0,0,0.55)",
      },
      [
        el("div", {
          width: 26,
          height: 26,
          borderRadius: 999,
          display: "flex",
          backgroundColor: highlight,
        }),
        el("div", { display: "flex", color: "#fff", fontSize: 28 }, handle),
      ],
    ),
  );

  const tree = el(
    "div",
    {
      width: W,
      height: H,
      display: "flex",
      flexDirection: "column",
      backgroundColor: bg,
      fontFamily: "Anton",
    },
    [
      el(
        "div",
        {
          width: W,
          height: IMG_H,
          position: "relative",
          display: "flex",
          backgroundColor: "#1d1340",
        },
        imageChildren,
      ),
      el(
        "div",
        {
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 70,
          paddingRight: 70,
          paddingTop: 30,
          paddingBottom: 30,
        },
        [
          el(
            "div",
            {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize,
              lineHeight: 1.05,
              textTransform: "uppercase",
            },
            headlineChildren,
          ),
        ],
      ),
    ],
  );

  const svg = await satori(tree, {
    width: W,
    height: H,
    fonts: [{ name: "Anton", data: fontData, weight: 400, style: "normal" }],
  });

  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } })
    .render()
    .asPng();
  return png;
}
