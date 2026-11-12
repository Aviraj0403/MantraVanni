import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";

/**
 * Multi-language & currency (storefront side).
 *  - remembers the shopper's language + display currency in localStorage
 *  - adds the `x-lang` header to storefront GET requests (the backend swaps in translated product / category / banner text)
 *  - exposes formatDisplayPrice(inr): an APPROXIMATE display price in the chosen currency.
 *
 * Limits (by design): fixed storefront labels are not translated; formatDisplayPrice is NOT wired into existing pages (other components may
 * call it); checkout and payment are always in INR.
 */
const LANG_KEY = "mv_lang";
const CUR_KEY = "mv_cur";
const safe = (fn, fb = null) => { try { return fn(); } catch { return fb; } };

export const getStoredLang = () => safe(() => localStorage.getItem(LANG_KEY));
export const getStoredCurrency = () => safe(() => localStorage.getItem(CUR_KEY));

// ---- interceptor (installed once, when this module is first imported by the slot file)
let installed = false;
export const installLangInterceptor = () => {
  if (installed) return;
  installed = true;
  Axios.interceptors.request.use((config) => {
    try {
      const lang = getStoredLang();
      const method = String(config.method || "get").toLowerCase();
      if (lang && method === "get" && /^[a-z]{2}$/.test(lang)) {
        config.headers = config.headers || {};
        config.headers["x-lang"] = lang;
      }
    } catch { /* never block a request */ }
    return config;
  });
};
installLangInterceptor();

// ---- public config (one fetch per page load)
let cfgPromise = null;
let cfgValue = null;
const cfgListeners = new Set();
export const loadLangConfig = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/multi-language/languages", { timeout: 8000 })
      .then((r) => (r?.data?.success ? r.data : null))
      .catch(() => null)
      .then((c) => { cfgValue = c; cfgListeners.forEach((l) => l(c)); return c; });
  }
  return cfgPromise;
};
export const useLangConfig = () => {
  const [cfg, setCfg] = useState(cfgValue);
  useEffect(() => {
    const l = (c) => setCfg(c);
    cfgListeners.add(l);
    if (cfgValue) setCfg(cfgValue); else loadLangConfig();
    return () => cfgListeners.delete(l);
  }, []);
  return cfg;
};

// ---- choices
/** Changing language re-fetches everything translated: a simple full reload is the most reliable way. */
export const setLanguage = (code) => {
  if (!/^[a-z]{2}$/.test(String(code))) return;
  const changed = getStoredLang() !== code;
  safe(() => localStorage.setItem(LANG_KEY, code));
  safe(() => { document.documentElement.lang = code; });
  // If storage is blocked the choice cannot persist: do not reload (it would loop).
  if (changed && getStoredLang() === code) safe(() => window.location.reload());
};

const curListeners = new Set();
export const setCurrency = (code) => {
  if (code && !/^[A-Z]{3}$/.test(String(code))) return;
  safe(() => (code ? localStorage.setItem(CUR_KEY, code) : localStorage.removeItem(CUR_KEY)));
  curListeners.forEach((l) => l(code || ""));
};
export const useCurrencyChoice = () => {
  const [code, setCode] = useState(getStoredCurrency() || "");
  useEffect(() => { curListeners.add(setCode); return () => curListeners.delete(setCode); }, []);
  return code;
};

// ---- display price helper (pure maths mirrors the backend langCalc.convertFromInr)
export const convertFromInr = (inr, rateToInr) => {
  const a = Number(inr); const r = Number(rateToInr);
  if (!Number.isFinite(a) || !Number.isFinite(r) || r <= 0) return NaN;
  const v = a / r;
  return Math.sign(v) * Math.round((Math.abs(v) + Number.EPSILON) * 100) / 100;
};

/** Returns "≈ $11.98" for the shopper's chosen display currency, or "" when none is chosen / known. Import it where you want a hint under an INR price. */
export const formatDisplayPrice = (inr) => {
  const code = getStoredCurrency();
  if (!code || !cfgValue) return "";
  const cur = (cfgValue.currencies || []).find((c) => c.code === code);
  if (!cur) return "";
  const v = convertFromInr(inr, cur.rateToInr);
  return Number.isFinite(v) ? `≈ ${cur.symbol}${v.toFixed(2)}` : "";
};
