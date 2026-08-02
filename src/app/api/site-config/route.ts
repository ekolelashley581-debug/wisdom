import { NextResponse } from "next/server";
import {
  readSiteConfig,
  updatePayments,
  updateSiteDesign,
  updateSiteSettings,
  writeSiteConfig,
} from "@/lib/site-store";
import type { SiteConfig } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  const config = await readSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<SiteConfig> & { section?: string };
  const section = body.section;

  if (section === "settings" && body.settings) {
    const config = await updateSiteSettings(body.settings);
    return NextResponse.json(config);
  }
  if (section === "design" && body.design) {
    const config = await updateSiteDesign(body.design);
    return NextResponse.json(config);
  }
  if (section === "payments" && body.payments) {
    const config = await updatePayments(body.payments);
    return NextResponse.json(config);
  }

  // Full replace if complete payload
  if (body.settings && body.design && body.payments) {
    const config: SiteConfig = {
      settings: body.settings,
      design: body.design,
      payments: body.payments,
    };
    await writeSiteConfig(config);
    return NextResponse.json(config);
  }

  const current = await readSiteConfig();
  return NextResponse.json(current);
}
