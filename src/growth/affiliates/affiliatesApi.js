import Axios from "../../utils/Axios";

/** Affiliate storefront API (/v1/api/affiliates) plus the small localStorage capture helpers. */
export const getAffiliateConfig = async () => (await Axios.get("/affiliates/config", { timeout: 8000 })).data;
export const getMyAffiliate = async () => (await Axios.get("/affiliates/me")).data;
export const applyAffiliate = async (body) => (await Axios.post("/affiliates/apply", body)).data;
export const attachAffiliateCode = async (code) => (await Axios.post("/affiliates/attach", { code }, { timeout: 8000 })).data;

const KEY = "aff_attr";
const DAY = 86400000;
export const normalizeCode = (raw) => {
  if (typeof raw !== "string") return "";
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z0-9]{4,12}$/.test(s) ? s : "";
};
/** ?aff=CODE, ?ref=CODE or utm_source=affiliate&utm_campaign=CODE */
export const codeFromSearch = (search) => {
  try {
    const p = new URLSearchParams(search || "");
    const direct = normalizeCode(p.get("aff") || p.get("ref") || "");
    if (direct) return direct;
    if (String(p.get("utm_source") || "").toLowerCase() === "affiliate") return normalizeCode(p.get("utm_campaign") || "");
  } catch { /* ignore */ }
  return "";
};
export const storeAffiliateCode = (code, cookieDays) => {
  try { localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now(), days: cookieDays })); } catch { /* storage unavailable */ }
};
export const readAffiliateCode = (cookieDays) => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!v || !normalizeCode(v.code)) return null;
    const days = Math.max(1, Math.min(90, Number(cookieDays) || Number(v.days) || 30));
    if (!(Date.now() - Number(v.at) <= days * DAY)) { localStorage.removeItem(KEY); return null; }
    return v;
  } catch { return null; }
};
