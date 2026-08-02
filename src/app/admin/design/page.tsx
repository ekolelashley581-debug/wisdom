"use client";

import { useEffect, useState } from "react";
import type { SiteDesign, TriadItem } from "@/types";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { MultiMediaPicker } from "@/components/admin/MultiMediaPicker";
import { defaultDesign } from "@/lib/site-defaults";
import { collectMediaUrls } from "@/components/ui/MediaSlideshow";

export default function AdminDesignPage() {
  const [design, setDesign] = useState<SiteDesign>(defaultDesign);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.design) {
          setDesign({
            ...defaultDesign,
            ...cfg.design,
            triad_items:
              cfg.design.triad_items?.length > 0
                ? cfg.design.triad_items
                : defaultDesign.triad_items,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const heroUrls = collectMediaUrls(design.hero_image_url, design.hero_media_urls);
    const payload: SiteDesign = {
      ...design,
      hero_media_urls: heroUrls,
      hero_image_url: heroUrls[0] || design.hero_image_url,
    };
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "design", design: payload }),
    });
    if (res.ok) {
      setDesign(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Could not save design");
    }
  }

  function updateTriad(i: number, patch: Partial<TriadItem>) {
    const items = [...(design.triad_items || [])];
    items[i] = { ...items[i], ...patch };
    setDesign({ ...design, triad_items: items });
  }

  function addTriad() {
    setDesign({
      ...design,
      triad_items: [
        ...(design.triad_items || []),
        {
          id: `triad-${Date.now()}`,
          label: "New world",
          line: "Short description",
          href: "/",
          media_url: "",
          visible: true,
        },
      ],
    });
  }

  function removeTriad(i: number) {
    if (!confirm("Remove this pillar?")) return;
    setDesign({
      ...design,
      triad_items: (design.triad_items || []).filter((_, idx) => idx !== i),
    });
  }

  if (loading) return <p className="text-silver">Loading design…</p>;

  const heroUrls = collectMediaUrls(design.hero_image_url, design.hero_media_urls);

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Design & branding</h1>
      <p className="mt-1 text-sm text-silver">
        Logo, hero slideshow, signature triad, colors & CTAs — no code needed
      </p>

      <form onSubmit={save} className="mt-8 max-w-2xl space-y-8">
        <ImagePicker
          label="Logo (photo or video)"
          folder="branding"
          accept="all"
          value={design.logo_url}
          onChange={(url) =>
            setDesign({
              ...design,
              logo_url: url,
              favicon_url: url || design.favicon_url,
            })
          }
        />
        <div className="rounded-xl border border-white/10 bg-primary/40 p-3">
          <ImagePicker
            label="Favicon (browser tab icon)"
            folder="branding"
            accept="all"
            value={design.favicon_url}
            onChange={(url) => setDesign({ ...design, favicon_url: url })}
          />
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="font-display text-xl text-white">Hero media</h2>
          <MultiMediaPicker
            label="Hero photos / videos"
            folder="branding"
            urls={heroUrls}
            onChange={(urls) =>
              setDesign({
                ...design,
                hero_media_urls: urls,
                hero_image_url: urls[0] || "",
              })
            }
          />
          <label className="flex items-center gap-2 text-sm text-silver-mute">
            <input
              type="checkbox"
              checked={design.hero_slideshow !== false}
              onChange={(e) =>
                setDesign({ ...design, hero_slideshow: e.target.checked })
              }
            />
            Play as slideshow when 2+ media
          </label>
          <div>
            <label className="text-xs uppercase text-silver-dark">
              Slide interval (seconds)
            </label>
            <input
              type="number"
              min={6}
              max={30}
              className="mt-1 w-28 rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={design.hero_slideshow_interval || 9}
              onChange={(e) =>
                setDesign({
                  ...design,
                  hero_slideshow_interval: Number(e.target.value) || 9,
                })
              }
            />
            <p className="mt-1 text-[11px] text-silver-mute">
              Lazy pace recommended: 8–12 seconds. Slides glide slowly between frames.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-silver-dark">Hero eyebrow</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={design.hero_eyebrow}
              onChange={(e) => setDesign({ ...design, hero_eyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-silver-dark">Hero title</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={design.hero_title}
              onChange={(e) => setDesign({ ...design, hero_title: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Hero subtitle</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={design.hero_subtitle}
            onChange={(e) => setDesign({ ...design, hero_subtitle: e.target.value })}
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl text-white">Signature triad</h2>
            <label className="flex items-center gap-2 text-xs text-silver-mute">
              <input
                type="checkbox"
                checked={design.triad_visible !== false}
                onChange={(e) =>
                  setDesign({ ...design, triad_visible: e.target.checked })
                }
              />
              Show on homepage
            </label>
          </div>
          <p className="text-xs text-silver-mute">
            The animated Restaurant · Shop · Spa band under the hero. Edit labels, links,
            and preview images here.
          </p>
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            placeholder="Eyebrow"
            value={design.triad_eyebrow || ""}
            onChange={(e) => setDesign({ ...design, triad_eyebrow: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            placeholder="Title"
            value={design.triad_title || ""}
            onChange={(e) => setDesign({ ...design, triad_title: e.target.value })}
          />
          <textarea
            rows={2}
            className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            placeholder="Supporting text"
            value={design.triad_body || ""}
            onChange={(e) => setDesign({ ...design, triad_body: e.target.value })}
          />

          {(design.triad_items || []).map((item, i) => (
            <div
              key={item.id}
              className="space-y-2 rounded-xl border border-white/10 bg-primary/40 p-3"
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-silver-mute">
                  <input
                    type="checkbox"
                    checked={item.visible !== false}
                    onChange={(e) => updateTriad(i, { visible: e.target.checked })}
                  />
                  Visible
                </label>
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() => removeTriad(i)}
                >
                  Delete
                </button>
              </div>
              <input
                className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
                value={item.label}
                onChange={(e) => updateTriad(i, { label: e.target.value })}
                placeholder="Label (Restaurant, Shop, Spa…)"
              />
              <input
                className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
                value={item.line}
                onChange={(e) => updateTriad(i, { line: e.target.value })}
                placeholder="Short description"
              />
              <input
                className="w-full rounded-lg border border-white/15 bg-primary px-3 py-2 text-sm"
                value={item.href}
                onChange={(e) => updateTriad(i, { href: e.target.value })}
                placeholder="/restaurant"
              />
              <ImagePicker
                label="Preview photo or video"
                folder="branding"
                accept="all"
                value={item.media_url || ""}
                onChange={(media_url) => updateTriad(i, { media_url })}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTriad}
            className="text-xs text-secondary-glow hover:underline"
          >
            + Add pillar
          </button>
        </div>

        <div>
          <label className="text-xs uppercase text-silver-dark">Footer blurb</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            value={design.footer_blurb}
            onChange={(e) => setDesign({ ...design, footer_blurb: e.target.value })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-silver-dark">Restaurant CTA</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={design.restaurant_cta}
              onChange={(e) =>
                setDesign({ ...design, restaurant_cta: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase text-silver-dark">Spa CTA</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={design.spa_cta}
              onChange={(e) => setDesign({ ...design, spa_cta: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["primary_color", "Primary"],
              ["secondary_color", "Teal"],
              ["silver_color", "Silver"],
              ["glow_color", "Glow"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs uppercase text-silver-dark">{label}</label>
              <input
                type="color"
                className="mt-1 h-10 w-full cursor-pointer rounded border border-white/15 bg-primary"
                value={design[key]}
                onChange={(e) => setDesign({ ...design, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          {saved ? "Saved!" : "Save design"}
        </button>
        <p className="text-xs text-silver-dark">
          Changes apply on the public site after refresh.
        </p>
      </form>
    </div>
  );
}
