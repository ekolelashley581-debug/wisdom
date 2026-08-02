"use client";

import { useEffect, useMemo, useState } from "react";
import { getEvents, clearEvents } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/types";

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const stats = useMemo(() => {
    const wa = events.filter((e) => e.type === "whatsapp_click");
    const bookings = events.filter((e) => e.type === "booking_start");
    const orders = events.filter((e) => e.type === "order_start");
    const popular: Record<string, number> = {};
    wa.forEach((e) => {
      popular[e.label] = (popular[e.label] || 0) + 1;
    });
    const top = Object.entries(popular)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    return {
      total: events.length,
      whatsapp: wa.length,
      bookings: bookings.length,
      orders: orders.length,
      top,
    };
  }, [events]);

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Analytics</h1>
          <p className="mt-1 text-sm text-silver">
            WhatsApp clicks, bookings & orders (browser analytics — connect GA later)
          </p>
        </div>
        <button
          type="button"
          className="btn-outline !text-xs"
          onClick={() => {
            if (confirm("Clear analytics?")) {
              clearEvents();
              setEvents([]);
            }
          }}
        >
          Clear data
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Events", stats.total],
          ["WhatsApp clicks", stats.whatsapp],
          ["Booking starts", stats.bookings],
          ["Order starts", stats.orders],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xs uppercase tracking-wider text-silver">{label}</p>
            <p className="mt-2 font-display text-3xl text-white">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl text-white">Popular WhatsApp CTAs</h2>
      <ul className="mt-4 space-y-2">
        {!stats.top.length && (
          <li className="text-sm text-silver-mute">No clicks recorded yet.</li>
        )}
        {stats.top.map(([label, count]) => (
          <li
            key={label}
            className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm"
          >
            <span>{label}</span>
            <span className="text-secondary-glow">{count}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl text-white">Recent events</h2>
      <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
        {events.slice(0, 40).map((e) => (
          <div
            key={e.id}
            className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-silver-mute"
          >
            <span className="text-secondary-glow">{e.type}</span> · {e.label} · {e.path}
          </div>
        ))}
      </div>
    </div>
  );
}
