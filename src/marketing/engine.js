// Marketing engine: Meta Pixel loader, consent, track() with server mirroring. Loaded lazily (only when marketing is enabled).
import { readAttribution, captureAttribution } from "./attribution";

const CONSENT_KEY = "mv_consent";
const PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";
const MIRRORED = new Set(["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Search", "AddPaymentInfo"]);
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://apicrm.jdinfotechsolutions.in/v1/api";

const state = { cfg: null, consent: null, pixelReady: false, bannerOpen: false, version: 0 };
const listeners = new Set();
const emit = () => {
  state.version += 1;
  listeners.forEach((l) => { try { l(); } catch { /* ignore */ } });
};

export const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export const getSnapshot = () => state.version;
export const getState = () => state;

function readConsent() {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return c && c.v === 1 && (c.choice === "accept" || c.choice === "decline") ? c.choice : null;
  } catch {
    return null;
  }
}

/** Is tracking allowed right now (consent not needed, or accepted)? */
export const isAllowed = () => !!state.cfg && (!state.cfg.consentRequired || state.consent === "accept");

const dismissedThisSession = () => {
  try { return sessionStorage.getItem("mv_consent_dismissed") === "1"; } catch { return false; }
};

function loadPixel() {
  const id = state.cfg?.pixelId;
  if (!id || state.pixelReady || typeof window === "undefined") return;
  if (!window.fbq) {
    const n = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = PIXEL_SRC;
    document.head.appendChild(s);
  }
  if (state.cfg.consentRequired) window.fbq("consent", "revoke");
  window.fbq("init", id);
  if (isAllowed()) window.fbq("consent", "grant");
  state.pixelReady = true;
}

export function initEngine(cfg) {
  state.cfg = { pixelId: String(cfg.pixelId || ""), consentRequired: !!cfg.consentRequired };
  state.consent = readConsent();
  captureAttribution();
  if (isAllowed()) loadPixel();
  state.bannerOpen = state.cfg.consentRequired && !state.consent && !dismissedThisSession();
  emit();
}

export function setConsent(choice) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: 1, choice, ts: Date.now() }));
  } catch { /* storage unavailable */ }
  state.consent = choice;
  state.bannerOpen = false;
  try { sessionStorage.removeItem("mv_consent_dismissed"); } catch { /* ignore */ }
  try {
    if (choice === "accept") {
      if (state.pixelReady && window.fbq) window.fbq("consent", "grant");
      else loadPixel();
    } else if (state.pixelReady && window.fbq) {
      window.fbq("consent", "revoke");
    }
  } catch { /* never block the shopper */ }
  emit();
}

export function dismissBanner() {
  try { sessionStorage.setItem("mv_consent_dismissed", "1"); } catch { /* ignore */ }
  state.bannerOpen = false;
  emit();
}

export function openBanner() {
  state.bannerOpen = true;
  emit();
}

const uuid = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch { /* fall through */ }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 3) | 8).toString(16);
  });
};

const cookie = (name) => {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  } catch {
    return "";
  }
};

function getFbc() {
  const c = cookie("_fbc");
  if (c) return c;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("fbclid");
    if (fromUrl) return `fb.1.${Date.now()}.${fromUrl}`;
    const a = readAttribution();
    if (a?.fbclid) return `fb.1.${a.clickTs || Date.parse(a.clickAt) || Date.now()}.${a.fbclid}`;
  } catch { /* ignore */ }
  return "";
}

function currentUser() {
  try {
    const u = JSON.parse(sessionStorage.getItem("user_data") || "null");
    if (!u) return null;
    const email = typeof u.email === "string" ? u.email.trim() : "";
    const phone = String(u.phoneNumber || u.phone || u.mobile || "").replace(/[^\d]/g, "");
    if (!email && !phone) return null;
    const out = {};
    if (email) out.email = email;
    if (phone) out.phone = phone;
    return out;
  } catch {
    return null;
  }
}

function mirror(body) {
  try {
    fetch(`${API_BASE}/marketing/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch { /* ignore */ }
}

export function track(eventName, custom) {
  try {
    if (!isAllowed()) return;
    const eventId = uuid();
    const data = { ...(custom || {}) };
    if (data.value != null && !data.currency) data.currency = "INR";
    loadPixel();
    window.fbq?.("track", eventName, data, { eventID: eventId });
    if (!MIRRORED.has(eventName)) return;
    const body = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      consent: true,
      custom: data,
    };
    const fbp = cookie("_fbp");
    const fbc = getFbc();
    if (fbp) body.fbp = fbp;
    if (fbc) body.fbc = fbc;
    const user = currentUser();
    if (user) body.user = user;
    mirror(body);
  } catch { /* marketing must never break the store */ }
}

/** Browser-side Purchase only (the server sends the Conversions API twin with the same event id). */
export function trackPurchase(orderId, { value, items } = {}) {
  try {
    if (!orderId || !isAllowed()) return;
    const key = `mv_purchase_${orderId}`;
    if (sessionStorage.getItem(key)) return;
    loadPixel();
    const list = Array.isArray(items) ? items.filter((i) => i && i.id) : [];
    const data = { value: Number(value) || 0, currency: "INR", content_type: "product_group" };
    if (list.length) {
      data.content_ids = list.map((i) => String(i.id));
      data.contents = list.map((i) => ({ id: String(i.id), quantity: Number(i.quantity) || 1, item_price: Number(i.price) || 0 }));
      data.num_items = list.reduce((a, i) => a + (Number(i.quantity) || 1), 0);
    }
    window.fbq?.("track", "Purchase", data, { eventID: `purchase_${orderId}` });
    sessionStorage.setItem(key, "1");
  } catch { /* ignore */ }
}

/** Fields merged into the order API bodies. */
export function orderFields() {
  try {
    if (!state.cfg) return {};
    const allowed = isAllowed();
    const a = readAttribution();
    const attribution = a
      ? {
          v: 1, source: a.source, medium: a.medium, campaign: a.campaign, content: a.content, term: a.term,
          fbclid: a.fbclid, landingPath: a.landingPath, referrer: a.referrer, clickAt: a.clickAt,
        }
      : {};
    const out = { consent: allowed };
    if (allowed) {
      const fbp = cookie("_fbp");
      const fbc = getFbc();
      if (fbp) { out.fbp = fbp; attribution.fbp = fbp; }
      if (fbc) { out.fbc = fbc; attribution.fbc = fbc; }
    }
    out.attribution = attribution;
    return out;
  } catch {
    return {};
  }
}
