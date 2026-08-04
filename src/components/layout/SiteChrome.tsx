"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/WhatsAppFloat";
import { Chatbot } from "@/components/chat/Chatbot";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import type { SiteSettings, SiteDesign } from "@/types";

export function SiteChrome({
  children,
  settings,
  design,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  design: SiteDesign;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageViewTracker />
      <Header
        logoUrl={design.logo_url}
        restaurantCta={design.restaurant_cta}
        spaCta={design.spa_cta}
        phone={settings.whatsapp_number}
        settings={settings}
      />
      <main>{children}</main>
      <Footer settings={settings} design={design} />
      <Chatbot />
      <BackToTop />
    </>
  );
}
