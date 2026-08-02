import { promises as fs } from "fs";
import path from "path";
import type { ContactMessage, ContactStatus } from "@/types";

const FILE = path.join(process.cwd(), "data", "contact-messages.json");

async function ensure() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  await ensure();
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as ContactMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeMessages(items: ContactMessage[]) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export async function addMessage(
  input: Omit<ContactMessage, "id" | "status" | "created_at">
): Promise<ContactMessage> {
  const items = await readMessages();
  const msg: ContactMessage = {
    ...input,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "new",
    created_at: new Date().toISOString(),
  };
  items.unshift(msg);
  await writeMessages(items);
  return msg;
}

export async function updateMessage(
  id: string,
  patch: Partial<Pick<ContactMessage, "status" | "notes">>
): Promise<ContactMessage | null> {
  const items = await readMessages();
  const i = items.findIndex((m) => m.id === id);
  if (i < 0) return null;
  items[i] = { ...items[i], ...patch };
  await writeMessages(items);
  return items[i];
}

export async function deleteMessage(id: string): Promise<boolean> {
  const items = await readMessages();
  const next = items.filter((m) => m.id !== id);
  if (next.length === items.length) return false;
  await writeMessages(next);
  return true;
}

export const CONTACT_STATUSES: ContactStatus[] = [
  "new",
  "read",
  "replied",
  "archived",
];
