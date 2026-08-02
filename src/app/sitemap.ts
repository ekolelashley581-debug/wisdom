import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getMenuItems,
  getSpaProducts,
  getSpaServices,
  getStaff,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";
  const [menu, spa, products, posts, staff] = await Promise.all([
    getMenuItems(),
    getSpaServices(),
    getSpaProducts(),
    getBlogPosts(),
    getStaff(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/restaurant`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/spa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/product`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const menuRoutes = menu.map((item) => ({
    url: `${base}/restaurant/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const spaRoutes = spa.map((service) => ({
    url: `${base}/spa/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.published_at ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staffRoutes = staff.map((s) => ({
    url: `${base}/team/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [
    ...staticRoutes,
    ...menuRoutes,
    ...spaRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...staffRoutes,
  ];
}
