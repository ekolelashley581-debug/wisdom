import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPageCopy, getSettings, getSpaProducts } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.product.seo.meta_title,
    description: copy.product.seo.meta_description,
  };
}

export default async function ProductsPage() {
  const [products, settings, copy] = await Promise.all([
    getSpaProducts(),
    getSettings(),
    getPageCopy(),
  ]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop" },
          ]}
        />
        <p className="eyebrow">{copy.product.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.product.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.product.body}</p>
        <ProductGrid products={products} phone={settings.whatsapp_number} />
      </div>
    </div>
  );
}
