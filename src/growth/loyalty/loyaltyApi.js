import Axios from "../../utils/Axios";

/** Loyalty storefront API (/v1/api/loyalty). Config is fetched once and shared; failures resolve to null (feature simply hidden). */
let cfgPromise = null;
export const getLoyaltyPublicConfig = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/loyalty/config", { timeout: 8000 })
      .then((r) => (r?.data?.success ? r.data.config : null))
      .catch(() => null);
  }
  return cfgPromise;
};

export const getMyLoyalty = async () => (await Axios.get("/loyalty/me")).data;
export const getMyLoyaltyHistory = async (page = 1) => (await Axios.get("/loyalty/history", { params: { page } })).data;
export const redeemLoyaltyPoints = async (points, key) =>
  (await Axios.post("/loyalty/redeem", { points, key }, { headers: { "Idempotency-Key": key } })).data;

export const newKey = () => {
  try { if (globalThis.crypto?.randomUUID) return `rd-${globalThis.crypto.randomUUID()}`; } catch { /* fall through */ }
  return `rd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

/** Mirrors the server maths: floor(price * multiplier / earnPerRupees), exact in paise. */
export const pointsForPrice = (price, multiplier, earnPerRupees) => {
  const paise = Math.round((Number(price) || 0) * 100);
  const m = Math.round((Number(multiplier) || 0) * 100);
  const den = Math.round((Number(earnPerRupees) || 0) * 100) * 100;
  if (!(den > 0) || paise <= 0) return 0;
  const a = paise * m;
  return (a - (a % den)) / den;
};
