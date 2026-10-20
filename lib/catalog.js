// Shared, client-safe catalogue helpers: categories, ids and image urls.

export const CATEGORIES = [
  {
    code: "mpt",
    title: "Most Popular Tours",
    short: "Popular Tours",
  },
  {
    code: "at",
    title: "Airport Transfers",
    short: "Airport Transfers",
  },
  {
    code: "ctp",
    title: "Combo Tour Packages",
    short: "Combo Packages",
  },
  {
    code: "abc",
    title: "Attractions / Beach / City Tours",
    short: "Attractions",
  },
  {
    code: "cse",
    title: "Cruise Shore Excursions",
    short: "Cruise Excursions",
  },
  {
    code: "edt",
    title: "Eating / Dining Tours",
    short: "Dining Tours",
  },
  {
    code: "egt",
    title: "Exclusive Golf Tours",
    short: "Golf Tours",
  },
  {
    code: "ncb",
    title: "Night Life / Casino / Bar Tours",
    short: "Nightlife Tours",
  },
  {
    code: "st",
    title: "Shopping Tours",
    short: "Shopping Tours",
  },
];

export function getCategory(code) {
  return (
    CATEGORIES.find((c) => c.code === code) || {
      code,
      title: "Other Tours",
      short: "Other",
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
