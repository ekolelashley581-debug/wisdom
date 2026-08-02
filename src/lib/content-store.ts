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

const DATA_DIR = path.join(process.cwd(), "data");

type CatalogSection = "menu" | "spa" | "products" | "blog" | "staff";

const FILES: Record<CatalogSection, string> = {
  menu: "menu.json",
  spa: "spa.json",
  products: "products.json",
  blog: "blog.json",
  staff: "staff.json",
};

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
  return readJsonFile(FILES.products, seedProducts);
}

export async function writeProducts(items: SpaProduct[]) {
  await writeJsonFile(FILES.products, items);
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
      break;
    case "spa":
      await writeSpa(items as SpaService[]);
      break;
    case "products":
      await writeProducts(items as SpaProduct[]);
      break;
    case "blog":
      await writeBlog(items as BlogPost[]);
      break;
    case "staff":
      await writeStaff(items as StaffMember[]);
      break;
  }
  return items;
}

export function isCatalogSection(value: string): value is CatalogSection {
  return value in FILES;
}
