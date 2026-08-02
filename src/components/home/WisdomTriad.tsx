"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/format";
import type { SiteDesign, TriadItem } from "@/types";
import { isVideoUrl } from "@/lib/media-kind";

const ICONS = [UtensilsCrossed, ShoppingBag, Sparkles] as const;

const DEFAULT_ITEMS: TriadItem[] = [
  {
    id: "triad-restaurant",
    label: "Restaurant",
    line: "Coastal Cameroonian plates, charcoal grill & chef specials",
    href: "/restaurant",
    media_url: "/placeholders/experience-restaurant.png",
    visible: true,
  },
  {
    id: "triad-shop",
    label: "Shop",
    line: "Spa oils, butters & rituals to take home",
    href: "/product",
    media_url: "/placeholders/product-shea.png",
    visible: true,
  },
  {
    id: "triad-spa",
    label: "Spa",
    line: "Hair, nails, massage & restoration under one roof",
    href: "/spa",
    media_url: "/placeholders/experience-spa.png",
    visible: true,
  },
];

export function WisdomTriad({ design }: { design: SiteDesign }) {
  if (design.triad_visible === false) return null;

  const items = (design.triad_items?.length ? design.triad_items : DEFAULT_ITEMS).filter(
    (i) => i.visible !== false
  );
  if (!items.length) return null;

  return <TriadInner design={design} items={items} />;
}

function TriadInner({ design, items }: { design: SiteDesign; items: TriadItem[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 3800);
    return () => window.clearInterval(t);
  }, [items.length]);

  const focus = hovered ?? active;
  const current = items[focus] || items[0];
  const Icon = ICONS[focus % ICONS.length];

  return (
    <section
      aria-label="What WISDOM is"
      className="relative overflow-hidden border-y border-white/10 bg-primary"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-glow, #14B8A6) 22%, transparent), transparent 55%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl animate-pulse-soft"
        style={{ background: "color-mix(in srgb, var(--color-secondary, #0D7377) 28%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-silver, #C0C0C0) 12%, transparent)" }}
      />

      <div className="container-wisdom relative py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-secondary-glow">
            {design.triad_eyebrow || "In 5 seconds"}
          </p>
          <h2 className="mt-2 font-display text-3xl text-white md:text-5xl">
            {design.triad_title || "Restaurant. Shop. Spa."}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-silver-mute md:text-base">
            {design.triad_body ||
              "WISDOM is Limbe’s restaurant, shop, and spa — one coastal address. Touch a world to enter."}
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          {/* Living preview panel */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 lg:col-span-7">
            <div className="relative aspect-[16/11] min-h-[260px] md:min-h-[340px]">
              {items.map((item, i) => {
                const on = i === focus;
                const media = item.media_url;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-700",
                      on ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    )}
                  >
                    {media ? (
                      isVideoUrl(media) ? (
                        <video
                          src={media}
                          className="h-full w-full object-cover"
                          autoPlay={on}
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={media}
                          alt={item.label}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div
                        className="flex h-full w-full items-end bg-gradient-to-br from-primary via-secondary/40 to-primary p-8"
                      >
                        <p className="font-display text-4xl text-white">{item.label}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                  </div>
                );
              })}

              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-primary/70 px-3 py-1 text-xs text-secondary-glow backdrop-blur">
                  <Icon size={14} />
                  Live preview
                </div>
                <p className="font-display text-3xl text-white md:text-4xl">{current.label}</p>
                <p className="mt-2 max-w-md text-sm text-silver-mute md:text-base">
                  {current.line}
                </p>
                <Link
                  href={current.href || "/"}
                  className="btn-primary mt-5 inline-flex gap-2 hover:scale-[1.03]"
                >
                  Enter {current.label}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Pillar cards */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {items.map((item, i) => {
              const ItemIcon = ICONS[i % ICONS.length];
              const on = focus === i;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex flex-1 items-center gap-4 rounded-2xl border px-4 py-4 text-left transition duration-500 md:py-5",
                    on
                      ? "border-secondary-glow bg-secondary/15 shadow-teal-glow"
                      : "border-white/10 bg-white/[0.03] hover:border-secondary/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition",
                      on
                        ? "border-secondary-glow bg-secondary text-white"
                        : "border-white/15 text-secondary-glow group-hover:border-secondary/50"
                    )}
                  >
                    <ItemIcon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl text-white md:text-2xl">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-silver-mute md:text-sm">
                      {item.line}
                    </span>
                  </span>
                  <Link
                    href={item.href || "/"}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs transition",
                      on
                        ? "border-secondary-glow text-secondary-glow"
                        : "border-white/15 text-silver-mute hover:text-white"
                    )}
                  >
                    Open
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
