const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const P = (f) => `/placeholders/${f}`;

const MENU = {
  "crispy-plantain-bites": "food-plantain-bites.png",
  "seafood-spring-rolls": "food-spring-rolls.png",
  "grilled-barracuda": "food-grilled-fish.png",
  "ndole-royal": "food-ndole.png",
  "chicken-suya-platter": "food-chicken-suya.png",
  "coconut-beignets": "food-beignets.png",
  "limbe-sunset": "drink-cocktail.png",
  "house-red-glass": "drink-wine.png",
  "fresh-ginger-juice": "drink-ginger.png",
  "champagne-toast": "drink-champagne.png",
  "jellof-rice": "food-jollof.png",
};

const SPA = {
  "classic-haircut": "spa-hair.png",
  "plaiting-braids": "spa-braids.png",
  manicure: "spa-nails.png",
  pedicure: "spa-nails.png",
  "sauna-session": "spa-sauna.png",
  "body-scrub": "spa-scrub.png",
  "relaxation-massage": "spa-massage.png",
  "classic-facial": "spa-facial.png",
  "ear-piercing": "spa-piercing.png",
  "bride-package": "spa-bride.png",
  "couples-day": "spa-couples.png",
};

const PRODUCT = {
  "shea-body-butter": "product-shea.png",
  "teal-glow-face-oil": "product-face-oil.png",
  "coastal-salt-scrub": "product-scrub.png",
  "hair-elixir": "product-hair-elixir.png",
};

const BLOG = {
  "night-at-wisdom-coastal-flavours": "blog-dining-night.png",
  "spa-tips-first-facial": "blog-facial-tips.png",
  "behind-scenes-bride-package": "blog-bride-package.png",
};

const STAFF = {
  "marie-ngo": "staff-marie.png",
  "daniel-okon": "staff-daniel.png",
  "blessing-ewane": "staff-blessing.png",
};

function readJson(rel, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n");
}

function apply(items, map, mode) {
  return items.map((it) => {
    const f = map[it.slug];
    if (!f) return it;
    const u = P(f);
    const n = { ...it };
    if (mode === "img") {
      n.images = [u];
      n.thumbnail = u;
    }
    if (mode === "blog") {
      n.featured_image = u;
      n.og_image = u;
    }
    if (mode === "staff") {
      n.photo_url = u;
      n.thumbnail = u;
    }
    return n;
  });
}

const spaSeed = [
  {
    id: "ss-1",
    category_id: "spa-hair",
    name: "Classic Haircut",
    slug: "classic-haircut",
    description:
      "Precision cut and finish tailored to your face shape and style preference.",
    price_by_level: { junior: 3000, senior: 5000, master: 8000 },
    duration: "45 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-2",
    category_id: "spa-hair",
    name: "Plaiting & Braids",
    slug: "plaiting-braids",
    description: "Protective styles from classic cornrows to intricate Ghana braids.",
    price_by_level: { junior: 5000, senior: 8000, master: 12000 },
    duration: "1–3 hrs",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-3",
    category_id: "spa-nails",
    name: "Manicure",
    slug: "manicure",
    description:
      "Nail shaping, cuticle care, polish, and hand massage for a polished finish.",
    price_by_level: { junior: 4000, senior: 6000, master: 9000 },
    duration: "45 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-4",
    category_id: "spa-nails",
    name: "Pedicure",
    slug: "pedicure",
    description:
      "Foot soak, exfoliation, nail care, and polish with a relaxing foot massage.",
    price_by_level: { junior: 4500, senior: 7000, master: 10000 },
    duration: "60 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-5",
    category_id: "spa-body",
    name: "Sauna Session",
    slug: "sauna-session",
    description:
      "Private sauna time to detox, relax muscles, and reset after a long day.",
    price_by_level: { junior: 5000, senior: 5000, master: 5000 },
    duration: "30 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-6",
    category_id: "spa-body",
    name: "Body Scrub",
    slug: "body-scrub",
    description:
      "Full-body exfoliation with natural oils and salts for silky, glowing skin.",
    price_by_level: { junior: 8000, senior: 12000, master: 15000 },
    duration: "60 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-7",
    category_id: "spa-body",
    name: "Relaxation Massage",
    slug: "relaxation-massage",
    description:
      "Full-body massage with aromatic oils to release tension and restore calm.",
    price_by_level: { junior: 10000, senior: 15000, master: 20000 },
    duration: "60–90 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-8",
    category_id: "spa-face",
    name: "Classic Facial",
    slug: "classic-facial",
    description: "Deep cleanse, exfoliation, mask, and moisturizer for radiant skin.",
    price_by_level: { junior: 8000, senior: 12000, master: 16000 },
    duration: "60 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-9",
    category_id: "spa-face",
    name: "Ear Piercing",
    slug: "ear-piercing",
    description: "Professional piercing with sterile equipment and aftercare guidance.",
    price_by_level: { junior: 5000, senior: 7000, master: 10000 },
    duration: "20 min",
    images: [],
    is_package: false,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-10",
    category_id: "spa-packages",
    name: "Bride Package",
    slug: "bride-package",
    description:
      "Hair, makeup-ready facial, manicure, and pedicure — complete bridal glow for your day.",
    price_by_level: { junior: 35000, senior: 45000, master: 60000 },
    duration: "4 hrs",
    images: [],
    is_package: true,
    is_available: true,
    status: "published",
  },
  {
    id: "ss-11",
    category_id: "spa-packages",
    name: "Couples Day",
    slug: "couples-day",
    description:
      "Side-by-side massage, body scrub, and sauna for two. Ideal for anniversaries and date days.",
    price_by_level: { junior: 40000, senior: 55000, master: 70000 },
    duration: "3 hrs",
    images: [],
    is_package: true,
    is_available: true,
    status: "published",
  },
];

const blogSeed = [
  {
    id: "bp-1",
    title: "A Night at WISDOM: Coastal Flavours & Lounge Glow",
    slug: "night-at-wisdom-coastal-flavours",
    excerpt:
      "From charcoal-grilled barracuda to signature cocktails — how we set the table for Limbe evenings.",
    content:
      "<p>At WISDOM, dinner is never just a meal. It is the soft teal light on silver glassware, the smell of citrus butter on fresh fish, and the first sip of a lounge cocktail as the night opens.</p><p>Our kitchen leans into Cameroonian classics — ndolè, plantain, coastal seafood — plated with modern restraint. Ask for the Chef's Special when you visit; it changes with the season.</p><p>After dinner, step into the lounge. Same menu, deeper drinks list, and a soundtrack that carries until late.</p>",
    featured_image: "",
    category: "Events",
    author: "WISDOM Team",
    tags: ["restaurant", "lounge", "limbe"],
    status: "published",
    published_at: "2026-06-15T10:00:00.000Z",
    scheduled_at: null,
    meta_title: "A Night at WISDOM | Limbe Restaurant & Lounge",
    meta_description:
      "Discover coastal Cameroonian dining and lounge nights at WISDOM in Limbe.",
    og_image: "",
    created_at: "2026-06-10T10:00:00.000Z",
    updated_at: "2026-06-15T10:00:00.000Z",
  },
  {
    id: "bp-2",
    title: "Spa Tips: How to Prep for Your First Facial",
    slug: "spa-tips-first-facial",
    excerpt:
      "Arrive hydrated, skip heavy makeup, and leave with glow that lasts — our facialists share simple prep advice.",
    content:
      "<p>Your first facial at WISDOM should feel like a reset, not a rush. Arrive a few minutes early, drink water, and skip heavy foundation so our technicians can see your skin clearly.</p><p>We use products available in our shop — including Teal Glow Face Oil — so you can continue the ritual at home.</p><p>Book via WhatsApp with your preferred date and time. Pricing varies by stylist level.</p>",
    featured_image: "",
    category: "Spa tips",
    author: "Spa Desk",
    tags: ["spa", "facial", "tips"],
    status: "published",
    published_at: "2026-07-01T09:00:00.000Z",
    scheduled_at: null,
    meta_title: "Spa Tips: First Facial Prep | WISDOM Limbe",
    meta_description:
      "How to prepare for your first facial at WISDOM spa in Limbe, Cameroon.",
    og_image: "",
    created_at: "2026-06-28T09:00:00.000Z",
    updated_at: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "bp-3",
    title: "Behind the Scenes: Building the Bride Package",
    slug: "behind-scenes-bride-package",
    excerpt:
      "Hair, nails, facial, and calm — why we designed a full bridal morning under one roof.",
    content:
      "<p>Weddings in Limbe move fast. Our Bride Package gathers hair, a makeup-ready facial, manicure, and pedicure so you can stay in one place and breathe.</p><p>Couples often add Couples Day the weekend before — massage, scrub, and sauna for two.</p>",
    featured_image: "",
    category: "Behind-the-scenes",
    author: "WISDOM Team",
    tags: ["packages", "bridal", "spa"],
    status: "published",
    published_at: "2026-07-20T12:00:00.000Z",
    scheduled_at: null,
    meta_title: "Bride Package Story | WISDOM Spa Limbe",
    meta_description:
      "Behind the scenes of the WISDOM Bride Package — hair, facial, and nails in Limbe.",
    og_image: "",
    created_at: "2026-07-18T12:00:00.000Z",
    updated_at: "2026-07-20T12:00:00.000Z",
  },
];

const staffSeed = [
  {
    id: "staff-1",
    name: "Marie Ngo",
    slug: "marie-ngo",
    role: "Master Spa Therapist",
    department: "spa",
    bio: "Marie leads restorative body work at WISDOM with a calm, precise touch. Guests return for her deep-tissue and signature coastal massages.",
    short_bio: "Master therapist · massage & body rituals",
    photo_url: "",
    thumbnail: "",
    specialties: ["Deep tissue", "Swedish massage", "Hot stone"],
    service_slugs: ["relaxation-massage", "body-scrub", "sauna-session"],
    level: "master",
    years_experience: 8,
    status: "published",
    sort_order: 1,
    meta_title: "Marie Ngo — Master Spa Therapist | WISDOM",
    meta_description:
      "Meet Marie Ngo, master spa therapist at WISDOM Limbe — massage and body rituals.",
  },
  {
    id: "staff-2",
    name: "Daniel Okon",
    slug: "daniel-okon",
    role: "Senior Stylist",
    department: "spa",
    bio: "Daniel crafts cuts and colour with a modern coastal eye. He specialises in protective styles and event-ready looks.",
    short_bio: "Senior stylist · hair & grooming",
    photo_url: "",
    thumbnail: "",
    specialties: ["Cuts", "Colour", "Bridal hair"],
    service_slugs: ["classic-haircut", "plaiting-braids", "bride-package"],
    level: "senior",
    years_experience: 6,
    status: "published",
    sort_order: 2,
    meta_title: "Daniel Okon — Senior Stylist | WISDOM",
    meta_description:
      "Meet Daniel Okon, senior stylist at WISDOM Limbe — hair cuts, colour, and bridal styling.",
  },
  {
    id: "staff-3",
    name: "Blessing Ewane",
    slug: "blessing-ewane",
    role: "Head Chef",
    department: "restaurant",
    bio: "Blessing anchors the kitchen with Cameroonian classics and coastal plates — ndolè, seafood, and seasonal specials.",
    short_bio: "Head chef · Cameroonian & coastal cuisine",
    photo_url: "",
    thumbnail: "",
    specialties: ["Ndolè", "Seafood", "Chef's specials"],
    service_slugs: [],
    years_experience: 10,
    status: "published",
    sort_order: 3,
    meta_title: "Blessing Ewane — Head Chef | WISDOM",
    meta_description:
      "Meet Blessing Ewane, head chef at WISDOM Limbe — Cameroonian and coastal cuisine.",
  },
];

const menu = apply(readJson("data/menu.json", []), MENU, "img");
writeJson("data/menu.json", menu);

const products = apply(readJson("data/products.json", []), PRODUCT, "img");
writeJson("data/products.json", products);

let spa = readJson("data/spa.json", spaSeed);
if (!Array.isArray(spa) || !spa.length) spa = spaSeed;
spa = apply(spa, SPA, "img");
writeJson("data/spa.json", spa);

let blog = readJson("data/blog.json", blogSeed);
if (!Array.isArray(blog) || !blog.length) blog = blogSeed;
blog = apply(blog, BLOG, "blog");
writeJson("data/blog.json", blog);

let staff = readJson("data/staff.json", staffSeed);
if (!Array.isArray(staff) || !staff.length) staff = staffSeed;
staff = apply(staff, STAFF, "staff");
writeJson("data/staff.json", staff);

const config = readJson("data/site-config.json", {});
if (config.design) {
  config.design.hero_image_url = P("hero-wisdom.png");
  writeJson("data/site-config.json", config);
}

const files = fs
  .readdirSync(path.join(root, "public/placeholders"))
  .filter((f) => f.endsWith(".png"));
const media = files.map((f, i) => {
  const folder =
    f.startsWith("food-") || f.startsWith("drink-")
      ? "restaurant"
      : f.startsWith("spa-") || f.startsWith("product-")
        ? "spa"
        : f.startsWith("staff-")
          ? "staff"
          : f.startsWith("blog-")
            ? "blog"
            : f.startsWith("experience-") || f.startsWith("hero-")
              ? "brand"
              : "general";
  const st = fs.statSync(path.join(root, "public/placeholders", f));
  return {
    id: `media-ph-${i + 1}`,
    url: P(f),
    name: f,
    alt_text: f.replace(/\.png$/, "").replace(/-/g, " "),
    folder,
    size: st.size,
    created_at: new Date().toISOString(),
    usage_refs: ["draft-placeholder"],
  };
});
writeJson("data/media.json", media);

console.log(
  JSON.stringify(
    {
      menu: menu.filter((m) => m.images?.length).length,
      spa: spa.filter((m) => m.images?.length).length,
      products: products.filter((m) => m.images?.length).length,
      blog: blog.filter((m) => m.featured_image).length,
      staff: staff.filter((m) => m.photo_url).length,
      media: media.length,
      hero: config.design?.hero_image_url,
    },
    null,
    2
  )
);
