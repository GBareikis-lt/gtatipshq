import Link from "next/link";
import { Hero } from "@/components/hero";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/jsonld";
import { ContentCard } from "@/components/content-card";
import { SectionHeading, Badge } from "@/components/ui";
import { getLatest } from "@/lib/content";
import { quickFacts, gameInfo, faqItems } from "@/lib/gta-facts";
import { tipCategories } from "@/lib/tip-categories";
import { siteConfig } from "@/lib/site-config";
import {
  MoneyIcon,
  ShieldIcon,
  CarIcon,
  TrophyIcon,
  MapIcon,
  ArrowRightIcon,
  NewsIcon,
  TipsIcon,
} from "@/components/icons";

const categoryIcons: Record<string, (props: { className?: string }) => React.ReactNode> = {
  money: MoneyIcon,
  beginner: ShieldIcon,
  vehicles: CarIcon,
  secrets: TrophyIcon,
};

export default function HomePage() {
  const latestNews = getLatest("news", 3);
  const latestTips = getLatest("tips", 3);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: siteConfig.publisher },
    about: {
      "@type": "VideoGame",
      name: "Grand Theft Auto VI",
      alternateName: ["GTA 6", "GTA VI"],
      gamePlatform: ["PlayStation 5", "Xbox Series X|S"],
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.publisher,
    url: siteConfig.url,
    description:
      "Independent fan hub for GTA 6 news, tips, guides and the release countdown.",
    logo: `${siteConfig.url}/icon.svg`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />

      <Hero />

      {/* Quick facts strip */}
      <section className="container-page -mt-6">
        <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4">
          {quickFacts.map((f) => (
            <div key={f.label} className="bg-night-900/40 px-5 py-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {f.label}
              </p>
              <p className="mt-2 font-display text-base font-bold text-white sm:text-lg">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="container-page mt-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Fresh off the press"
            title="Latest GTA 6 news"
            description="Trailer breakdowns, official announcements and the rumours worth knowing — updated continuously."
          />
          <Link
            href="/news"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-magenta-400 hover:text-magenta-500 sm:inline-flex"
          >
            All news
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        {latestNews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {latestNews.map((doc) => (
              <ContentCard key={doc.slug} doc={doc} />
            ))}
          </div>
        ) : (
          <EmptyState
            Icon={NewsIcon}
            label="News drops here as soon as it breaks. Check back shortly."
          />
        )}
      </section>

      {/* Tips categories */}
      <section className="container-page mt-24">
        <SectionHeading
          eyebrow="Get a head start"
          title="GTA 6 tips & guides for day one"
          description="Browse by what you want to master. We are prepping the essentials now so you hit the ground running in Leonida."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tipCategories.map((cat) => {
            const Icon = categoryIcons[cat.slug] ?? MoneyIcon;
            return (
              <Link
                key={cat.slug}
                href={`/tips?category=${cat.slug}`}
                className="glass glass-hover group flex flex-col rounded-3xl p-6"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-magenta-600/30 to-sunset-500/20 text-magenta-400">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm text-white/55">{cat.description}</p>
              </Link>
            );
          })}
        </div>

        {latestTips.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {latestTips.map((doc) => (
              <ContentCard key={doc.slug} doc={doc} />
            ))}
          </div>
        )}
      </section>

      {/* What is GTA 6 — info / SEO section */}
      <section className="container-page mt-24">
        <SectionHeading
          eyebrow="The lowdown"
          title="What is GTA 6?"
          description="Everything we know so far about Rockstar's most ambitious open world to date."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {gameInfo.map((info) => (
            <article key={info.title} className="glass rounded-3xl p-7">
              <h3 className="font-display text-xl font-bold text-white">{info.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{info.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Map teaser */}
      <section className="container-page mt-24">
        <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div
            className="absolute inset-0 grid-backdrop opacity-60"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <Badge tone="cyan" className="mb-4">
                <MapIcon className="h-3.5 w-3.5" />
                Coming soon
              </Badge>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                The interactive GTA 6 map of Leonida
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                An explorable map of Vice City and Leonida with collectibles,
                stunt jumps, hidden packages and money spots — landing here as the
                world is revealed.
              </p>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-400/40 hover:bg-white/10"
            >
              Preview the map
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page mt-24">
        <SectionHeading
          align="center"
          eyebrow="Good to know"
          title="GTA 6 — frequently asked questions"
        />
        <div className="mt-8">
          <Faq items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-magenta-500/30 bg-gradient-to-br from-magenta-600/20 via-night-800 to-sunset-600/15 p-10 text-center sm:p-14">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Don&apos;t miss a single drop.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Bookmark GTATipsHQ and be first to every GTA 6 update, guide and money
            method — all the way to launch day and beyond.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-night-950 transition-transform hover:scale-[1.03]"
            >
              <NewsIcon className="h-4 w-4" strokeWidth={2} />
              Explore the news
            </Link>
            <Link
              href="/tips"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <TipsIcon className="h-4 w-4" strokeWidth={2} />
              Get the tips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({
  Icon,
  label,
}: {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
}) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-magenta-400">
        <Icon className="h-7 w-7" />
      </span>
      <p className="max-w-sm text-sm text-white/55">{label}</p>
    </div>
  );
}
