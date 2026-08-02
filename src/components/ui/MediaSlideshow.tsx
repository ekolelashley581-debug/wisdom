"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { isVideoUrl } from "@/lib/media-kind";

/** Lazy default: linger on each slide, then glide slowly to the next */
const DEFAULT_INTERVAL_SEC = 9;
const SLIDE_MS = 1600;

export function MediaSlideshow({
  urls,
  className,
  intervalSec = DEFAULT_INTERVAL_SEC,
  enabled = true,
  alt = "WISDOM",
  fit = "cover",
}: {
  urls: string[];
  className?: string;
  intervalSec?: number;
  enabled?: boolean;
  alt?: string;
  fit?: "cover" | "contain";
}) {
  const slides = urls.filter(Boolean);
  const [index, setIndex] = useState(0);
  const auto = enabled !== false && slides.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [slides.join("|")]);

  useEffect(() => {
    if (!auto) return;
    // Lazy dwell: at least 6s between advances so the glide feels unhurried
    const ms = Math.max(6, intervalSec || DEFAULT_INTERVAL_SEC) * 1000;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ms);
    return () => window.clearInterval(t);
  }, [auto, slides.length, intervalSec]);

  if (!slides.length) return null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translate3d(-${(index * 100) / slides.length}%, 0, 0)`,
          transition: `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
        }}
      >
        {slides.map((url, i) => {
          const isVid = isVideoUrl(url);
          const active = i === index;
          return (
            <div
              key={url + i}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${100 / slides.length}%` }}
              aria-hidden={!active}
            >
              {isVid ? (
                <video
                  src={url}
                  className={cn(
                    "h-full w-full",
                    fit === "contain" ? "object-contain" : "object-cover"
                  )}
                  autoPlay={active}
                  muted
                  loop
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={active ? alt : ""}
                  className={cn(
                    "h-full w-full",
                    fit === "contain" ? "object-contain" : "object-cover"
                  )}
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>

      {auto && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index
                  ? "w-7 bg-[var(--color-glow,#14B8A6)]"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Prefer ordered list from extras, then ensure primary is included first if set */
export function collectMediaUrls(primary?: string, extras?: string[]): string[] {
  const list = [...(primary ? [primary] : []), ...(extras || [])].filter(Boolean);
  return Array.from(new Set(list));
}
