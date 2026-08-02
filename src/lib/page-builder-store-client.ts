import { newCardId } from "@/lib/media-kind";
import type {
  BuilderElement,
  BuilderSection,
} from "@/types/page-builder";

function eid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createElement(
  type: BuilderElement["type"],
  partial?: Partial<BuilderElement>
): BuilderElement {
  const base: BuilderElement = {
    id: eid(type),
    type,
    label: type,
    visible: true,
    styles: { paddingY: "md", textAlign: "left", maxWidth: "lg" },
  };

  switch (type) {
    case "heading":
      return {
        ...base,
        label: "Heading",
        eyebrow: "Section",
        title: "New heading",
        ...partial,
      };
    case "text":
      return {
        ...base,
        label: "Text",
        body: "Add your text here…",
        ...partial,
      };
    case "button":
      return {
        ...base,
        label: "Button",
        title: "Learn more",
        href: "/",
        button_variant: "primary",
        ...partial,
      };
    case "buttons":
      return {
        ...base,
        label: "Buttons",
        buttons: [
          {
            id: newCardId(),
            label: "Primary",
            href: "/",
            variant: "primary",
          },
        ],
        ...partial,
      };
    case "media":
      return { ...base, label: "Media", media_url: "", ...partial };
    case "cards":
      return {
        ...base,
        label: "Cards",
        cards: [
          {
            id: newCardId(),
            title: "Card title",
            body: "Card text",
            media_url: "",
            link_url: "/",
            link_label: "Open",
            visible: true,
          },
        ],
        ...partial,
      };
    case "spacer":
      return { ...base, label: "Spacer", spacer_height: 48, styles: {}, ...partial };
    case "divider":
      return { ...base, label: "Divider", styles: { paddingY: "sm" }, ...partial };
    case "hero":
      return { ...base, label: "Hero", styles: { paddingY: "none" }, ...partial };
    case "dynamic_chefs":
      return {
        ...base,
        label: "Chef specials",
        eyebrow: "Chef's Special",
        title: "Seasonal favourites",
        cta: "Full menu",
        cta_link: "/restaurant",
        ...partial,
      };
    case "dynamic_products":
      return {
        ...base,
        label: "Shop products",
        eyebrow: "Shop",
        title: "Take the ritual home",
        body: "Spa products via WhatsApp.",
        cta: "View shop",
        cta_link: "/product",
        ...partial,
      };
    case "dynamic_hours":
      return { ...base, label: "Hours", ...partial };
    case "dynamic_map":
      return { ...base, label: "Map", ...partial };
    case "testimonials":
      return {
        ...base,
        label: "Testimonials",
        eyebrow: "Voices",
        title: "What guests say",
        body: "",
        testimonials: [
          {
            id: newCardId(),
            name: "Guest",
            role: "Limbe",
            quote: "A wonderful experience.",
            initials: "G",
            visible: true,
          },
        ],
        ...partial,
      };
    default:
      return { ...base, ...partial };
  }
}

export function createSection(
  label: string,
  elements: BuilderElement[] = [],
  styles: BuilderSection["styles"] = { paddingY: "lg", background: "" }
): BuilderSection {
  return {
    id: eid("sec"),
    label,
    visible: true,
    styles,
    elements,
  };
}
