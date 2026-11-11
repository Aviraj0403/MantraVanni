// First/last paid-touch attribution kept in localStorage (no PII). Used only to tag orders.
const KEY = "mv_attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

const clip = (v, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export function readAttribution() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || raw.v !== 1) return null;
    if (!raw.expires || raw.expires < Date.now()) return null;
    return raw;
  } catch {
    return null;
  }
}

function externalReferrer() {
  try {
    if (!document.referrer) return "";
    const u = new URL(document.referrer);
    return u.origin === window.location.origin ? "" : clip(document.referrer, 300);
  } catch {
    return "";
  }
}

/** Call on every landing / route change; only writes when there is something new to remember. */
export function captureAttribution() {
  try {
    const sp = new URLSearchParams(window.location.search);
    const found = {};
    PARAMS.forEach((p) => {
      const v = clip(sp.get(p));
      if (v) found[p] = v;
    });
    const hasNewTouch = Object.keys(found).length > 0;
    const existing = readAttribution();
    if (existing && !hasNewTouch) return existing; // organic visit keeps the stored touch
    if (existing && hasNewTouch) {
      // Same touch re-seen (reload / navigation keeping the query string): nothing new to store.
      if (
        existing.source === (found.utm_source || "") &&
        existing.campaign === (found.utm_campaign || "") &&
        existing.fbclid === (found.fbclid || "") &&
        existing.content === (found.utm_content || "") &&
        existing.term === (found.utm_term || "") &&
        existing.medium === (found.utm_medium || "")
      ) return existing;
    }
    const now = Date.now();
    const rec = {
      v: 1,
      source: found.utm_source || "",
      medium: found.utm_medium || "",
      campaign: found.utm_campaign || "",
      content: found.utm_content || "",
      term: found.utm_term || "",
      fbclid: found.fbclid || "",
      referrer: externalReferrer(),
      landingPath: clip(window.location.pathname, 300),
      clickAt: new Date(now).toISOString(),
      clickTs: now,
      expires: now + TTL_MS,
    };
    localStorage.setItem(KEY, JSON.stringify(rec));
    return rec;
  } catch {
    return null;
  }
}
