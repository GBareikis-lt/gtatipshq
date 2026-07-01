import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-extrabold text-gradient-sunset sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
        Wasted. This page got away.
      </h1>
      <p className="mt-3 max-w-md text-sm text-white/55">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back to the action.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta-600 to-sunset-500 px-7 py-3.5 text-sm font-semibold text-white shadow-glow-magenta transition-transform hover:scale-[1.03]"
      >
        Back to home
        <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}
