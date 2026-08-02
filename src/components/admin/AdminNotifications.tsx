"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { AdminNotification } from "@/types";

export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = (await res.json()) as {
        items?: AdminNotification[];
        unread?: number;
      };
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(id);
  }, [load]);

  async function markRead(id: string) {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as {
      items?: AdminNotification[];
      unread?: number;
    };
    setItems(data.items ?? []);
    setUnread(data.unread ?? 0);
  }

  async function markAll() {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as {
      items?: AdminNotification[];
      unread?: number;
    };
    setItems(data.items ?? []);
    setUnread(data.unread ?? 0);
  }

  const recent = items.slice(0, 8);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-silver transition hover:border-secondary hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-white/15 bg-[#12181f] p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <p className="text-sm font-medium text-white">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => void markAll()}
                  className="text-[11px] text-secondary-glow hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {!recent.length && (
                <p className="px-2 py-6 text-center text-xs text-silver-mute">
                  No notifications yet.
                </p>
              )}
              {recent.map((n) => (
                <Link
                  key={n.id}
                  href={n.href || "/admin/notifications"}
                  onClick={() => {
                    if (!n.read) void markRead(n.id);
                    setOpen(false);
                  }}
                  className={`block rounded-xl px-3 py-2.5 transition hover:bg-white/5 ${
                    n.read ? "opacity-70" : "bg-white/[0.03]"
                  }`}
                >
                  <p className="text-sm text-white">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-silver-mute">{n.body}</p>
                  <p className="mt-1 text-[10px] text-silver-dark">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/admin/notifications"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl px-3 py-2 text-center text-xs text-secondary-glow hover:bg-white/5"
            >
              View all
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
