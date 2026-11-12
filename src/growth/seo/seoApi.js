import Axios from "../../utils/Axios";

/** Public SEO & content API (/seo-cms). Failures reject; callers render nothing / not-found. */
const B = "/seo-cms";
const get = async (path, params) => (await Axios.get(`${B}${path}`, { params, timeout: 10000 }))?.data || {};

let configP = null;
export const getSeoConfig = () => {
  if (!configP) configP = get("/config").then((r) => r.config || {}).catch(() => ({}));
  return configP;
};
export const getPost = (slug) => get(`/posts/${encodeURIComponent(slug)}`).then((r) => r.post);
export const getPostList = (page, tag) => get("/posts", { page, ...(tag ? { tag } : {}) });
export const getCmsPage = (slug) => get(`/pages/${encodeURIComponent(slug)}`).then((r) => r.page);

const overrideCache = new Map();
export const getOverride = (type, ref) => {
  const k = `${type}:${ref || ""}`;
  if (!overrideCache.has(k)) overrideCache.set(k, get("/seo/override", { type, ...(ref ? { ref } : {}) }).then((r) => r.override || null).catch(() => null));
  return overrideCache.get(k);
};

let redirectsP = null;
export const getRedirects = () => {
  if (!redirectsP) redirectsP = get("/redirects").then((r) => r.redirects || {}).catch(() => ({}));
  return redirectsP;
};
export const reportRedirectHit = (from) => { Axios.post(`${B}/redirects/hit`, { from }, { timeout: 5000 }).catch(() => {}); };
