import { NextResponse } from "next/server";
import {
  isCatalogSection,
  readCatalog,
  writeCatalog,
} from "@/lib/content-store";
import { addNotification } from "@/lib/notification-store";
import type { BlogPost } from "@/types";

export const runtime = "nodejs";

const SECTION_LABELS: Record<string, string> = {
  menu: "Restaurant menu",
  spa: "Spa services",
  products: "Products",
  blog: "Blog",
  staff: "Staff",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") || "menu";
  if (!isCatalogSection(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  const items = await readCatalog(section);
  return NextResponse.json({ section, items });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { section?: string; items?: unknown[] };
  const section = body.section || "";
  if (!isCatalogSection(section) || !Array.isArray(body.items)) {
    return NextResponse.json(
      { error: "Expected { section, items[] }" },
      { status: 400 }
    );
  }

  const previous = await readCatalog(section);
  const items = await writeCatalog(section, body.items);

  try {
    if (section === "blog") {
      const prev = previous as BlogPost[];
      const next = body.items as BlogPost[];
      const newlyPublished = next.filter((post) => {
        if (post.status !== "published") return false;
        const old = prev.find((p) => p.id === post.id);
        return !old || old.status !== "published";
      });

      for (const post of newlyPublished) {
        await addNotification({
          type: "blog_published",
          title: "Blog post published",
          body: `"${post.title || "Untitled"}" is now live`,
          href: post.slug ? `/blog/${post.slug}` : "/admin/blog",
          meta: { post_id: post.id, slug: post.slug || "" },
        });
      }

      if (!newlyPublished.length) {
        await addNotification({
          type: "content_updated",
          title: "Blog updated",
          body: `${next.length} post${next.length === 1 ? "" : "s"} saved`,
          href: "/admin/blog",
        });
      }
    } else {
      const label = SECTION_LABELS[section] || section;
      await addNotification({
        type: "content_updated",
        title: `${label} updated`,
        body: `${body.items.length} item${body.items.length === 1 ? "" : "s"} saved`,
        href: `/admin/${section === "menu" ? "restaurant" : section}`,
      });
    }
  } catch (notifyErr) {
    console.error("notification failed", notifyErr);
  }

  return NextResponse.json({ section, items });
}
