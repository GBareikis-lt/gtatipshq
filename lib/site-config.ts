/**
 * Central site configuration.
 *
 * Everything that is likely to change over time (brand name, release date,
 * social links, SEO defaults) lives here so it can be tweaked in one place.
 */

export const siteConfig = {
  name: "GTATipsHQ",
  shortName: "GTATipsHQ",
  // Marketing tagline shown in the hero / metadata.
  tagline: "Your HQ for GTA 6 news, tips & the countdown to Leonida.",
  description:
    "GTATipsHQ is the modern hub for Grand Theft Auto 6 — live release countdown, breaking news, money-making guides, hidden tips and everything you need before launch day in Leonida.",
  // Public production URL (used for canonical URLs, sitemap, Open Graph).
  url: "https://leonidatips.com",
  locale: "en_US",
  // Twitter/X handle for SEO cards (leave empty if none yet).
  twitter: "",
  // Author / publisher shown in structured data.
  publisher: "GTATipsHQ",

  /**
   * Official GTA 6 release date used by the countdown.
   * Update this single value if Rockstar changes the date.
   * NOTE: stored in UTC. 2026-11-19.
   */
  releaseDateISO: "2026-11-19T00:00:00Z",
  releaseDateLabel: "November 19, 2026",
  releaseDateSubject: "Release window per Rockstar Games — subject to change.",

  nav: [
    { label: "News", href: "/news" },
    { label: "Tips & Guides", href: "/tips" },
    { label: "Map", href: "/map" },
    { label: "About", href: "/about" },
  ],

  social: {
    twitter: "",
    youtube: "",
    reddit: "",
    discord: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
