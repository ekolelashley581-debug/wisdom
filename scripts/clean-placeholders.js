const fs = require("fs");
const path = require("path");

const seedPath = path.join("src", "data", "seed.ts");
let seed = fs.readFileSync(seedPath, "utf8");
seed = seed.replace(/images:\s*\[[^\]]*\/placeholders\/[^\]]*\]/g, "images: []");
seed = seed.replace(
  /featured_image:\s*"\/placeholders\/[^"]+"/g,
  'featured_image: ""'
);
seed = seed.replace(/og_image:\s*"\/placeholders\/[^"]+"/g, 'og_image: ""');
fs.writeFileSync(seedPath, seed);

function cleanObj(o) {
  if (Array.isArray(o)) {
    o.forEach(cleanObj);
    return;
  }
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o.images)) {
    o.images = o.images.filter((u) => !String(u).includes("/placeholders/"));
  }
  for (const key of ["featured_image", "og_image", "thumbnail", "photo_url"]) {
    if (typeof o[key] === "string" && o[key].includes("/placeholders/")) {
      o[key] = "";
    }
  }
  Object.values(o).forEach(cleanObj);
}

for (const f of [
  "data/menu.json",
  "data/products.json",
  "data/spa.json",
  "data/blog.json",
]) {
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  cleanObj(j);
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
}

console.log("cleaned placeholder paths");
