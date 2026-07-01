import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "GTA 6 Countdown, News & Tips | GTATipsHQ",
    template: "%s | GTATipsHQ",
  },
  description:
    "GTA 6 news, tips and guides plus a live release date countdown. Track the launch, master money-making methods and explore Leonida — all in one place.",
  applicationName: siteConfig.name,
  keywords: [
    "GTA 6",
    "GTA VI",
    "Grand Theft Auto 6",
    "GTA 6 release date",
    "GTA 6 countdown",
    "GTA 6 news",
    "GTA 6 tips",
    "GTA 6 money guide",
    "Leonida",
    "Vice City",
  ],
  authors: [{ name: siteConfig.publisher }],
  creator: siteConfig.publisher,
  publisher: siteConfig.publisher,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "GTA 6 Countdown, News & Tips",
    description:
      "Everything GTA 6 in one place: a live release countdown, breaking news, money guides and hidden tips for Leonida.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Countdown, News & Tips",
    description:
      "Everything GTA 6 in one place: live countdown, news, money guides and hidden tips for Leonida.",
    creator: siteConfig.twitter || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#07040f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="pt-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
