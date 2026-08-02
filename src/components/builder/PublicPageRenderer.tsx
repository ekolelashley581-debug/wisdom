"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CardMediaGallery } from "@/components/ui/CardMediaGallery";
import { MediaSlideshow, collectMediaUrls } from "@/components/ui/MediaSlideshow";
import { Hero } from "@/components/home/Hero";
import { WisdomTriad } from "@/components/home/WisdomTriad";
import { ChefsSpecial } from "@/components/home/ChefsSpecial";
import { ShopGlimpse } from "@/components/home/ShopGlimpse";
import { HoursStrip } from "@/components/home/HoursStrip";
import { NearbyAndMap } from "@/components/home/NearbyAndMap";
import { cn } from "@/lib/format";
import type { SiteDesign, SiteSettings, MenuItem, SpaProduct } from "@/types";
import type {
  BuilderElement,
  BuilderPage,
  BuilderSection,
  BuilderStyles,
} from "@/types/page-builder";

function padClass(s?: BuilderStyles["paddingY"]) {
  switch (s) {
    case "none":
      return "py-0";
    case "sm":
      return "py-6";
    case "md":
      return "py-10";
    case "xl":
      return "section-pad";
    case "lg":
    default:
      return "py-14 md:py-20";
  }
}

function alignClass(a?: BuilderStyles["textAlign"]) {
  if (a === "center") return "text-center items-center";
  if (a === "right") return "text-right items-end";
  return "text-left items-start";
}

function maxW(a?: BuilderStyles["maxWidth"]) {
  if (a === "sm") return "max-w-xl";
  if (a === "md") return "max-w-2xl";
  if (a === "full") return "max-w-none";
  return "max-w-3xl";
}

export type BuilderSelect =
  | { kind: "section"; sectionId: string }
  | { kind: "element"; sectionId: string; elementId: string };

function SectionShell({
  section,
  children,
  preview,
  selected,
  onSelect,
}: {
  section: BuilderSection;
  children: React.ReactNode;
  preview?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  if (!section.visible && !preview) return null;
  return (
    <section
      className={cn(
        padClass(section.styles.paddingY),
        !section.visible && preview && "opacity-40 outline outline-dashed outline-amber-500/50",
        selected && preview && "outline outline-2 outline-secondary-glow"
      )}
      style={{
        background: section.styles.background || undefined,
        color: section.styles.textColor || undefined,
      }}
      data-builder-section={section.id}
      onClick={
        preview && onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect();
            }
          : undefined
      }
    >
      <div className="container-wisdom">{children}</div>
    </section>
  );
}

function ElementView({
  el,
  sectionId,
  design,
  settings,
  specials,
  products,
  phone,
  preview,
  selected,
  onSelect,
}: {
  el: BuilderElement;
  sectionId: string;
  design: SiteDesign;
  settings: SiteSettings;
  specials: MenuItem[];
  products: SpaProduct[];
  phone: string;
  preview?: boolean;
  selected?: boolean;
  onSelect?: (sel: BuilderSelect) => void;
}) {
  if (!el.visible && !preview) return null;

  const wrap = (node: React.ReactNode) => (
    <div
      className={cn(
        "relative mb-6 flex flex-col",
        alignClass(el.styles.textAlign),
        !el.visible && preview && "opacity-40",
        selected && preview && "rounded-lg outline outline-2 outline-secondary-glow"
      )}
      style={{
        color: el.styles.textColor || undefined,
        background: el.styles.background || undefined,
      }}
      data-builder-el={el.id}
      onClick={
        preview && onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect({ kind: "element", sectionId, elementId: el.id });
            }
          : undefined
      }
    >
      {node}
    </div>
  );

  switch (el.type) {
    case "hero":
      return (
        <div
          data-builder-el={el.id}
          className={cn(selected && preview && "outline outline-2 outline-secondary-glow")}
          onClick={
            preview && onSelect
              ? (e) => {
                  e.stopPropagation();
                  onSelect({ kind: "element", sectionId, elementId: el.id });
                }
              : undefined
          }
        >
          <Hero design={design} />
          {!preview && <WisdomTriad design={design} />}
        </div>
      );
    case "heading":
      return wrap(
        <div className={cn(maxW(el.styles.maxWidth), "w-full")}>
          {el.eyebrow ? <p className="eyebrow">{el.eyebrow}</p> : null}
          <h2 className="heading-display !text-4xl md:!text-5xl">{el.title}</h2>
        </div>
      );
    case "text":
      return wrap(
        <p className={cn("text-muted", maxW(el.styles.maxWidth))}>{el.body}</p>
      );
    case "button":
      return wrap(
        <Link
          href={el.href || "/"}
          className={
            el.button_variant === "outline"
              ? "btn-outline"
              : el.button_variant === "whatsapp"
                ? "btn-whatsapp"
                : el.button_variant === "silver"
                  ? "btn-silver"
                  : "btn-primary"
          }
          onClick={preview ? (e) => e.preventDefault() : undefined}
        >
          {el.title || "Button"}
        </Link>
      );
    case "buttons":
      return wrap(
        <div className="flex flex-wrap gap-3">
          {(el.buttons || []).map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className={
                b.variant === "outline"
                  ? "btn-outline"
                  : b.variant === "whatsapp"
                    ? "btn-whatsapp"
                    : b.variant === "silver"
                      ? "btn-silver"
                      : "btn-primary"
              }
              onClick={preview ? (e) => e.preventDefault() : undefined}
            >
              {b.label}
            </Link>
          ))}
        </div>
      );
    case "media": {
      const mediaUrls = collectMediaUrls(el.media_url, el.media_urls);
      const autoSlide = mediaUrls.length > 1 && el.media_mode !== "single";
      return wrap(
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 min-h-[200px]">
          {autoSlide ? (
            <div className="aspect-[21/9] min-h-[200px] w-full">
              <MediaSlideshow
                urls={mediaUrls}
                enabled
                intervalSec={8}
                alt={el.label}
              />
            </div>
          ) : (
            <PlaceholderImage
              label={el.label}
              src={el.media_url || undefined}
              aspect="wide"
              className="rounded-none min-h-[200px]"
              autoPlay
            />
          )}
        </div>
      );
    }
    case "cards": {
      const cards = (el.cards || []).filter((c) => c.visible !== false || preview);
      const few = cards.length <= 2;
      return wrap(
        <div
          className={cn(
            "grid w-full gap-6 md:gap-8",
            few ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {cards.map((card) => {
            if (!card.visible && !preview) return null;
            const inner = (
              <>
                <CardMediaGallery
                  title={card.title}
                  media_url={card.media_url}
                  media_urls={card.media_urls}
                  media_mode={card.media_mode || "single"}
                  aspect="video"
                  className="min-h-[240px] md:min-h-[320px]"
                />
                <div className="p-5 md:p-7">
                  <h3 className="font-display text-2xl text-white md:text-3xl">
                    {card.title}
                  </h3>
                  {card.body ? (
                    <p className="mt-2 text-sm text-silver-mute md:text-base">{card.body}</p>
                  ) : null}
                  {card.note ? (
                    <p className="mt-2 text-xs text-secondary-glow md:text-sm">{card.note}</p>
                  ) : null}
                  {card.link_label ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-secondary-glow">
                      {card.link_label} <ArrowRight size={14} />
                    </span>
                  ) : null}
                </div>
              </>
            );
            return card.link_url ? (
              <Link
                key={card.id}
                href={card.link_url}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-secondary/40 hover:shadow-teal-glow"
                onClick={preview ? (e) => e.preventDefault() : undefined}
              >
                {inner}
              </Link>
            ) : (
              <article
                key={card.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                {inner}
              </article>
            );
          })}
        </div>
      );
    }
    case "spacer":
      return <div style={{ height: el.spacer_height || 32 }} aria-hidden />;
    case "divider":
      return <div className="my-4 h-px w-full bg-chrome-line" />;
    case "dynamic_chefs":
      return (
        <ChefsSpecial
          items={specials}
          phone={phone}
          copy={{
            eyebrow: el.eyebrow || "",
            title: el.title || "",
            body: el.body || "",
            cta: el.cta,
            cta_link: el.cta_link,
            visible: true,
          }}
        />
      );
    case "dynamic_products":
      return (
        <ShopGlimpse
          products={products}
          phone={phone}
          copy={{
            eyebrow: el.eyebrow || "",
            title: el.title || "",
            body: el.body || "",
            cta: el.cta,
            cta_link: el.cta_link,
            visible: true,
          }}
        />
      );
    case "dynamic_hours":
      return <HoursStrip settings={settings} />;
    case "dynamic_map":
      return <NearbyAndMap settings={settings} />;
    case "testimonials": {
      const items = (el.testimonials || []).filter(
        (t) => t.visible !== false || preview
      );
      return wrap(
        <div className="w-full">
          <div className={cn(maxW(el.styles.maxWidth), "mb-8")}>
            {el.eyebrow ? <p className="eyebrow">{el.eyebrow}</p> : null}
            <h2 className="heading-display !text-4xl">{el.title}</h2>
            {el.body ? <p className="mt-3 text-muted">{el.body}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((t, i) => (
              <blockquote
                key={t.id || i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-silver/30 ring-2 ring-secondary/30">
                    {t.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.photo_url}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-secondary/20 font-display text-sm text-secondary-glow">
                        {t.initials}
                      </span>
                    )}
                  </div>
                  <cite className="not-italic text-sm text-secondary-glow">
                    <span className="block font-semibold text-white">{t.name}</span>
                    {t.role}
                  </cite>
                </div>
                <p className="font-display text-lg text-silver-light">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export function PublicPageRenderer({
  page,
  design,
  settings,
  specials = [],
  products = [],
  preview = false,
  selected,
  onSelect,
}: {
  page: BuilderPage;
  design: SiteDesign;
  settings: SiteSettings;
  specials?: MenuItem[];
  products?: SpaProduct[];
  preview?: boolean;
  selected?: BuilderSelect | null;
  onSelect?: (sel: BuilderSelect) => void;
}) {
  return (
    <>
      {page.sections.map((section) => {
        const onlyDynamic =
          section.elements.length === 1 &&
          (section.elements[0].type === "dynamic_chefs" ||
            section.elements[0].type === "dynamic_products" ||
            section.elements[0].type === "dynamic_hours" ||
            section.elements[0].type === "dynamic_map" ||
            section.elements[0].type === "hero");

        const sectionSelected =
          selected?.kind === "section" && selected.sectionId === section.id;

        if (onlyDynamic) {
          if (!section.visible && !preview) return null;
          return (
            <div
              key={section.id}
              className={cn(
                !section.visible && preview && "opacity-40",
                sectionSelected && preview && "outline outline-2 outline-secondary-glow"
              )}
              data-builder-section={section.id}
              onClick={
                preview && onSelect
                  ? () => onSelect({ kind: "section", sectionId: section.id })
                  : undefined
              }
              onDragOver={
                preview
                  ? (e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "copy";
                    }
                  : undefined
              }
              onDrop={
                preview
                  ? (e) => {
                      e.preventDefault();
                      const type = e.dataTransfer.getData("application/x-widget-type");
                      if (type && onSelect) {
                        (
                          window as unknown as {
                            __builderDrop?: (sectionId: string, type: string) => void;
                          }
                        ).__builderDrop?.(section.id, type);
                      }
                    }
                  : undefined
              }
            >
              {section.elements.map((el) => (
                <ElementView
                  key={el.id}
                  el={el}
                  sectionId={section.id}
                  design={design}
                  settings={settings}
                  specials={specials}
                  products={products}
                  phone={settings.whatsapp_number}
                  preview={preview}
                  selected={
                    selected?.kind === "element" && selected.elementId === el.id
                  }
                  onSelect={onSelect}
                />
              ))}
            </div>
          );
        }

        return (
          <SectionShell
            key={section.id}
            section={section}
            preview={preview}
            selected={sectionSelected}
            onSelect={
              onSelect
                ? () => onSelect({ kind: "section", sectionId: section.id })
                : undefined
            }
          >
            <div
              onDragOver={
                preview
                  ? (e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "copy";
                    }
                  : undefined
              }
              onDrop={
                preview
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const type = e.dataTransfer.getData("application/x-widget-type");
                      if (type) {
                        (
                          window as unknown as {
                            __builderDrop?: (sectionId: string, type: string) => void;
                          }
                        ).__builderDrop?.(section.id, type);
                      }
                    }
                  : undefined
              }
            >
              {section.elements.map((el) => (
                <ElementView
                  key={el.id}
                  el={el}
                  sectionId={section.id}
                  design={design}
                  settings={settings}
                  specials={specials}
                  products={products}
                  phone={settings.whatsapp_number}
                  preview={preview}
                  selected={
                    selected?.kind === "element" && selected.elementId === el.id
                  }
                  onSelect={onSelect}
                />
              ))}
            </div>
          </SectionShell>
        );
      })}
    </>
  );
}
