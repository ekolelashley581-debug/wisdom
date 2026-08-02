"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("err");
        setError(data.error || "Could not send");
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("err");
      setError("Network error — try again or WhatsApp us.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-secondary/40 bg-secondary/10 p-8 text-center">
        <p className="font-display text-2xl text-white">Message received</p>
        <p className="mt-2 text-sm text-silver-mute">
          Our team will reply soon. For faster help, chat on WhatsApp.
        </p>
        <button
          type="button"
          className="btn-outline mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Name *</label>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2.5 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Email *</label>
          <input
            required
            type="email"
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2.5 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Phone</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2.5 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+237…"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Subject *</label>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2.5 text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Reservation, spa, feedback…"
          />
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-silver-dark">Message *</label>
        <textarea
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2.5 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
