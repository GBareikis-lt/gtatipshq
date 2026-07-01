import Link from "next/link";
import type { ContentDoc } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { Badge } from "@/components/ui";
import { ClockIcon, ArrowRightIcon, CalendarIcon } from "@/components/icons";

const toneByCollection = {
  news: "cyan",
  tips: "sunset",
} as const;

/** A clickable card for a news article or a tip/guide. */
export function ContentCard({
  doc,
  featured = false,
}: {
  doc: ContentDoc;
  featured?: boolean;
}) {
  const href = `/${doc.collection}/${doc.slug}`;
  const tone = toneByCollection[doc.collection];

  return (
    <Link
      href={href}
      className={`glass glass-hover group relative flex flex-col overflow-hidden rounded-3xl p-6 ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={tone}>{doc.frontmatter.category}</Badge>
        {doc.frontmatter.difficulty && (
          <Badge tone="muted">{doc.frontmatter.difficulty}</Badge>
        )}
        {doc.frontmatter.featured && featured && <Badge tone="magenta">Featured</Badge>}
      </div>

      <h3
        className={`font-display font-extrabold leading-snug text-white transition-colors group-hover:text-magenta-400 ${
          featured ? "text-2xl sm:text-3xl" : "text-xl"
        }`}
      >
        {doc.frontmatter.title}
      </h3>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/60">
        {doc.frontmatter.description}
      </p>

      <div className="mt-5 flex items-center justify-between text-xs text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(doc.frontmatter.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon className="h-4 w-4" />
          {doc.readingMinutes} min read
        </span>
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-magenta-400 opacity-0 transition-opacity group-hover:opacity-100">
        Read more
        <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
      </span>
    </Link>
  );
}
