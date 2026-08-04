"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsEvent } from "@/types";
import {
  ActivityBars,
  BarChart,
  VisitorsChart,
} from "@/components/admin/AnalyticsCharts";

type Stats = {
  summary: {
    pageViews: number;
    uniqueVisitors: number;
    whatsapp: number;
    bookings: number;
    orders: number;
    todayViews: number;
    todayVisitors: number;
    todayWa: number;
    totalEvents: number;
  };
  byDay: Array<{
    date: string;
    views: number;
    visitors: number;
    wa: number;
    bookings: number;
    orders: number;
  }>;
  topPages: Array<{ path: string; count: number }>;
  topCtas: Array<{ label: string; count: number }>;
  recent: AnalyticsEvent[];
};

const empty: Stats = {
  summary: {
    pageViews: 0,
    uniqueVisitors: 0,
    whatsapp: 0,
    bookings: 0,
    orders: 0,
    todayViews: 0,
    todayVisitors: 0,
    todayWa: 0,
    totalEvents: 0,
  },
  byDay: [],
  topPages: [],
  topCtas: [],
  recent: [],
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>(empty);
  const [live, setLive] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics?days=14");
      if (!res.ok) return;
      const data = (await res.json()) as Stats;
      setStats(data);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(id);
  }, [live, load]);

  async function clearAll() {
    if (!confirm("Clear all analytics data on the server?")) return;
    await fetch("/api/analytics", { method: "DELETE" });
    setStats(empty);
  }

  const s = stats.summary;

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Analytics</h1>
          <p className="mt-1 text-sm text-silver">
            Live visitors, page views, WhatsApp & conversions
            {updatedAt ? ` · updated ${updatedAt}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs ${
              live
                ? "border-secondary-glow text-secondary-glow"
                : "border-white/15 text-silver-mute"
            }`}
            onClick={() => setLive((v) => !v)}
          >
            {live ? "● Live" : "○ Paused"}
          </button>
          <button type="button" className="btn-outline !text-xs" onClick={() => void load()}>
            Refresh
          </button>
          <button type="button" className="btn-outline !text-xs" onClick={() => void clearAll()}>
            Clear data
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Today visitors", s.todayVisitors],
          ["Today page views", s.todayViews],
          ["Unique visitors", s.uniqueVisitors],
          ["Total page views", s.pageViews],
          ["WhatsApp clicks", s.whatsapp],
          ["Bookings started", s.bookings],
          ["Orders started", s.orders],
          ["Today WA clicks", s.todayWa],
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

      <div className="mt-8">
        <h2 className="mb-3 font-display text-xl text-white">Traffic</h2>
        <VisitorsChart data={stats.byDay} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ActivityBars data={stats.byDay} />
        <BarChart
          title="Top pages"
          items={stats.topPages.map((p) => ({ label: p.path, count: p.count }))}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Popular WhatsApp CTAs"
          items={stats.topCtas.map((c) => ({ label: c.label, count: c.count }))}
        />
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-display text-lg text-white">Live event feed</h3>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
            {!stats.recent.length && (
              <p className="text-sm text-silver-mute">
                No events yet. Browse the public site to generate page views.
              </p>
            )}
            {stats.recent.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-silver-mute"
              >
                <span className="text-secondary-glow">{e.type}</span> · {e.label} ·{" "}
                {e.path}
                <span className="mt-0.5 block text-[10px] text-silver-dark">
                  {new Date(e.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
