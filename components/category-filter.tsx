import Link from "next/link";
import { tipCategories } from "@/lib/tip-categories";

/**
 * Category filter bar for the tips page. Rendered as plain links (one per
 * category) so it works without client JS and every filtered view is
 * crawlable. The active category is highlighted.
 */
export function CategoryFilter({
  active,
  basePath = "/tips",
}: {
  active?: string;
  basePath?: string;
}) {
  const items = [
    { slug: "", label: "All" },
    ...tipCategories.map((c) => ({ slug: c.slug, label: c.label })),
  ];

  return (
    <nav
      aria-label="Filter tips by category"
      className="mt-8 flex flex-wrap justify-center gap-2"
    >
      {items.map((item) => {
        const isActive = (item.slug || "") === (active || "");
        const href = item.slug ? `${basePath}?category=${item.slug}` : basePath;
        return (
          <Link
            key={item.slug || "all"}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "border-magenta-500/50 bg-magenta-500/15 text-magenta-400"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
