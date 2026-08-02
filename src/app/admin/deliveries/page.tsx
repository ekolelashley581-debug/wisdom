"use client";

import { useEffect, useState } from "react";
import type { DeliveryOrder, DeliveryStatus } from "@/types";
import { demoStore } from "@/lib/demo-store";
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

  useEffect(() => {
    setItems(demoStore.getDeliveries());
  }, []);

  function refresh() {
    setItems(demoStore.getDeliveries());
  }

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Deliveries</h1>
      <p className="mt-1 text-sm text-silver">
        Self-delivery orders from the restaurant — manage status here
      </p>

      <div className="mt-8 space-y-3">
        {!items.length && (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-silver-mute">
            No delivery orders yet. Guests create them from menu item pages.
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
                  {o.customer_name} · {o.customer_phone || "—"}
                </p>
                <p className="text-xs text-silver-dark">{o.address}</p>
                <p className="mt-1 text-[10px] text-silver-dark">
                  Pay: {o.payment_method} ({o.payment_status}) · {o.id}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) => {
                  demoStore.updateDelivery(o.id, {
                    status: e.target.value as DeliveryStatus,
                  });
                  refresh();
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
