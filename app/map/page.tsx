import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { siteConfig } from "@/lib/site-config";
import { MapIcon, ArrowRightIcon, MoneyIcon, StarIcon, CarIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "GTA 6 Map: Interactive Leonida & Vice City",
  description:
    "The interactive GTA 6 map of Leonida and Vice City — collectibles, money spots, stunt jumps and hidden secrets. Filling in as Rockstar reveals the world.",
  alternates: { canonical: "/map" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/map`,
    title: "GTA 6 Map: Interactive Leonida & Vice City",
    description:
      "An interactive GTA 6 map of Leonida with collectibles, money spots, stunt jumps and hidden secrets.",
  },
};

const planned = [
  { Icon: MoneyIcon, title: "Money & loot spots", desc: "Where to grab quick cash and hidden stashes." },
  { Icon: StarIcon, title: "Collectibles", desc: "Every package, sticker and easter egg, mapped." },
  { Icon: CarIcon, title: "Stunt jumps & rare cars", desc: "Spawn locations and the best jumps to nail." },
];

export default function MapPage() {
  return (
    <div className="container-page pb-16 pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <Badge tone="cyan" className="mb-4">
          <MapIcon className="h-3.5 w-3.5" />
          Coming soon
        </Badge>
        <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          GTA 6 Interactive Map
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          We&apos;re building a full interactive GTA 6 map of Vice City and the
          state of Leonida. As Rockstar reveals more of the world, this page fills
          in with everything worth finding.
        </p>
      </header>

      {/* Map placeholder */}
      <div className="glass relative mt-12 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-3xl">
        <div className="absolute inset-0 grid-backdrop" aria-hidden="true" />
        <div
          className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-magenta-600/30 blur-[90px]"
          aria-hidden="true"
        />
        <div
          className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-cyan-500/25 blur-[80px]"
          aria-hidden="true"
        />
        <div className="relative text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-cyan-400">
            <MapIcon className="h-8 w-8" />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-white">
            Map preview in progress
          </p>
          <p className="mt-1 text-sm text-white/50">Check back as launch nears.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {planned.map(({ Icon, title, desc }) => (
          <div key={title} className="glass rounded-3xl p-6">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-magenta-600/20 text-cyan-400">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="font-display text-base font-bold text-white">{title}</h2>
            <p className="mt-1.5 text-sm text-white/55">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/tips"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Meanwhile, browse our tips
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
