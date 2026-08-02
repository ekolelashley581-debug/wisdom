import { promises as fs } from "fs";
import path from "path";
import type { ContentCard, PageCopy, PageSectionCopy } from "@/types";
import { newCardId } from "@/lib/media-kind";

const DATA_DIR = path.join(process.cwd(), "data");
const COPY_PATH = path.join(DATA_DIR, "page-copy.json");

const discoverCards: ContentCard[] = [
  {
    id: "discover-restaurant",
    title: "Restaurant",
    body: "Cameroonian gastronomy, coastal seafood, and a lounge with signature drinks.",
    media_url: "",
    link_url: "/restaurant",
    link_label: "Explore menu",
    visible: true,
  },
  {
    id: "discover-spa",
    title: "Spa",
    body: "Hair, nails, massage, facials, sauna, and curated packages for every occasion.",
    media_url: "",
    link_url: "/spa",
    link_label: "View services",
    visible: true,
  },
];

const spaMomentCards: ContentCard[] = [
  {
    id: "spa-m1",
    title: "Massage sanctuary",
    body: "",
    note: "Deep calm",
    media_url: "",
    link_url: "/spa",
    visible: true,
  },
  {
    id: "spa-m2",
    title: "Facial ritual",
    body: "",
    note: "Glow",
    media_url: "",
    link_url: "/spa",
    visible: true,
  },
  {
    id: "spa-m3",
    title: "Sauna steam",
    body: "",
    note: "Release",
    media_url: "",
    link_url: "/spa",
    visible: true,
  },
  {
    id: "spa-m4",
    title: "Nails lounge",
    body: "",
    note: "Polish",
    media_url: "",
    link_url: "/spa",
    visible: true,
  },
];

export const defaultPageCopy: PageCopy = {
  home_seo: {
    meta_title: "WISDOM - Restaurant, Spa & Lounge in Limbe, Cameroon",
    meta_description:
      "Experience WISDOM in Limbe: premium restaurant, lounge, and spa. Authentic Cameroonian cuisine, spa rituals, and coastal hospitality.",
  },
  home_discover: {
    eyebrow: "Discover",
    title: "Two worlds. One WISDOM.",
    body: "Separate experiences under one roof — refined dining & lounge energy, and a spa dedicated to calm restoration.",
    visible: true,
    cards: discoverCards,
  },
  home_chefs: {
    eyebrow: "Chef's Special",
    title: "Seasonal favourites",
    body: "",
    cta: "Full menu",
    cta_link: "/restaurant",
    visible: true,
  },
  home_spa_glimpse: {
    eyebrow: "Spa sessions",
    title: "A glimpse into stillness",
    body: "Soft light, teal calm, silver detail — a preview of the WISDOM spa experience.",
    cta: "Book a session",
    cta_link: "/spa",
    image_url: "",
    media_kind: "image",
    visible: true,
    cards: spaMomentCards,
  },
  home_shop: {
    eyebrow: "Shop",
    title: "Take the ritual home",
    body: "Spa products used in our treatments — buy via WhatsApp for local pickup or delivery around Limbe.",
    cta: "View shop",
    cta_link: "/product",
    visible: true,
  },
  home_testimonials: {
    eyebrow: "Voices",
    title: "What Limbe says",
    body: "Guests who dined, lingered in the lounge, or left the spa restored.",
    visible: true,
    items: [
      {
        id: "t1",
        name: "Aïcha M.",
        role: "Limbe, CM",
        quote:
          "The ndolè was a revelation. Service felt like family — WISDOM already feels like home.",
        initials: "AM",
        visible: true,
      },
      {
        id: "t2",
        name: "Eric T.",
        role: "Douala, CM",
        quote:
          "Best lounge energy in the South-West. Cocktails crafted with soul, nights that linger.",
        initials: "ET",
        visible: true,
      },
      {
        id: "t3",
        name: "Lena & Paul",
        role: "Paris, FR",
        quote:
          "The spa massage was a quiet sanctuary after a long coast day. We will be back.",
        initials: "LP",
        visible: true,
      },
      {
        id: "t4",
        name: "Grace N.",
        role: "Buea, CM",
        quote:
          "Facials and nails done with care. The black-and-teal vibe matches the logo — pure luxury.",
        initials: "GN",
        visible: true,
      },
    ],
  },
  restaurant: {
    eyebrow: "Restaurant & Lounge",
    title: "Our Menu",
    body: "Seasonal Cameroonian cuisine and coastal favourites. Order for delivery or dine in — we confirm everything on WhatsApp.",
    visible: true,
    seo: {
      meta_title: "Restaurant Menu | WISDOM Limbe",
      meta_description:
        "Explore the WISDOM restaurant menu in Limbe — appetizers, mains, desserts, drinks, and lounge classics.",
    },
  },
  spa: {
    eyebrow: "Spa & Wellness",
    title: "Our Services",
    body: "From classic cuts to restorative massages and bridal packages. Pricing varies by stylist level — book via WhatsApp.",
    visible: true,
    seo: {
      meta_title: "Spa Services | WISDOM Limbe",
      meta_description:
        "Book WISDOM spa services in Limbe — hair, nails, body, face treatments, and packages.",
    },
  },
  product: {
    eyebrow: "Shop",
    title: "Spa products",
    body: "Products used in our treatments — available for local purchase via WhatsApp.",
    visible: true,
    seo: {
      meta_title: "Shop — Spa Products | WISDOM Limbe",
      meta_description:
        "Buy WISDOM spa products in Limbe — body butters, face oils, scrubs, and hair elixirs via WhatsApp.",
    },
  },
  blog: {
    eyebrow: "Stories",
    title: "Journal",
    body: "Recipes, spa tips, events, promotions, and life behind the WISDOM doors.",
    visible: true,
    seo: {
      meta_title: "Blog | WISDOM Limbe",
      meta_description:
        "Recipes, spa tips, events, and behind-the-scenes stories from WISDOM Limbe.",
    },
  },
  about: {
    eyebrow: "Our story",
    title: "About WISDOM",
    body: "A premium hub in Limbe where dining, lounge nights, and spa rituals share one address.",
    story:
      "WISDOM was built for Limbe — a place where Cameroonian hospitality meets dark elegance and coastal calm. We bring restaurant, lounge, and spa under one roof so you can arrive curious and leave restored.",
    mission:
      "To craft memorable evenings and restorative sessions with care, craft, and WhatsApp-first convenience for our community.",
    visible: true,
    seo: {
      meta_title: "About WISDOM | Restaurant, Spa & Lounge Limbe",
      meta_description:
        "Learn about WISDOM in Limbe — our story, mission, and the people behind the restaurant, lounge, and spa.",
    },
  },
  team: {
    eyebrow: "The team",
    title: "People behind the craft",
    body: "Meet the stylists, therapists, and hosts who shape every WISDOM experience.",
    visible: true,
    seo: {
      meta_title: "Our Team | WISDOM Limbe",
      meta_description:
        "Meet the WISDOM Limbe team — spa stylists, therapists, and restaurant hosts behind your experience.",
    },
  },
};

function deepMerge<T extends Record<string, unknown>>(base: T, patch: Partial<T>): T {
  const out = { ...base };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const pv = patch[key];
    const bv = base[key];
    if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(
        bv as Record<string, unknown>,
        pv as Record<string, unknown>
      ) as T[keyof T];
    } else if (pv !== undefined) {
      out[key] = pv as T[keyof T];
    }
  }
  return out;
}

/** Migrate older page-copy shapes (restaurant_title etc.) into cards */
function normalizePageCopy(copy: PageCopy): PageCopy {
  const discover = copy.home_discover as PageSectionCopy & Record<string, string>;
  if (!discover.cards?.length) {
    const legacyCards: ContentCard[] = [];
    if (discover.restaurant_title || discover.restaurant_body) {
      legacyCards.push({
        id: newCardId(),
        title: discover.restaurant_title || "Restaurant",
        body: discover.restaurant_body || "",
        media_url: discover.restaurant_image_url || "",
        link_url: "/restaurant",
        link_label: "Explore menu",
        visible: true,
      });
    }
    if (discover.spa_title || discover.spa_body) {
      legacyCards.push({
        id: newCardId(),
        title: discover.spa_title || "Spa",
        body: discover.spa_body || "",
        media_url: discover.spa_image_url || "",
        link_url: "/spa",
        link_label: "View services",
        visible: true,
      });
    }
    discover.cards = legacyCards.length ? legacyCards : discoverCards;
  }
  if (!copy.home_spa_glimpse.cards?.length) {
    copy.home_spa_glimpse.cards = spaMomentCards;
  }
  if (copy.home_chefs.cta_link == null) copy.home_chefs.cta_link = "/restaurant";
  if (copy.home_shop.cta_link == null) copy.home_shop.cta_link = "/product";
  if (copy.home_spa_glimpse.cta_link == null) copy.home_spa_glimpse.cta_link = "/spa";
  return copy;
}

export async function readPageCopy(): Promise<PageCopy> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(COPY_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<PageCopy>;
    const merged = deepMerge(
      defaultPageCopy as unknown as Record<string, unknown>,
      parsed as Record<string, unknown>
    ) as unknown as PageCopy;
    return normalizePageCopy(merged);
  } catch {
    return defaultPageCopy;
  }
}

export async function writePageCopy(copy: PageCopy): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(COPY_PATH, JSON.stringify(copy, null, 2), "utf8");
}
