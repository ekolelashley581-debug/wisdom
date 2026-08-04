"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/** Records a page_view on every public route change. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    trackEvent({
      type: "page_view",
      label: pathname === "/" ? "Home" : pathname,
      path: pathname,
    });
  }, [pathname]);

  return null;
}
