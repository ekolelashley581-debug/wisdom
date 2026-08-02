"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactMessage, ContactStatus } from "@/types";

const STATUSES: ContactStatus[] = ["new", "read", "replied", "archived"];

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ContactStatus>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/contact");
    const data = await res.json();
    setItems(Array.isArray(data.items) ? data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible =
    filter === "all" ? items : items.filter((m) => m.status === filter);

  async function setStatus(id: string, status: ContactStatus) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((list) => list.map((m) => (m.id === id ? data.item : m)));
      if (selected?.id === id) setSelected(data.item);
    }
  }

  async function saveNotes(id: string, notes: string) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((list) => list.map((m) => (m.id === id ? data.item : m)));
      setSelected(data.item);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((list) => list.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  if (loading) return <p className="text-silver">Loading messages…</p>;

  const unread = items.filter((m) => m.status === "new").length;

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-white">Contact messages</h1>
          <p className="mt-1 text-sm text-silver">
            Inbox from the public contact form
            {unread ? ` · ${unread} new` : ""}
          </p>
        </div>
        <select
          className="rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          {visible.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelected(m);
                if (m.status === "new") void setStatus(m.id, "read");
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                selected?.id === m.id
                  ? "border-secondary-glow bg-secondary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium text-white">{m.name}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    m.status === "new"
                      ? "bg-secondary/30 text-secondary-glow"
                      : "bg-white/10 text-silver-mute"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-silver-mute">{m.subject}</p>
              <p className="mt-1 text-[11px] text-silver-dark">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </button>
          ))}
          {!visible.length && (
            <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-silver-mute">
              No messages yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-3">
          {selected ? (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl text-white">{selected.subject}</h2>
                <p className="mt-1 text-sm text-silver-mute">
                  {selected.name} ·{" "}
                  <a href={`mailto:${selected.email}`} className="text-secondary-glow">
                    {selected.email}
                  </a>
                  {selected.phone ? ` · ${selected.phone}` : ""}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-silver-light">
                {selected.message}
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void setStatus(selected.id, s)}
                    className={`rounded-full border px-3 py-1 text-xs capitalize ${
                      selected.status === s
                        ? "border-secondary-glow text-secondary-glow"
                        : "border-white/15 text-silver-mute"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[10px] uppercase text-silver-dark">
                  Admin notes
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  defaultValue={selected.notes || ""}
                  key={selected.id}
                  onBlur={(e) => void saveNotes(selected.id, e.target.value)}
                  placeholder="Internal notes…"
                />
              </div>
              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                    selected.subject
                  )}`}
                  className="btn-outline !py-2 !text-xs"
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() => void remove(selected.id)}
                  className="text-xs text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-silver-mute">
              Select a message to read and manage it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
