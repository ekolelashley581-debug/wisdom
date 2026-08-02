import Link from "next/link";
import { Play } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { PageCopy } from "@/types";

export function SpaGlimpse({ copy }: { copy: PageCopy["home_spa_glimpse"] }) {
  if (copy.visible === false) return null;
  const cards = (copy.cards || []).filter((c) => c.visible !== false);
  const ctaHref = copy.cta_link || "/spa";

  return (
    <section id="spa-glimpse" className="section-pad relative overflow-hidden bg-surface">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-silver/5 blur-3xl" />

      <div className="container-wisdom relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="heading-display !text-4xl md:!text-5xl">{copy.title}</h2>
            <p className="mt-4 text-muted">{copy.body}</p>
          </div>
          <Link href={ctaHref} className="btn-outline hover:scale-[1.03]">
            {copy.cta || "Book a session"}
          </Link>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
          <PlaceholderImage
            label="Spa ambient"
            src={copy.image_url || undefined}
            aspect="wide"
            variant={copy.image_url ? "image" : "video"}
            className="rounded-none min-h-[220px] md:min-h-[320px]"
            autoPlay
          />
        </div>

        {cards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((m) => {
              const content = (
                <>
                  <div className="overflow-hidden">
                    <PlaceholderImage
                      label={m.title}
                      src={m.media_url || undefined}
                      className="rounded-none image-zoom !aspect-[4/3]"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{m.title}</p>
                      {m.note ? (
                        <p className="text-xs text-secondary-glow">{m.note}</p>
                      ) : null}
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-silver/25 text-silver transition group-hover:border-secondary-glow group-hover:text-secondary-glow">
                      <Play size={12} fill="currentColor" />
                    </span>
                  </div>
                </>
              );

              if (!m.link_url) {
                return (
                  <article
                    key={m.id}
                    className="group dark-panel overflow-hidden rounded-2xl transition duration-500 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-teal-glow"
                  >
                    {content}
                  </article>
                );
              }

              return (
                <Link
                  key={m.id}
                  href={m.link_url}
                  className="group dark-panel overflow-hidden rounded-2xl transition duration-500 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-teal-glow"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
