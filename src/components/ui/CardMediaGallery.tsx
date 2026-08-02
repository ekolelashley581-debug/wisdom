"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { MediaSlideshow, collectMediaUrls } from "@/components/ui/MediaSlideshow";
import { cn } from "@/lib/format";

export function cardMediaList(card: {
  media_url?: string;
  media_urls?: string[];
}): string[] {
  return collectMediaUrls(card.media_url, card.media_urls);
}

export function CardMediaGallery({
  title,
  media_url,
  media_urls,
  media_mode,
  className,
  aspect = "video",
  slideshowInterval = 8,
}: {
  title: string;
  media_url?: string;
  media_urls?: string[];
  media_mode?: "single" | "slideshow";
  className?: string;
  aspect?: "video" | "square" | "portrait" | "hero" | "wide";
  slideshowInterval?: number;
}) {
  const media = cardMediaList({ media_url, media_urls });
  const [index, setIndex] = useState(0);
  // Auto-run slideshow for 2+ media unless admin forces "single"
  const autoSlideshow = media.length > 1 && media_mode !== "single";
  const current = media[index] || media[0];

  if (autoSlideshow) {
    return (
      <div className={cn("relative min-h-[240px] md:min-h-[320px]", className)}>
        <MediaSlideshow
          urls={media}
          enabled
          intervalSec={slideshowInterval}
          alt={title}
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <PlaceholderImage
        label={title}
        src={current}
        aspect={aspect}
        className="rounded-none image-zoom min-h-[220px] md:min-h-[280px]"
      />
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {media.map((url, i) => (
            <button
              key={url + i}
              type="button"
              aria-label={`Show media ${i + 1}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "h-2 w-2 rounded-full transition",
                i === index ? "bg-secondary-glow scale-125" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
