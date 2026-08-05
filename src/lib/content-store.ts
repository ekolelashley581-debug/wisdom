import { promises as fs } from "fs";
import path from "path";
import type { BlogPost, MenuItem, SpaProduct, SpaService, StaffMember } from "@/types";
import {
  menuItems as seedMenu,
  spaServices as seedSpa,
  spaProducts as seedProducts,
  blogPosts as seedBlog,
} from "@/data/seed";
import { seedStaff } from "@/data/staff-seed";
import { createServiceClient } from "@/lib/supabase/admin";

const DATA_DIR = path.join(process.cwd(), "data");
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CatalogSection = "menu" | "spa" | "products" | "blog" | "staff";

const FILES: Record<CatalogSection, string> = {
  menu: "menu.json",
  spa: "spa.json",
  products: "products.json",
  blog: "blog.json",
  staff: "staff.json",
};

function asUuid(id: string) {
  return UUID_RE.test(id) ? id : crypto.randomUUID();
}

function mapProductRow(row: Record<string, unknown>): SpaProduct {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    description: String(row.description || ""),
    sizes: Array.isArray(row.sizes)
      ? (row.sizes as SpaProduct["sizes"])
      : [],
    price: Number(row.price || 0),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    thumbnail: String(row.thumbnail || ""),
    status: row.status === "published" ? "published" : "draft",
    is_available: row.is_available !== false,
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = JSON.parse(raw) as T;
    if (Array.isArray(parsed) && parsed.length === 0) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(file: string, data: unknown) {
  await ensureDataDir();
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export async function readMenu(): Promise<MenuItem[]> {
  return readJsonFile(FILES.menu, seedMenu);
}

export async function writeMenu(items: MenuItem[]) {
  await writeJsonFile(FILES.menu, items);
}

export async function readSpa(): Promise<SpaService[]> {
  return readJsonFile(FILES.spa, seedSpa);
}

export async function writeSpa(items: SpaService[]) {
  await writeJsonFile(FILES.spa, items);
}

export async function readProducts(): Promise<SpaProduct[]> {
  const admin = createServiceClient();
  if (admin) {
    const { data, error } = await admin
      .from("spa_products")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      if (data.length) {
        return data.map((row) => mapProductRow(row as Record<string, unknown>));
      }
      // Empty DB: fall back to seed/file so first load isn't blank
      const fileItems = await readJsonFile(FILES.products, seedProducts);
      return fileItems;
    }
  }
  return readJsonFile(FILES.products, seedProducts);
}

export async function writeProducts(items: SpaProduct[]): Promise<SpaProduct[]> {
  const normalized = items.map((p) => ({
    ...p,
    id: asUuid(p.id),
    thumbnail: p.thumbnail || "",
    images: p.images || [],
    is_available: p.is_available !== false,
  }));

  const admin = createServiceClient();
  if (admin) {
    const rows = normalized.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      sizes: p.sizes,
      price: p.price,
      images: p.images,
      thumbnail: p.thumbnail || "",
      status: p.status,
      is_available: p.is_available !== false,
      updated_at: new Date().toISOString(),
    }));

    const { data: existing } = await admin.from("spa_products").select("id");
    const keep = new Set(rows.map((r) => r.id));
    const toDelete = (existing || [])
      .map((e) => String(e.id))
      .filter((id) => !keep.has(id));
    if (toDelete.length) {
      const { error: delErr } = await admin
        .from("spa_products")
        .delete()
        .in("id", toDelete);
      if (delErr) throw new Error(delErr.message);
    }

    if (rows.length) {
      const { error } = await admin
        .from("spa_products")
        .upsert(rows, { onConflict: "id" });
      if (error) throw new Error(error.message);
    }

    await writeJsonFile(FILES.products, normalized);
    return normalized;
  }

  await writeJsonFile(FILES.products, normalized);
  return normalized;
}

export async function readBlog(): Promise<BlogPost[]> {
  return readJsonFile(FILES.blog, seedBlog);
}

export async function writeBlog(items: BlogPost[]) {
  await writeJsonFile(FILES.blog, items);
}

export async function readStaff(): Promise<StaffMember[]> {
  return readJsonFile(FILES.staff, seedStaff);
}

export async function writeStaff(items: StaffMember[]) {
  await writeJsonFile(FILES.staff, items);
}

export async function readCatalog(section: CatalogSection) {
  switch (section) {
    case "menu":
      return readMenu();
    case "spa":
      return readSpa();
    case "products":
      return readProducts();
    case "blog":
      return readBlog();
    case "staff":
      return readStaff();
  }
}

export async function writeCatalog(section: CatalogSection, items: unknown[]) {
  switch (section) {
    case "menu":
      await writeMenu(items as MenuItem[]);
      return items;
    case "spa":
      await writeSpa(items as SpaService[]);
      return items;
    case "products":
      return writeProducts(items as SpaProduct[]);
    case "blog":
      await writeBlog(items as BlogPost[]);
      return items;
    case "staff":
      await writeStaff(items as StaffMember[]);
      return items;
  }
}

export function isCatalogSection(value: string): value is CatalogSection {
  return value in FILES;
}
