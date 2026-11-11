// Tiny always-loaded facade. The heavy engine is code-split and registered here once marketing is enabled,
// so when the module is off every call below is a cheap no-op (no network, no script).
let engine = null;

export const registerMarketingEngine = (e) => { engine = e; };

export const track = (eventName, custom) => {
  try { if (engine) engine.track(eventName, custom); } catch { /* never block the store */ }
};

export const trackPurchase = (orderId, info) => {
  try { if (engine) engine.trackPurchase(orderId, info); } catch { /* ignore */ }
};

/** `{ attribution, fbp, fbc, consent }` for order API bodies, or {} when marketing is off. */
export const getOrderMarketing = () => {
  try { return engine ? engine.orderFields() : {}; } catch { return {}; }
};

export const openConsentPreferences = () => {
  try { window.dispatchEvent(new CustomEvent("mv:consent-open")); } catch { /* ignore */ }
};
