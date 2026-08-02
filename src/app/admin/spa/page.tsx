"use client";

import { useEffect, useState } from "react";
import type { SpaService } from "@/types";
import { demoStore } from "@/lib/demo-store";
import { formatPrice } from "@/lib/format";
import { ItemImagesFields } from "@/components/admin/ItemImagesFields";
import { loadCatalog, saveCatalog } from "@/lib/admin-catalog";

const emptyService = (): SpaService => ({
  id: `ss-${Date.now()}`,
  category_id: "spa-body",
  name: "",
  slug: "",
  description: "",
  price_by_level: { junior: 0, senior: 0, master: 0 },
  duration: "",
  images: [],
  thumbnail: "",
  is_package: false,
  is_available: true,
  status: "draft",
});

export default function AdminSpaPage() {
  const [items, setItems] = useState<SpaService[]>([]);
  const [editing, setEditing] = useState<SpaService | null>(null);

  useEffect(() => {
    loadCatalog<SpaService>("spa").then((list) => {
      if (list.length) {
        setItems(list);
        demoStore.setSpa(list);
      } else {
        setItems(demoStore.getSpa());
      }
    });
  }, []);

  function persist(next: SpaService[]) {
    setItems(next);
    demoStore.setSpa(next);
    void saveCatalog("spa", next);
  }

  function saveItem(item: SpaService) {
    const slug =
      item.slug ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const saved = { ...item, slug };
    const exists = items.some((i) => i.id === saved.id);
    const next = exists
      ? items.map((i) => (i.id === saved.id ? saved : i))
      : [...items, saved];
    persist(next);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    persist(items.filter((i) => i.id !== id));
  }

  function toggleStatus(id: string) {
    persist(
      items.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "published" ? "draft" : "published" }
          : i
      )
    );
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Spa</h1>
          <p className="mt-1 text-sm text-silver">Manage services & packages</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyService())}
          className="btn-primary"
        >
          Add service
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-silver">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">
                  {item.name}
                  {item.is_package && (
                    <span className="ml-2 text-[10px] text-secondary-glow">PKG</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {formatPrice(item.price_by_level.junior)}
                </td>
                <td className="px-4 py-3">{item.duration}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item.id)}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize"
                  >
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="text-secondary-glow hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#1a1f26] p-6"
            onSubmit={(e) => {
              e.preventDefault();
              saveItem(editing);
            }}
          >
            <h2 className="font-display text-xl text-white">
              {items.some((i) => i.id === editing.id) ? "Edit" : "Add"} service
            </h2>
            <div className="mt-4 space-y-3">
              <ItemImagesFields
                folder="spa"
                mainUrl={editing.images[0] || ""}
                thumbUrl={editing.thumbnail || ""}
                onMainChange={(url) =>
                  setEditing({
                    ...editing,
                    images: url
                      ? [url, ...editing.images.slice(1)]
                      : editing.images.slice(1),
                  })
                }
                onThumbChange={(url) => setEditing({ ...editing, thumbnail: url })}
              />
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Name"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
              <textarea
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Description"
                rows={3}
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Duration"
                value={editing.duration}
                onChange={(e) =>
                  setEditing({ ...editing, duration: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-2">
                {(["junior", "senior", "master"] as const).map((level) => (
                  <input
                    key={level}
                    type="number"
                    className="rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                    placeholder={level}
                    value={editing.price_by_level[level]}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price_by_level: {
                          ...editing.price_by_level,
                          [level]: Number(e.target.value),
                        },
                      })
                    }
                  />
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_package}
                  onChange={(e) =>
                    setEditing({ ...editing, is_package: e.target.checked })
                  }
                />
                Package
              </label>
              <select
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as "draft" | "published",
                  })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn-outline !border-silver/30 !text-silver"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
