import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { thumbSrc } from "@/lib/media-src";
import { getPageCopy, getStaff } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.team.seo.meta_title,
    description: copy.team.seo.meta_description,
    openGraph: {
      title: copy.team.seo.meta_title,
      description: copy.team.seo.meta_description,
    },
  };
}

export default async function TeamPage() {
  const [copy, staff] = await Promise.all([getPageCopy(), getStaff()]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Team" },
          ]}
        />
        <p className="eyebrow">{copy.team.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.team.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.team.body}</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Link
              key={s.id}
              href={`/team/${s.slug}`}
              className="group glass-card overflow-hidden"
            >
              <PlaceholderImage
                label={s.name}
                src={thumbSrc({ thumbnail: s.thumbnail, images: [s.photo_url] })}
                className="rounded-none image-zoom"
              />
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-glow">
                  {s.department}
                  {s.level ? ` · ${s.level}` : ""}
                </p>
                <h2 className="mt-1 font-display text-xl text-white transition group-hover:text-secondary-glow">
                  {s.name}
                </h2>
                <p className="mt-1 text-sm text-silver-mute">{s.role}</p>
                <p className="mt-3 line-clamp-2 text-sm text-silver-dark">
                  {s.short_bio || s.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!staff.length && (
          <p className="text-sm text-silver-mute">Team profiles coming soon.</p>
        )}
      </div>
    </div>
  );
}
