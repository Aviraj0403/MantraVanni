import Axios from "../../utils/Axios";

/** Subscriptions storefront API. Config fails soft (null = feature unavailable); customer calls throw so the UI can show the message. */
let cfgPromise = null;
export const loadSubsConfig = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/subscriptions/config", { timeout: 8000 })
      .then((r) => (r?.data?.success ? r.data.config : null))
      .catch(() => null);
  }
  return cfgPromise;
};

export const apiMessage = (e, fb = "Something went wrong. Please try again.") => e?.response?.data?.message || fb;

export const subscribe = async (payload) => (await Axios.post("/subscriptions/subscribe", payload, { timeout: 15000 })).data;
export const listMine = async () => (await Axios.get("/subscriptions/mine", { timeout: 10000 })).data?.subscriptions || [];
export const act = async (id, action) => (await Axios.post(`/subscriptions/${id}/${action}`, {}, { timeout: 12000 })).data?.subscription;
export const changeFrequency = async (id, frequencyDays) => (await Axios.put(`/subscriptions/${id}/frequency`, { frequencyDays }, { timeout: 12000 })).data?.subscription;
export const getAddresses = async () => (await Axios.get("/users/getaddresses", { withCredentials: true, timeout: 10000 })).data?.data || [];

export const isEligible = (cfg, productId) => {
  if (!cfg || !productId) return false;
  if (cfg.eligibility?.mode !== "selected") return true;
  const id = String(productId).toLowerCase();
  return (cfg.eligibility.productIds || []).some((x) => String(x).toLowerCase() === id);
};

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }) : "-");
