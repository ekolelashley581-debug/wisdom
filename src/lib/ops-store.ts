import { promises as fs } from "fs";
import path from "path";
import type {
  BlogSubscriber,
  DeliveryOrder,
  ShopOrder,
  SpaBooking,
  TableReservation,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const full = path.join(DATA_DIR, file);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(full, "utf8");
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf8"
  );
}

export async function readBookings(): Promise<SpaBooking[]> {
  return readJson("bookings.json", []);
}

export async function addBooking(b: SpaBooking): Promise<SpaBooking> {
  const list = await readBookings();
  list.unshift(b);
  await writeJson("bookings.json", list);
  return b;
}

export async function updateBooking(
  id: string,
  patch: Partial<SpaBooking>
): Promise<SpaBooking | null> {
  const list = await readBookings();
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  await writeJson("bookings.json", list);
  return list[i];
}

export async function readDeliveries(): Promise<DeliveryOrder[]> {
  return readJson("deliveries.json", []);
}

export async function addDelivery(o: DeliveryOrder): Promise<DeliveryOrder> {
  const list = await readDeliveries();
  list.unshift(o);
  await writeJson("deliveries.json", list);
  return o;
}

export async function updateDelivery(
  id: string,
  patch: Partial<DeliveryOrder>
): Promise<DeliveryOrder | null> {
  const list = await readDeliveries();
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, updated_at: new Date().toISOString() };
  await writeJson("deliveries.json", list);
  return list[i];
}

export async function readShopOrders(): Promise<ShopOrder[]> {
  return readJson("shop-orders.json", []);
}

export async function addShopOrder(o: ShopOrder): Promise<ShopOrder> {
  const list = await readShopOrders();
  list.unshift(o);
  await writeJson("shop-orders.json", list);
  return o;
}

export async function updateShopOrder(
  id: string,
  patch: Partial<ShopOrder>
): Promise<ShopOrder | null> {
  const list = await readShopOrders();
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, updated_at: new Date().toISOString() };
  await writeJson("shop-orders.json", list);
  return list[i];
}

export async function readReservations(): Promise<TableReservation[]> {
  return readJson("reservations.json", []);
}

export async function addReservation(
  r: TableReservation
): Promise<TableReservation> {
  const list = await readReservations();
  list.unshift(r);
  await writeJson("reservations.json", list);
  return r;
}

export async function updateReservation(
  id: string,
  patch: Partial<TableReservation>
): Promise<TableReservation | null> {
  const list = await readReservations();
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  await writeJson("reservations.json", list);
  return list[i];
}

export async function readSubscribers(): Promise<BlogSubscriber[]> {
  return readJson("blog-subscribers.json", []);
}

export async function addSubscriber(
  input: Omit<BlogSubscriber, "id" | "created_at" | "active">
): Promise<BlogSubscriber> {
  const list = await readSubscribers();
  const email = input.email.trim().toLowerCase();
  const existing = list.find((s) => s.email === email);
  if (existing) {
    existing.active = true;
    existing.name = input.name || existing.name;
    existing.phone = input.phone || existing.phone;
    await writeJson("blog-subscribers.json", list);
    return existing;
  }
  const sub: BlogSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name,
    email,
    phone: input.phone,
    created_at: new Date().toISOString(),
    active: true,
  };
  list.unshift(sub);
  await writeJson("blog-subscribers.json", list);
  return sub;
}

export function calcDeliveryFee(
  km: number,
  base: number,
  perKm: number
): number {
  if (km <= 0) return base;
  return base + Math.ceil(km) * perKm;
}
