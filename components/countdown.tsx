"use client";

import { useEffect, useState } from "react";

/**
 * Live countdown to the GTA 6 release date.
 *
 * Renders a stable server-side placeholder first (to avoid hydration
 * mismatch), then ticks every second on the client.
 */

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: number): TimeLeft {
  const now = Date.now();
  const delta = Math.max(0, target - now);
  const done = delta === 0;
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds, done };
}

function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="glass relative flex min-w-[68px] items-center justify-center rounded-2xl px-3 py-4 sm:min-w-[92px] sm:py-6">
        <span className="font-display text-3xl font-extrabold tabular-nums text-white sm:text-5xl">
          {display}
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-magenta-500 to-transparent" />
      </div>
      <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const [time, setTime] = useState<TimeLeft>(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.done) {
    return (
      <div className="text-gradient-sunset font-display text-3xl font-extrabold sm:text-5xl">
        It&apos;s here. Welcome to Leonida.
      </div>
    );
  }

  return (
    <div
      className="flex items-start justify-center gap-2.5 sm:gap-4"
      suppressHydrationWarning
      aria-label="Countdown to GTA 6 release"
      role="timer"
    >
      <Unit value={time.days} label="Days" />
      <Separator />
      <Unit value={time.hours} label="Hours" />
      <Separator />
      <Unit value={time.minutes} label="Minutes" />
      <Separator />
      <Unit value={mounted ? time.seconds : 0} label="Seconds" />
    </div>
  );
}

function Separator() {
  return (
    <span className="self-center pb-6 font-display text-2xl font-bold text-magenta-500/60 sm:text-4xl">
      :
    </span>
  );
}
