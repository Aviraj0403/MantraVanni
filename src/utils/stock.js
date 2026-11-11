// Stock helpers. The API exposes `stockQty` on the product and/or the selected variant; some list
// endpoints only expose an `inStock` flag. Unknown stock is treated as purchasable (the server is
// the final authority and rejects out-of-stock orders with 409 OUT_OF_STOCK).
const asNumber = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export const getStockQty = (product, variant) => {
  const v = variant && !Array.isArray(variant) ? variant : (!Array.isArray(product?.variants) ? product?.variants : null);
  const fromVariant = asNumber(v?.stockQty ?? v?.stock);
  if (fromVariant !== null) return fromVariant;
  return asNumber(product?.stockQty ?? product?.stock);
};

export const isOutOfStock = (product, variant) => {
  const qty = getStockQty(product, variant);
  if (qty !== null) return qty <= 0;
  return product?.inStock === false;
};
