import React, { useCallback, useEffect, useState } from "react";
import { getGallery } from "./ugcApi";

/** "Customer photos & videos" strip with a simple lightbox. Renders nothing when empty or on any failure. */
export default function Gallery({ productId }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    let live = true;
    setItems([]);
    if (productId) getGallery(productId).then((r) => live && setItems(Array.isArray(r) ? r : [])).catch(() => {});
    return () => { live = false; };
  }, [productId]);

  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + items.length) % items.length)), [items.length]);
  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (!items.length) return null;
  const cur = open >= 0 ? items[open] : null;

  return (
    <section className="py-6" aria-label="Customer photos and videos">
      <h3 className="mb-3 text-lg font-semibold text-brand-text">Customer photos &amp; videos</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {items.map((m, i) => (
          <button key={m.url} type="button" onClick={() => setOpen(i)} aria-label={m.type === "video" ? "Play customer video" : "View customer photo"}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-secondary-200 bg-gray-100 sm:h-28 sm:w-28">
            <img src={m.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            {m.type === "video" && <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-2xl text-white" aria-hidden="true">&#9654;</span>}
          </button>
        ))}
      </div>
      {cur && (
        <div role="dialog" aria-modal="true" aria-label="Customer media" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={close}>
          <div className="relative max-h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {cur.type === "video"
              ? <video key={cur.url} src={cur.url} poster={cur.thumb} controls autoPlay playsInline preload="metadata" className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg bg-black" />
              : <img src={cur.url} alt="" className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain" />}
            <div className="mt-3 text-center text-sm text-white">
              <span className="text-yellow-400">{"★".repeat(cur.rating || 0)}</span> <span className="opacity-90">{cur.userName}</span>
              {cur.comment && <p className="mx-auto mt-1 max-w-xl text-xs opacity-80">{cur.comment}</p>}
            </div>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute left-0 top-1/3 rounded-full bg-white/20 px-3 py-2 text-white">&#8249;</button>
                <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute right-0 top-1/3 rounded-full bg-white/20 px-3 py-2 text-white">&#8250;</button>
              </>
            )}
            <button type="button" onClick={close} aria-label="Close" className="absolute -top-2 right-0 rounded-full bg-white/20 px-3 py-1 text-xl text-white">&times;</button>
          </div>
        </div>
      )}
    </section>
  );
}
