import { siteConfig } from "@/lib/site-config";

/**
 * GTATipsHQ logo.
 *
 * The mark is a synthwave "Vice City" sunset — a striped neon sun with a palm
 * silhouette. Instantly reads as the GTA 6 / Miami aesthetic without using any
 * official Rockstar assets. `withWordmark` toggles the text lockup.
 */

export function LogoMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gtaSun" x1="32" y1="14" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd15a" />
          <stop offset="0.42" stopColor="#ff4fa0" />
          <stop offset="1" stopColor="#ff7a1f" />
        </linearGradient>
        <linearGradient id="gtaPalm" x1="20" y1="18" x2="40" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38e1f0" />
          <stop offset="1" stopColor="#16c7e0" />
        </linearGradient>
        {/* The classic retro-sun stripes: cut horizontal gaps out of the lower half. */}
        <mask id="gtaSunStripes">
          <rect width="64" height="64" fill="black" />
          <circle cx="32" cy="28" r="16" fill="white" />
          <rect x="12" y="29.5" width="40" height="1.6" fill="black" />
          <rect x="12" y="33.2" width="40" height="2.1" fill="black" />
          <rect x="12" y="37.4" width="40" height="2.8" fill="black" />
          <rect x="12" y="42.2" width="40" height="3.6" fill="black" />
        </mask>
      </defs>

      {/* Striped sunset sun */}
      <rect width="64" height="64" fill="url(#gtaSun)" mask="url(#gtaSunStripes)" />

      {/* Reflective horizon line */}
      <line
        x1="9"
        y1="50.5"
        x2="55"
        y2="50.5"
        stroke="url(#gtaSun)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Neon palm silhouette */}
      <g
        stroke="url(#gtaPalm)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M43 50c-.6-6-1.4-11-2.4-16" />
        <path d="M40.6 34c-2.6-2-5.6-2.7-8.9-2" />
        <path d="M40.6 34c-1.4-3-1.6-6 .1-9.2" />
        <path d="M40.6 34c2.9-1.6 6-1.9 9.4-.7" />
        <path d="M40.6 34c.6-2.6 2.3-4.7 5-6.3" />
      </g>
      {/* Coconut cluster */}
      <circle cx="40.7" cy="33.7" r="1.5" fill="url(#gtaPalm)" />
    </svg>
  );
}

export function Logo({
  withWordmark = true,
  size = 40,
  className = "",
}: {
  withWordmark?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark
        size={size}
        className="drop-shadow-[0_0_14px_rgba(255,79,160,0.5)]"
      />
      {withWordmark && (
        <span className="font-display text-lg font-extrabold leading-none tracking-tight">
          <span className="text-white">GTA</span>
          <span className="text-gradient-sunset">Tips</span>
          <span className="text-white/90">HQ</span>
        </span>
      )}
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  );
}
