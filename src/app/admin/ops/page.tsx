"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  BlogSubscriber,
  DeliveryOrder,
  ShopOrder,
  SpaBooking,
  TableReservation,
} from "@/types";
import { formatPrice } from "@/lib/format";

type Tab = "overview" | "shop" | "reservations" | "subscribers" | "settings";

export default function AdminOpsPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<SpaBooking[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [shop, setShop] = useState<ShopOrder[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [subscribers, setSubscribers] = useState<BlogSubscriber[]>([]);
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    const [ops, subs, cfg] = await Promise.all([
      fetch("/api/ops").then((r) => r.json()),
      fetch("/api/subscribers").then((r) => r.json()),
      fetch("/api/site-config").then((r) => r.json()),
    ]);
    setBookings(ops.bookings || []);
    setDeliveries(ops.deliveries || []);
    setShop(ops.shop || []);
    setReservations(ops.reservations || []);
    setSubscribers(subs.items || []);
    setSettings(cfg.settings || null);
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "settings", settings }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Save failed");
    }
  }

  async function patchStatus(
    kind: string,
    id: string,
    status: string
  ) {
    await fetch("/api/ops", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id, patch: { status } }),
    });
    await load();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "shop", label: "Shop orders" },
    { id: "reservations", label: "Reservations" },
    { id: "subscribers", label: "Blog alerts" },
    { id: "settings", label: "Ops settings" },
  ];

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Operations Center</h1>
      <p className="mt-1 text-sm text-silver">
        Manage orders, bookings, reservations, delivery fees, and blog alerts — no code
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              tab === t.id
                ? "border-secondary-glow bg-secondary/20 text-secondary-glow"
                : "border-white/15 text-silver-mute hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Spa bookings", n: bookings.length, href: "/admin/bookings" },
            { label: "Food orders", n: deliveries.length, href: "/admin/deliveries" },
            { label: "Shop orders", n: shop.length, href: "#", onClick: () => setTab("shop") },
            {
              label: "Reservations",
              n: reservations.length,
              href: "#",
              onClick: () => setTab("reservations"),
            },
            {
              label: "Blog subscribers",
              n: subscribers.filter((s) => s.active).length,
              href: "#",
              onClick: () => setTab("subscribers"),
            },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                if (c.onClick) c.onClick();
                else if (c.href.startsWith("/")) window.location.href = c.href;
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-secondary/40"
            >
              <p className="text-xs uppercase text-silver-dark">{c.label}</p>
              <p className="mt-2 font-display text-3xl text-white">{c.n}</p>
            </button>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2">
            <p className="text-sm text-silver">
              Quick links:{" "}
              <Link href="/admin/bookings" className="text-secondary-glow hover:underline">
                Bookings
              </Link>
              {" · "}
              <Link href="/admin/deliveries" className="text-secondary-glow hover:underline">
                Deliveries
              </Link>
              {" · "}
              <Link href="/admin/messages" className="text-secondary-glow hover:underline">
                Messages
              </Link>
              {" · "}
              <Link href="/admin/settings" className="text-secondary-glow hover:underline">
                Site settings
              </Link>
            </p>
          </div>
        </div>
      )}

      {tab === "shop" && (
        <div className="mt-8 space-y-3">
          {!shop.length && <p className="text-sm text-silver-mute">No shop orders yet.</p>}
          {shop.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-white/10 px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">
                    {o.product_name} ({o.size}) ×{o.quantity}
                  </p>
                  <p className="text-xs text-silver-mute">
                    {o.customer_name} · {o.customer_phone} · {o.fulfillment}
                    {o.fulfillment === "delivery" ? ` · ${o.address}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-secondary-glow">
                    {formatPrice(o.total)}
                    {o.delivery_fee > 0 ? ` (incl. delivery ${formatPrice(o.delivery_fee)})` : ""}
                  </p>
                </div>
                <select
                  className="rounded-lg border border-white/15 bg-primary px-2 py-1 text-xs"
                  value={o.status}
                  onChange={(e) => void patchStatus("shop", o.id, e.target.value)}
                >
                  {["new", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reservations" && (
        <div className="mt-8 space-y-3">
          {!reservations.length && (
            <p className="text-sm text-silver-mute">No table reservations yet.</p>
          )}
          {reservations.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">
                  {r.customer_name} · {r.guests} guests
                </p>
                <p className="text-xs text-silver-mute">
                  {r.date} {r.time} · {r.customer_phone}
                </p>
              </div>
              <select
                className="rounded-lg border border-white/15 bg-primary px-2 py-1 text-xs"
                value={r.status}
                onChange={(e) => void patchStatus("reservation", r.id, e.target.value)}
              >
                {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === "subscribers" && (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-silver">
            When you publish a blog post, open Admin → Blog and use Share on WhatsApp.
            Active subscribers ({subscribers.filter((s) => s.active).length}) can be
            messaged from this list.
          </p>
          {!subscribers.length && (
            <p className="text-sm text-silver-mute">No subscribers yet.</p>
          )}
          {subscribers.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm"
            >
              <p className="text-white">{s.name}</p>
              <p className="text-silver-mute">
                {s.email}
                {s.phone ? ` · ${s.phone}` : ""}
                {!s.active ? " · inactive" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && settings && (
        <form onSubmit={saveSettings} className="mt-8 max-w-xl space-y-4">
          <div>
            <label className="mb-1 block text-xs text-silver">
              Delivery fee base (XAF)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm"
              value={Number(settings.delivery_fee_base ?? 1000)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  delivery_fee_base: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-silver">
              Delivery fee per km (XAF)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm"
              value={Number(settings.delivery_fee_per_km ?? 200)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  delivery_fee_per_km: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-silver">Min order (XAF)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm"
              value={Number(settings.min_order ?? 5000)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  min_order: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.require_order_forms !== false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  require_order_forms: e.target.checked,
                })
              }
            />
            Require order/booking forms before WhatsApp (catalog buttons open forms)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.blog_alerts_enabled !== false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  blog_alerts_enabled: e.target.checked,
                })
              }
            />
            Enable blog subscribe / new-post alerts
          </label>
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-silver-mute">
            Admin IP lock is controlled by the Vercel/env variable{" "}
            <code className="text-secondary-glow">ADMIN_ALLOWED_IPS</code> (comma-separated).
            Use your public IP on Vercel — <code>192.168.x.x</code> only works on your local
            network. Empty = open to any IP (login still required).
          </p>
          <button type="submit" className="btn-primary">
            {saved ? "Saved" : "Save ops settings"}
          </button>
        </form>
      )}
    </div>
  );
}
