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
  getPageCopy,
} from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { WisdomTriad } from "@/components/home/WisdomTriad";
import { ExperienceSplit } from "@/components/home/ExperienceSplit";
import { ChefsSpecial } from "@/components/home/ChefsSpecial";
import { SpaGlimpse } from "@/components/home/SpaGlimpse";
import { ShopGlimpse } from "@/components/home/ShopGlimpse";
import { Testimonials } from "@/components/home/Testimonials";
import { HoursStrip } from "@/components/home/HoursStrip";
import { NearbyAndMap } from "@/components/home/NearbyAndMap";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: { absolute: copy.home_seo.meta_title },
    description: copy.home_seo.meta_description,
    openGraph: {
      title: copy.home_seo.meta_title,
      description: copy.home_seo.meta_description,
    },
  };
}

export default async function HomePage() {
  const [settings, specials, products, design, copy] = await Promise.all([
    getSettings(),
    getMenuItems({ chefsSpecial: true }),
    getSpaProducts(),
    getDesign(),
    getPageCopy(),
  ]);

  return (
    <>
      <RestaurantJsonLd settings={settings} design={design} />
      <LocalBusinessJsonLd settings={settings} design={design} />
      <Hero design={design} />
      <WisdomTriad design={design} />
      <ExperienceSplit copy={copy.home_discover} />
      <ChefsSpecial items={specials} copy={copy.home_chefs} />
      <SpaGlimpse copy={copy.home_spa_glimpse} />
      <ShopGlimpse products={products} copy={copy.home_shop} />
      <Testimonials copy={copy.home_testimonials} />
      <HoursStrip settings={settings} />
      <NearbyAndMap settings={settings} />
    </>
  );
}
