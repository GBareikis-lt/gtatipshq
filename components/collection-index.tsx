import type { ReactNode } from "react";
import { ContentCard } from "@/components/content-card";
import { Badge } from "@/components/ui";
import type { Collection, ContentDoc } from "@/lib/content";

/** Shared listing layout for the News and Tips index pages. */
export function CollectionIndex({
  eyebrow,
  title,
  description,
  docs,
  emptyLabel,
  filterBar,
}: {
  eyebrow: string;
  title: string;
  description: string;
  docs: ContentDoc[];
  collection: Collection;
  emptyLabel: string;
  filterBar?: ReactNode;
}) {
  const [featured, ...rest] = docs;

  return (
    <div className="container-page pb-16 pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-magenta-400">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">{description}</p>
      </header>

      {filterBar}

      {docs.length === 0 ? (
        <div className="glass mx-auto mt-12 max-w-xl rounded-3xl px-6 py-16 text-center">
          <p className="text-sm text-white/55">{emptyLabel}</p>
        </div>
      ) : (
        <div className="mt-12 space-y-5">
          <ContentCard doc={featured} featured />
          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((doc) => (
                <ContentCard key={doc.slug} doc={doc} />
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-white/35">
        <Badge tone="muted">{docs.length} published</Badge>
      </p>
    </div>
  );
}
