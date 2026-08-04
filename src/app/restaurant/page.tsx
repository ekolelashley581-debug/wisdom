import type { Metadata } from "next";
import { MenuGrid } from "@/components/restaurant/MenuGrid";
import { ReservationForm } from "@/components/restaurant/ReservationForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCategories, getMenuItems, getPageCopy, getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.restaurant.seo.meta_title,
    description: copy.restaurant.seo.meta_description,
  };
}

export default async function RestaurantPage() {
  const [items, categories, settings, copy] = await Promise.all([
    getMenuItems(),
    getCategories("restaurant"),
    getSettings(),
    getPageCopy(),
  ]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Restaurant" },
          ]}
        />
        <p className="eyebrow">{copy.restaurant.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.restaurant.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.restaurant.body}</p>
        <p className="mb-8 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-silver-light">
          Delivery: {settings.delivery_radius}. Min order{" "}
          {settings.min_order.toLocaleString("en-US")} XAF. Delivery fee from{" "}
          {(settings.delivery_fee_base ?? 1000).toLocaleString("en-US")} XAF +{" "}
          {(settings.delivery_fee_per_km ?? 200).toLocaleString("en-US")} XAF/km.
        </p>

        <div className="mb-12">
          <ReservationForm phone={settings.whatsapp_number} />
        </div>

        <MenuGrid items={items} categories={categories} />
      </div>
    </div>
  );
}
