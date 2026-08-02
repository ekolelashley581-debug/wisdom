import type { SiteDesign, WhatsAppPaymentConfig } from "@/types";

/** Client-safe defaults (no Node fs) — usable from admin UI and server store */
export const defaultDesign: SiteDesign = {
  logo_url: "/branding/wisdom-logo.png",
  favicon_url: "/branding/wisdom-logo.png",
  hero_eyebrow: "Limbe · Cameroon",
  hero_title: "WISDOM",
  hero_subtitle:
    "Dark elegance. Coastal warmth. Fine dining, lounge nights, and a spa crafted for restoration — one address in Limbe.",
  hero_image_url: "",
  hero_media_urls: [],
  hero_slideshow: true,
  hero_slideshow_interval: 9,
  primary_color: "#0A0A0A",
  secondary_color: "#0D7377",
  silver_color: "#C0C0C0",
  glow_color: "#14B8A6",
  restaurant_cta: "Explore Menu",
  spa_cta: "Book Spa",
  footer_blurb:
    "A premium Cameroonian hub in Limbe — restaurant, lounge, and spa. Crafted for those who arrive curious and leave restored.",
  triad_visible: true,
  triad_eyebrow: "In 5 seconds",
  triad_title: "Restaurant. Shop. Spa.",
  triad_body:
    "WISDOM is Limbe’s restaurant, shop, and spa — one coastal address. Touch a world to enter.",
  triad_items: [
    {
      id: "triad-restaurant",
      label: "Restaurant",
      line: "Coastal Cameroonian plates, charcoal grill & chef specials",
      href: "/restaurant",
      media_url: "/placeholders/experience-restaurant.png",
      visible: true,
    },
    {
      id: "triad-shop",
      label: "Shop",
      line: "Spa oils, butters & rituals to take home",
      href: "/product",
      media_url: "/placeholders/product-shea.png",
      visible: true,
    },
    {
      id: "triad-spa",
      label: "Spa",
      line: "Hair, nails, massage & restoration under one roof",
      href: "/spa",
      media_url: "/placeholders/experience-spa.png",
      visible: true,
    },
  ],
};

export const defaultPayments: WhatsAppPaymentConfig = {
  instructions:
    "All payments are arranged and confirmed on WhatsApp after you order or book. No card checkout on the website.",
  accepted_note: "MTN MoMo, Orange Money, or Cash — staff will confirm details in chat",
  momo_hint: "Ask for MTN MoMo number on WhatsApp",
  orange_hint: "Ask for Orange Money number on WhatsApp",
  cash_hint: "Cash on delivery / at venue",
};
