"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/types";
import { cn } from "@/lib/format";
import { isVideoUrl } from "@/lib/media-kind";

export function ImagePicker({
  value,
  onChange,
  label = "Media",
  folder = "general",
  accept = "all",
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  /** Filter library: images only, videos only, or both */
  accept?: "image" | "video" | "all";
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    let list: MediaItem[] = Array.isArray(data.items) ? data.items : [];
    if (accept === "image") {
      list = list.filter((m) => (m.kind || "image") !== "video" && !isVideoUrl(m.url));
    } else if (accept === "video") {
      list = list.filter((m) => m.kind === "video" || isVideoUrl(m.url));
    }
    setItems(list);
  }, [accept]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      form.append("alt", file.name);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.item) {
        setItems(Array.isArray(data.items) ? data.items : []);
        onChange(data.item.url);
        setOpen(false);
      } else {
        alert(data.error || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }

  const fileAccept =
    accept === "video"
      ? "video/mp4,video/webm,video/ogg,video/quicktime"
      : accept === "image"
        ? "image/jpeg,image/png,image/webp,image/gif"
        : "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime";

  const previewIsVideo = isVideoUrl(value);

  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wider text-silver-dark">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/15 bg-primary">
          {value ? (
            previewIsVideo ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] text-silver-dark">
              None
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-outline !py-2 !text-xs"
        >
          Choose / Upload
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-400"
          >
            Remove
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-elevated">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="font-display text-lg text-white">Media library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-silver">
                Close
              </button>
            </div>
            <div className="border-b border-white/10 px-4 py-3">
              <label className="btn-primary inline-flex !cursor-pointer !py-2 !text-xs">
                {uploading ? "Uploading…" : "Upload photo or video"}
                <input
                  type="file"
                  accept={fileAccept}
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    for (const f of Array.from(files)) {
                      await onUpload(f);
                    }
                  }}
                />
              </label>
              <p className="mt-2 text-[11px] text-silver-mute">
                Photos ≤ 8MB · Videos (MP4/WebM) ≤ 50MB
              </p>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-4">
              {items.map((m) => {
                const vid = m.kind === "video" || isVideoUrl(m.url);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.url);
                      setOpen(false);
                    }}
                    className={cn(
                      "overflow-hidden rounded-xl border text-left transition hover:border-secondary-glow",
                      value === m.url ? "border-secondary-glow" : "border-white/10"
                    )}
                  >
                    {vid ? (
                      <video src={m.url} className="aspect-square w-full object-cover" muted />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.alt_text}
                        className="aspect-square w-full object-cover"
                      />
                    )}
                    <p className="truncate px-2 py-1 text-[10px] text-silver-mute">
                      {vid ? "▶ " : ""}
                      {m.name}
                    </p>
                  </button>
                );
              })}
              {!items.length && (
                <p className="col-span-full py-8 text-center text-sm text-silver-mute">
                  No media yet — upload your first photo or video.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SmartImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) return null;
  if (isVideoUrl(src)) {
    return <video src={src} className={className} controls playsInline />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
