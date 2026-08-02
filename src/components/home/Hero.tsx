"use client";

import Link from "next/link";
import { MediaSlideshow, collectMediaUrls } from "@/components/ui/MediaSlideshow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { SiteDesign } from "@/types";
import { isVideoUrl } from "@/lib/media-kind";

export function Hero({ design }: { design: SiteDesign }) {
  const slides = collectMediaUrls(design.hero_image_url, design.hero_media_urls);
  // Always auto-run when 2+ slides (slideshow off only if explicitly false AND admin wants single)
  const useSlideshow = slides.length > 1 && design.hero_slideshow !== false;
  const single = slides[0];
  const interval = design.hero_slideshow_interval || 9;

  return (
    <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-primary pb-16 pt-24 md:items-center md:pb-0 md:pt-16">
      <div className="absolute inset-0">
        {slides.length > 0 ? (
          useSlideshow ? (
            <MediaSlideshow
              urls={slides}
              enabled
              intervalSec={interval}
              className="absolute inset-0 min-h-[80vh]"
              alt={design.hero_title || "WISDOM"}
            />
          ) : isVideoUrl(single) ? (
            <video
              src={single}
              className="h-full min-h-[80vh] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={single}
              alt=""
              className="h-full min-h-[80vh] w-full object-cover"
            />
          )
        ) : (
          <PlaceholderImage
            label=""
            aspect="hero"
            variant="video"
            className="h-full min-h-[80vh] w-full rounded-none !aspect-auto"
          />
        )}
        <div className="absolute inset-0 bg-hero-vignette" />
        <div className="absolute inset-0 bg-teal-fade opacity-40" />
      </div>

      <div className="container-wisdom relative z-10 animate-fade-in-up">
        <p className="eyebrow !mb-3">{design.hero_eyebrow}</p>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
          {design.hero_title}
        </h1>
        <div className="mt-3 h-px w-24 bg-chrome-line" />
        <p className="mt-5 max-w-lg text-base text-silver md:text-lg">
          {design.hero_subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/restaurant" className="btn-primary hover:scale-[1.03]">
            {design.restaurant_cta}
          </Link>
          <Link href="/spa" className="btn-outline hover:scale-[1.03]">
            {design.spa_cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
