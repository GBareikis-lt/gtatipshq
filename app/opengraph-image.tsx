import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = "GTATipsHQ — GTA 6 News, Tips & Countdown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(1200px 500px at 20% 0%, #2a1d57 0%, #07040f 60%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 30,
            fontWeight: 700,
            color: "#ff5cb1",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 99,
              background: "#ff2d8e",
            }}
          />
          GTATipsHQ
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Everything GTA 6, in one place.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 880,
          }}
        >
          Live countdown · News · Tips & money guides · Leonida map
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#38e1f0",
          }}
        >
          {`Releasing ${siteConfig.releaseDateLabel} · leonidatips.com`}
        </div>
      </div>
    ),
    { ...size },
  );
}
