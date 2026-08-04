import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lock /admin/* to ADMIN_ALLOWED_IPS (comma-separated).
 * Unmatched IPs get a 404 (looks like the page does not exist).
 *
 * Note: 192.168.x.x only works on your local network.
 * On Vercel, set your public IP (whatismyip) in ADMIN_ALLOWED_IPS.
 * Leave ADMIN_ALLOWED_IPS empty to disable the lock.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const raw = process.env.ADMIN_ALLOWED_IPS || "";
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.length === 0) {
    return NextResponse.next();
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "";

  const alwaysOk = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
  if (alwaysOk.has(ip) || allowed.includes(ip)) {
    return NextResponse.next();
  }

  // Soft-allow empty IP in local `next start` without proxy headers when
  // the allowlist only contains LAN IPs — still block unknown public IPs.
  if (!ip && process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const deny = request.nextUrl.clone();
  deny.pathname = "/admin-denied";
  return NextResponse.rewrite(deny);
}

export const config = {
  matcher: ["/admin/:path*"],
};
