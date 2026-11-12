import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useCartActions } from "../../hooks/useCartActions";
import { formatINR } from "../../utils/money";
import { productPath } from "../../utils/productPath";
import { fetchRecommendations, trackUpsell, cardToCartProduct, useUpsellConfig } from "./api";

/**
 * "Frequently bought together" for a set of product ids. `layout`: "strip" (cart, horizontal cards) | "list" (product page, compact rows).
 * Renders nothing while loading, when disabled, on failure or when there is nothing to suggest.
 */
export default function RecoList({ productIds, source, layout = "strip" }) {
  const cfg = useUpsellConfig();
  const { addToCart } = useCartActions();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState("");
  const [added, setAdded] = useState({});
  const seen = useRef(new Set());
  const key = [...new Set(productIds || [])].sort().join(",");

  useEffect(() => {
    let live = true;
    if (!cfg || !cfg.crossSell?.enabled || !key) { setItems([]); return undefined; }
    fetchRecommendations(key.split(",")).then((p) => { if (live) setItems(p.slice(0, cfg.crossSell.maxItems || 4)); });
    return () => { live = false; };
  }, [key, cfg]);

  useEffect(() => {
    items.forEach((p) => {
      const k = `${source}:${p._id}`;
      if (!seen.current.has(k)) { seen.current.add(k); trackUpsell("impression", p._id, source); }
    });
  }, [items, source]);

  if (!cfg || !cfg.crossSell?.enabled || !items.length) return null;

  const add = async (c) => {
    if (busy) return;
    setBusy(c._id);
    try {
      const v = c.variant || {};
      const r = await addToCart(cardToCartProduct(c), v.size || "default", v.color || "default", 1);
      if (r?.success) { trackUpsell("add", c._id, source); setAdded((a) => ({ ...a, [c._id]: true })); setTimeout(() => setAdded((a) => ({ ...a, [c._id]: false })), 2500); }
    } catch { /* never break the page */ }
    setBusy("");
  };

  const AddBtn = ({ c, compact }) => (
    <button type="button" onClick={() => add(c)} disabled={busy === c._id}
      aria-label={`Add ${c.name} to cart`}
      className={`inline-flex items-center justify-center gap-1 rounded-full bg-primary-600 font-semibold text-white transition hover:bg-primary-700 active:scale-95 disabled:opacity-60 ${compact ? "h-8 px-3 text-xs" : "h-9 w-full text-sm"}`}>
      {added[c._id] ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add</>}
    </button>
  );

  const Price = ({ c }) => (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-bold text-gray-900">{formatINR(c.price)}</span>
      {c.realPrice > c.price && <span className="text-xs text-gray-400 line-through">{formatINR(c.realPrice)}</span>}
    </div>
  );

  const title = cfg.messages?.crossSellTitle || "Frequently bought together";

  if (layout === "list") {
    return (
      <section className="mt-4 rounded-2xl border border-primary-100 bg-white/70 p-3" aria-label={title}>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
        <ul className="divide-y divide-gray-100">
          {items.map((c) => (
            <li key={c._id} className="flex items-center gap-3 py-2">
              <Link to={productPath(c)} className="shrink-0"><img src={c.image} alt={c.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" /></Link>
              <div className="min-w-0 flex-1">
                <Link to={productPath(c)} className="line-clamp-1 text-sm font-medium text-gray-800">{c.name}</Link>
                <Price c={c} />
              </div>
              <AddBtn c={c} compact />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mb-4 rounded-2xl border border-primary-100 bg-white/70 p-3 sm:p-4" aria-label={title}>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">{title}</h3>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
        {items.map((c) => (
          <div key={c._id} className="w-36 shrink-0 snap-start rounded-xl border border-gray-100 bg-white p-2 sm:w-40">
            <Link to={productPath(c)}><img src={c.image} alt={c.name} loading="lazy" className="aspect-square w-full rounded-lg object-cover" /></Link>
            <Link to={productPath(c)} className="mt-2 block line-clamp-2 min-h-[2.5rem] text-xs font-medium text-gray-800 sm:text-sm">{c.name}</Link>
            <div className="my-1"><Price c={c} /></div>
            <AddBtn c={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
