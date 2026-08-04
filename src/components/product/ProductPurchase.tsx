"use client";

import type { SpaProduct } from "@/types";
import { ShopOrderForm } from "@/components/product/ShopOrderForm";

export function ProductPurchase({
  product,
  phone,
  deliveryFeeBase = 1000,
  deliveryFeePerKm = 200,
  minOrder = 0,
}: {
  product: SpaProduct;
  phone: string;
  deliveryFeeBase?: number;
  deliveryFeePerKm?: number;
  minOrder?: number;
}) {
  return (
    <ShopOrderForm
      product={product}
      phone={phone}
      deliveryFeeBase={deliveryFeeBase}
      deliveryFeePerKm={deliveryFeePerKm}
      minOrder={minOrder}
    />
  );
}
