"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, SpaService } from "@/types";
import { formatPrice, cn } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { thumbSrc } from "@/lib/media-src";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

export function SpaGrid({
  services,
  categories,
  phone,
}: {
  services: SpaService[];
  categories: Category[];
  phone: string;
}) {
  const parents = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return services;
    return services.filter((s) => s.category_id === active);
  }, [active, services]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
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
            onClick={() => setActive(cat.id)}
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

      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((service) => (
          <article key={service.id} className="group glass-card animate-fade-in">
            <Link href={`/spa/${service.slug}`} className="block overflow-hidden">
              <div className="overflow-hidden">
                <PlaceholderImage
                  label={service.name}
                  src={thumbSrc(service)}
                  className="rounded-none image-zoom"
                />
              </div>
            </Link>
            <div className="p-5">
              {service.is_package && (
                <span className="mb-2 inline-block rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-glow">
                  Package
                </span>
              )}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-xl text-white">
                  <Link
                    href={`/spa/${service.slug}`}
                    className="hover:text-secondary-glow"
                  >
                    {service.name}
                  </Link>
                </h3>
                <span className="shrink-0 text-sm font-semibold text-secondary-glow">
                  from {formatPrice(service.price_by_level.junior)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-silver-mute">
                {service.description}
              </p>
              <p className="mt-1 text-xs text-silver-dark">{service.duration}</p>
              <div className="mt-4">
                <WhatsAppCTA
                  type="booking"
                  phone={phone}
                  itemName={service.name}
                  date="[Date]"
                  time="[Time]"
                  className="btn-whatsapp !py-2 !text-xs"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
