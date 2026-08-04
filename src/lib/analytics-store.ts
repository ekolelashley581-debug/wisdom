import { promises as fs } from "fs";
import path from "path";
import type { AnalyticsEvent } from "@/types";

const FILE = path.join(process.cwd(), "data", "analytics.json");
const MAX = 5000;

async function ensure() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function readAnalytics(): Promise<AnalyticsEvent[]> {
  await ensure();
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAnalytics(items: AnalyticsEvent[]) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(items.slice(0, MAX), null, 2) + "\n", "utf8");
}

export async function addAnalyticsEvent(
  partial: Omit<AnalyticsEvent, "id" | "created_at"> & { created_at?: string }
): Promise<AnalyticsEvent> {
  const items = await readAnalytics();
  const event: AnalyticsEvent = {
    ...partial,
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: partial.created_at || new Date().toISOString(),
  };
  items.unshift(event);
  await writeAnalytics(items);
  return event;
}

export async function clearAnalytics(): Promise<void> {
  await writeAnalytics([]);
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export function summarizeAnalytics(events: AnalyticsEvent[], days = 14) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));
  const startKey = start.toISOString().slice(0, 10);

  const inRange = events.filter((e) => dayKey(e.created_at) >= startKey);
  const todayEvents = events.filter((e) => dayKey(e.created_at) === today);

  const unique = (list: AnalyticsEvent[]) =>
    new Set(list.map((e) => e.visitor_id || e.id)).size;

  const pageViews = events.filter((e) => e.type === "page_view");
  const wa = events.filter((e) => e.type === "whatsapp_click");
  const bookings = events.filter((e) => e.type === "booking_start");
  const orders = events.filter((e) => e.type === "order_start");
  const reservations = events.filter((e) => e.type === "reservation_start");

  const byDayMap: Record<
    string,
    { date: string; views: number; visitors: Set<string>; wa: number; bookings: number; orders: number }
  > = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    byDayMap[key] = {
      date: key,
      views: 0,
      visitors: new Set(),
      wa: 0,
      bookings: 0,
      orders: 0,
    };
  }

  for (const e of inRange) {
    const key = dayKey(e.created_at);
    const bucket = byDayMap[key];
    if (!bucket) continue;
    if (e.type === "page_view") {
      bucket.views += 1;
      bucket.visitors.add(e.visitor_id || e.id);
    } else if (e.type === "whatsapp_click") {
      bucket.wa += 1;
    } else if (e.type === "booking_start" || e.type === "reservation_start") {
      bucket.bookings += 1;
    } else if (e.type === "order_start") {
      bucket.orders += 1;
    }
  }

  const byDay = Object.values(byDayMap).map((b) => ({
    date: b.date,
    views: b.views,
    visitors: b.visitors.size,
    wa: b.wa,
    bookings: b.bookings,
    orders: b.orders,
  }));

  const pageCounts: Record<string, number> = {};
  for (const e of pageViews) {
    const p = e.path || "/";
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pathName, count]) => ({ path: pathName, count }));

  const labelCounts: Record<string, number> = {};
  for (const e of wa) {
    labelCounts[e.label || "WhatsApp"] = (labelCounts[e.label || "WhatsApp"] || 0) + 1;
  }
  const topCtas = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));

  return {
    summary: {
      pageViews: pageViews.length,
      uniqueVisitors: unique(pageViews),
      whatsapp: wa.length,
      bookings: bookings.length + reservations.length,
      orders: orders.length,
      todayViews: todayEvents.filter((e) => e.type === "page_view").length,
      todayVisitors: unique(todayEvents.filter((e) => e.type === "page_view")),
      todayWa: todayEvents.filter((e) => e.type === "whatsapp_click").length,
      totalEvents: events.length,
    },
    byDay,
    topPages,
    topCtas,
    recent: events.slice(0, 50),
  };
}
