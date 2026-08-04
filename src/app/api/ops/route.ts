import { NextResponse } from "next/server";
import {
  addBooking,
  addDelivery,
  addReservation,
  addShopOrder,
  readBookings,
  readDeliveries,
  readReservations,
  readShopOrders,
  updateBooking,
  updateDelivery,
  updateReservation,
  updateShopOrder,
} from "@/lib/ops-store";
import { addNotification } from "@/lib/notification-store";
import type {
  DeliveryOrder,
  ShopOrder,
  SpaBooking,
  TableReservation,
} from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") || "all";

  if (kind === "bookings") {
    return NextResponse.json({ items: await readBookings() });
  }
  if (kind === "deliveries") {
    return NextResponse.json({ items: await readDeliveries() });
  }
  if (kind === "shop") {
    return NextResponse.json({ items: await readShopOrders() });
  }
  if (kind === "reservations") {
    return NextResponse.json({ items: await readReservations() });
  }

  const [bookings, deliveries, shop, reservations] = await Promise.all([
    readBookings(),
    readDeliveries(),
    readShopOrders(),
    readReservations(),
  ]);
  return NextResponse.json({ bookings, deliveries, shop, reservations });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kind = String(body.kind || "");

    if (kind === "booking") {
      const item = body.item as SpaBooking;
      if (!item?.service_name || !item?.date || !item?.time) {
        return NextResponse.json({ error: "Incomplete booking" }, { status: 400 });
      }
      const saved = await addBooking(item);
      await addNotification({
        type: "system",
        title: "New spa booking",
        body: `${saved.customer_name} · ${saved.service_name} · ${saved.date} ${saved.time}`,
        href: "/admin/bookings",
      });
      return NextResponse.json({ item: saved }, { status: 201 });
    }

    if (kind === "delivery") {
      const item = body.item as DeliveryOrder;
      if (!item?.items?.length || !item?.customer_name) {
        return NextResponse.json({ error: "Incomplete order" }, { status: 400 });
      }
      const saved = await addDelivery(item);
      await addNotification({
        type: "system",
        title: "New food order",
        body: `${saved.customer_name} · ${saved.fulfillment} · ${saved.total.toLocaleString()} XAF`,
        href: "/admin/deliveries",
      });
      return NextResponse.json({ item: saved }, { status: 201 });
    }

    if (kind === "shop") {
      const item = body.item as ShopOrder;
      if (!item?.product_name || !item?.customer_name) {
        return NextResponse.json({ error: "Incomplete shop order" }, { status: 400 });
      }
      const saved = await addShopOrder(item);
      await addNotification({
        type: "system",
        title: "New shop order",
        body: `${saved.customer_name} · ${saved.product_name} · ${saved.fulfillment}`,
        href: "/admin/ops",
      });
      return NextResponse.json({ item: saved }, { status: 201 });
    }

    if (kind === "reservation") {
      const item = body.item as TableReservation;
      if (!item?.date || !item?.time || !item?.customer_name) {
        return NextResponse.json({ error: "Incomplete reservation" }, { status: 400 });
      }
      const saved = await addReservation(item);
      await addNotification({
        type: "system",
        title: "New table reservation",
        body: `${saved.customer_name} · ${saved.guests} guests · ${saved.date} ${saved.time}`,
        href: "/admin/ops",
      });
      return NextResponse.json({ item: saved }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const kind = String(body.kind || "");
    const id = String(body.id || "");
    const patch = body.patch || {};
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    if (kind === "booking") {
      const item = await updateBooking(id, patch);
      return item
        ? NextResponse.json({ item })
        : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (kind === "delivery") {
      const item = await updateDelivery(id, patch);
      return item
        ? NextResponse.json({ item })
        : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (kind === "shop") {
      const item = await updateShopOrder(id, patch);
      return item
        ? NextResponse.json({ item })
        : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (kind === "reservation") {
      const item = await updateReservation(id, patch);
      return item
        ? NextResponse.json({ item })
        : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}
