import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTiers, sendQuote, apiMessage, money } from "./api";

/** "Buy 10+ for Rs X" wholesale price tiers under Add to Cart (approved wholesale customers; retail only when the store opts in). Renders nothing otherwise. */
export default function TierBox({ product, variant }) {
  const { user } = useAuth() || {};
  const [data, setData] = useState(null);
  const [quote, setQuote] = useState(false);
  const [qty, setQty] = useState("10");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const pid = String(product?._id || product?.id || "");
  const size = variant?.size || "";

  useEffect(() => {
    let live = true;
    setData(null);
    if (!user || !pid) return undefined;
    getTiers(pid, size).then((d) => { if (live) setData(d); });
    return () => { live = false; };
  }, [user, pid, size]);

  if (!data?.success || !data.tiers?.length) return null;
  const submit = async () => {
    setState("busy"); setErr("");
    try { await sendQuote({ items: [{ productId: pid, size, qty: Number(qty) }], message: msg }); setState("done"); }
    catch (e) { setErr(apiMessage(e)); setState("idle"); }
  };
  return (
    <div className="mt-4 rounded-2xl border border-primary-200 bg-primary-50/40 p-4 text-sm" data-testid="wholesale-tiers">
      <p className="font-bold text-brand-text">{data.member ? "Your wholesale prices" : "Wholesale prices (apply at /wholesale)"}</p>
      <ul className="mt-2 space-y-1 text-brand-text/90">
        {data.tiers.map((t) => <li key={t.minQty}>{t.minQty > 1 ? `Buy ${t.minQty}+ for ` : "1 unit: "}<b>{money(t.unitPrice)}</b> each</li>)}
      </ul>
      {data.moq && <p className="mt-1 text-xs text-brand-text/70">Minimum order quantity: {data.moq}</p>}
      {data.retailPrice != null && <p className="mt-1 text-xs text-brand-text/60">Retail price {money(data.retailPrice)}. Wholesale prices apply in your cart and at checkout.</p>}
      {data.member && state !== "done" && !quote && <button type="button" onClick={() => setQuote(true)} className="mt-2 text-xs font-semibold text-primary-700 underline">Need a bigger quantity? Request a quote</button>}
      {quote && state !== "done" && (
        <div className="mt-3 space-y-2">
          <input aria-label="Quantity" type="number" min="1" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full rounded-xl border border-secondary-200 px-3 py-2 text-sm" />
          <textarea aria-label="Message" rows={2} maxLength={1500} placeholder="Anything we should know (delivery date, branding...)" value={msg} onChange={(e) => setMsg(e.target.value)} className="w-full rounded-xl border border-secondary-200 px-3 py-2 text-sm" />
          {err && <p className="text-xs text-rose-600" role="alert">{err}</p>}
          <button type="button" disabled={state === "busy" || !(Number(qty) >= 1)} onClick={submit} className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{state === "busy" ? "Sending..." : "Send quote request"}</button>
        </div>
      )}
      {state === "done" && <p className="mt-2 text-xs font-semibold text-emerald-700" role="status">Quote request sent. See replies under My account, Wholesale.</p>}
    </div>
  );
}
