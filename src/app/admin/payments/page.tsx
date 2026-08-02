"use client";

import { useEffect, useState } from "react";
import type { WhatsAppPaymentConfig, UserRole } from "@/types";
import { demoStore } from "@/lib/demo-store";

const defaults: WhatsAppPaymentConfig = {
  instructions:
    "All payments are arranged and confirmed on WhatsApp after you order or book. No card checkout on the website.",
  accepted_note:
    "MTN MoMo, Orange Money, or Cash — staff will confirm details in chat",
  momo_hint: "Ask for MTN MoMo number on WhatsApp",
  orange_hint: "Ask for Orange Money number on WhatsApp",
  cash_hint: "Cash on delivery / at venue",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<WhatsAppPaymentConfig>(defaults);
  const [role, setRole] = useState<UserRole>("admin");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.payments) setPayments({ ...defaults, ...cfg.payments });
      });
    setRole(demoStore.getRole());
  }, []);

  async function save() {
    demoStore.setRole(role);
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "payments", payments }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">WhatsApp payments</h1>
      <p className="mt-1 max-w-2xl text-sm text-silver">
        Money is collected on WhatsApp — not on the website. Edit the messages guests
        and staff use when arranging MoMo, Orange Money, or cash.
      </p>

      <div className="mt-8 max-w-xl space-y-4 rounded-2xl border border-white/10 p-6">
        <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary-glow">
          Checkout stays WhatsApp-first. No online card gateway on this site.
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">
            Main payment instructions
          </label>
          <textarea
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            rows={3}
            value={payments.instructions}
            onChange={(e) =>
              setPayments({ ...payments, instructions: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Accepted methods note</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={payments.accepted_note}
            onChange={(e) =>
              setPayments({ ...payments, accepted_note: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">MTN MoMo hint</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={payments.momo_hint}
            onChange={(e) =>
              setPayments({ ...payments, momo_hint: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Orange Money hint</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={payments.orange_hint}
            onChange={(e) =>
              setPayments({ ...payments, orange_hint: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Cash hint</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={payments.cash_hint}
            onChange={(e) =>
              setPayments({ ...payments, cash_hint: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Demo admin role</label>
          <select
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="admin">Admin (full)</option>
            <option value="editor">Editor (content)</option>
            <option value="viewer">Viewer (read-only)</option>
          </select>
        </div>

        <button type="button" onClick={save} className="btn-primary">
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}
