import type { ContentCard } from "@/types";

/** Detect uploaded / linked video URLs */
export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    /\.(mp4|webm|ogg|mov|m4v)$/.test(clean) ||
    clean.includes("/video/") ||
    clean.includes("kind=video")
  );
}

export function newCardId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyCard(partial?: Partial<ContentCard>): ContentCard {
  return {
    id: newCardId(),
    title: "New card",
    body: "",
    note: "",
    media_url: "",
    media_urls: [],
    link_url: "/",
    link_label: "Learn more",
    visible: true,
    ...partial,
  };
}
