import { promises as fs } from "fs";
import path from "path";
import type {
  MediaItem,
  SiteConfig,
  SiteDesign,
  SiteSettings,
  WhatsAppPaymentConfig,
} from "@/types";
import { settings as seedSettings } from "@/data/seed";
import { defaultDesign, defaultPayments } from "@/lib/site-defaults";

export { defaultDesign, defaultPayments } from "@/lib/site-defaults";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "site-config.json");
const MEDIA_PATH = path.join(DATA_DIR, "media.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export function defaultSiteConfig(): SiteConfig {
  return {
    settings: seedSettings,
    design: defaultDesign,
    payments: defaultPayments,
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function readSiteConfig(): Promise<SiteConfig> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return {
      settings: { ...seedSettings, ...parsed.settings },
      design: { ...defaultDesign, ...parsed.design },
      payments: { ...defaultPayments, ...parsed.payments },
    };
  } catch {
    return defaultSiteConfig();
  }
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

export async function updateSiteSettings(settings: SiteSettings): Promise<SiteConfig> {
  const config = await readSiteConfig();
  config.settings = settings;
  await writeSiteConfig(config);
  return config;
}

export async function updateSiteDesign(design: SiteDesign): Promise<SiteConfig> {
  const config = await readSiteConfig();
  config.design = design;
  await writeSiteConfig(config);
  return config;
}

export async function updatePayments(
  payments: WhatsAppPaymentConfig
): Promise<SiteConfig> {
  const config = await readSiteConfig();
  config.payments = payments;
  await writeSiteConfig(config);
  return config;
}

export async function readMedia(): Promise<MediaItem[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(MEDIA_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MediaItem[]) : [];
  } catch {
    return [];
  }
}

export async function writeMedia(items: MediaItem[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MEDIA_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function addMediaItem(item: MediaItem): Promise<MediaItem[]> {
  const items = await readMedia();
  const next = [item, ...items];
  await writeMedia(next);
  return next;
}

export async function updateMediaItem(
  id: string,
  patch: Partial<MediaItem>
): Promise<MediaItem[]> {
  const items = await readMedia();
  const next = items.map((m) => (m.id === id ? { ...m, ...patch } : m));
  await writeMedia(next);
  return next;
}

export async function deleteMediaItem(id: string): Promise<MediaItem[]> {
  const items = await readMedia();
  const target = items.find((m) => m.id === id);
  const next = items.filter((m) => m.id !== id);
  await writeMedia(next);
  if (target?.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", target.url.replace(/^\//, ""));
    try {
      await fs.unlink(filePath);
    } catch {
      /* ignore missing file */
    }
  }
  return next;
}

export { UPLOADS_DIR };
