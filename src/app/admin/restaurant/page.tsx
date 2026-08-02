"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/types";
import { demoStore } from "@/lib/demo-store";
import { formatPrice } from "@/lib/format";
import { ItemImagesFields } from "@/components/admin/ItemImagesFields";
import { loadCatalog, saveCatalog } from "@/lib/admin-catalog";

const emptyItem = (): MenuItem => ({
  id: `mi-${Date.now()}`,
  category_id: "cat-mains",
  name: "",
  slug: "",
  description: "",
  price: 0,
  images: [],
  thumbnail: "",
  ingredients: [],
  allergens: [],
  prep_time: "",
  spice_level: 0,
  is_chefs_special: false,
  is_available: true,
  status: "draft",
});

export default function AdminRestaurantPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadCatalog<MenuItem>("menu").then((list) => {
      if (list.length) {
        setItems(list);
        demoStore.setMenu(list);
      } else {
        setItems(demoStore.getMenu());
      }
    });
  }, []);

  function persist(next: MenuItem[]) {
    setItems(next);
    demoStore.setMenu(next);
    void saveCatalog("menu", next);
  }

  function saveItem(item: MenuItem) {
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
    if (!confirm("Delete this item?")) return;
    persist(items.filter((i) => i.id !== id));
    setSelected((s) => s.filter((x) => x !== id));
  }

  function toggleAvailable(id: string) {
    persist(
      items.map((i) =>
        i.id === id ? { ...i, is_available: !i.is_available } : i
      )
    );
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

  function exportCsv() {
    const header = "name,slug,price,status,available,description\n";
    const rows = items
      .map((i) =>
        [
          i.name,
          i.slug,
          i.price,
          i.status,
          i.is_available,
          `"${i.description.replace(/"/g, '""')}"`,
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wisdom-menu.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).slice(1).filter(Boolean);
      const imported: MenuItem[] = lines.map((line, idx) => {
        const parts = line.split(",");
        const name = parts[0] || `Imported ${idx + 1}`;
        const slug =
          parts[1] ||
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        return {
          ...emptyItem(),
          id: `mi-import-${Date.now()}-${idx}`,
          name,
          slug,
          price: Number(parts[2]) || 0,
          status: parts[3] === "published" ? "published" : "draft",
          is_available: parts[4] !== "false",
          description: parts.slice(5).join(",").replace(/^"|"$/g, ""),
        };
      });
      persist([...imported, ...items]);
    };
    reader.readAsText(file);
  }

  function bulkPublish() {
    persist(
      items.map((i) =>
        selected.includes(i.id) ? { ...i, status: "published" } : i
      )
    );
    setSelected([]);
  }

  function bulkDelete() {
    if (!confirm(`Delete ${selected.length} items?`)) return;
    persist(items.filter((i) => !selected.includes(i.id)));
    setSelected([]);
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Restaurant</h1>
          <p className="mt-1 text-sm text-silver">
            Add, edit, publish · CSV import/export · bulk actions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} className="btn-outline !py-2 !text-xs">
            Export CSV
          </button>
          <label className="btn-outline !cursor-pointer !py-2 !text-xs">
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importCsv(f);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setEditing(emptyItem())}
            className="btn-primary"
          >
            Add item
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm">
          <span>{selected.length} selected</span>
          <button type="button" onClick={bulkPublish} className="text-secondary-glow underline">
            Bulk publish
          </button>
          <button type="button" onClick={bulkDelete} className="text-red-400 underline">
            Bulk delete
          </button>
          <button type="button" onClick={() => setSelected([])} className="underline">
            Clear
          </button>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-silver">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === items.length && items.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? items.map((i) => i.id) : [])
                  }
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={(e) =>
                      setSelected((s) =>
                        e.target.checked
                          ? [...s, item.id]
                          : s.filter((id) => id !== item.id)
                      )
                    }
                  />
                </td>
                <td className="px-4 py-3 text-white">
                  {item.name}
                  {item.is_chefs_special && (
                    <span className="ml-2 text-[10px] text-secondary-glow">SPECIAL</span>
                  )}
                </td>
                <td className="px-4 py-3">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item.id)}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize"
                  >
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleAvailable(item.id)}
                    className="text-xs"
                  >
                    {item.is_available ? "Yes" : "No"}
                  </button>
                </td>
                <td className="space-x-2 px-4 py-3">
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
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(null);
              if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                saveItem(editing);
              }
            }}
          >
            <h2 className="font-display text-xl text-white">
              {items.some((i) => i.id === editing.id) ? "Edit" : "Add"} item
            </h2>
            <div className="mt-4 space-y-3">
              <ItemImagesFields
                folder="restaurant"
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
                type="number"
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Price (XAF)"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
              />
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Prep time"
                value={editing.prep_time}
                onChange={(e) =>
                  setEditing({ ...editing, prep_time: e.target.value })
                }
              />
              <input
                className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm text-white"
                placeholder="Ingredients (comma-separated)"
                value={editing.ingredients.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    ingredients: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_chefs_special}
                  onChange={(e) =>
                    setEditing({ ...editing, is_chefs_special: e.target.checked })
                  }
                />
                Chef&apos;s special
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
