/** Client analytics — local cache + live server POST */

import type { AnalyticsEvent } from "@/types";

const KEY = "wisdom_analytics";
const VISITOR_KEY = "wisdom_vid";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `v-${Date.now()}`;
  }
}

export function trackEvent(partial: Omit<AnalyticsEvent, "id" | "created_at">) {
  if (typeof window === "undefined") return;

  const visitor_id = partial.visitor_id || getVisitorId();
  const event: AnalyticsEvent = {
    ...partial,
    visitor_id,
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  try {
    const list = getEvents();
    list.unshift(event);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 500)));
  } catch {
    /* ignore quota */
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: event.type,
      label: event.label,
      path: event.path,
      meta: event.meta,
      visitor_id,
    }),
    keepalive: true,
  }).catch(() => {
    /* offline / blocked */
  });
}

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  void fetch("/api/analytics", { method: "DELETE" }).catch(() => undefined);
}
