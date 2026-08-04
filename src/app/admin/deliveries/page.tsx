"use client";

import { useEffect, useState } from "react";
import type { DeliveryOrder, DeliveryStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/format";

const STATUSES: DeliveryStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function AdminDeliveriesPage() {
  const [items, setItems] = useState<DeliveryOrder[]>([]);

  async function load() {
    const res = await fetch("/api/ops?kind=deliveries");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Deliveries</h1>
      <p className="mt-1 text-sm text-silver">
        Food orders (pickup or delivery) — manage status here
      </p>

      <div className="mt-8 space-y-3">
        {!items.length && (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-silver-mute">
            No orders yet. Guests create them from menu item pages.
          </p>
        )}
        {items.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">
                  {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </p>
                <p className="text-sm text-secondary-glow">{formatPrice(o.total)}</p>
                <p className="mt-1 text-xs text-silver-mute">
                  {o.customer_name} · {o.customer_phone || "—"} ·{" "}
                  {o.fulfillment || "delivery"}
                </p>
                <p className="text-xs text-silver-dark">{o.address}</p>
                <p className="mt-1 text-[10px] text-silver-dark">
                  Pay: {o.payment_method} ({o.payment_status}) · {o.id}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) => {
                  void fetch("/api/ops", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      kind: "delivery",
                      id: o.id,
                      patch: { status: e.target.value as DeliveryStatus },
                    }),
                  }).then(() => load());
                }}
                className="rounded-lg border border-white/15 bg-primary px-2 py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-[10px] text-silver-dark">
              {formatDate(o.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
