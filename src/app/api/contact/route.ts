import { NextResponse } from "next/server";
import { addMessage, readMessages } from "@/lib/contact-store";
import { addNotification } from "@/lib/notification-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await readMessages();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const item = await addMessage({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    });

    try {
      await addNotification({
        type: "contact_message",
        title: `New message from ${name}`,
        body: subject,
        href: "/admin/messages",
        meta: { message_id: item.id },
      });
    } catch (notifyErr) {
      console.error("notification failed", notifyErr);
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
