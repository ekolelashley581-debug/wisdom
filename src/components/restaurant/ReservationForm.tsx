"use client";

import { useMemo, useState } from "react";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const TIMES = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

export function ReservationForm({ phone }: { phone: string }) {
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("7:00 PM");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !customerPhone.trim()) {
      alert("Name and WhatsApp number are required.");
      return;
    }
    setSending(true);
    const item = {
      id: `rs-${Date.now()}`,
      date,
      time,
      guests,
      customer_name: name.trim(),
      customer_phone: customerPhone.trim(),
      notes,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      cancelled_at: null,
    };

    try {
      await fetch("/api/ops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "reservation", item }),
      });
    } catch {
      /* continue */
    }

    trackEvent({
      type: "booking_start",
      label: "table_reservation",
      path: "/restaurant",
      meta: { date, time, guests: String(guests) },
    });

    const msg = `Hi WISDOM! Table reservation request:\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nName: ${item.customer_name}\nPhone: ${item.customer_phone}\nNotes: ${notes || "—"}\nRef: ${item.id}`;
    window.open(
      `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSending(false);
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-surface-elevated p-5"
    >
      <h2 className="font-display text-xl text-white">Reserve a table</h2>
      <p className="text-sm text-silver-mute">
        Complete this form, then confirm on WhatsApp.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase text-silver-dark">Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-silver-dark">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          >
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-silver-dark">Guests</label>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="WhatsApp number *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>
      <textarea
        className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
        rows={2}
        placeholder="Occasion / notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit" disabled={sending} className="btn-whatsapp disabled:opacity-60">
        {sending ? "Sending…" : "Confirm via WhatsApp"}
      </button>
    </form>
  );
}
