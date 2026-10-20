// Shared, client-safe catalogue helpers: categories, ids and image urls.

export const CATEGORIES = [
  {
    code: "mpt",
    title: "Most Popular Tours",
    short: "Popular",
    blurb: "The island's greatest hits — falls, rivers, jerk and beaches.",
  },
  {
    code: "at",
    title: "Airport Transfers",
    short: "Transfers",
    blurb: "Private rides from Sangster International to wherever you're staying.",
  },
  {
    code: "ctp",
    title: "Combo Tour Packages",
    short: "Combos",
    blurb: "Two or three stops in one day, one driver, one price.",
  },
  {
    code: "abc",
    title: "Attractions / Beach / City Tours",
    short: "Attractions",
    blurb: "Beaches, great houses, markets and city days out.",
  },
  {
    code: "cse",
    title: "Cruise Shore Excursions",
    short: "Shore days",
    blurb: "Port pickups timed so you're back before all-aboard.",
  },
  {
    code: "edt",
    title: "Eating / Dining Tours",
    short: "Food",
    blurb: "Jerk pits, seafood shacks and the island's best plates.",
  },
  {
    code: "egt",
    title: "Exclusive Golf Tours",
    short: "Golf",
    blurb: "Tee times at the north coast's championship courses.",
  },
  {
    code: "ncb",
    title: "Night Life / Casino / Bar Tours",
    short: "Nightlife",
    blurb: "Safe rides to the clubs, casinos and rum bars.",
  },
  {
    code: "st",
    title: "Shopping Tours",
    short: "Shopping",
    blurb: "Craft markets, malls and duty-free runs.",
  },
];

export function getCategory(code) {
  return (
    CATEGORIES.find((c) => c.code === code) || {
      code,
      title: "Other Tours",
      short: "Other",
      blurb: "",
    }
  );
}

// Product ids are `${category}-${n}`. Firestore returns docs ordered by id as
// a string (mpt-1, mpt-10, mpt-11 … mpt-9), so "last in the list" is not the
// highest number — always take the numeric max.
export function nextProductId(products, category) {
  const max = products
    .filter((p) => p.id?.startsWith(`${category}-`))
    .map((p) => parseInt(p.id.slice(category.length + 1), 10))
    .filter((n) => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${category}-${max + 1}`;
}

// Uploaded images carry an imageUrl; the original catalogue images live in
// /public/<category>/<id>.<ext>.
export function productImage(product) {
  if (product?.imageUrl) return product.imageUrl;
  if (!product?.id) return "/local/hero-5.jpg";
  return `/${product.id.split("-").shift()}/${product.id}.${
    product.imageExtension || "webp"
  }`;
}

// Location price keys are every key containing "price" except the range.
export function priceKeys(product) {
  if (!product) return [];
  return Object.keys(product).filter(
    (key) =>
      key.toLowerCase().includes("price") &&
      key !== "priceLowest" &&
      key !== "priceHighest"
  );
}

export function sortByPrice(products) {
  return [...products].sort(
    (a, b) => parseFloat(a.priceLowest) - parseFloat(b.priceLowest)
  );
}

export function formatMoney(value) {
  const n = parseFloat(value);
  if (isNaN(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
