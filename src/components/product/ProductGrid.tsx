"use client";

import Link from "next/link";
import type { SpaProduct } from "@/types";
import { formatPrice } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { thumbSrc } from "@/lib/media-src";

export function ProductGrid({
  products,
  phone,
}: {
  products: SpaProduct[];
  phone: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="group glass-card flex flex-col">
          <Link href={`/product/${product.slug}`} className="block overflow-hidden">
            <PlaceholderImage
              label={product.name}
              src={thumbSrc(product)}
              aspect="square"
              className="rounded-none image-zoom"
            />
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-display text-xl text-white transition group-hover:text-secondary-glow">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-silver-mute">
              {product.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-secondary-glow">
              from {formatPrice(product.price)}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <WhatsAppCTA
                type="buy"
                phone={phone}
                itemName={product.name}
                size={product.sizes[0]?.label}
                quantity={1}
                label="Buy"
                className="btn-whatsapp !py-2 !text-xs"
              />
              <Link
                href={`/product/${product.slug}`}
                className="text-xs font-semibold text-secondary-glow hover:underline"
              >
                Details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
