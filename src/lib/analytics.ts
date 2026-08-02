/** Client-side analytics helpers (localStorage demo; swap for GA/Supabase later) */

import type { AnalyticsEvent } from "@/types";

const KEY = "wisdom_analytics";

export function trackEvent(partial: Omit<AnalyticsEvent, "id" | "created_at">) {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = {
    ...partial,
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };
  const list = getEvents();
  list.unshift(event);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 500)));
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
}
