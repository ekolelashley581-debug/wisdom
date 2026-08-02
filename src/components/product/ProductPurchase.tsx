"use client";

import { useMemo, useState } from "react";
import type { SpaProduct } from "@/types";
import { formatPrice } from "@/lib/format";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

export function ProductPurchase({
  product,
  phone,
}: {
  product: SpaProduct;
  phone: string;
}) {
  const [size, setSize] = useState(product.sizes[0]?.label ?? "Standard");
  const [qty, setQty] = useState(1);

  const price = useMemo(() => {
    const match = product.sizes.find((s) => s.label === size);
    return match?.price ?? product.price;
  }, [product, size]);

  return (
    <div className="mt-8 space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-silver-dark">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSize(s.label)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                size === s.label
                  ? "border-secondary-glow bg-secondary/20 text-secondary-glow"
                  : "border-white/15 text-silver-mute hover:border-secondary"
              }`}
            >
              {s.label} · {formatPrice(s.price)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-silver-dark">
          Quantity
        </p>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 px-3 py-1.5">
          <button
            type="button"
            className="text-lg text-silver-light"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button
            type="button"
            className="text-lg text-silver-light"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      <p className="text-2xl font-semibold text-secondary-glow">
        {formatPrice(price * qty)}
      </p>

      <WhatsAppCTA
        type="buy"
        phone={phone}
        itemName={product.name}
        size={size}
        quantity={qty}
        label="Buy via WhatsApp"
      />
    </div>
  );
}
