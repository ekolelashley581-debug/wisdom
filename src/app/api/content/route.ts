import { NextResponse } from "next/server";
import {
  isCatalogSection,
  readCatalog,
  writeCatalog,
} from "@/lib/content-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") || "menu";
  if (!isCatalogSection(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  const items = await readCatalog(section);
  return NextResponse.json({ section, items });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { section?: string; items?: unknown[] };
  const section = body.section || "";
  if (!isCatalogSection(section) || !Array.isArray(body.items)) {
    return NextResponse.json(
      { error: "Expected { section, items[] }" },
      { status: 400 }
    );
  }
  const items = await writeCatalog(section, body.items);
  return NextResponse.json({ section, items });
}
