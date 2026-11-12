import React, { useEffect } from "react";
import { Globe } from "lucide-react";
import { useLangConfig, getStoredLang, setLanguage, useCurrencyChoice, setCurrency } from "./langStore";

/** Compact language + display-currency bar (slot layout.top). Renders nothing when the store has nothing to choose from. */
export default function LangBar() {
  const cfg = useLangConfig();
  const curChoice = useCurrencyChoice();

  // First visit: optionally pick the browser language (only if it is enabled). Remember the outcome so this never loops.
  useEffect(() => {
    if (!cfg) return;
    try {
      const stored = getStoredLang();
      if (!stored) {
        let pick = cfg.defaultLanguage;
        if (cfg.detectBrowserLanguage) {
          const nav = String(navigator.language || "").slice(0, 2).toLowerCase();
          if ((cfg.languages || []).some((l) => l.code === nav)) pick = nav;
        }
        setLanguage(pick);
      } else {
        document.documentElement.lang = stored;
      }
    } catch { /* ignore */ }
  }, [cfg]);

  if (!cfg || cfg.showSelector === false) return null;
  const langs = cfg.languages || [];
  const curs = cfg.currencies || [];
  if (langs.length < 2 && curs.length === 0) return null;
  const current = getStoredLang() || cfg.defaultLanguage;
  const selCls = "max-w-[48vw] cursor-pointer rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400";
  return (
    <div className="w-full border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-3 py-1 text-xs text-gray-600 sm:gap-3">
        <Globe size={14} aria-hidden="true" />
        {langs.length > 1 && (
          <select aria-label="Language" className={selCls} value={langs.some((l) => l.code === current) ? current : cfg.defaultLanguage} onChange={(e) => setLanguage(e.target.value)}>
            {langs.map((l) => <option key={l.code} value={l.code}>{l.nativeLabel || l.label}</option>)}
          </select>
        )}
        {curs.length > 0 && (
          <select aria-label="Display currency (approximate)" title="Approximate display only. You always pay in INR." className={selCls} value={curChoice} onChange={(e) => setCurrency(e.target.value)}>
            <option value="">{"INR (₹)"}</option>
            {curs.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
