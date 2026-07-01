import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collection-index";
import { CategoryFilter } from "@/components/category-filter";
import { JsonLd } from "@/components/jsonld";
import { getAllDocs } from "@/lib/content";
import { findTipCategory } from "@/lib/tip-categories";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "GTA 6 Tips, Guides & Money Methods",
  description:
    "GTA 6 tips and guides: money-making methods, beginner walkthroughs, vehicle guides and hidden secrets to master Leonida from day one.",
  alternates: { canonical: "/tips" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/tips`,
    title: "GTA 6 Tips, Guides & Money Methods",
    description:
      "Money methods, beginner survival, vehicles and secrets — everything you need to dominate GTA 6's Leonida.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "GTA 6 Tips & Guides", item: `${siteConfig.url}/tips` },
  ],
};

export default async function TipsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = findTipCategory(category);
  const activeSlug = activeCategory?.slug;

  const allDocs = getAllDocs("tips");
  const docs = activeSlug
    ? allDocs.filter((d) => d.frontmatter.category === activeSlug)
    : allDocs;

  const description = activeCategory
    ? `GTA 6 ${activeCategory.label.toLowerCase()} guides — ${activeCategory.description}`
    : "Money methods, beginner survival, vehicles, secrets and walkthroughs — everything you need to dominate GTA 6's Leonida.";

  const emptyLabel = activeCategory
    ? `No "${activeCategory.label}" guides published yet — check back soon or browse all tips.`
    : "No guides published yet. We are prepping day-one essentials now — check back soon.";

  return (
    <>
      <JsonLd data={breadcrumb} />
      <CollectionIndex
        collection="tips"
        eyebrow="Level up"
        title="GTA 6 Tips & Guides"
        description={description}
        docs={docs}
        filterBar={<CategoryFilter active={activeSlug} />}
        emptyLabel={emptyLabel}
      />
    </>
  );
}
