import { NextResponse } from "next/server";
import { addSubscriber, readSubscribers } from "@/lib/ops-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await readSubscribers();
  return NextResponse.json({
    items,
    active: items.filter((s) => s.active).length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const item = await addSubscriber({
      name: name || "Guest",
      email,
      phone: phone || undefined,
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
