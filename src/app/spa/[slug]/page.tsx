import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BookingForm } from "@/components/spa/BookingForm";
import {
  getSpaServiceBySlug,
  getSpaServices,
  getSettings,
  getStaffForService,
} from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { mainSrc, thumbSrc } from "@/lib/media-src";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const services = await getSpaServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getSpaServiceBySlug(params.slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.description.slice(0, 155),
  };
}

export default async function SpaServicePage({ params }: Props) {
  const [service, settings, staff] = await Promise.all([
    getSpaServiceBySlug(params.slug),
    getSettings(),
    getStaffForService(params.slug),
  ]);
  if (!service) notFound();

  const levels = [
    { key: "junior" as const, label: "Junior" },
    { key: "senior" as const, label: "Senior" },
    { key: "master" as const, label: "Master" },
  ];

  return (
    <div className="bg-primary pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Spa", href: "/spa" },
            { label: service.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <PlaceholderImage
            label={service.name}
            src={mainSrc(service)}
            className="rounded-2xl"
          />
          <div>
            {service.is_package && (
              <span className="mb-3 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-glow">
                Package
              </span>
            )}
            <h1 className="font-display text-4xl text-white md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-2 text-sm text-silver-mute">Duration: {service.duration}</p>
            <p className="mt-6 leading-relaxed text-silver-mute">{service.description}</p>

            <h2 className="mt-8 font-display text-xl text-white">Pricing by stylist</h2>
            <ul className="mt-4 space-y-2">
              {levels.map((level) => (
                <li
                  key={level.key}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-sm text-silver-light transition hover:border-secondary/40"
                >
                  <span>{level.label}</span>
                  <span className="font-semibold text-secondary-glow">
                    {formatPrice(service.price_by_level[level.key])}
                  </span>
                </li>
              ))}
            </ul>

            {staff.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-white">Who performs this</h2>
                <p className="mt-1 text-sm text-silver-mute">
                  Learn more about the people behind this service.
                </p>
                <ul className="mt-4 space-y-2">
                  {staff.map((person) => (
                    <li key={person.id}>
                      <Link
                        href={`/team/${person.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition hover:border-secondary/40"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <PlaceholderImage
                            label={person.name}
                            src={thumbSrc({
                              thumbnail: person.thumbnail,
                              images: [person.photo_url],
                            })}
                            aspect="square"
                            className="rounded-none !aspect-square"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{person.name}</p>
                          <p className="text-xs text-secondary-glow">
                            {person.role}
                            {person.level ? ` · ${person.level}` : ""}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <BookingForm service={service} phone={settings.whatsapp_number} />

            <Link href="/spa" className="btn-outline mt-6 inline-flex">
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
