"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { formatDate, cn } from "@/lib/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { thumbSrc } from "@/lib/media-src";

const PAGE_SIZE = 6;

export function BlogList({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: string[];
}) {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return posts;
    return posts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }, [posts, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            setPage(1);
          }}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            category === "all"
              ? "bg-secondary text-white shadow-teal-glow"
              : "bg-white/5 text-silver-mute hover:bg-secondary/20 hover:text-white"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              category === cat
                ? "bg-secondary text-white shadow-teal-glow"
                : "bg-white/5 text-silver-mute hover:bg-secondary/20 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((post) => (
          <article key={post.id} className="group glass-card overflow-hidden">
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
              <PlaceholderImage
                label={post.title}
                src={thumbSrc(post)}
                className="rounded-none image-zoom"
              />
            </Link>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-glow">
                {post.category}
              </p>
              <h2 className="mt-2 font-display text-xl text-white transition group-hover:text-secondary-glow">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-silver-mute">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-silver-dark">
                {post.author} ·{" "}
                {post.published_at ? formatDate(post.published_at) : "Draft"}
              </p>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outline !py-2 !text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-silver-mute">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-outline !py-2 !text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
