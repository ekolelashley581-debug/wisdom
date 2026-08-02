import type { Metadata } from "next";
import { SpaGrid } from "@/components/spa/SpaGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCategories, getPageCopy, getSpaServices, getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.spa.seo.meta_title,
    description: copy.spa.seo.meta_description,
  };
}

export default async function SpaPage() {
  const [services, categories, settings, copy] = await Promise.all([
    getSpaServices(),
    getCategories("spa"),
    getSettings(),
    getPageCopy(),
  ]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Spa" },
          ]}
        />
        <p className="eyebrow">{copy.spa.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.spa.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.spa.body}</p>
        <SpaGrid
          services={services}
          categories={categories}
          phone={settings.whatsapp_number}
        />
      </div>
    </div>
  );
}
