"use client";

import { useState } from "react";

export function BlogSubscribe({ enabled = true }: { enabled?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-5 text-sm text-silver-light">
        You&apos;re on the list. We&apos;ll tip you when a new WISDOM story goes live.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-white/10 bg-surface-elevated p-5"
    >
      <h2 className="font-display text-xl text-white">Get new post alerts</h2>
      <p className="mt-1 text-sm text-silver-mute">
        Leave your email (and optional WhatsApp). We&apos;ll notify you when we publish.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          required
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="WhatsApp (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4 !py-2.5 !text-sm disabled:opacity-60"
      >
        {loading ? "Saving…" : "Notify me"}
      </button>
    </form>
  );
}
