"use client";

import { useEffect, useState } from "react";
import type { SpaBooking, BookingStatus } from "@/types";
import { formatDate } from "@/lib/format";

const STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

export default function AdminBookingsPage() {
  const [items, setItems] = useState<SpaBooking[]>([]);

  async function load() {
    const res = await fetch("/api/ops?kind=bookings");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Bookings</h1>
      <p className="mt-1 text-sm text-silver">
        Spa appointments from the booking form (WhatsApp-confirmed)
      </p>

      <div className="mt-8 space-y-3">
        {!items.length && (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-silver-mute">
            No bookings yet. They appear when guests use Book on a spa service page.
          </p>
        )}
        {items.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{b.service_name}</p>
                <p className="text-sm text-silver-mute">
                  {b.date} · {b.time} · {b.stylist_level}
                </p>
                <p className="mt-1 text-xs text-silver-dark">
                  {b.customer_name} · {b.customer_phone || "no phone"} · {b.id}
                </p>
              </div>
              <select
                value={b.status}
                onChange={(e) => {
                  void fetch("/api/ops", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      kind: "booking",
                      id: b.id,
                      patch: {
                        status: e.target.value as BookingStatus,
                        cancelled_at:
                          e.target.value === "cancelled"
                            ? new Date().toISOString()
                            : b.cancelled_at,
                      },
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
            {b.notes && (
              <p className="mt-2 text-xs text-silver-mute">Notes: {b.notes}</p>
            )}
            <p className="mt-2 text-[10px] text-silver-dark">
              Created {formatDate(b.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
