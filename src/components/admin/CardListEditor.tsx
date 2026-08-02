"use client";

import type { ContentCard } from "@/types";
import { MultiMediaPicker } from "@/components/admin/MultiMediaPicker";
import { emptyCard } from "@/lib/media-kind";
import { cardMediaList } from "@/components/ui/CardMediaGallery";

export function CardListEditor({
  cards,
  onChange,
  folder = "general",
}: {
  cards: ContentCard[];
  onChange: (cards: ContentCard[]) => void;
  folder?: string;
}) {
  function update(i: number, patch: Partial<ContentCard>) {
    const next = cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onChange(next);
  }

  function remove(i: number) {
    if (!confirm("Delete this card?")) return;
    onChange(cards.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...cards, emptyCard()]);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= cards.length) return;
    const next = [...cards];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-silver-dark">Cards</p>
        <button type="button" onClick={add} className="text-xs text-secondary-glow hover:underline">
          + Add card
        </button>
      </div>

      {cards.map((card, i) => {
        const media = cardMediaList(card);
        return (
          <div
            key={card.id}
            className="space-y-3 rounded-xl border border-white/10 bg-primary/30 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs text-silver-mute">
                <input
                  type="checkbox"
                  checked={card.visible !== false}
                  onChange={(e) => update(i, { visible: e.target.checked })}
                />
                Visible on site
              </label>
              <div className="flex gap-2 text-xs">
                <button type="button" className="text-silver-mute" onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="text-silver-mute" onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button type="button" className="text-red-400" onClick={() => remove(i)}>
                  Delete
                </button>
              </div>
            </div>

            <input
              className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
              placeholder="Card title"
              value={card.title}
              onChange={(e) => update(i, { title: e.target.value })}
            />
            <textarea
              rows={2}
              className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
              placeholder="Card text"
              value={card.body}
              onChange={(e) => update(i, { body: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
              placeholder="Short note (optional)"
              value={card.note || ""}
              onChange={(e) => update(i, { note: e.target.value })}
            />
            <MultiMediaPicker
              folder={folder}
              urls={media}
              onChange={(urls) =>
                update(i, {
                  media_urls: urls,
                  media_url: urls[0] || "",
                })
              }
            />
            <label className="flex flex-wrap items-center gap-3 text-xs text-silver-mute">
              <span>Display mode</span>
              <select
                className="rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
                value={card.media_mode === "single" ? "single" : "slideshow"}
                onChange={(e) =>
                  update(i, {
                    media_mode: e.target.value as "single" | "slideshow",
                  })
                }
              >
                <option value="slideshow">Auto slideshow</option>
                <option value="single">Single / manual dots</option>
              </select>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase text-silver-dark">Link URL</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
                  placeholder="/spa or https://…"
                  value={card.link_url}
                  onChange={(e) => update(i, { link_url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-silver-dark">Link label</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
                  placeholder="Learn more"
                  value={card.link_label || ""}
                  onChange={(e) => update(i, { link_label: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      })}

      {!cards.length && (
        <p className="text-sm text-silver-mute">No cards — add one or the section shows text only.</p>
      )}
    </div>
  );
}
