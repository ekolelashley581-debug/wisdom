"use client";

import { useEffect, useState } from "react";
import type { ActivityLogEntry } from "@/types";
import { demoStore } from "@/lib/demo-store";

export default function AdminActivityPage() {
  const [items, setItems] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    setItems(demoStore.getActivity());
  }, []);

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Activity log</h1>
      <p className="mt-1 text-sm text-silver">Who did what in the admin (demo user)</p>

      <div className="mt-8 space-y-2">
        {!items.length && (
          <p className="text-sm text-silver-mute">No activity yet.</p>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"
          >
            <span>
              <span className="text-secondary-glow">{a.action}</span> {a.entity}{" "}
              <span className="text-silver-dark">({a.entity_id})</span>
            </span>
            <span className="text-xs text-silver-dark">
              {new Date(a.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
