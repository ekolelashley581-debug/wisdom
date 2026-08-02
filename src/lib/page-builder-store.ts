import { promises as fs } from "fs";
import path from "path";
import { readPageCopy, defaultPageCopy } from "@/lib/page-copy";
import { createElement, createSection } from "@/lib/page-builder-store-client";
import type {
  BuilderPage,
  BuilderPageId,
  SiteLayouts,
} from "@/types/page-builder";
import { PAGE_IDS } from "@/types/page-builder";

const DATA_DIR = path.join(process.cwd(), "data");
const LAYOUT_PATH = path.join(DATA_DIR, "page-layouts.json");

export { createElement, createSection } from "@/lib/page-builder-store-client";


async function buildDefaultLayouts(): Promise<SiteLayouts> {
  const copy = await readPageCopy().catch(() => defaultPageCopy);

  const home: BuilderPage = {
    id: "home",
    title: "Home",
    seo: copy.home_seo,
    sections: [
      createSection(
        "Hero",
        [createElement("hero", { id: "el-hero", label: "Hero" })],
        { paddingY: "none" }
      ),
      createSection("Chef specials", [
        createElement("dynamic_chefs", {
          id: "el-chefs",
          eyebrow: copy.home_chefs.eyebrow,
          title: copy.home_chefs.title,
          body: copy.home_chefs.body,
          cta: copy.home_chefs.cta,
          cta_link: copy.home_chefs.cta_link,
        }),
      ]),
      createSection("Spa glimpse", [
        createElement("heading", {
          id: "el-spa-h",
          eyebrow: copy.home_spa_glimpse.eyebrow,
          title: copy.home_spa_glimpse.title,
        }),
        createElement("text", {
          id: "el-spa-t",
          body: copy.home_spa_glimpse.body,
        }),
        createElement("buttons", {
          id: "el-spa-btn",
          buttons: [
            {
              id: "b1",
              label: copy.home_spa_glimpse.cta || "Book",
              href: copy.home_spa_glimpse.cta_link || "/spa",
              variant: "outline",
            },
          ],
        }),
        createElement("media", {
          id: "el-spa-media",
          media_url: copy.home_spa_glimpse.image_url || "",
        }),
        createElement("cards", {
          id: "el-spa-cards",
          cards: copy.home_spa_glimpse.cards || [],
        }),
      ]),
      createSection("Shop", [
        createElement("dynamic_products", {
          id: "el-shop",
          eyebrow: copy.home_shop.eyebrow,
          title: copy.home_shop.title,
          body: copy.home_shop.body,
          cta: copy.home_shop.cta,
          cta_link: copy.home_shop.cta_link,
        }),
      ]),
      createSection("Testimonials", [
        createElement("testimonials", {
          id: "el-voices",
          eyebrow: copy.home_testimonials.eyebrow,
          title: copy.home_testimonials.title,
          body: copy.home_testimonials.body,
          testimonials: copy.home_testimonials.items,
        }),
      ]),
      createSection("Hours", [createElement("dynamic_hours", { id: "el-hours" })]),
      createSection("Visit", [createElement("dynamic_map", { id: "el-map" })]),
    ],
  };

  function listingPage(
    id: BuilderPageId,
    title: string,
    sec: typeof copy.restaurant
  ): BuilderPage {
    return {
      id,
      title,
      seo: sec.seo,
      sections: [
        createSection(`${title} intro`, [
          createElement("heading", {
            eyebrow: sec.eyebrow,
            title: sec.title,
          }),
          createElement("text", { body: sec.body }),
        ]),
      ],
    };
  }

  const about = copy.about;
  const team = copy.team;

  return {
    version: 1,
    updated_at: new Date().toISOString(),
    pages: {
      home,
      restaurant: listingPage("restaurant", "Restaurant", copy.restaurant),
      spa: listingPage("spa", "Spa", copy.spa),
      product: listingPage("product", "Shop", copy.product),
      blog: listingPage("blog", "Blog", copy.blog),
      about: {
        id: "about",
        title: "About",
        seo: about.seo,
        sections: [
          createSection("About", [
            createElement("heading", {
              eyebrow: about.eyebrow,
              title: about.title,
            }),
            createElement("text", { body: about.body }),
            createElement("heading", { title: "Our story", eyebrow: "" }),
            createElement("text", { body: about.story }),
            createElement("heading", { title: "Mission", eyebrow: "" }),
            createElement("text", { body: about.mission }),
            createElement("button", {
              title: "Meet the team",
              href: "/team",
              button_variant: "primary",
            }),
          ]),
        ],
      },
      team: {
        id: "team",
        title: "Team",
        seo: team.seo,
        sections: [
          createSection("Team", [
            createElement("heading", {
              eyebrow: team.eyebrow,
              title: team.title,
            }),
            createElement("text", { body: team.body }),
          ]),
        ],
      },
    },
  };
}

export async function readLayouts(): Promise<SiteLayouts> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(LAYOUT_PATH, "utf8");
    const parsed = JSON.parse(raw) as SiteLayouts;
    if (!parsed?.pages?.home) return buildDefaultLayouts();
    // ensure all page keys exist
    const defaults = await buildDefaultLayouts();
    for (const id of PAGE_IDS) {
      if (!parsed.pages[id]) parsed.pages[id] = defaults.pages[id];
    }
    return parsed;
  } catch {
    const layouts = await buildDefaultLayouts();
    await writeLayouts(layouts);
    return layouts;
  }
}

export async function writeLayouts(layouts: SiteLayouts): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  layouts.updated_at = new Date().toISOString();
  await fs.writeFile(LAYOUT_PATH, JSON.stringify(layouts, null, 2), "utf8");
}

export async function getLayoutPage(id: BuilderPageId): Promise<BuilderPage> {
  const layouts = await readLayouts();
  return layouts.pages[id];
}
