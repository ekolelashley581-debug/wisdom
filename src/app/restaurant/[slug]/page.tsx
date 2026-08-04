import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { DeliveryOrderForm } from "@/components/restaurant/DeliveryOrderForm";
import { getMenuItemBySlug, getMenuItems, getSettings } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { mainSrc } from "@/lib/media-src";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const items = await getMenuItems();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getMenuItemBySlug(params.slug);
  if (!item) return { title: "Item not found" };
  return {
    title: item.name,
    description: item.description.slice(0, 155),
    openGraph: { title: item.name, description: item.description },
  };
}

export default async function MenuItemPage({ params }: Props) {
  const [item, settings] = await Promise.all([
    getMenuItemBySlug(params.slug),
    getSettings(),
  ]);
  if (!item) notFound();

  return (
    <div className="bg-primary pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Restaurant", href: "/restaurant" },
            { label: item.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <PlaceholderImage
            label={item.name}
            src={mainSrc(item)}
            className="rounded-2xl"
          />
          <div>
            {item.is_chefs_special && (
              <span className="mb-3 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-glow">
                Chef&apos;s Special
              </span>
            )}
            <h1 className="font-display text-4xl text-white md:text-5xl">{item.name}</h1>
            <p className="mt-3 text-2xl font-semibold text-secondary-glow">
              {formatPrice(item.price)}
            </p>
            <p className="mt-6 leading-relaxed text-silver-mute">{item.description}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-silver-dark">
                  Prep time
                </dt>
                <dd className="mt-1 text-sm text-silver-light">{item.prep_time || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-silver-dark">
                  Spice level
                </dt>
                <dd className="mt-1 text-sm text-silver-light">
                  {item.spice_level === 0
                    ? "Mild"
                    : `${"●".repeat(item.spice_level)}${"○".repeat(5 - item.spice_level)} (${item.spice_level}/5)`}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-silver-dark">
                  Ingredients
                </dt>
                <dd className="mt-1 text-sm text-silver-light">
                  {item.ingredients.join(", ") || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-silver-dark">
                  Allergens
                </dt>
                <dd className="mt-1 text-sm text-silver-light">
                  {item.allergens.length ? item.allergens.join(", ") : "None listed"}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link href="/restaurant" className="btn-outline">
                Back to Menu
              </Link>
            </div>

            <div id="order">
              <DeliveryOrderForm
                item={item}
                phone={settings.whatsapp_number}
                deliveryFeeBase={settings.delivery_fee_base ?? 1000}
                deliveryFeePerKm={settings.delivery_fee_per_km ?? 200}
                minOrder={settings.min_order ?? 5000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
