"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/format";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const gallery = images.length ? images : ["", "", ""];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const activeSrc = gallery[active] || undefined;

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 text-left"
        aria-label="Zoom image"
      >
        <PlaceholderImage
          label={`${name} — view ${active + 1}`}
          src={activeSrc}
          className="rounded-none image-zoom"
        />
        <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wider text-silver opacity-0 transition group-hover:opacity-100">
          Click to zoom
        </span>
      </button>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {gallery.slice(0, 3).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "overflow-hidden rounded-xl border transition",
              active === i
                ? "border-secondary-glow shadow-teal-glow"
                : "border-white/10 opacity-70 hover:opacity-100"
            )}
          >
            <PlaceholderImage
              label={`Thumb ${i + 1}`}
              src={src || undefined}
              aspect="square"
              className="rounded-none"
            />
          </button>
        ))}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-silver/30"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaceholderImage
              label={`${name} lightbox`}
              src={activeSrc}
              aspect="video"
              className="rounded-none max-h-[80vh]"
            />
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
