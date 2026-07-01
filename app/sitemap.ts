import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllDocs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/news`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/tips`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/map`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const news = getAllDocs("news").map((doc) => ({
    url: `${base}/news/${doc.slug}`,
    lastModified: new Date(doc.frontmatter.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tips = getAllDocs("tips").map((doc) => ({
    url: `${base}/tips/${doc.slug}`,
    lastModified: new Date(doc.frontmatter.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...news, ...tips];
}
