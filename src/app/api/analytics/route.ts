import { NextResponse } from "next/server";
import {
  addAnalyticsEvent,
  clearAnalytics,
  readAnalytics,
  summarizeAnalytics,
} from "@/lib/analytics-store";
import type { AnalyticsEvent } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.min(60, Math.max(7, Number(searchParams.get("days") || 14)));
  const events = await readAnalytics();
  const stats = summarizeAnalytics(events, days);
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AnalyticsEvent>;
    const type = body.type;
    if (
      !type ||
      ![
        "page_view",
        "whatsapp_click",
        "booking_start",
        "order_start",
        "reservation_start",
      ].includes(type)
    ) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const event = await addAnalyticsEvent({
      type,
      label: String(body.label || type).slice(0, 200),
      path: String(body.path || "/").slice(0, 300),
      meta: body.meta,
      visitor_id: body.visitor_id ? String(body.visitor_id).slice(0, 80) : undefined,
    });
    return NextResponse.json({ item: event }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAnalytics();
  return NextResponse.json({ ok: true });
}
