import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Countdown } from "@/components/countdown";
import { Badge } from "@/components/ui";
import { ArrowRightIcon, TipsIcon, BoltIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop layers */}
      <div className="absolute inset-0 grid-backdrop" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-[-10%] -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-magenta-600/25 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="absolute right-[-10%] top-[20%] -z-10 h-[360px] w-[360px] rounded-full bg-cyan-500/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-20%] left-[-5%] -z-10 h-[360px] w-[360px] rounded-full bg-sunset-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-page relative flex flex-col items-center pb-20 pt-20 text-center sm:pt-28">
        <Badge tone="magenta" className="mb-6 animate-pulse-slow">
          <BoltIcon className="h-3.5 w-3.5" strokeWidth={2} />
          Countdown to Leonida is live
        </Badge>

        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Everything <span className="text-gradient-sunset">GTA&nbsp;6</span>
          <br className="hidden sm:block" /> in one place.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          {siteConfig.tagline} Track the official release countdown, read
          breaking news, and master money-making guides &amp; hidden tips before
          launch day.
        </p>

        {/* Countdown */}
        <div className="mt-12 w-full">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
            Releasing {siteConfig.releaseDateLabel}
          </p>
          <Countdown targetISO={siteConfig.releaseDateISO} />
          <p className="mt-5 text-xs text-white/35">
            {siteConfig.releaseDateSubject}
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/news"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-magenta-600 to-sunset-500 px-7 py-3.5 text-sm font-semibold text-white shadow-glow-magenta transition-transform hover:scale-[1.03]"
          >
            Read the latest news
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            href="/tips"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <TipsIcon className="h-4 w-4" strokeWidth={2} />
            Browse tips &amp; guides
          </Link>
        </div>
      </div>
    </section>
  );
}
