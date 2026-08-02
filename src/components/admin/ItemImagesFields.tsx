"use client";

import { ImagePicker } from "@/components/admin/ImagePicker";

/**
 * Main image (detail pages) + thumbnail (cards/lists) pickers.
 * Thumbnail is optional — if empty, the site uses the main image.
 */
export function ItemImagesFields({
  folder,
  mainUrl,
  thumbUrl,
  onMainChange,
  onThumbChange,
  mainLabel = "Main image",
  thumbLabel = "Thumbnail (cards & lists)",
}: {
  folder: string;
  mainUrl: string;
  thumbUrl: string;
  onMainChange: (url: string) => void;
  onThumbChange: (url: string) => void;
  mainLabel?: string;
  thumbLabel?: string;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-primary/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-silver-dark">
        Photos or videos — pick from Media library or upload
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <ImagePicker
          label={mainLabel}
          folder={folder}
          accept="all"
          value={mainUrl}
          onChange={onMainChange}
        />
        <ImagePicker
          label={thumbLabel}
          folder={folder}
          accept="all"
          value={thumbUrl}
          onChange={onThumbChange}
        />
      </div>
      <p className="text-[11px] text-silver-mute">
        Main shows on the item page. Thumbnail shows on grids — leave blank to reuse the
        main media. Images and videos both allowed.
      </p>
      {mainUrl && !thumbUrl && (
        <button
          type="button"
          className="text-xs text-secondary-glow hover:underline"
          onClick={() => onThumbChange(mainUrl)}
        >
          Copy main image → thumbnail
        </button>
      )}
    </div>
  );
}
