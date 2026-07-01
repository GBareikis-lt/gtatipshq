import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import {
  getAllSlugs,
  getDocBySlug,
  getAllDocs,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs("news").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug("news", slug);
  if (!doc) return {};

  const url = `${siteConfig.url}/news/${doc.slug}`;
  return {
    // Absolute keeps unique, keyword-rich article titles from exceeding the
    // ~60-char SERP limit once the brand suffix would be appended.
    title: { absolute: doc.frontmatter.title },
    description: doc.frontmatter.description,
    alternates: { canonical: `/news/${doc.slug}` },
    openGraph: {
      type: "article",
      url,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      publishedTime: doc.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug("news", slug);
  if (!doc) notFound();

  const related = getAllDocs("news")
    .filter((d) => d.slug !== doc.slug)
    .slice(0, 2);

  return <ArticleView doc={doc} related={related} />;
}
