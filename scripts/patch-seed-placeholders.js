const fs = require("fs");

function patchSeedImages(file, pairs, field) {
  let s = fs.readFileSync(file, "utf8");
  for (const [slug, img] of pairs) {
    const url = `/placeholders/${img}`;
    if (field === "images") {
      const re = new RegExp(
        `(slug:\\s*"${slug}"[\\s\\S]*?images:\\s*)\\[\\]`,
        "m"
      );
      if (!re.test(s)) {
        console.log("miss images", slug);
        continue;
      }
      s = s.replace(re, `$1["${url}"]`);
    } else if (field === "blog") {
      const re = new RegExp(
        `(slug:\\s*"${slug}"[\\s\\S]*?featured_image:\\s*)""`,
        "m"
      );
      if (!re.test(s)) {
        console.log("miss blog", slug);
        continue;
      }
      s = s.replace(re, `$1"${url}"`);
      const re2 = new RegExp(
        `(slug:\\s*"${slug}"[\\s\\S]*?og_image:\\s*)""`,
        "m"
      );
      s = s.replace(re2, `$1"${url}"`);
    } else if (field === "staff") {
      const re = new RegExp(
        `(slug:\\s*"${slug}"[\\s\\S]*?photo_url:\\s*)""`,
        "m"
      );
      s = s.replace(re, `$1"${url}"`);
      const re2 = new RegExp(
        `(slug:\\s*"${slug}"[\\s\\S]*?thumbnail:\\s*)""`,
        "m"
      );
      s = s.replace(re2, `$1"${url}"`);
    }
  }
  fs.writeFileSync(file, s);
}

patchSeedImages(
  "src/data/seed.ts",
  [
    ["crispy-plantain-bites", "food-plantain-bites.png"],
    ["seafood-spring-rolls", "food-spring-rolls.png"],
    ["grilled-barracuda", "food-grilled-fish.png"],
    ["ndole-royal", "food-ndole.png"],
    ["chicken-suya-platter", "food-chicken-suya.png"],
    ["coconut-beignets", "food-beignets.png"],
    ["limbe-sunset", "drink-cocktail.png"],
    ["house-red-glass", "drink-wine.png"],
    ["fresh-ginger-juice", "drink-ginger.png"],
    ["champagne-toast", "drink-champagne.png"],
    ["classic-haircut", "spa-hair.png"],
    ["plaiting-braids", "spa-braids.png"],
    ["manicure", "spa-nails.png"],
    ["pedicure", "spa-nails.png"],
    ["sauna-session", "spa-sauna.png"],
    ["body-scrub", "spa-scrub.png"],
    ["relaxation-massage", "spa-massage.png"],
    ["classic-facial", "spa-facial.png"],
    ["ear-piercing", "spa-piercing.png"],
    ["bride-package", "spa-bride.png"],
    ["couples-day", "spa-couples.png"],
    ["shea-body-butter", "product-shea.png"],
    ["teal-glow-face-oil", "product-face-oil.png"],
    ["coastal-salt-scrub", "product-scrub.png"],
    ["hair-elixir", "product-hair-elixir.png"],
  ],
  "images"
);

patchSeedImages(
  "src/data/seed.ts",
  [
    ["night-at-wisdom-coastal-flavours", "blog-dining-night.png"],
    ["spa-tips-first-facial", "blog-facial-tips.png"],
    ["behind-scenes-bride-package", "blog-bride-package.png"],
  ],
  "blog"
);

patchSeedImages(
  "src/data/staff-seed.ts",
  [
    ["marie-ngo", "staff-marie.png"],
    ["daniel-okon", "staff-daniel.png"],
    ["blessing-ewane", "staff-blessing.png"],
  ],
  "staff"
);

console.log("seeds patched");
