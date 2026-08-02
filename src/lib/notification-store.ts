import { promises as fs } from "fs";
import path from "path";
import type { AdminNotification, AdminNotificationType } from "@/types";

const FILE = path.join(process.cwd(), "data", "notifications.json");
const MAX_ITEMS = 200;

async function ensure() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function readNotifications(): Promise<AdminNotification[]> {
  await ensure();
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as AdminNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeNotifications(items: AdminNotification[]) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(items.slice(0, MAX_ITEMS), null, 2) + "\n", "utf8");
}

export async function addNotification(input: {
  type: AdminNotificationType;
  title: string;
  body: string;
  href?: string;
  meta?: Record<string, string>;
}): Promise<AdminNotification> {
  const items = await readNotifications();
  const item: AdminNotification = {
    id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: input.type,
    title: input.title,
    body: input.body,
    href: input.href,
    meta: input.meta,
    read: false,
    created_at: new Date().toISOString(),
  };
  items.unshift(item);
  await writeNotifications(items);
  return item;
}

export async function markNotificationRead(
  id: string,
  read = true
): Promise<AdminNotification | null> {
  const items = await readNotifications();
  const i = items.findIndex((n) => n.id === id);
  if (i < 0) return null;
  items[i] = { ...items[i], read };
  await writeNotifications(items);
  return items[i];
}

export async function markAllNotificationsRead(): Promise<number> {
  const items = await readNotifications();
  let count = 0;
  for (const n of items) {
    if (!n.read) {
      n.read = true;
      count += 1;
    }
  }
  await writeNotifications(items);
  return count;
}

export async function deleteNotification(id: string): Promise<boolean> {
  const items = await readNotifications();
  const next = items.filter((n) => n.id !== id);
  if (next.length === items.length) return false;
  await writeNotifications(next);
  return true;
}

export function unreadCount(items: AdminNotification[]): number {
  return items.filter((n) => !n.read).length;
}
