import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import { mainSrc, thumbSrc } from "@/lib/media-src";
import {
  getSpaServices,
  getStaff,
  getStaffBySlug,
} from "@/lib/content";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const staff = await getStaff({ publishedOnly: false });
  return staff.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = await getStaffBySlug(params.slug);
  if (!person) return { title: "Team member not found" };
  return {
    title: person.meta_title || `${person.name} | WISDOM`,
    description: person.meta_description || person.short_bio || person.bio.slice(0, 155),
    openGraph: {
      title: person.meta_title || person.name,
      description: person.meta_description || person.short_bio,
      images: person.photo_url ? [{ url: person.photo_url }] : undefined,
    },
  };
}

export default async function StaffProfilePage({ params }: Props) {
  const [person, allServices] = await Promise.all([
    getStaffBySlug(params.slug),
    getSpaServices(),
  ]);
  if (!person) notFound();

  const linked = allServices.filter((s) => person.service_slugs.includes(s.slug));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";

  return (
    <div className="bg-primary pt-24">
      <PersonJsonLd
        name={person.name}
        jobTitle={person.role}
        description={person.bio}
        image={person.photo_url || undefined}
        url={`${siteUrl}/team/${person.slug}`}
      />
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Team", href: "/team" },
            { label: person.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <PlaceholderImage
            label={person.name}
            src={mainSrc({ images: [person.photo_url], thumbnail: person.thumbnail })}
            className="rounded-2xl"
          />
          <div>
            <p className="eyebrow">
              {person.department}
              {person.level ? ` · ${person.level}` : ""}
            </p>
            <h1 className="font-display text-4xl text-white md:text-5xl">
              {person.name}
            </h1>
            <p className="mt-2 text-lg text-secondary-glow">{person.role}</p>
            {person.years_experience ? (
              <p className="mt-1 text-sm text-silver-mute">
                {person.years_experience}+ years experience
              </p>
            ) : null}
            <p className="mt-6 leading-relaxed text-silver-mute">{person.bio}</p>

            {person.specialties.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {person.specialties.map((sp) => (
                  <span
                    key={sp}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-silver-light"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            )}

            {linked.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl text-white">Services</h2>
                <ul className="mt-4 space-y-2">
                  {linked.map((svc) => (
                    <li key={svc.id}>
                      <Link
                        href={`/spa/${svc.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-sm text-silver-light transition hover:border-secondary/40"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <PlaceholderImage
                            label={svc.name}
                            src={thumbSrc(svc)}
                            aspect="square"
                            className="rounded-none !aspect-square"
                          />
                        </div>
                        <span>{svc.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/team" className="btn-outline mt-8 inline-flex">
              Back to team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
