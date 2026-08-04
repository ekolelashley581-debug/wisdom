import Link from "next/link";
import type { MenuItem } from "@/types";
import type { PageCopy } from "@/types";
import { formatPrice } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { thumbSrc } from "@/lib/media-src";

export function ChefsSpecial({
  items,
  copy,
}: {
  items: MenuItem[];
  phone?: string;
  copy: PageCopy["home_chefs"];
}) {
  if (!items.length) return null;
  if (copy.visible === false) return null;

  return (
    <section className="section-pad border-y border-white/5 bg-surface-elevated text-white">
      <div className="container-wisdom">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl">{copy.title}</h2>
            {copy.body ? <p className="mt-2 max-w-xl text-muted">{copy.body}</p> : null}
          </div>
          <Link href={copy.cta_link || "/restaurant"} className="btn-outline hover:scale-[1.03]">
            {copy.cta || "Full menu"}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-primary/60 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-teal-glow"
            >
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
                  <h3 className="font-display text-xl">
                    <Link
                      href={`/restaurant/${item.slug}`}
                      className="transition hover:text-secondary-glow"
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <span className="shrink-0 text-sm font-semibold text-secondary-glow">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-silver-mute">{item.description}</p>
                <div className="mt-4 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                  <Link
                    href={`/restaurant/${item.slug}#order`}
                    className="btn-whatsapp !py-2 !text-xs"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
