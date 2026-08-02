import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { formatPrice } from "@/lib/format";
import { thumbSrc } from "@/lib/media-src";
import type { SpaProduct, PageCopy } from "@/types";

export function ShopGlimpse({
  phone,
  products,
  copy,
}: {
  phone: string;
  products: SpaProduct[];
  copy: PageCopy["home_shop"];
}) {
  if (copy.visible === false) return null;
  const list = products.slice(0, 4);

  return (
    <section id="shop" className="section-pad bg-primary">
      <div className="container-wisdom">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="heading-display !text-4xl md:!text-5xl">{copy.title}</h2>
            <p className="mt-4 text-muted">{copy.body}</p>
          </div>
          <Link
            href={copy.cta_link || "/product"}
            className="btn-silver inline-flex items-center gap-2 hover:scale-[1.03]"
          >
            <ShoppingBag size={16} />
            {copy.cta || "View shop"}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <article key={p.id} className="group glass-card flex flex-col">
              <Link href={`/product/${p.slug}`} className="overflow-hidden">
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
                  <WhatsAppCTA
                    type="buy"
                    phone={phone}
                    itemName={p.name}
                    size={p.sizes[0]?.label}
                    quantity={1}
                    label="Buy"
                    className="btn-whatsapp !w-full !py-2 !text-xs"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
