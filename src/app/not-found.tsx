import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-primary px-4 pt-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-display text-4xl text-white">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        This page doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back home
      </Link>
    </div>
  );
}
