import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";

/** Upsell storefront API. Everything fails soft: callers get null / [] and render nothing. */
let cfgPromise = null;
export const loadUpsellConfig = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/upsell/config", { timeout: 8000 })
      .then((r) => (r?.data?.success ? r.data.config : null))
      .catch(() => null);
  }
  return cfgPromise;
};

export const useUpsellConfig = () => {
  const [cfg, setCfg] = useState(undefined); // undefined = loading, null = unavailable
  useEffect(() => {
    let live = true;
    loadUpsellConfig().then((c) => live && setCfg(c));
    return () => { live = false; };
  }, []);
  return cfg;
};

export const fetchRecommendations = async (productIds) => {
  const ids = [...new Set((productIds || []).filter((i) => /^[a-f0-9]{24}$/i.test(String(i))).map(String))].slice(0, 10);
  if (!ids.length) return [];
  try {
    const r = await Axios.get("/upsell/recommendations", { params: { productIds: ids.join(",") }, timeout: 8000 });
    return Array.isArray(r?.data?.products) ? r.data.products : [];
  } catch {
    return [];
  }
};

/** Fire-and-forget; never throws. */
export const trackUpsell = (event, productId, source) => {
  try { Axios.post("/upsell/track", { event, productId, source }, { timeout: 4000 }).catch(() => {}); } catch { /* ignore */ }
};

export const fill = (tpl, vars) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

/** Card from the API -> the product shape useCartActions().addToCart expects (same as ProductCard: a single `variants` object). */
export const cardToCartProduct = (c) => ({
  _id: c._id, name: c.name, slug: c.slug, pimage: c.image, discount: c.discount || 0,
  variants: { size: c.variant?.size, color: c.variant?.color, price: c.variant?.price, stockQty: c.variant?.stockQty },
});
