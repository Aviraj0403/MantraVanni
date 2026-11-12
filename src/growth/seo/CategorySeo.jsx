import { useEffect, useState } from "react";
import usePageMeta from "../../hooks/usePageMeta";
import { getOverride } from "./seoApi";

/**
 * categoryPage.seo slot: renders nothing. Applies the category's SEO override (title, description, og image, noindex) through usePageMeta.
 * The category page sets its own tags first, so the override is applied one tick later to win.
 */
export default function CategorySeo({ categorySlug }) {
  const [override, setOverride] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    setOverride(null);
    if (categorySlug) getOverride("category", categorySlug).then((o) => live && setOverride(o));
    return () => { live = false; };
  }, [categorySlug]);

  useEffect(() => {
    setReady(false);
    const h = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(h);
  }, [categorySlug, override]);

  const on = ready && !!override;
  usePageMeta({
    title: on ? override.title || undefined : undefined,
    description: on ? override.description || undefined : undefined,
    image: on ? override.ogImage || undefined : undefined,
    canonical: on ? window.location.pathname : undefined,
    noindex: on && !!override.noindex,
  });
  return null;
}
