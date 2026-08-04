"use client";

import { useMemo, useState } from "react";
import type { SpaService } from "@/types";
import { formatPrice } from "@/lib/format";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { demoStore } from "@/lib/demo-store";
import { trackEvent } from "@/lib/analytics";

const TIMES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

export function BookingForm({
  service,
  phone,
}: {
  service: SpaService;
  phone: string;
}) {
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("10:00 AM");
  const [level, setLevel] = useState<"junior" | "senior" | "master">("senior");
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const price = service.price_by_level[level];
  const waPhone = normalizeWhatsAppNumber(phone);

  function openWa(message: string) {
    window.open(
      `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !customerPhone.trim()) {
      alert("Name and WhatsApp number are required.");
      return;
    }
    const booking = {
      id: `bk-${Date.now()}`,
      service_name: service.name,
      service_slug: service.slug,
      stylist_level: level,
      date,
      time,
      customer_name: name.trim(),
      customer_phone: customerPhone.trim(),
      notes,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      cancelled_at: null,
    };
    void persistAndOpen(booking);
  }

  async function persistAndOpen(booking: {
    id: string;
    service_name: string;
    service_slug: string;
    stylist_level: "junior" | "senior" | "master";
    date: string;
    time: string;
    customer_name: string;
    customer_phone: string;
    notes: string;
    status: "pending";
    created_at: string;
    cancelled_at: null;
  }) {
    demoStore.addBooking(booking);
    try {
      await fetch("/api/ops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "booking", item: booking }),
      });
    } catch {
      /* local fallback already saved */
    }
    trackEvent({
      type: "booking_start",
      label: service.name,
      path: `/spa/${service.slug}`,
      meta: { date, time, level },
    });
    setSavedId(booking.id);

    openWa(
      `Hi WISDOM! I want to book ${service.name} (${level}) for ${date} at ${time}.\nName: ${booking.customer_name}\nMy phone: ${customerPhone || "—"}\nNotes: ${notes || "—"}\nBooking ref: ${booking.id}`
    );
  }

  function cancelBooking() {
    if (!savedId) return;
    demoStore.cancelBooking(savedId);
    openWa(
      `Hi WISDOM! I'd like to cancel booking ${savedId} for ${service.name} on ${date} at ${time}.`
    );
    setSavedId(null);
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-surface-elevated p-5"
    >
      <h2 className="font-display text-xl text-white">Book this service</h2>
      <p className="text-sm text-silver-mute">
        Pick date & time, then confirm on WhatsApp. Cancel anytime from here or via
        WhatsApp.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
          >
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-silver-dark">
          Stylist level
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["junior", "senior", "master"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                level === l
                  ? "border-secondary-glow bg-secondary/20 text-secondary-glow"
                  : "border-white/15 text-silver-mute"
              }`}
            >
              {l} · {formatPrice(service.price_by_level[l])}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
            placeholder="Required"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-silver-dark">
            Your WhatsApp
          </label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
            placeholder="+237…"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-silver-dark">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
          placeholder="Allergies, preferences…"
        />
      </div>

      <p className="text-lg font-semibold text-secondary-glow">
        Estimated {formatPrice(price)}
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-whatsapp">
          Confirm via WhatsApp
        </button>
        {savedId && (
          <button
            type="button"
            onClick={cancelBooking}
            className="btn-outline !border-red-400/40 !text-red-300"
          >
            Cancel booking
          </button>
        )}
      </div>
      {savedId && <p className="text-xs text-silver-dark">Saved ref: {savedId}</p>}
    </form>
  );
}
