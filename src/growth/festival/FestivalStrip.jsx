import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Copy, Check } from "lucide-react";
import Axios from "../../utils/Axios";

/**
 * Festival announcement strip (layout.top slot). One GET /festival-campaigns/active per page load (shared promise), nothing on failure.
 * Dismissal is remembered per campaign in sessionStorage. Everything from the API is re-validated here before it touches the DOM.
 */
let promise = null;
const loadActive = () => {
  if (!promise) {
    promise = Axios.get("/festival-campaigns/active", { timeout: 8000 })
      .then((r) => (r?.data?.success ? { campaign: r.data.campaign || null, config: r.data.config || {} } : null))
      .catch(() => null);
  }
  return promise;
};

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const hex = (v, fb) => (typeof v === "string" && HEX.test(v) ? v : fb);
const kind = (l) => {
  if (typeof l !== "string" || !l || /[\s\\<>"'`]/.test(l)) return null;
  if (l.startsWith("/") && !l.startsWith("//")) return "internal";
  if (/^https:\/\/[^\s]+$/i.test(l)) return "external";
  return null;
};
const dismissKey = (id) => `festival-strip-dismissed:${id}`;
const wasDismissed = (id) => { try { return sessionStorage.getItem(dismissKey(id)) === "1"; } catch { return false; } };

export default function FestivalStrip() {
  const [state, setState] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    loadActive().then((s) => { if (alive && s?.campaign?.id) { setState(s); setHidden(wasDismissed(s.campaign.id)); } });
    return () => { alive = false; };
  }, []);

  const c = state?.campaign;
  if (!c || hidden || !c.title) return null;
  const bg = hex(c.colors?.bg, "#b45309");
  const fg = hex(c.colors?.text, "#ffffff");
  const dismissible = state.config?.dismissible !== false;
  const sticky = state.config?.position === "sticky";
  const k = c.ctaText ? kind(c.ctaLink) : null;

  const close = () => { try { sessionStorage.setItem(dismissKey(c.id), "1"); } catch { /* storage blocked */ } setHidden(true); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(c.couponCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  const btnCls = "rounded-md border px-2.5 py-0.5 text-xs font-semibold underline-offset-2 hover:underline";

  return (
    <div role="region" aria-label={c.name || "Announcement"} style={{ backgroundColor: bg, color: fg }} className={`relative w-full px-10 py-2 text-center text-sm ${sticky ? "sticky top-0 z-40" : ""}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-semibold">{c.title}</span>
        {c.message && <span>{c.message}</span>}
        {c.couponCode && (
          <button type="button" onClick={copy} aria-label={`Copy coupon code ${c.couponCode}`} style={{ borderColor: fg }} className="inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 font-mono text-xs tracking-wide">
            {c.couponCode}{copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
        {k === "internal" && <Link to={c.ctaLink} style={{ borderColor: fg }} className={btnCls}>{c.ctaText}</Link>}
        {k === "external" && <a href={c.ctaLink} target="_blank" rel="noopener noreferrer" style={{ borderColor: fg }} className={btnCls}>{c.ctaText}</a>}
      </div>
      {dismissible && (
        <button type="button" onClick={close} aria-label="Close announcement" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 opacity-80 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
