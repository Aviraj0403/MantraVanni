import { useEffect, useState } from "react";
import usePageMeta from "../../hooks/usePageMeta";
import { getOverride } from "./seoApi";

/**
 * productPage.seo slot: renders nothing. Applies the product's SEO override (title, description, og image, noindex) through usePageMeta.
 * The product page sets its own tags in an effect that runs AFTER this child's effect, so the override is applied one tick later
 * (and again whenever the variant changes) so that it wins.
 */
export default function ProductSeo({ product, variant }) {
  const id = product?._id || product?.id || null;
  const [override, setOverride] = useState(null);
  const [ready, setReady] = useState(false);
  const variantKey = variant?._id || variant?.sku || variant?.size || "";

  useEffect(() => {
    let live = true;
    setOverride(null);
    if (id) getOverride("product", id).then((o) => live && setOverride(o));
    return () => { live = false; };
  }, [id]);

  useEffect(() => {
    setReady(false);
    const h = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(h);
  }, [id, variantKey, override]);

  const on = ready && !!override;
  usePageMeta({
    title: on ? override.title || undefined : undefined,
    description: on ? override.description || undefined : undefined,
    image: on ? override.ogImage || undefined : undefined,
    canonical: on && id ? window.location.pathname : undefined,
    noindex: on && !!override.noindex,
  });
  return null;
}
