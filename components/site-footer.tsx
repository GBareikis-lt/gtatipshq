import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { XIcon, YoutubeIcon, RedditIcon, DiscordIcon } from "@/components/icons";

const socials = [
  { key: "twitter", label: "X", Icon: XIcon, href: siteConfig.social.twitter },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon, href: siteConfig.social.youtube },
  { key: "reddit", label: "Reddit", Icon: RedditIcon, href: siteConfig.social.reddit },
  { key: "discord", label: "Discord", Icon: DiscordIcon, href: siteConfig.social.discord },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-night-900/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ key, label, Icon, href }) => (
              <a
                key={key}
                href={href || "#"}
                aria-label={label}
                target={href ? "_blank" : undefined}
                rel={href ? "noopener noreferrer" : undefined}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-magenta-500/50 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <nav className="text-sm">
          <h3 className="mb-3 font-semibold uppercase tracking-wider text-white/40">
            Explore
          </h3>
          <ul className="space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="text-sm">
          <h3 className="mb-3 font-semibold uppercase tracking-wider text-white/40">
            Release
          </h3>
          <ul className="space-y-2 text-white/65">
            <li>{siteConfig.releaseDateLabel}</li>
            <li className="text-white/40">{siteConfig.releaseDateSubject}</li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Fan-made — not
            affiliated with Rockstar Games or Take-Two Interactive.
          </p>
          <p>
            Grand Theft Auto and GTA are trademarks of Take-Two Interactive.
          </p>
        </div>
      </div>
    </footer>
  );
}
