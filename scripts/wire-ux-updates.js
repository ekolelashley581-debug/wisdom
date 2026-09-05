const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const srcDir = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-USER-Desktop-wisdom/assets"
);
const dst = path.join(root, "public/placeholders");
fs.mkdirSync(dst, { recursive: true });

for (const f of [
  "testimonial-aicha.png",
  "testimonial-eric.png",
  "testimonial-lena-paul.png",
  "testimonial-grace.png",
]) {
  const from = path.join(srcDir, f);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(dst, f));
}

const photos = {
  "Aïcha M.": "/placeholders/testimonial-aicha.png",
  "Eric T.": "/placeholders/testimonial-eric.png",
  "Lena & Paul": "/placeholders/testimonial-lena-paul.png",
  "Grace N.": "/placeholders/testimonial-grace.png",
};

function patchTestimonials(items) {
  return items.map((t) => ({
    ...t,
    photo_url: photos[t.name] || t.photo_url || "",
  }));
}

const copyPath = path.join(root, "data/page-copy.json");
const copy = JSON.parse(fs.readFileSync(copyPath, "utf8"));
if (copy.home_testimonials?.items) {
  copy.home_testimonials.items = patchTestimonials(copy.home_testimonials.items);
  fs.writeFileSync(copyPath, JSON.stringify(copy, null, 2) + "\n");
}

const configPath = path.join(root, "data/site-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
config.design = {
  ...config.design,
  hero_slideshow: true,
  hero_slideshow_interval: 5,
  hero_media_urls: [
    config.design.hero_image_url,
    "/placeholders/experience-restaurant.png",
    "/placeholders/experience-spa.png",
  ].filter(Boolean),
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
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

console.log("wired testimonials + triad + hero slideshow");
