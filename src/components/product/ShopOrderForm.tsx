"use client";

import { useMemo, useState } from "react";
import type { SpaProduct } from "@/types";
import { formatPrice } from "@/lib/format";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function ShopOrderForm({
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
  const [size, setSize] = useState(product.sizes[0]?.label ?? "Standard");
  const [qty, setQty] = useState(1);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [km, setKm] = useState(3);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"ask" | "momo" | "orange" | "cash">("ask");
  const [sending, setSending] = useState(false);

  const unitPrice = useMemo(() => {
    const match = product.sizes.find((s) => s.label === size);
    return match?.price ?? product.price;
  }, [product, size]);

  const subtotal = unitPrice * qty;
  const deliveryFee =
    fulfillment === "delivery"
      ? deliveryFeeBase + Math.ceil(Math.max(0, km)) * deliveryFeePerKm
      : 0;
  const total = subtotal + deliveryFee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !customerPhone.trim()) {
      alert("Name and WhatsApp number are required.");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      alert("Delivery address is required.");
      return;
    }
    if (fulfillment === "delivery" && minOrder > 0 && subtotal < minOrder) {
      alert(`Minimum order for delivery is ${minOrder.toLocaleString()} XAF.`);
      return;
    }

    setSending(true);
    const order = {
      id: `so-${Date.now()}`,
      product_name: product.name,
      product_slug: product.slug,
      size,
      quantity: qty,
      unit_price: unitPrice,
      fulfillment,
      delivery_km: fulfillment === "delivery" ? km : 0,
      delivery_fee: deliveryFee,
      subtotal,
      total,
      customer_name: name.trim(),
      customer_phone: customerPhone.trim(),
      address: fulfillment === "delivery" ? address.trim() : "Pickup at WISDOM shop",
      notes,
      status: "new" as const,
      payment_method:
        payment === "ask" ? ("whatsapp" as const) : (payment as "momo" | "orange" | "cash"),
      payment_status: "unpaid" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await fetch("/api/ops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "shop", item: order }),
      });
    } catch {
      /* still open WhatsApp */
    }

    trackEvent({
      type: "order_start",
      label: product.name,
      path: `/product/${product.slug}`,
      meta: { fulfillment, qty: String(qty) },
    });

    const payNote =
      payment === "momo"
        ? "Payment preference: MTN MoMo"
        : payment === "orange"
          ? "Payment preference: Orange Money"
          : payment === "cash"
            ? "Payment preference: Cash"
            : "Payment: arrange on WhatsApp";

    const msg = [
      `Hi WISDOM! Shop order:`,
      `${product.name} (${size}) x${qty}`,
      `Fulfillment: ${fulfillment}`,
      fulfillment === "delivery"
        ? `Address: ${order.address}\nDistance ~${km} km\nDelivery fee: ${deliveryFee.toLocaleString()} XAF`
        : `Collect in shop`,
      `Name: ${order.customer_name}`,
      `Phone: ${order.customer_phone}`,
      `Subtotal: ${subtotal.toLocaleString()} XAF`,
      `Total: ${total.toLocaleString()} XAF`,
      payNote,
      notes ? `Notes: ${notes}` : null,
      `Order ref: ${order.id}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSending(false);
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-surface-elevated p-5"
    >
      <h2 className="font-display text-xl text-white">Place shop order</h2>
      <p className="text-sm text-silver-mute">
        Fill this form, then confirm on WhatsApp. Choose pickup or delivery.
      </p>

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
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)}>
            +
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase text-silver-dark">Fulfillment</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pickup", "Collect in shop"],
              ["delivery", "Delivery"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFulfillment(val)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                fulfillment === val
                  ? "border-secondary-glow text-secondary-glow"
                  : "border-white/15 text-silver-mute"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {fulfillment === "delivery" && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-primary/40 p-3">
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            placeholder="Delivery address in Limbe"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div>
            <label className="text-xs uppercase text-silver-dark">
              Approx. distance (km)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              step={1}
              value={km}
              onChange={(e) => setKm(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-silver-dark">
              Fee = {formatPrice(deliveryFeeBase)} + {formatPrice(deliveryFeePerKm)}
              /km
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="WhatsApp number *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>
      <textarea
        className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
        rows={2}
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div>
        <p className="mb-2 text-xs uppercase text-silver-dark">Preferred payment</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["ask", "Decide on WhatsApp"],
              ["momo", "MTN MoMo"],
              ["orange", "Orange Money"],
              ["cash", "Cash"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setPayment(val)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                payment === val
                  ? "border-secondary-glow text-secondary-glow"
                  : "border-white/15 text-silver-mute"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p className="flex justify-between text-silver">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        {fulfillment === "delivery" && (
          <p className="flex justify-between text-silver">
            <span>Delivery fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </p>
        )}
        <p className="flex justify-between text-lg font-semibold text-secondary-glow">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
      </div>

      <button type="submit" disabled={sending} className="btn-whatsapp disabled:opacity-60">
        {sending ? "Sending…" : "Send order via WhatsApp"}
      </button>
    </form>
  );
}
