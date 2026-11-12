import Axios from "../../utils/Axios";

/** Gift cards storefront API (/v1/api/gift-cards). Config fails soft (null); actions throw so the UI can show the server message. */
export const getGiftConfig = () =>
  Axios.get("/gift-cards/config", { timeout: 8000 }).then((r) => (r?.data?.success ? r.data.config : null)).catch(() => null);

export const redeemGiftCard = (code) => Axios.post("/gift-cards/redeem", { code }).then((r) => r.data);
export const checkGiftCard = (code) => Axios.post("/gift-cards/balance-check", { code }).then((r) => r.data);
export const startGiftPurchase = (body) => Axios.post("/gift-cards/purchase", body).then((r) => r.data);
export const verifyGiftPurchase = (body) => Axios.post("/gift-cards/purchase/verify", body).then((r) => r.data);
export const getMyGiftPurchases = () => Axios.get("/gift-cards/purchases").then((r) => r.data?.purchases || []).catch(() => []);

export const apiMessage = (e, fallback) => {
  const st = e?.response?.status;
  const m = e?.response?.data?.message;
  return st && st < 500 && m ? m : fallback;
};
