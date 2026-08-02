"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminNotification } from "@/types";

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [unread, setUnread] = useState(0);

  async function load() {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = (await res.json()) as {
      items?: AdminNotification[];
      unread?: number;
    };
    setItems(data.items ?? []);
    setUnread(data.unread ?? 0);
  }

  useEffect(() => {
    void load();
  }, []);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    await load();
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    await load();
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Notifications</h1>
          <p className="mt-1 text-sm text-silver">
            Contact messages, blog publishes, and CMS updates
            {unread > 0 ? ` · ${unread} unread` : ""}
          </p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={() => void markAll()} className="btn-outline !py-2 !text-xs">
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-8 space-y-2">
        {!items.length && (
          <p className="text-sm text-silver-mute">
            No notifications yet. They appear when someone contacts you, you publish a
            blog post, or you save catalog content.
          </p>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className={`flex flex-wrap items-start justify-between gap-3 rounded-2xl border px-4 py-3 ${
              n.read
                ? "border-white/10 bg-white/[0.02]"
                : "border-secondary/30 bg-secondary/5"
            }`}
          >
            <div>
              <p className="font-medium text-white">{n.title}</p>
              <p className="mt-1 text-sm text-silver">{n.body}</p>
              <p className="mt-2 text-xs text-silver-dark">
                {n.type.replace(/_/g, " ")} · {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              {n.href && (
                <Link href={n.href} className="text-secondary-glow hover:underline">
                  Open
                </Link>
              )}
              {!n.read && (
                <button
                  type="button"
                  onClick={() => void markRead(n.id)}
                  className="hover:text-white"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
