import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import { getPostList, getSeoConfig } from "./seoApi";
import { Spinner } from "./Prose.jsx";

const fmt = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }); } catch { return ""; } };

/** /blog  (seoCms:blog): cards, tag filter, pagination (?page=&tag=). */
export default function BlogIndex() {
  const [sp, setSp] = useSearchParams();
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const tag = (sp.get("tag") || "").slice(0, 60);
  const [state, setState] = useState({ loading: true, data: null, cfg: {}, failed: false });

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true }));
    Promise.all([getPostList(page, tag).catch(() => null), getSeoConfig()]).then(([data, cfg]) => live && setState({ loading: false, data, cfg, failed: !data }));
    return () => { live = false; };
  }, [page, tag]);

  const { data, cfg } = state;
  const title = cfg.blogTitle || data?.blogTitle || "Blog";
  usePageMeta({
    title: tag ? `#${tag} | ${title}` : title,
    description: cfg.blogDescription || data?.blogDescription || undefined,
    canonical: "/blog",
    image: cfg.defaultOgImage || undefined,
    noindex: !!tag || page > 1,
  });

  const go = (p, t) => { const n = new URLSearchParams(); if (t) n.set("tag", t); if (p > 1) n.set("page", String(p)); setSp(n); window.scrollTo({ top: 0 }); };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
      {(cfg.blogDescription || data?.blogDescription) && <p className="mt-2 max-w-2xl text-gray-600">{cfg.blogDescription || data?.blogDescription}</p>}

      {data?.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button type="button" onClick={() => go(1, "")} className={`rounded-full px-3 py-1.5 text-sm ${!tag ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>All</button>
          {data.tags.map((t) => (
            <button key={t.tag} type="button" onClick={() => go(1, t.tag)} className={`rounded-full px-3 py-1.5 text-sm ${tag === t.tag ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>#{t.tag}</button>
          ))}
        </div>
      )}

      {state.loading && !data ? <Spinner /> : state.failed ? (
        <p className="mt-10 text-gray-500">We could not load the blog right now. Please try again later.</p>
      ) : data.posts.length === 0 ? (
        <p className="mt-10 text-gray-500">No posts yet. Please check back soon.</p>
      ) : (
        <div className={`mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${state.loading ? "opacity-60" : ""}`}>
          {data.posts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md">
              {p.coverImage ? <img src={p.coverImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" /> : <div className="aspect-[16/9] w-full bg-gray-100" />}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{p.excerpt}</p>
                <p className="mt-auto pt-3 text-xs text-gray-500">{[p.authorName, fmt(p.publishedAt)].filter(Boolean).join(" · ")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
          <button type="button" disabled={page <= 1} onClick={() => go(page - 1, tag)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-600">{page} / {data.totalPages}</span>
          <button type="button" disabled={page >= data.totalPages} onClick={() => go(page + 1, tag)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">Next</button>
        </nav>
      )}
    </main>
  );
}
