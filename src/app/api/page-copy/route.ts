import { NextResponse } from "next/server";
import { readPageCopy, writePageCopy } from "@/lib/page-copy";
import type { PageCopy } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  const copy = await readPageCopy();
  return NextResponse.json(copy);
}

export async function PUT(req: Request) {
  const body = (await req.json()) as PageCopy;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await writePageCopy(body);
  return NextResponse.json(body);
}
