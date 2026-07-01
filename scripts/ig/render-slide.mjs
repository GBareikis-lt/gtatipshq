/**
 * Render one Instagram carousel slide (1080x1350) to a PNG buffer.
 *
 * Layout: the background photo fills the frame and grows to take all the space
 * the text doesn't need; the headline sits in a black band at the bottom whose
 * height hugs the text. White text with sunset-gradient highlighted keywords,
 * and the @handle in the bottom-right.
 *
 * Highlight markup: wrap words in *asterisks* in the headline to color them.
 */

import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const W = 1080;
const H = 1350;

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
  const gradient = theme.gradient || "linear-gradient(140deg, #381d6b 0%, #b81e79 55%, #ff8a1f 100%)";
  const hlGradient = theme.highlightGradient;
  const fontSize = slide.fontSize || 74;

  const bgUri = toDataUri(slide.background);

  const words = parseHeadline(slide.headline || "");
  const headlineChildren = words.map((w) => {
    const base = { marginRight: 16, display: "flex" };
    if (w.hl && hlGradient) {
      return el(
        "span",
        {
          ...base,
          backgroundImage: hlGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        w.text,
      );
    }
    return el("span", { ...base, color: w.hl ? highlight : "#ffffff" }, w.text);
  });

  const imageStyle = bgUri
    ? { backgroundImage: `url("${bgUri}")`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: gradient };

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
      // Photo area — grows to fill whatever the text band doesn't use.
      el(
        "div",
        { display: "flex", flexGrow: 1, position: "relative", ...imageStyle },
        [
          // Soft scrim so the photo blends into the black text band.
          el("div", {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: W,
            height: 170,
            display: "flex",
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0), ${bg})`,
          }),
        ],
      ),
      // Text band — height hugs the content.
      el(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          backgroundColor: bg,
          paddingLeft: 64,
          paddingRight: 64,
          paddingTop: 44,
          paddingBottom: 40,
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
          // @handle, bottom-right.
          el(
            "div",
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: 34,
            },
            [
              el("div", {
                width: 22,
                height: 22,
                borderRadius: 999,
                display: "flex",
                marginRight: 12,
                backgroundColor: highlight,
              }),
              el("div", { display: "flex", color: "rgba(255,255,255,0.6)", fontSize: 30 }, handle),
            ],
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
