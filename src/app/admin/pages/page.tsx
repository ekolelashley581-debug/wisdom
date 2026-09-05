"use client";

import { useEffect, useState } from "react";
import type { PageCopy, PageSectionCopy, SeoFields } from "@/types";

type Tab =
  | "home"
  | "restaurant"
  | "spa"
  | "product"
  | "blog"
  | "about"
  | "team"
  | "seo";

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs uppercase text-silver-dark">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SectionFields({
  value,
  onChange,
  showCta,
}: {
  value: PageSectionCopy;
  onChange: (v: PageSectionCopy) => void;
  showCta?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <Field
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      <Field
        label="Body text"
        value={value.body}
        onChange={(body) => onChange({ ...value, body })}
        rows={3}
      />
      {showCta && (
        <Field
          label="Button / CTA label"
          value={value.cta || ""}
          onChange={(cta) => onChange({ ...value, cta })}
        />
      )}
    </div>
  );
}

function SeoBlock({
  value,
  onChange,
}: {
  value: SeoFields;
  onChange: (v: SeoFields) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary-glow">
        SEO for this page
      </p>
      <Field
        label="Meta title (Google tab)"
        value={value.meta_title}
        onChange={(meta_title) => onChange({ ...value, meta_title })}
      />
      <Field
        label="Meta description"
        value={value.meta_description}
        onChange={(meta_description) => onChange({ ...value, meta_description })}
        rows={2}
      />
    </div>
  );
}

export default function AdminPagesPage() {
  const [copy, setCopy] = useState<PageCopy | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-copy")
      .then((r) => r.json())
      .then(setCopy);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!copy) return;
    const res = await fetch("/api/page-copy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else alert("Could not save page text");
  }

  if (!copy) return <p className="text-silver">Loading page texts…</p>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "restaurant", label: "Restaurant" },
    { id: "spa", label: "Spa" },
    { id: "product", label: "Shop" },
    { id: "blog", label: "Blog" },
    { id: "about", label: "About" },
    { id: "team", label: "Team" },
    { id: "seo", label: "SEO overview" },
  ];

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Page texts</h1>
      <p className="mt-1 text-sm text-silver">
        Edit headlines and paragraphs for every public page — no code, no AI needed
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              tab === t.id
                ? "border-secondary-glow text-secondary-glow"
                : "border-white/15 text-silver-mute"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="mt-8 max-w-2xl space-y-6">
        {tab === "home" && (
          <div className="space-y-8">
            <p className="text-sm text-silver-mute">
              Hero image, logo & colors are under Design. Edit homepage section copy below.
            </p>
            <div className="space-y-3">
              <h2 className="font-display text-xl text-white">Discover</h2>
              <SectionFields
                value={copy.home_discover}
                onChange={(v) =>
                  setCopy({ ...copy, home_discover: { ...copy.home_discover, ...v } })
                }
                showCta
              />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl text-white">Chef&apos;s specials</h2>
              <SectionFields
                value={copy.home_chefs}
                onChange={(v) =>
                  setCopy({ ...copy, home_chefs: { ...copy.home_chefs, ...v } })
                }
                showCta
              />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl text-white">Spa glimpse</h2>
              <SectionFields
                value={copy.home_spa_glimpse}
                onChange={(v) =>
                  setCopy({
                    ...copy,
                    home_spa_glimpse: { ...copy.home_spa_glimpse, ...v },
                  })
                }
                showCta
              />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl text-white">Shop</h2>
              <SectionFields
                value={copy.home_shop}
                onChange={(v) =>
                  setCopy({ ...copy, home_shop: { ...copy.home_shop, ...v } })
                }
                showCta
              />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl text-white">Testimonials</h2>
              <SectionFields
                value={copy.home_testimonials}
                onChange={(v) =>
                  setCopy({
                    ...copy,
                    home_testimonials: { ...copy.home_testimonials, ...v },
                  })
                }
              />
            </div>
            <SeoBlock
              value={copy.home_seo}
              onChange={(home_seo) => setCopy({ ...copy, home_seo })}
            />
          </div>
        )}

        {tab === "restaurant" && (
          <>
            <SectionFields
              value={copy.restaurant}
              onChange={(v) => setCopy({ ...copy, restaurant: { ...copy.restaurant, ...v } })}
            />
            <SeoBlock
              value={copy.restaurant.seo}
              onChange={(seo) => setCopy({ ...copy, restaurant: { ...copy.restaurant, seo } })}
            />
          </>
        )}

        {tab === "spa" && (
          <>
            <SectionFields
              value={copy.spa}
              onChange={(v) => setCopy({ ...copy, spa: { ...copy.spa, ...v } })}
            />
            <SeoBlock
              value={copy.spa.seo}
              onChange={(seo) => setCopy({ ...copy, spa: { ...copy.spa, seo } })}
            />
          </>
        )}

        {tab === "product" && (
          <>
            <SectionFields
              value={copy.product}
              onChange={(v) => setCopy({ ...copy, product: { ...copy.product, ...v } })}
            />
            <SeoBlock
              value={copy.product.seo}
              onChange={(seo) => setCopy({ ...copy, product: { ...copy.product, seo } })}
            />
          </>
        )}

        {tab === "blog" && (
          <>
            <SectionFields
              value={copy.blog}
              onChange={(v) => setCopy({ ...copy, blog: { ...copy.blog, ...v } })}
            />
            <SeoBlock
              value={copy.blog.seo}
              onChange={(seo) => setCopy({ ...copy, blog: { ...copy.blog, seo } })}
            />
          </>
        )}

        {tab === "about" && (
          <>
            <SectionFields
              value={copy.about}
              onChange={(v) => setCopy({ ...copy, about: { ...copy.about, ...v } })}
            />
            <Field
              label="Full story"
              value={copy.about.story}
              onChange={(story) =>
                setCopy({ ...copy, about: { ...copy.about, story } })
              }
              rows={5}
            />
            <Field
              label="Mission"
              value={copy.about.mission}
              onChange={(mission) =>
                setCopy({ ...copy, about: { ...copy.about, mission } })
              }
              rows={3}
            />
            <SeoBlock
              value={copy.about.seo}
              onChange={(seo) => setCopy({ ...copy, about: { ...copy.about, seo } })}
            />
          </>
        )}

        {tab === "team" && (
          <>
            <SectionFields
              value={copy.team}
              onChange={(v) => setCopy({ ...copy, team: { ...copy.team, ...v } })}
            />
            <SeoBlock
              value={copy.team.seo}
              onChange={(seo) => setCopy({ ...copy, team: { ...copy.team, seo } })}
            />
            <p className="text-sm text-silver-mute">
              Add individual staff in <strong className="text-white">Admin → Staff</strong>.
            </p>
          </>
        )}

        {tab === "seo" && (
          <div className="space-y-4">
            <SeoBlock
              value={copy.home_seo}
              onChange={(home_seo) => setCopy({ ...copy, home_seo })}
            />
            <p className="text-xs text-silver-mute">
              Other page SEO titles live on each page tab (Restaurant, Spa, About…).
              Hero text is under Design. Blog posts have their own SEO fields when editing.
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary">
          {saved ? "Saved!" : "Save page texts"}
        </button>
      </form>
    </div>
  );
}
