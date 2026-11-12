import React from "react";

const CSS = `
.seo-prose{line-height:1.75;color:#374151;word-wrap:break-word;overflow-wrap:anywhere}
.seo-prose>*+*{margin-top:1em}
.seo-prose h1{font-size:1.9rem;font-weight:700;line-height:1.25;color:#111827}
.seo-prose h2{font-size:1.5rem;font-weight:700;line-height:1.3;color:#111827;margin-top:1.6em}
.seo-prose h3{font-size:1.2rem;font-weight:600;color:#111827;margin-top:1.4em}
.seo-prose h4{font-size:1.05rem;font-weight:600;color:#111827}
.seo-prose a{color:#7c3aed;text-decoration:underline}
.seo-prose ul{list-style:disc;padding-left:1.4em}
.seo-prose ol{list-style:decimal;padding-left:1.4em}
.seo-prose blockquote{border-left:4px solid #e5e7eb;padding-left:1em;color:#4b5563;font-style:italic}
.seo-prose img{max-width:100%;height:auto;border-radius:.75rem}
.seo-prose figure{margin:1.4em 0}
.seo-prose figcaption{font-size:.85rem;color:#6b7280;margin-top:.4em;text-align:center}
.seo-prose table{display:block;max-width:100%;overflow-x:auto;border-collapse:collapse}
.seo-prose th,.seo-prose td{border:1px solid #e5e7eb;padding:.5em .75em;text-align:left}
.seo-prose th{background:#f9fafb;font-weight:600}
.seo-prose hr{border:0;border-top:1px solid #e5e7eb;margin:2em 0}
`;

/** Renders server-sanitised HTML (the API sanitises on save and on read with a strict allow-list). */
export default function Prose({ html }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="seo-prose" dangerouslySetInnerHTML={{ __html: html || "" }} />
    </>
  );
}

export const Spinner = () => (
  <div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>
);
