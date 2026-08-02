"use client";

import { ImagePicker } from "@/components/admin/ImagePicker";

/** Upload / pick multiple photos or videos for card thumbnails */
export function MultiMediaPicker({
  urls,
  onChange,
  folder = "general",
  label = "Thumbnails (photos or videos)",
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}) {
  const list = urls.filter(Boolean);

  function setAt(i: number, url: string) {
    const next = [...list];
    if (!url) {
      next.splice(i, 1);
    } else {
      next[i] = url;
    }
    onChange(next);
  }

  function add() {
    onChange([...list, ""]);
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-primary/30 p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-silver-dark">{label}</p>
        <button
          type="button"
          onClick={add}
          className="text-xs text-secondary-glow hover:underline"
        >
          + Add media
        </button>
      </div>
      {list.length === 0 && (
        <p className="text-[11px] text-silver-mute">
          Add one or more photos/videos for this card gallery.
        </p>
      )}
      <div className="space-y-3">
        {(list.length ? list : [""]).map((url, i) => (
          <div key={`media-${i}`} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <ImagePicker
                label={`Media ${i + 1}`}
                folder={folder}
                accept="all"
                value={url}
                onChange={(v) => {
                  if (!list.length && v) onChange([v]);
                  else setAt(i, v);
                }}
              />
            </div>
            {list.length > 0 && (
              <button
                type="button"
                className="mt-6 text-xs text-red-400"
                onClick={() => setAt(i, "")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
