import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { PageCopy } from "@/types";

export function ExperienceSplit({ copy }: { copy: PageCopy["home_discover"] }) {
  if (copy.visible === false) return null;
  const cards = (copy.cards || []).filter((c) => c.visible !== false);

  return (
    <section className="section-pad bg-primary bg-marble-subtle">
      <div className="container-wisdom">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="heading-display">{copy.title}</h2>
          <p className="mt-4 text-muted">{copy.body}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const inner = (
              <>
                <div className="overflow-hidden">
                  <PlaceholderImage
                    label={card.title}
                    src={card.media_url || undefined}
                    className="rounded-none image-zoom"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-white transition group-hover:text-secondary-glow">
                    {card.title}
                  </h3>
                  {card.body ? (
                    <p className="mt-2 text-sm text-muted">{card.body}</p>
                  ) : null}
                  {(card.link_label || card.link_url) && (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary-glow">
                      {card.link_label || "Learn more"}{" "}
                      <ArrowRight
                        size={16}
                        className="transition duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  )}
                </div>
              </>
            );

            if (!card.link_url) {
              return (
                <article key={card.id} className="group glass-card block">
                  {inner}
                </article>
              );
            }

            const external = /^https?:\/\//i.test(card.link_url);
            if (external) {
              return (
                <a
                  key={card.id}
                  href={card.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-card block"
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link key={card.id} href={card.link_url} className="group glass-card block">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
