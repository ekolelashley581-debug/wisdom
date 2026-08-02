"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { demoStore } from "@/lib/demo-store";
import { trackEvent } from "@/lib/analytics";

export function DeliveryOrderForm({
  item,
  phone,
}: {
  item: MenuItem;
  phone: string;
}) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"momo" | "orange" | "cash" | "ask">(
    "ask"
  );

  const total = useMemo(() => item.price * qty, [item.price, qty]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const order = {
      id: `dl-${Date.now()}`,
      items: [{ name: item.name, quantity: qty, price: item.price }],
      customer_name: name || "Guest",
      customer_phone: customerPhone,
      address: address || "Limbe (TBD)",
      notes,
      total,
      status: "new" as const,
      payment_method:
        payment === "ask" ? ("whatsapp" as const) : (payment as "momo" | "orange" | "cash"),
      payment_status: "unpaid" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoStore.addDelivery(order);
    trackEvent({
      type: "order_start",
      label: item.name,
      path: `/restaurant/${item.slug}`,
      meta: { qty: String(qty), payment },
    });

    const payNote =
      payment === "momo"
        ? "\nPayment preference: MTN MoMo — please send your MoMo details / confirm on WhatsApp"
        : payment === "orange"
          ? "\nPayment preference: Orange Money — confirm number on WhatsApp"
          : payment === "cash"
            ? "\nPayment preference: Cash on delivery"
            : "\nPayment: arrange on WhatsApp (MoMo / Orange / Cash)";

    const msg = `Hi WISDOM! I'd like to order ${item.name} x${qty} for delivery.\nName: ${order.customer_name}\nPhone: ${customerPhone || "—"}\nAddress: ${order.address}\nNotes: ${notes || "—"}\nTotal: ${total.toLocaleString("en-US")} XAF${payNote}\nOrder ref: ${order.id}`;
    window.open(
      `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-surface-elevated p-5"
    >
      <h2 className="font-display text-xl text-white">Order for delivery</h2>
      <p className="text-sm text-silver-mute">
        Payment is confirmed on WhatsApp (MoMo, Orange Money, or cash) — nothing is charged on
        this website.
      </p>

      <div>
        <label className="text-xs uppercase text-silver-dark">Quantity</label>
        <div className="mt-1 inline-flex items-center gap-3 rounded-full border border-white/15 px-3 py-1.5">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="WhatsApp number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>
      <input
        className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
        placeholder="Delivery address in Limbe"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
        rows={2}
        placeholder="Special instructions"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div>
        <p className="mb-2 text-xs uppercase text-silver-dark">
          Preferred payment (via WhatsApp)
        </p>
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

      <p className="text-lg font-semibold text-secondary-glow">
        {formatPrice(total)}
      </p>
      <button type="submit" className="btn-whatsapp">
        Send order via WhatsApp
      </button>
    </form>
  );
}
