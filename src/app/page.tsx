import type { Metadata } from "next";
import {
  RestaurantJsonLd,
  LocalBusinessJsonLd,
} from "@/components/seo/JsonLd";
import {
  getMenuItems,
  getSettings,
  getSpaProducts,
  getDesign,
} from "@/lib/content";
import { getLayoutPage } from "@/lib/page-builder-store";
import { PublicPageRenderer } from "@/components/builder/PublicPageRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLayoutPage("home");
  return {
    title: { absolute: page.seo.meta_title },
    description: page.seo.meta_description,
    openGraph: {
      title: page.seo.meta_title,
      description: page.seo.meta_description,
    },
  };
}

export default async function HomePage() {
  const [settings, specials, products, design, layout] = await Promise.all([
    getSettings(),
    getMenuItems({ chefsSpecial: true }),
    getSpaProducts(),
    getDesign(),
    getLayoutPage("home"),
  ]);

  return (
    <>
      <RestaurantJsonLd settings={settings} design={design} />
      <LocalBusinessJsonLd settings={settings} design={design} />
      <PublicPageRenderer
        page={layout}
        design={design}
        settings={settings}
        specials={specials}
        products={products}
      />
    </>
  );
}
