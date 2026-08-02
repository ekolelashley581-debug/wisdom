import type {
  Category,
  MenuItem,
  SpaService,
  SpaProduct,
  SiteSettings,
} from "@/types";
import type { BlogPost, FaqItem } from "@/types";
import {
  categories as seedCategories,
  menuItems as seedMenuItems,
  spaServices as seedSpaServices,
  spaProducts as seedSpaProducts,
  settings as seedSettings,
  blogPosts as seedBlogPosts,
  faqs as seedFaqs,
} from "@/data/seed";
import { createClient } from "@/lib/supabase/server";
import { readSiteConfig } from "@/lib/site-store";
import {
  readBlog,
  readMenu,
  readProducts,
  readSpa,
  readStaff,
} from "@/lib/content-store";
import { readPageCopy } from "@/lib/page-copy";
import type { SiteConfig, SiteDesign, StaffMember, PageCopy } from "@/types";

export async function getSiteConfig(): Promise<SiteConfig> {
  return readSiteConfig();
}

export async function getDesign(): Promise<SiteDesign> {
  const config = await readSiteConfig();
  return config.design;
}

export async function getPageCopy(): Promise<PageCopy> {
  return readPageCopy();
}

export async function getStaff(opts?: {
  publishedOnly?: boolean;
  department?: StaffMember["department"];
}): Promise<StaffMember[]> {
  const publishedOnly = opts?.publishedOnly !== false;
  let items = await readStaff();
  if (publishedOnly) items = items.filter((s) => s.status === "published");
  if (opts?.department) {
    items = items.filter((s) => s.department === opts.department);
  }
  return items.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getStaffBySlug(slug: string): Promise<StaffMember | null> {
  const items = await getStaff({ publishedOnly: true });
  return items.find((s) => s.slug === slug) ?? null;
}

export async function getStaffForService(serviceSlug: string): Promise<StaffMember[]> {
  const items = await getStaff({ publishedOnly: true });
  return items.filter((s) => s.service_slugs.includes(serviceSlug));
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const fileConfig = await readSiteConfig();
    const supabase = createClient();
    if (!supabase) return fileConfig.settings;

    const { data, error } = await supabase.from("settings").select("key, value");
    if (error || !data?.length) return fileConfig.settings;

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
    return {
      ...fileConfig.settings,
      whatsapp_number: map.whatsapp_number ?? fileConfig.settings.whatsapp_number,
      delivery_radius: map.delivery_radius ?? fileConfig.settings.delivery_radius,
      min_order: Number(map.min_order ?? fileConfig.settings.min_order),
      address: map.address ?? fileConfig.settings.address,
      maps_query: map.maps_query ?? fileConfig.settings.maps_query,
      email: map.email ?? fileConfig.settings.email,
      tagline: map.tagline ?? fileConfig.settings.tagline,
      opening_hours: map.opening_hours
        ? JSON.parse(map.opening_hours)
        : fileConfig.settings.opening_hours,
      social_links: map.social_links
        ? JSON.parse(map.social_links)
        : fileConfig.settings.social_links,
    };
  } catch {
    return seedSettings;
  }
}

export async function getCategories(type?: "restaurant" | "spa"): Promise<Category[]> {
  try {
    const supabase = createClient();
    if (!supabase) {
      return type
        ? seedCategories.filter((c) => c.type === type)
        : seedCategories;
    }
    let query = supabase.from("categories").select("*").order("sort_order");
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error || !data?.length) {
      return type
        ? seedCategories.filter((c) => c.type === type)
        : seedCategories;
    }
    return data as Category[];
  } catch {
    return type
      ? seedCategories.filter((c) => c.type === type)
      : seedCategories;
  }
}

export async function getMenuItems(opts?: {
  categoryId?: string;
  chefsSpecial?: boolean;
  publishedOnly?: boolean;
}): Promise<MenuItem[]> {
  const publishedOnly = opts?.publishedOnly !== false;
  try {
    const fileItems = await readMenu();
    const supabase = createClient();
    let items = fileItems.length ? fileItems : seedMenuItems;

    if (supabase) {
      let query = supabase.from("menu_items").select("*");
      if (publishedOnly) query = query.eq("status", "published");
      if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
      if (opts?.chefsSpecial) query = query.eq("is_chefs_special", true);
      const { data, error } = await query;
      if (!error && data?.length) items = data as MenuItem[];
    }

    if (publishedOnly) items = items.filter((i) => i.status === "published");
    if (opts?.categoryId) items = items.filter((i) => i.category_id === opts.categoryId);
    if (opts?.chefsSpecial) items = items.filter((i) => i.is_chefs_special);
    return items;
  } catch {
    let items = seedMenuItems;
    if (publishedOnly) items = items.filter((i) => i.status === "published");
    if (opts?.categoryId) items = items.filter((i) => i.category_id === opts.categoryId);
    if (opts?.chefsSpecial) items = items.filter((i) => i.is_chefs_special);
    return items;
  }
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const items = await getMenuItems({ publishedOnly: true });
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getSpaServices(opts?: {
  categoryId?: string;
  packagesOnly?: boolean;
  publishedOnly?: boolean;
}): Promise<SpaService[]> {
  const publishedOnly = opts?.publishedOnly !== false;
  try {
    const fileItems = await readSpa();
    const supabase = createClient();
    let items = fileItems.length ? fileItems : seedSpaServices;

    if (supabase) {
      let query = supabase.from("spa_services").select("*");
      if (publishedOnly) query = query.eq("status", "published");
      if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
      if (opts?.packagesOnly) query = query.eq("is_package", true);
      const { data, error } = await query;
      if (!error && data?.length) items = data as SpaService[];
    }

    if (publishedOnly) items = items.filter((i) => i.status === "published");
    if (opts?.categoryId) items = items.filter((i) => i.category_id === opts.categoryId);
    if (opts?.packagesOnly) items = items.filter((i) => i.is_package);
    return items;
  } catch {
    let items = seedSpaServices;
    if (publishedOnly) items = items.filter((i) => i.status === "published");
    if (opts?.categoryId) items = items.filter((i) => i.category_id === opts.categoryId);
    if (opts?.packagesOnly) items = items.filter((i) => i.is_package);
    return items;
  }
}

export async function getSpaServiceBySlug(slug: string): Promise<SpaService | null> {
  const items = await getSpaServices({ publishedOnly: true });
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getSpaProducts(): Promise<SpaProduct[]> {
  try {
    const fileItems = await readProducts();
    let items = fileItems.length ? fileItems : seedSpaProducts;
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("spa_products")
        .select("*")
        .eq("status", "published");
      if (!error && data?.length) items = data as SpaProduct[];
    }
    return items.filter((p) => p.status === "published");
  } catch {
    return seedSpaProducts.filter((p) => p.status === "published");
  }
}

export async function getSpaProductBySlug(slug: string): Promise<SpaProduct | null> {
  const products = await getSpaProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

function isBlogLive(post: BlogPost, now = new Date()): boolean {
  if (post.status !== "published") {
    if (post.scheduled_at && new Date(post.scheduled_at) <= now) return true;
    return false;
  }
  if (post.published_at && new Date(post.published_at) > now) return false;
  return true;
}

export async function getBlogPosts(opts?: {
  category?: string;
  includeScheduled?: boolean;
}): Promise<BlogPost[]> {
  try {
    const filePosts = await readBlog();
    let posts = filePosts.length ? filePosts : seedBlogPosts;
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("blog_posts").select("*");
      if (!error && data?.length) posts = data as BlogPost[];
    }
    const now = new Date();
    let list = opts?.includeScheduled
      ? posts
      : posts.filter((p) => isBlogLive(p, now));
    if (opts?.category && opts.category !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === opts.category!.toLowerCase()
      );
    }
    return list.sort((a, b) => {
      const da = a.published_at ?? a.created_at;
      const db = b.published_at ?? b.created_at;
      return new Date(db).getTime() - new Date(da).getTime();
    });
  } catch {
    return seedBlogPosts.filter((p) => isBlogLive(p));
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export async function getFaqs(): Promise<FaqItem[]> {
  return seedFaqs;
}
