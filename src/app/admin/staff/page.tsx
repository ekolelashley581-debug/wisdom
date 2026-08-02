"use client";

import { useEffect, useState } from "react";
import type { SpaService, StaffMember } from "@/types";
import { ItemImagesFields } from "@/components/admin/ItemImagesFields";
import { loadCatalog, saveCatalog } from "@/lib/admin-catalog";
import { cn } from "@/lib/format";

const emptyStaff = (): StaffMember => ({
  id: `staff-${Date.now()}`,
  name: "",
  slug: "",
  role: "",
  department: "spa",
  bio: "",
  short_bio: "",
  photo_url: "",
  thumbnail: "",
  specialties: [],
  service_slugs: [],
  level: "senior",
  years_experience: 1,
  status: "draft",
  sort_order: 99,
  meta_title: "",
  meta_description: "",
});

export default function AdminStaffPage() {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [editing, setEditing] = useState<StaffMember | null>(null);

  useEffect(() => {
    loadCatalog<StaffMember>("staff").then(setItems);
    loadCatalog<SpaService>("spa").then(setServices);
  }, []);

  function persist(next: StaffMember[]) {
    setItems(next);
    void saveCatalog("staff", next);
  }

  function saveItem(item: StaffMember) {
    const slug =
      item.slug ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const saved: StaffMember = {
      ...item,
      slug,
      meta_title: item.meta_title || `${item.name} — ${item.role} | WISDOM`,
      meta_description:
        item.meta_description || item.short_bio || item.bio.slice(0, 155),
    };
    const exists = items.some((i) => i.id === saved.id);
    persist(exists ? items.map((i) => (i.id === saved.id ? saved : i)) : [...items, saved]);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Delete this staff profile?")) return;
    persist(items.filter((i) => i.id !== id));
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Staff portfolio</h1>
          <p className="mt-1 text-sm text-silver">
            Profiles guests see on About / Team — link spa services to the person
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing(emptyStaff())}>
          Add staff
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {items
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-primary">
                  {(s.thumbnail || s.photo_url) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.thumbnail || s.photo_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{s.name}</p>
                  <p className="text-xs text-silver-mute">
                    {s.role} · {s.department} · {s.status}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <button type="button" className="text-secondary-glow" onClick={() => setEditing(s)}>
                  Edit
                </button>
                <button type="button" className="text-red-400" onClick={() => remove(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        {!items.length && (
          <p className="text-sm text-silver-mute">No staff yet — add your first profile.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-surface-elevated p-6"
            onSubmit={(e) => {
              e.preventDefault();
              saveItem(editing);
            }}
          >
            <h2 className="font-display text-2xl text-white">
              {items.some((i) => i.id === editing.id) ? "Edit" : "New"} staff
            </h2>

            <div className="mt-4">
              <ItemImagesFields
                folder="staff"
                mainLabel="Portrait (profile page)"
                thumbLabel="Thumbnail (cards)"
                mainUrl={editing.photo_url}
                thumbUrl={editing.thumbnail || ""}
                onMainChange={(photo_url) => setEditing({ ...editing, photo_url })}
                onThumbChange={(thumbnail) => setEditing({ ...editing, thumbnail })}
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-silver-dark">Name</label>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase text-silver-dark">Role / title</label>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase text-silver-dark">Department</label>
                <select
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.department}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      department: e.target.value as StaffMember["department"],
                    })
                  }
                >
                  <option value="spa">Spa</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="lounge">Lounge</option>
                  <option value="management">Management</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-silver-dark">Level (spa)</label>
                <select
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.level || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      level: (e.target.value || undefined) as StaffMember["level"],
                    })
                  }
                >
                  <option value="">—</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                  <option value="master">Master</option>
                </select>
              </div>
            </div>

            <label className="mt-3 block text-xs uppercase text-silver-dark">Short bio</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.short_bio}
              onChange={(e) => setEditing({ ...editing, short_bio: e.target.value })}
            />

            <label className="mt-3 block text-xs uppercase text-silver-dark">Full bio</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.bio}
              onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            />

            <label className="mt-3 block text-xs uppercase text-silver-dark">
              Specialties (comma-separated)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.specialties.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  specialties: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
            />

            <div className="mt-4">
              <p className="mb-2 text-xs uppercase text-silver-dark">
                Linked spa services (shown on service pages)
              </p>
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                {services.map((svc) => {
                  const on = editing.service_slugs.includes(svc.slug);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => {
                        const next = on
                          ? editing.service_slugs.filter((x) => x !== svc.slug)
                          : [...editing.service_slugs, svc.slug];
                        setEditing({ ...editing, service_slugs: next });
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs",
                        on
                          ? "border-secondary-glow text-secondary-glow"
                          : "border-white/15 text-silver-mute"
                      )}
                    >
                      {svc.name}
                    </button>
                  );
                })}
                {!services.length && (
                  <p className="text-xs text-silver-mute">
                    Publish spa services first, then link them here.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs uppercase text-silver-dark">Sort order</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-xs uppercase text-silver-dark">Years exp.</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.years_experience || 0}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      years_experience: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs uppercase text-silver-dark">Status</label>
                <select
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as StaffMember["status"],
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-secondary/30 p-3">
              <p className="text-xs uppercase text-secondary-glow">SEO</p>
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                placeholder="Meta title"
                value={editing.meta_title}
                onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
              />
              <textarea
                rows={2}
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                placeholder="Meta description"
                value={editing.meta_description}
                onChange={(e) =>
                  setEditing({ ...editing, meta_description: e.target.value })
                }
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
