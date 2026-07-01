import type { ReactNode } from "react";

/** Small pill label, e.g. category or status badges. */
export function Badge({
  children,
  tone = "magenta",
  className = "",
}: {
  children: ReactNode;
  tone?: "magenta" | "cyan" | "sunset" | "muted";
  className?: string;
}) {
  const tones: Record<string, string> = {
    magenta: "border-magenta-500/40 bg-magenta-500/10 text-magenta-400",
    cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-400",
    sunset: "border-sunset-500/40 bg-sunset-500/10 text-sunset-400",
    muted: "border-white/15 bg-white/5 text-white/60",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Section eyebrow + heading lockup. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-magenta-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-white/60">{description}</p>
      )}
    </div>
  );
}
