import Link from "next/link";
import type { ContentDoc } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { JsonLd } from "@/components/jsonld";
import { Badge } from "@/components/ui";
import { ContentCard } from "@/components/content-card";
import { siteConfig } from "@/lib/site-config";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ExternalIcon,
  TagIcon,
} from "@/components/icons";

export function ArticleView({
  doc,
  related,
}: {
  doc: ContentDoc;
  related: ContentDoc[];
}) {
  const url = `${siteConfig.url}/${doc.collection}/${doc.slug}`;
  const backHref = `/${doc.collection}`;
  const backLabel = doc.collection === "news" ? "All news" : "All tips & guides";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": doc.collection === "news" ? "NewsArticle" : "Article",
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    datePublished: doc.frontmatter.date,
    dateModified: doc.frontmatter.date,
    author: { "@type": "Organization", name: doc.frontmatter.author },
    publisher: { "@type": "Organization", name: siteConfig.publisher },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: doc.collection === "news" ? "News" : "Tips",
        item: `${siteConfig.url}${backHref}`,
      },
      { "@type": "ListItem", position: 3, name: doc.frontmatter.title, item: url },
    ],
  };

  return (
    <article className="container-page max-w-3xl pb-16 pt-10">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />

      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" strokeWidth={2} />
        {backLabel}
      </Link>

      <header className="mt-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={doc.collection === "news" ? "cyan" : "sunset"}>
            {doc.frontmatter.category}
          </Badge>
          {doc.frontmatter.difficulty && (
            <Badge tone="muted">{doc.frontmatter.difficulty}</Badge>
          )}
        </div>

        <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {doc.frontmatter.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/65">
          {doc.frontmatter.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            {formatDate(doc.frontmatter.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {doc.readingMinutes} min read
          </span>
          <span className="text-white/35">By {doc.frontmatter.author}</span>
        </div>
      </header>

      <hr className="my-8 border-white/10" />

      <MdxContent source={doc.body} />

      {/* Tags + source */}
      {(doc.frontmatter.tags?.length || doc.frontmatter.source) && (
        <footer className="mt-10 space-y-4 border-t border-white/10 pt-6">
          {doc.frontmatter.tags && doc.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <TagIcon className="h-4 w-4 text-white/40" />
              {doc.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {doc.frontmatter.source && (
            <a
              href={doc.frontmatter.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-cyan-400"
            >
              <ExternalIcon className="h-3.5 w-3.5" />
              Source
            </a>
          )}
        </footer>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold text-white">
            Keep reading
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((d) => (
              <ContentCard key={d.slug} doc={d} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
