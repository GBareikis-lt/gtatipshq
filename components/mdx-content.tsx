import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders an MDX body string (from a content file) with site-styled elements.
 * Internal links use next/link; external links open safely in a new tab.
 */

const components = {
  a: ({ href = "", children }: { href?: string; children?: ReactNode }) => {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className="font-medium text-cyan-400 underline-offset-2 hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-cyan-400 underline-offset-2 hover:underline"
      >
        {children}
      </a>
    );
  },
  // Callout blocks via blockquote.
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-6 rounded-2xl border-l-4 border-magenta-500 bg-magenta-500/5 px-5 py-4 text-white/80">
      {children}
    </blockquote>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-gta max-w-none prose-headings:font-display prose-headings:font-bold prose-a:no-underline prose-img:rounded-2xl">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
