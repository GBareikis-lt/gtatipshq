import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/site-config";
import { NewsIcon, TipsIcon, MapIcon, BoltIcon, ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About — Your GTA 6 News & Tips Hub",
  description:
    "About GTATipsHQ, an independent fan hub for GTA 6 news, tips, guides and the live countdown to launch day in Leonida.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/about`,
    title: "About GTATipsHQ — GTA 6 News & Tips Hub",
    description:
      "An independent fan hub for GTA 6 news, tips, guides and the countdown to launch in Leonida.",
  },
};

const pillars = [
  { Icon: NewsIcon, title: "Breaking news", desc: "Every official drop and credible rumour, summarised fast." },
  { Icon: TipsIcon, title: "Practical guides", desc: "Money methods, beginner help and secrets that actually work." },
  { Icon: MapIcon, title: "Interactive map", desc: "A growing map of Leonida with everything worth finding." },
  { Icon: BoltIcon, title: "Always current", desc: "Auto-updated content so you never miss what matters." },
];

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl pb-16 pt-12">
      <header className="text-center">
        <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          About <span className="text-gradient-sunset">{siteConfig.name}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60">
          {siteConfig.name} is an independent hub built for one thing: getting you
          everything that matters about Grand Theft Auto 6 — fast, accurate and in
          one place — all the way to launch day in Leonida and beyond.
        </p>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {pillars.map(({ Icon, title, desc }) => (
          <div key={title} className="glass rounded-3xl p-6">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-magenta-600/30 to-sunset-500/20 text-magenta-400">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            <p className="mt-1.5 text-sm text-white/55">{desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <SectionHeading
          eyebrow="How it works"
          title="Fresh content, automatically"
        />
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          New stories and guides are published through an automated content
          pipeline that gathers, drafts and formats the latest GTA 6 information,
          then files it as a clean article on the site. Editors review the queue,
          but the system keeps the news and tips flowing around the clock.
        </p>
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-night-900/40 p-7">
        <h2 className="font-display text-lg font-bold text-white">A quick disclaimer</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {siteConfig.name} is a fan-made project and is not affiliated with,
          endorsed by, or sponsored by Rockstar Games or Take-Two Interactive.
          Grand Theft Auto, GTA and all related marks are trademarks of Take-Two
          Interactive. All in-game information is gathered from official trailers,
          announcements and public sources.
        </p>
      </section>

      <div className="mt-12 text-center">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta-600 to-sunset-500 px-7 py-3.5 text-sm font-semibold text-white shadow-glow-magenta transition-transform hover:scale-[1.03]"
        >
          Start with the latest news
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
