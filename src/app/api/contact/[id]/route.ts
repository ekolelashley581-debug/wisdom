import { NextResponse } from "next/server";
import { deleteMessage, updateMessage } from "@/lib/contact-store";
import type { ContactStatus } from "@/types";

export const runtime = "nodejs";

const STATUSES: ContactStatus[] = ["new", "read", "replied", "archived"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const patch: { status?: ContactStatus; notes?: string } = {};
    if (body.status && STATUSES.includes(body.status)) {
      patch.status = body.status;
    }
    if (typeof body.notes === "string") patch.notes = body.notes;
    const item = await updateMessage(params.id, patch);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ok = await deleteMessage(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
