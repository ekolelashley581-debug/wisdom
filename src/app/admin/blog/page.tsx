"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/types";
import { demoStore } from "@/lib/demo-store";
import { formatDate } from "@/lib/format";
import { ItemImagesFields } from "@/components/admin/ItemImagesFields";
import { loadCatalog, saveCatalog } from "@/lib/admin-catalog";

const emptyPost = (): BlogPost => ({
  id: `bp-${Date.now()}`,
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  featured_image: "",
  thumbnail: "",
  category: "Events",
  author: "WISDOM Team",
  tags: [],
  status: "draft",
  published_at: null,
  scheduled_at: null,
  meta_title: "",
  meta_description: "",
  og_image: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadCatalog<BlogPost>("blog").then((list) => {
      if (list.length) {
        setItems(list);
        demoStore.setBlog(list);
      } else {
        setItems(demoStore.getBlog());
      }
    });
  }, []);

  function persist(next: BlogPost[]) {
    setItems(next);
    demoStore.setBlog(next);
    void saveCatalog("blog", next);
  }

  function saveItem(item: BlogPost) {
    const slug =
      item.slug ||
      item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const saved: BlogPost = {
      ...item,
      slug,
      meta_title: item.meta_title || item.title,
      meta_description: item.meta_description || item.excerpt,
      updated_at: new Date().toISOString(),
      published_at:
        item.status === "published"
          ? item.published_at || new Date().toISOString()
          : item.published_at,
    };
    const exists = items.some((i) => i.id === saved.id);
    persist(exists ? items.map((i) => (i.id === saved.id ? saved : i)) : [...items, saved]);
    setEditing(null);
  }

  return (
    <div className="text-silver-light">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Blog</h1>
          <p className="mt-1 text-sm text-silver">Posts, schedule & SEO</p>
        </div>
        <button type="button" onClick={() => setEditing(emptyPost())} className="btn-primary">
          New post
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="font-medium text-white">{post.title || "Untitled"}</p>
              <p className="text-xs text-silver-mute">
                {post.category} · {post.status}
                {post.scheduled_at ? ` · scheduled ${formatDate(post.scheduled_at)}` : ""}
                {post.published_at ? ` · ${formatDate(post.published_at)}` : ""}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => setEditing(post)} className="hover:text-white">
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete post?")) persist(items.filter((i) => i.id !== post.id));
                }}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
            <h2 className="font-display text-2xl text-white">Edit post</h2>
            <div className="mt-4">
              <ItemImagesFields
                folder="blog"
                mainLabel="Main / featured image"
                thumbLabel="Thumbnail (blog cards)"
                mainUrl={editing.featured_image}
                thumbUrl={editing.thumbnail || ""}
                onMainChange={(url) =>
                  setEditing({
                    ...editing,
                    featured_image: url,
                    og_image: url || editing.og_image,
                  })
                }
                onThumbChange={(url) => setEditing({ ...editing, thumbnail: url })}
              />
            </div>
            <label className="mt-4 block text-xs uppercase text-silver-dark">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">Excerpt</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              rows={2}
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">
              Content (HTML rich text)
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 font-mono text-xs"
              rows={8}
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase text-silver-dark">Category</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-silver-dark">Author</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.author}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-silver-dark">Status</label>
                <select
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as BlogPost["status"],
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-silver-dark">
                  Schedule (optional)
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
                  value={
                    editing.scheduled_at
                      ? editing.scheduled_at.slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      scheduled_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
            </div>
            <label className="mt-3 block text-xs uppercase text-silver-dark">Meta title</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.meta_title}
              onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">
              Meta description
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              rows={2}
              value={editing.meta_description}
              onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
            />
            <label className="mt-3 block text-xs uppercase text-silver-dark">
              Tags (comma-separated)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
              value={editing.tags.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
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
