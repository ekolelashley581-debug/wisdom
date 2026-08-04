"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { VisitorsChart } from "@/components/admin/AnalyticsCharts";

type Summary = {
  pageViews: number;
  uniqueVisitors: number;
  whatsapp: number;
  bookings: number;
  orders: number;
  todayViews: number;
  todayVisitors: number;
  todayWa: number;
};

type DayPoint = {
  date: string;
  views: number;
  visitors: number;
  wa: number;
  bookings: number;
  orders: number;
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary>({
    pageViews: 0,
    uniqueVisitors: 0,
    whatsapp: 0,
    bookings: 0,
    orders: 0,
    todayViews: 0,
    todayVisitors: 0,
    todayWa: 0,
  });
  const [byDay, setByDay] = useState<DayPoint[]>([]);
  const [ops, setOps] = useState({
    spaBookings: 0,
    deliveries: 0,
    shop: 0,
    reservations: 0,
    messages: 0,
  });
  const [updatedAt, setUpdatedAt] = useState("");

  const load = useCallback(async () => {
    try {
      const [analytics, opsRes, messages] = await Promise.all([
        fetch("/api/analytics?days=14").then((r) => r.json()),
        fetch("/api/ops").then((r) => r.json()),
        fetch("/api/contact").then((r) => r.json()).catch(() => ({ items: [] })),
      ]);
      if (analytics?.summary) setSummary(analytics.summary);
      if (analytics?.byDay) setByDay(analytics.byDay);
      setOps({
        spaBookings: (opsRes.bookings || []).length,
        deliveries: (opsRes.deliveries || []).length,
        shop: (opsRes.shop || []).length,
        reservations: (opsRes.reservations || []).length,
        messages: (messages.items || []).filter(
          (m: { status?: string }) => m.status === "new"
        ).length,
      });
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 20000);
    return () => window.clearInterval(id);
  }, [load]);

  const cards = [
    { label: "Today visitors", value: summary.todayVisitors, href: "/admin/analytics" },
    { label: "Today views", value: summary.todayViews, href: "/admin/analytics" },
    { label: "WA clicks", value: summary.whatsapp, href: "/admin/analytics" },
    { label: "New messages", value: ops.messages, href: "/admin/messages" },
    { label: "Spa bookings", value: ops.spaBookings, href: "/admin/bookings" },
    { label: "Food orders", value: ops.deliveries, href: "/admin/deliveries" },
    { label: "Shop orders", value: ops.shop, href: "/admin/ops" },
    { label: "Reservations", value: ops.reservations, href: "/admin/ops" },
  ];

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-silver">
            Live site feedback
            {updatedAt ? ` · refreshed ${updatedAt}` : ""}
          </p>
        </div>
        <Link href="/admin/analytics" className="btn-outline !text-xs">
          Full analytics
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-secondary/40"
          >
            <p className="text-xs uppercase tracking-wider text-silver">{c.label}</p>
            <p className="mt-2 font-display text-3xl text-white">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-xl text-white">Visitors (14 days)</h2>
        <VisitorsChart data={byDay} />
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-xl text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/ops" className="btn-primary !text-xs">
            Ops Center
          </Link>
          <Link href="/admin/analytics" className="btn-primary !text-xs">
            Analytics
          </Link>
          <Link href="/admin/bookings" className="btn-outline !text-xs">
            Bookings
          </Link>
          <Link href="/admin/deliveries" className="btn-outline !text-xs">
            Deliveries
          </Link>
          <Link href="/admin/messages" className="btn-outline !text-xs">
            Messages
          </Link>
        </div>
        <p className="mt-6 text-xs text-silver-dark">
          Live totals: {summary.uniqueVisitors} visitors · {summary.pageViews} views ·{" "}
          {summary.orders} order starts · auto-refresh every 20s.
        </p>
      </div>
    </div>
  );
}
