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
import { createServiceClient } from "@/lib/supabase/admin";

export { defaultDesign, defaultPayments } from "@/lib/site-defaults";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "site-config.json");
const MEDIA_PATH = path.join(DATA_DIR, "media.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const BUCKET = "media";

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

function mapMediaRow(row: Record<string, unknown>): MediaItem {
  return {
    id: String(row.id),
    url: String(row.url),
    name: String(row.name || ""),
    alt_text: String(row.alt_text || ""),
    folder: String(row.folder || "general"),
    size: Number(row.size || 0),
    created_at: String(row.created_at || new Date().toISOString()),
    usage_refs: Array.isArray(row.usage_refs)
      ? (row.usage_refs as string[])
      : [],
    kind: row.kind === "video" ? "video" : "image",
  };
}

async function readMediaFromFile(): Promise<MediaItem[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(MEDIA_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MediaItem[]) : [];
  } catch {
    return [];
  }
}

async function writeMediaToFile(items: MediaItem[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MEDIA_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function readMedia(): Promise<MediaItem[]> {
  const admin = createServiceClient();
  if (admin) {
    const { data, error } = await admin
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((row) => mapMediaRow(row as Record<string, unknown>));
    }
  }
  return readMediaFromFile();
}

export async function writeMedia(items: MediaItem[]): Promise<void> {
  await writeMediaToFile(items);
}

export async function addMediaItem(item: MediaItem): Promise<MediaItem[]> {
  const admin = createServiceClient();
  if (admin) {
    const { error } = await admin.from("media").insert({
      id: item.id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
        ? item.id
        : crypto.randomUUID(),
      url: item.url,
      name: item.name,
      alt_text: item.alt_text,
      folder: item.folder,
      size: item.size,
      kind: item.kind || "image",
      usage_refs: item.usage_refs,
      created_at: item.created_at,
    });
    if (error) {
      console.error("media insert failed", error);
      throw new Error(error.message);
    }
    return readMedia();
  }

  const items = await readMediaFromFile();
  const next = [item, ...items];
  await writeMediaToFile(next);
  return next;
}

export async function updateMediaItem(
  id: string,
  patch: Partial<MediaItem>
): Promise<MediaItem[]> {
  const admin = createServiceClient();
  if (admin) {
    const { error } = await admin
      .from("media")
      .update({
        alt_text: patch.alt_text,
        folder: patch.folder,
        usage_refs: patch.usage_refs,
        name: patch.name,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return readMedia();
  }

  const items = await readMediaFromFile();
  const next = items.map((m) => (m.id === id ? { ...m, ...patch } : m));
  await writeMediaToFile(next);
  return next;
}

function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function deleteMediaItem(id: string): Promise<MediaItem[]> {
  const admin = createServiceClient();
  if (admin) {
    const { data: existing } = await admin
      .from("media")
      .select("url")
      .eq("id", id)
      .maybeSingle();

    await admin.from("media").delete().eq("id", id);

    const objectPath = existing?.url
      ? storagePathFromUrl(String(existing.url))
      : null;
    if (objectPath) {
      await admin.storage.from(BUCKET).remove([objectPath]);
    }
    return readMedia();
  }

  const items = await readMediaFromFile();
  const target = items.find((m) => m.id === id);
  const next = items.filter((m) => m.id !== id);
  await writeMediaToFile(next);
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
