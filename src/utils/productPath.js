// Single source of truth for product page URLs.
// Prefers the product slug; falls back to the id so a product with a missing/empty slug still opens.
// The identifier is URL-encoded so unusual characters can never break the route.
export const productIdentifier = (p) => {
  if (p == null) return "";
  if (typeof p === "string" || typeof p === "number") return String(p).trim();
  const raw = p.slug || p.productSlug || p._id || p.id || p.productId || "";
  return String(raw).trim();
};

export const productPath = (p) => {
  const id = productIdentifier(p);
  return id ? `/product/${encodeURIComponent(id)}` : "/";
};
