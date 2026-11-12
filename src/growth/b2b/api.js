import Axios from "../../utils/Axios";

/** Wholesale storefront API. Config fails soft (null = feature unavailable); customer calls throw so the UI can show the message. */
let cfgPromise = null;
export const loadB2bConfig = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/b2b-wholesale/config", { timeout: 8000 })
      .then((r) => (r?.data?.success ? r.data.config : null))
      .catch(() => null);
  }
  return cfgPromise;
};

export const apiMessage = (e, fb = "Something went wrong. Please try again.") => e?.response?.data?.message || fb;
export const getMe = async () => (await Axios.get("/b2b-wholesale/me", { timeout: 10000 })).data?.me || null;
export const apply = async (payload) => (await Axios.post("/b2b-wholesale/apply", payload, { timeout: 15000 })).data;
export const listQuotes = async () => (await Axios.get("/b2b-wholesale/quotes", { timeout: 10000 })).data?.quotes || [];
export const sendQuote = async (payload) => (await Axios.post("/b2b-wholesale/quote", payload, { timeout: 15000 })).data;
export const getTiers = async (productId, size) => {
  try { return (await Axios.get("/b2b-wholesale/tiers", { params: { productId, size: size || undefined }, timeout: 8000 })).data || null; } catch { return null; }
};

export const money = (n) => `Rs ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }) : "-");
