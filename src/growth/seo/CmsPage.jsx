import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import NotFoundPage from "../../pages/PNF/NotFoundPage.jsx";
import { getCmsPage, getSeoConfig } from "./seoApi";
import Prose, { Spinner } from "./Prose.jsx";

/** /page/:slug  (seoCms:page) */
export default function CmsPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, page: null, cfg: {} });

  useEffect(() => {
    let live = true;
    setState({ loading: true, page: null, cfg: {} });
    Promise.all([getCmsPage(slug).catch(() => null), getSeoConfig()]).then(([page, cfg]) => live && setState({ loading: false, page, cfg }));
    return () => { live = false; };
  }, [slug]);

  const { page, cfg } = state;
  usePageMeta({
    title: page ? page.seoTitle || page.title : undefined,
    description: page ? page.seoDescription || undefined : undefined,
    canonical: page ? `/page/${slug}` : undefined,
    image: page ? page.ogImage || cfg.defaultOgImage || undefined : undefined,
    noindex: !!page?.noindex,
  });

  if (state.loading) return <Spinner />;
  if (!page) return <NotFoundPage />;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">{page.title}</h1>
      <Prose html={page.body} />
    </main>
  );
}
