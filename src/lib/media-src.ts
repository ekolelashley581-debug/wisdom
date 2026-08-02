function usable(url?: string): string | undefined {
  if (!url) return undefined;
  return url;
}

/** Prefer thumbnail for cards/lists; fall back to main image. */
export function thumbSrc(item: {
  thumbnail?: string;
  images?: string[];
  featured_image?: string;
}): string | undefined {
  return (
    usable(item.thumbnail) ||
    usable(item.images?.[0]) ||
    usable(item.featured_image) ||
    undefined
  );
}

/** Prefer main/featured image for detail pages. */
export function mainSrc(item: {
  thumbnail?: string;
  images?: string[];
  featured_image?: string;
}): string | undefined {
  return (
    usable(item.images?.[0]) ||
    usable(item.featured_image) ||
    usable(item.thumbnail) ||
    undefined
  );
}
