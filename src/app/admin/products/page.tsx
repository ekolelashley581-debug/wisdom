"use client";

import { useEffect, useState } from "react";
import type { SpaProduct } from "@/types";
import { demoStore } from "@/lib/demo-store";
import { formatPrice } from "@/lib/format";
import { ItemImagesFields } from "@/components/admin/ItemImagesFields";
import { loadCatalog, saveCatalog } from "@/lib/admin-catalog";

const emptyProduct = (): SpaProduct => ({
  id: `sp-${Date.now()}`,
  name: "",
  slug: "",
  description: "",
  sizes: [{ label: "100ml", price: 0 }],
  price: 0,
  images: [],
  thumbnail: "",
  status: "draft",
  is_available: true,
});

export default function AdminProductsPage() {
  const [items, setItems] = useState<SpaProduct[]>([]);
  const [editing, setEditing] = useState<SpaProduct | null>(null);

  useEffect(() => {
    loadCatalog<SpaProduct>("products").then((list) => {
      if (list.length) {
        setItems(list);
        demoStore.setProducts(list);
      } else {
        setItems(demoStore.getProducts());
      }
    });
  }, []);

  function persist(next: SpaProduct[]) {
    setItems(next);
    demoStore.setProducts(next);
    void saveCatalog("products", next);
  }

  function saveItem(item: SpaProduct) {
    const slug =
      item.slug ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const price = item.sizes[0]?.price ?? item.price;
    const saved = { ...item, slug, price };
    const exists = items.some((i) => i.id === saved.id);
    persist(exists ? items.map((i) => (i.id === saved.id ? saved : i)) : [...items, saved]);
    setEditing(null);
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Products</h1>
          <p className="mt-1 text-sm text-silver">Spa shop inventory</p>
        </div>
        <button type="button" onClick={() => setEditing(emptyProduct())} className="btn-primary">
          Add product
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-silver-dark">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">{item.name}</td>
                <td className="px-4 py-3">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      persist(
                        items.map((i) =>
                          i.id === item.id
                            ? {
                                ...i,
                                status: i.status === "published" ? "draft" : "published",
                              }
                            : i
                        )
                      )
                    }
                    className="text-secondary-glow hover:underline"
                  >
                    {item.status}
                  </button>
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button type="button" onClick={() => setEditing(item)} className="hover:text-white">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete?")) persist(items.filter((i) => i.id !== item.id));
                    }}
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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-surface-elevated p-6"
            onSubmit={(e) => {
              e.preventDefault();
              saveItem(editing);
            }}
          >
            <h2 className="font-display text-2xl text-white">
              {items.some((i) => i.id === editing.id) ? "Edit" : "New"} product
            </h2>
            <div className="mt-4">
              <ItemImagesFields
                folder="products"
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
            </div>
            <label className="mt-4 block text-xs uppercase text-silver-dark">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">Description</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              rows={3}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">
              Sizes (label:price, comma-separated)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.sizes.map((s) => `${s.label}:${s.price}`).join(", ")}
              onChange={(e) => {
                const sizes = e.target.value
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .map((part) => {
                    const [label, price] = part.split(":");
                    return { label: label?.trim() || "Size", price: Number(price) || 0 };
                  });
                setEditing({ ...editing, sizes: sizes.length ? sizes : editing.sizes });
              }}
            />
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
