import { NextResponse } from "next/server";
import { readLayouts, writeLayouts } from "@/lib/page-builder-store";
import type { SiteLayouts } from "@/types/page-builder";

export const runtime = "nodejs";

export async function GET() {
  const layouts = await readLayouts();
  return NextResponse.json(layouts);
}

export async function PUT(req: Request) {
  const body = (await req.json()) as SiteLayouts;
  if (!body?.pages?.home) {
    return NextResponse.json({ error: "Invalid layouts payload" }, { status: 400 });
  }
  await writeLayouts(body);
  return NextResponse.json(body);
}
