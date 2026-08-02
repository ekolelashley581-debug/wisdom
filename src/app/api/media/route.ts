import { NextResponse } from "next/server";
import {
  deleteMediaItem,
  readMedia,
  updateMediaItem,
} from "@/lib/site-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await readMedia();
  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const items = await updateMediaItem(id, {
    alt_text: body.alt_text,
    folder: body.folder,
    usage_refs: body.usage_refs,
  });
  return NextResponse.json({ items });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const items = await deleteMediaItem(id);
  return NextResponse.json({ items });
}
