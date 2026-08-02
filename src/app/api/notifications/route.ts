import { NextResponse } from "next/server";
import {
  addNotification,
  markAllNotificationsRead,
  markNotificationRead,
  readNotifications,
  unreadCount,
} from "@/lib/notification-store";
import type { AdminNotificationType } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  const items = await readNotifications();
  return NextResponse.json({ items, unread: unreadCount(items) });
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as {
      id?: string;
      all?: boolean;
      read?: boolean;
    };

    if (body.all) {
      const count = await markAllNotificationsRead();
      const items = await readNotifications();
      return NextResponse.json({ marked: count, items, unread: unreadCount(items) });
    }

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const item = await markNotificationRead(body.id, body.read !== false);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const items = await readNotifications();
    return NextResponse.json({ item, items, unread: unreadCount(items) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update notifications" }, { status: 500 });
  }
}

/** Optional manual create (admin tools / tests). */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type?: AdminNotificationType;
      title?: string;
      body?: string;
      href?: string;
    };
    if (!body.title || !body.body) {
      return NextResponse.json({ error: "title and body required" }, { status: 400 });
    }
    const item = await addNotification({
      type: body.type || "system",
      title: body.title,
      body: body.body,
      href: body.href,
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create notification" }, { status: 500 });
  }
}
