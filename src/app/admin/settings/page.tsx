"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => setSettings(cfg.settings))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return <p className="text-silver">Loading settings…</p>;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "settings", settings }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Save failed");
    }
  }

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Settings</h1>
      <p className="mt-1 text-sm text-silver">
        WhatsApp, hours, delivery, location — saved for the live site (no code)
      </p>

      <form onSubmit={save} className="mt-8 max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-xs text-silver">WhatsApp number</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.whatsapp_number}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp_number: e.target.value.replace(/\D/g, ""),
              })
            }
            placeholder="237673949163"
          />
          <p className="mt-1 text-xs text-silver-dark">
            Digits only, with country code (no +)
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Tagline</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Email</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Address</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Maps search query</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.maps_query}
            onChange={(e) =>
              setSettings({ ...settings, maps_query: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Delivery radius</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.delivery_radius}
            onChange={(e) =>
              setSettings({ ...settings, delivery_radius: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-silver">Minimum order (XAF)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white"
            value={settings.min_order}
            onChange={(e) =>
              setSettings({ ...settings, min_order: Number(e.target.value) })
            }
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(["instagram", "facebook", "tiktok"] as const).map((key) => (
            <div key={key}>
              <label className="mb-1 block text-xs capitalize text-silver">{key}</label>
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                value={settings.social_links[key] || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-xs text-silver">Opening hours</label>
          <div className="space-y-2">
            {settings.opening_hours.map((h, i) => (
              <div key={h.day} className="grid grid-cols-3 gap-2">
                <span className="flex items-center text-sm text-white">{h.day}</span>
                <input
                  className="rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs text-white"
                  value={h.open}
                  onChange={(e) => {
                    const opening_hours = [...settings.opening_hours];
                    opening_hours[i] = { ...h, open: e.target.value };
                    setSettings({ ...settings, opening_hours });
                  }}
                />
                <input
                  className="rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs text-white"
                  value={h.close}
                  onChange={(e) => {
                    const opening_hours = [...settings.opening_hours];
                    opening_hours[i] = { ...h, close: e.target.value };
                    setSettings({ ...settings, opening_hours });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary">
          {saved ? "Saved!" : "Save settings"}
        </button>
        <p className="text-xs text-silver-dark">
          Saved to the server config file — refresh the public site to see changes.
        </p>
      </form>
    </div>
  );
}
