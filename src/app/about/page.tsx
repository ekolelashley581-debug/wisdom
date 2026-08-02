import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AboutPageJsonLd } from "@/components/seo/JsonLd";
import { thumbSrc } from "@/lib/media-src";
import { getPageCopy, getSettings, getStaff } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.about.seo.meta_title,
    description: copy.about.seo.meta_description,
    openGraph: {
      title: copy.about.seo.meta_title,
      description: copy.about.seo.meta_description,
    },
  };
}

export default async function AboutPage() {
  const [copy, settings, staff] = await Promise.all([
    getPageCopy(),
    getSettings(),
    getStaff(),
  ]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <AboutPageJsonLd settings={settings} description={copy.about.seo.meta_description} />
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />
        <p className="eyebrow">{copy.about.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.about.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.about.body}</p>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-white">Our story</h2>
              <p className="mt-3 leading-relaxed text-silver-mute">{copy.about.story}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-white">Mission</h2>
              <p className="mt-3 leading-relaxed text-silver-mute">{copy.about.mission}</p>
            </div>
            <Link href="/team" className="btn-primary inline-flex">
              Meet the team
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {staff.slice(0, 4).map((s) => (
              <Link
                key={s.id}
                href={`/team/${s.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 transition hover:border-secondary/40"
              >
                <PlaceholderImage
                  label={s.name}
                  src={thumbSrc({ thumbnail: s.thumbnail, images: [s.photo_url] })}
                  aspect="square"
                  className="rounded-none image-zoom"
                />
                <div className="p-3">
                  <p className="font-display text-lg text-white group-hover:text-secondary-glow">
                    {s.name}
                  </p>
                  <p className="text-xs text-silver-mute">{s.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
