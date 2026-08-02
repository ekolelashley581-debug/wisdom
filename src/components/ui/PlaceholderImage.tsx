import { Play } from "lucide-react";
import { cn } from "@/lib/format";
import { isVideoUrl } from "@/lib/media-kind";

interface MediaDisplayProps {
  label: string;
  className?: string;
  aspect?: "video" | "square" | "portrait" | "hero" | "wide";
  variant?: "image" | "video";
  src?: string;
  /** Autoplay muted loop for section banners */
  autoPlay?: boolean;
}

const aspectMap = {
  video: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  hero: "aspect-[16/10] min-h-[50vh]",
  wide: "aspect-[21/9]",
};

/** Image, video, or branded placeholder */
export function PlaceholderImage({
  label,
  className,
  aspect = "video",
  variant = "image",
  src,
  autoPlay = true,
}: MediaDisplayProps) {
  const resolved = src || undefined;

  if (resolved && isVideoUrl(resolved)) {
    return (
      <div className={cn("relative overflow-hidden bg-primary", aspectMap[aspect], className)}>
        <video
          src={resolved}
          className="h-full w-full object-cover"
          controls={!autoPlay}
          muted={autoPlay}
          loop={autoPlay}
          autoPlay={autoPlay}
          playsInline
          aria-label={label || "WISDOM video"}
        />
      </div>
    );
  }

  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={label || "WISDOM"}
        className={cn("w-full object-cover", aspectMap[aspect], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden bg-gradient-to-br from-primary via-secondary-deeper/80 to-secondary-dark",
        aspectMap[aspect],
        className
      )}
      role="img"
      aria-label={label || "Media placeholder"}
    >
      <div className="absolute inset-0 bg-marble-subtle opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,232,232,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_45%)]" />

      {variant === "video" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-silver/40 bg-black/50 text-silver-light shadow-silver-glow backdrop-blur-sm transition hover:border-secondary-glow hover:text-secondary-glow">
            <Play size={22} fill="currentColor" className="ml-0.5" />
          </span>
          <span className="absolute bottom-4 left-4 rounded bg-black/50 px-2 py-1 text-[10px] uppercase tracking-widest text-silver animate-pulse-soft">
            Video placeholder
          </span>
        </div>
      )}

      {label && variant === "image" && (
        <span className="relative z-10 p-4 font-display text-sm text-silver-light/80 md:text-base">
          {label}
        </span>
      )}
    </div>
  );
}
