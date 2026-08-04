import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatPrice } from "@/lib/format";
import { thumbSrc } from "@/lib/media-src";
import type { SpaProduct, PageCopy } from "@/types";

export function ShopGlimpse({
  products,
  copy,
}: {
  phone?: string;
  products: SpaProduct[];
  copy: PageCopy["home_shop"];
}) {
  if (copy.visible === false) return null;
  const list = products.slice(0, 4);

  return (
    <section className="section-pad bg-primary text-white">
      <div className="container-wisdom">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <ShoppingBag size={14} /> {copy.eyebrow}
            </p>
            <h2 className="heading-display !text-4xl md:!text-5xl">{copy.title}</h2>
            <p className="mt-3 max-w-lg text-muted">{copy.body}</p>
          </div>
          <Link href="/product" className="btn-outline">
            {copy.cta || "View shop"}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <article key={p.id} className="group glass-card flex flex-col overflow-hidden">
              <Link href={`/product/${p.slug}`} className="block overflow-hidden">
                <PlaceholderImage
                  label={p.name}
                  src={thumbSrc(p)}
                  aspect="square"
                  className="rounded-none image-zoom"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-lg text-white transition group-hover:text-secondary-glow">
                  <Link href={`/product/${p.slug}`}>{p.name}</Link>
                </h3>
                <p className="mt-1 text-xs text-silver-mute">
                  {p.sizes[0]?.label ?? "Standard"}
                </p>
                <p className="mt-2 text-sm font-semibold text-secondary-glow">
                  from {formatPrice(p.price)}
                </p>
                <div className="mt-auto pt-4 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                  <Link
                    href={`/product/${p.slug}#order`}
                    className="btn-whatsapp !w-full !py-2 !text-xs"
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
