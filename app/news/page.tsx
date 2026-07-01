import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collection-index";
import { JsonLd } from "@/components/jsonld";
import { getAllDocs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "GTA 6 News: Latest Updates & Trailers",
  description:
    "The latest Grand Theft Auto 6 news: official announcements, trailer breakdowns, release date updates and the credible rumours worth knowing.",
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/news`,
    title: "GTA 6 News: Latest Updates & Trailers",
    description:
      "Official announcements, trailer breakdowns and everything new about Grand Theft Auto 6 — newest first.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "GTA 6 News", item: `${siteConfig.url}/news` },
  ],
};

export default function NewsPage() {
  const docs = getAllDocs("news");
  return (
    <>
      <JsonLd data={breadcrumb} />
      <CollectionIndex
        collection="news"
        eyebrow="Stay in the loop"
        title="GTA 6 News"
        description="Official announcements, trailer breakdowns and everything new about Grand Theft Auto 6 — newest first."
        docs={docs}
        emptyLabel="No news published yet. Our auto-poster adds stories the moment they break — check back soon."
      />
    </>
  );
}
