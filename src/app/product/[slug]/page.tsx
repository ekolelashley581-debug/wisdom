import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import {
  getSettings,
  getSpaProductBySlug,
  getSpaProducts,
} from "@/lib/content";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const products = await getSpaProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getSpaProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const [product, settings] = await Promise.all([
    getSpaProductBySlug(params.slug),
    getSettings(),
  ]);
  if (!product) notFound();

  return (
    <div className="bg-primary pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/product" },
            { label: product.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery name={product.name} images={product.images} />
          <div>
            <p className="eyebrow">Spa product</p>
            <h1 className="font-display text-4xl text-white md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 leading-relaxed text-silver-mute">
              {product.description}
            </p>
            <ProductPurchase product={product} phone={settings.whatsapp_number} />
            <Link href="/product" className="btn-outline mt-6 inline-flex">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
