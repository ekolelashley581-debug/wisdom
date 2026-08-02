"use client";

import type { PageCopy } from "@/types";

export function Testimonials({ copy }: { copy: PageCopy["home_testimonials"] }) {
  if (copy.visible === false) return null;
  const items = copy.items.filter((t) => t.visible !== false);
  if (!items.length) return null;

  return (
    <section id="testimonials" className="section-pad relative bg-surface-elevated">
      <div className="absolute inset-x-0 top-0 h-px bg-chrome-line" />
      <div className="container-wisdom">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="heading-display !text-4xl md:!text-5xl">{copy.title}</h2>
          <p className="mt-4 text-muted">{copy.body}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <blockquote
              key={t.name}
              className="group dark-panel rounded-2xl p-6 transition duration-500 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-teal-glow"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-silver/30 ring-2 ring-secondary/30 transition group-hover:ring-secondary-glow">
                  {t.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-secondary/25 font-display text-sm font-semibold text-secondary-glow">
                      {t.initials}
                    </span>
                  )}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-white">{t.name}</cite>
                  <p className="text-xs text-secondary-glow">{t.role}</p>
                </div>
              </div>
              <p className="font-display text-lg leading-relaxed text-silver-light">
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
