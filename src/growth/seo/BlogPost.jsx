import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import NotFoundPage from "../../pages/PNF/NotFoundPage.jsx";
import { getPost, getSeoConfig } from "./seoApi";
import Prose, { Spinner } from "./Prose.jsx";

const fmt = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { dateStyle: "long" }); } catch { return ""; } };

/** /blog/:slug  (seoCms:post). Sets title / description / canonical / og tags and Article JSON-LD. */
export default function BlogPost() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, post: null, cfg: {} });

  useEffect(() => {
    let live = true;
    setState({ loading: true, post: null, cfg: {} });
    Promise.all([getPost(slug).catch(() => null), getSeoConfig()]).then(([post, cfg]) => live && setState({ loading: false, post, cfg }));
    return () => { live = false; };
  }, [slug]);

  const { post, cfg } = state;
  const image = post ? post.ogImage || post.coverImage || cfg.defaultOgImage || undefined : undefined;
  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: (post.seoTitle || post.title).slice(0, 110),
      description: post.seoDescription || post.excerpt || undefined,
      image: image ? [image] : undefined,
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || post.publishedAt || undefined,
      author: { "@type": "Person", name: post.authorName || cfg.siteName || "Editorial team" },
      publisher: cfg.siteName ? { "@type": "Organization", name: cfg.siteName } : undefined,
      mainEntityOfPage: url ? { "@type": "WebPage", "@id": url } : undefined,
    };
  }, [post, cfg, slug, image]);

  usePageMeta({
    title: post ? post.seoTitle || post.title : undefined,
    description: post ? post.seoDescription || post.excerpt || undefined : undefined,
    canonical: post ? `/blog/${slug}` : undefined,
    image,
    jsonLd,
    noindex: !!post?.noindex,
  });

  if (state.loading) return <Spinner />;
  if (!post) return <NotFoundPage />;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb"><Link to="/blog" className="hover:underline">{cfg.blogTitle || "Blog"}</Link></nav>
      <article>
        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-gray-500">{[post.authorName, fmt(post.publishedAt)].filter(Boolean).join(" · ")}</p>
        {post.coverImage && <img src={post.coverImage} alt="" className="mt-6 w-full rounded-2xl object-cover" loading="eager" />}
        <div className="mt-8"><Prose html={post.body} /></div>
        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">#{t}</Link>)}
          </div>
        )}
      </article>
    </main>
  );
}
