"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/types";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");

  const load = useCallback(async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        form.append("alt", file.name.replace(/\.[^.]+$/, ""));
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (data.error) alert(data.error);
        else setItems(Array.isArray(data.items) ? data.items : []);
      }
    } finally {
      setUploading(false);
    }
  }

  async function saveAlt(id: string, alt_text: string) {
    const res = await fetch("/api/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, alt_text }),
    });
    const data = await res.json();
    setItems(Array.isArray(data.items) ? data.items : []);
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setItems(Array.isArray(data.items) ? data.items : []);
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Media</h1>
          <p className="mt-1 text-sm text-silver">
            Upload photos & videos for menu, spa, hero, cards — no code needed
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-xs"
          >
            <option value="general">General</option>
            <option value="restaurant">Restaurant</option>
            <option value="spa">Spa</option>
            <option value="products">Products</option>
            <option value="blog">Blog</option>
            <option value="branding">Branding</option>
            <option value="staff">Staff</option>
          </select>
          <label className="btn-primary !cursor-pointer !py-2 !text-xs">
            {uploading ? "Uploading…" : "Upload media"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div
        className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-silver-mute">
          Drag & drop photos or videos. Images ≤ 8MB · Videos (MP4/WebM) ≤ 50MB.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => {
          const isVid = m.kind === "video" || /\.(mp4|webm|ogg|mov)$/i.test(m.url);
          return (
          <article
            key={m.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            {isVid ? (
              <video src={m.url} className="aspect-[4/3] w-full object-cover" muted controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.alt_text} className="aspect-[4/3] w-full object-cover" />
            )}
            <div className="space-y-2 p-3">
              <p className="truncate text-xs text-silver-mute">
                {isVid ? "Video · " : "Photo · "}
                {m.folder} · {(m.size / 1024).toFixed(0)} KB
              </p>
              <input
                className="w-full rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
                defaultValue={m.alt_text}
                onBlur={(e) => {
                  if (e.target.value !== m.alt_text) saveAlt(m.id, e.target.value);
                }}
                placeholder="Alt text"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs text-secondary-glow"
                  onClick={() => {
                    navigator.clipboard.writeText(m.url);
                    alert("URL copied");
                  }}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() => remove(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
          );
        })}
      </div>
      {!items.length && (
        <p className="mt-6 text-center text-sm text-silver-mute">Library is empty.</p>
      )}
    </div>
  );
}
