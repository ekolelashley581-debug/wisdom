"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, MenuItem } from "@/types";
import { formatPrice, cn } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { thumbSrc } from "@/lib/media-src";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

export function MenuGrid({
  items,
  categories,
  phone,
}: {
  items: MenuItem[];
  categories: Category[];
  phone: string;
}) {
  const parents = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState<string>("all");
  const [subActive, setSubActive] = useState<string | null>(null);

  const subs = useMemo(
    () =>
      active === "all"
        ? []
        : categories
            .filter((c) => c.parent_id === active)
            .sort((a, b) => a.sort_order - b.sort_order),
    [active, categories]
  );

  const filtered = useMemo(() => {
    if (active === "all") return items;
    const childIds = categories
      .filter((c) => c.parent_id === active)
      .map((c) => c.id);
    const allowed = new Set([active, ...childIds]);
    let list = items.filter((i) => allowed.has(i.category_id));
    if (subActive) list = list.filter((i) => i.category_id === subActive);
    return list;
  }, [active, subActive, items, categories]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setActive("all");
            setSubActive(null);
          }}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            active === "all"
              ? "bg-secondary text-white shadow-teal-glow"
              : "bg-white/5 text-silver-mute hover:bg-secondary/20 hover:text-white"
          )}
        >
          All
        </button>
        {parents.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActive(cat.id);
              setSubActive(null);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active === cat.id
                ? "bg-secondary text-white shadow-teal-glow"
                : "bg-white/5 text-silver-mute hover:bg-secondary/20 hover:text-white"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {subs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subs.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSubActive(sub.id === subActive ? null : sub.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                subActive === sub.id
                  ? "border-secondary-glow bg-secondary/20 text-secondary-glow"
                  : "border-white/15 text-silver-mute hover:border-secondary"
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="group glass-card animate-fade-in">
            <Link href={`/restaurant/${item.slug}`} className="block overflow-hidden">
              <div className="overflow-hidden">
                <PlaceholderImage
                  label={item.name}
                  src={thumbSrc(item)}
                  className="rounded-none image-zoom"
                />
              </div>
            </Link>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-xl text-white">
                  <Link href={`/restaurant/${item.slug}`} className="hover:text-secondary-glow">
                    {item.name}
                  </Link>
                </h3>
                <span className="shrink-0 text-sm font-semibold text-secondary-glow">
                  {formatPrice(item.price)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-silver-mute">{item.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <WhatsAppCTA
                  type="order"
                  phone={phone}
                  itemName={item.name}
                  className="btn-whatsapp !py-2 !text-xs"
                />
                <Link
                  href={`/restaurant/${item.slug}`}
                  className="text-xs font-semibold text-secondary-glow hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <p className="py-16 text-center text-silver-mute">No items in this category yet.</p>
      )}
    </div>
  );
}
