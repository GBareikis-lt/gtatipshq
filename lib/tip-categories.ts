/**
 * Canonical list of tip/guide categories.
 *
 * Shared by the homepage category cards and the /tips filter bar so the two
 * always stay in sync. `slug` matches the `category` value in tip frontmatter.
 */

export interface TipCategory {
  slug: string;
  label: string;
  description: string;
}

export const tipCategories: TipCategory[] = [
  {
    slug: "money",
    label: "Money & business",
    description: "Fastest legit ways to stack cash early.",
  },
  {
    slug: "beginner",
    label: "Beginner survival",
    description: "Wanted levels, health, and staying alive.",
  },
  {
    slug: "vehicles",
    label: "Vehicles & garages",
    description: "Best rides and where to find them.",
  },
  {
    slug: "secrets",
    label: "Secrets & easter eggs",
    description: "Hidden spots most players miss.",
  },
];

export function findTipCategory(slug?: string): TipCategory | undefined {
  if (!slug) return undefined;
  return tipCategories.find((c) => c.slug === slug);
}
