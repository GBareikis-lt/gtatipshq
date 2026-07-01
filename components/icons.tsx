import type { SVGProps } from "react";

/**
 * Inline SVG icon set. All icons inherit `currentColor` and accept standard
 * SVG props (className, etc.). No emoji anywhere in the UI — these are used
 * instead.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
};

export function NewsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h11a1 1 0 0 1 1 1v12a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M16 8h2.5a1.5 1.5 0 0 1 1.5 1.5V18a2 2 0 0 1-2 2" />
      <path d="M7 8h6M7 11h6M7 14h4" />
    </svg>
  );
}

export function TipsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.9 1 .9 1.7v.5h5.4v-.5c0-.7.4-1.3.9-1.7A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 4 6 2 5-2v14l-5 2-6-2-5 2V6l5-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function MoneyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M16 7.5C16 6 14.5 5 12.5 5S9 6 9 7.5 10.5 10 12.5 10s3.5 1 3.5 2.5S14.5 15 12.5 15 9 14 9 12.5" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c1.5 3 4.5 4.5 4.5 8a4.5 4.5 0 0 1-9 0c0-1 .3-1.8.8-2.5C9 10 9.5 11 10.5 11c0-2 .5-5 1.5-8Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z" />
    </svg>
  );
}

export function GamepadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 8h10a4 4 0 0 1 4 4.2l-.5 4.3A2.5 2.5 0 0 1 16.2 18l-1.7-2h-5L7.8 18A2.5 2.5 0 0 1 3.5 16.5L3 12.2A4 4 0 0 1 7 8Z" />
      <path d="M8 11v3M6.5 12.5h3M15 11.5h.01M17.5 13.5h.01" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 5h5v5M19 5l-8 8M12 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7v5l9 9 7-7-9-9H5a2 2 0 0 0-2 2Z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 17h6M10 21h4M12 13v4" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v4H4z" />
      <path d="M7.5 17v1.5M16.5 17v1.5M7 15h.01M17 15h.01" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  );
}

/* ---- Brand / social icons (filled glyphs) ---- */

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
    </svg>
  );
}

export function RedditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
      <path d="M22 11.8a2.3 2.3 0 0 0-3.9-1.6 11.3 11.3 0 0 0-5.7-1.8l1-4.5 3.1.7a1.6 1.6 0 1 0 .2-1l-3.6-.8a.5.5 0 0 0-.6.4l-1.1 5a11.3 11.3 0 0 0-5.8 1.8 2.3 2.3 0 1 0-2.5 3.8 4 4 0 0 0 0 .6c0 3.1 3.7 5.6 8.2 5.6s8.2-2.5 8.2-5.6a4 4 0 0 0 0-.6 2.3 2.3 0 0 0 1.2-2Zm-14 1.5a1.4 1.4 0 1 1 1.4 1.4 1.4 1.4 0 0 1-1.4-1.4Zm7.8 3.7a5.3 5.3 0 0 1-3.8 1.2 5.3 5.3 0 0 1-3.8-1.2.5.5 0 0 1 .7-.7 4.4 4.4 0 0 0 3.1.9 4.4 4.4 0 0 0 3.1-.9.5.5 0 1 1 .7.7Zm-.4-2.3a1.4 1.4 0 1 1 1.4-1.4 1.4 1.4 0 0 1-1.4 1.4Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} {...props}>
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.4a18.3 18.3 0 0 1 4.3 1.4 16.6 16.6 0 0 0-12.9 0A18.3 18.3 0 0 1 8.8 3.4L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.9 8.5.1 12.5.5 16.4a20 20 0 0 0 6 3l.5-1.2a13 13 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12 0l.5.4a13 13 0 0 1-2 1l.5 1.2a20 20 0 0 0 6-3c.5-4.6-.8-8.6-2.7-12ZM8.7 14c-.9 0-1.7-.8-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm6.6 0c-.9 0-1.7-.8-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Z" />
    </svg>
  );
}
