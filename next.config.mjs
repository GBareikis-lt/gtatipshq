/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: no `output: "standalone"` — on Hostinger's managed Next.js runtime it
  // caused a second server process to fight for port 3000 (restart loop → 503).
  // Plain `next start` is what the managed runtime expects.
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
