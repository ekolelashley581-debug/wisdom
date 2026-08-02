import type { ContentCard, SeoFields, TestimonialCopy } from "@/types";

export type BuilderPageId =
  | "home"
  | "restaurant"
  | "spa"
  | "product"
  | "blog"
  | "about"
  | "team";

export type ElementType =
  | "heading"
  | "text"
  | "button"
  | "media"
  | "buttons"
  | "cards"
  | "spacer"
  | "divider"
  | "hero"
  | "dynamic_chefs"
  | "dynamic_products"
  | "dynamic_hours"
  | "dynamic_map"
  | "testimonials";

export interface BuilderStyles {
  background?: string;
  textColor?: string;
  paddingY?: "none" | "sm" | "md" | "lg" | "xl";
  textAlign?: "left" | "center" | "right";
  maxWidth?: "sm" | "md" | "lg" | "full";
}

export interface BuilderButton {
  id: string;
  label: string;
  href: string;
  variant: "primary" | "outline" | "whatsapp" | "silver";
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  label: string;
  visible: boolean;
  styles: BuilderStyles;
  eyebrow?: string;
  title?: string;
  body?: string;
  media_url?: string;
  media_urls?: string[];
  media_mode?: "single" | "slideshow";
  href?: string;
  button_variant?: BuilderButton["variant"];
  buttons?: BuilderButton[];
  cards?: ContentCard[];
  spacer_height?: number;
  testimonials?: TestimonialCopy[];
  cta?: string;
  cta_link?: string;
}

export interface BuilderSection {
  id: string;
  label: string;
  visible: boolean;
  styles: BuilderStyles;
  elements: BuilderElement[];
}

export interface BuilderPage {
  id: BuilderPageId;
  title: string;
  sections: BuilderSection[];
  seo: SeoFields;
}

export interface SiteLayouts {
  version: 1;
  updated_at: string;
  pages: Record<BuilderPageId, BuilderPage>;
}

export const PAGE_IDS: BuilderPageId[] = [
  "home",
  "restaurant",
  "spa",
  "product",
  "blog",
  "about",
  "team",
];

export const WIDGET_CATALOG: Array<{
  type: ElementType;
  label: string;
  group: "basic" | "media" | "layout" | "dynamic";
  description: string;
}> = [
  { type: "heading", label: "Heading", group: "basic", description: "Title + eyebrow" },
  { type: "text", label: "Text", group: "basic", description: "Paragraph body" },
  { type: "button", label: "Button", group: "basic", description: "Single CTA link" },
  { type: "buttons", label: "Button group", group: "basic", description: "Multiple CTAs" },
  { type: "media", label: "Image / Video", group: "media", description: "Photo or video block" },
  { type: "cards", label: "Cards grid", group: "media", description: "Add/remove linked cards" },
  { type: "testimonials", label: "Testimonials", group: "media", description: "Guest quotes" },
  { type: "spacer", label: "Spacer", group: "layout", description: "Vertical space" },
  { type: "divider", label: "Divider", group: "layout", description: "Horizontal line" },
  { type: "hero", label: "Hero (brand)", group: "dynamic", description: "Uses Design logo/hero" },
  {
    type: "dynamic_chefs",
    label: "Chef specials",
    group: "dynamic",
    description: "Live menu specials",
  },
  {
    type: "dynamic_products",
    label: "Shop products",
    group: "dynamic",
    description: "Live product grid",
  },
  { type: "dynamic_hours", label: "Opening hours", group: "dynamic", description: "From Settings" },
  { type: "dynamic_map", label: "Map / nearby", group: "dynamic", description: "From Settings" },
];
