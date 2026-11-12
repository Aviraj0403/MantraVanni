import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";

const STYLE_ID = "cd-hide-platform-credit";

/**
 * White-label (customDomain add-on). Renders nothing. When the store has saved branding:
 *  - appends " | <brand name>" to the document title (re-applied when a page changes the title),
 *  - swaps the favicon (https only; the backend already validates the URL),
 *  - if hidePlatformBranding is on, hides the footer's "Developed by ..." credit line (a CSS rule, see note below).
 * Nothing is applied unless the API returns a value; any failure leaves the storefront unchanged.
 * NOTE: the footer credit has no dedicated hook, so it is hidden with `footer p:has(> a[href*="jdinfotechsolutions.in"])`.
 * A proper fix is a one-line conditional in footer.jsx (reported to the owner).
 */
export default function Branding() {
  const [b, setB] = useState(null);

  useEffect(() => {
    let live = true;
    Axios.get("/custom-domain/branding")
      .then((r) => { if (live) setB(r?.data?.branding || null); })
      .catch(() => { /* feature off or unreachable: do nothing */ });
    return () => { live = false; };
  }, []);

  // favicon
  useEffect(() => {
    const url = b?.faviconUrl;
    if (!url || !/^https:\/\//i.test(url)) return undefined;
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;
    link.setAttribute("data-cd-favicon", "1");
    const old = [...document.querySelectorAll("link[rel~='icon']")].filter((l) => !l.hasAttribute("data-cd-favicon"));
    old.forEach((l) => { l.dataset.cdDisabled = l.rel; l.rel = "disabled-icon"; });
    document.head.appendChild(link);
    return () => {
      link.remove();
      old.forEach((l) => { if (l.dataset.cdDisabled) { l.rel = l.dataset.cdDisabled; delete l.dataset.cdDisabled; } });
    };
  }, [b?.faviconUrl]);

  // title suffix
  useEffect(() => {
    const name = (b?.storeName || "").trim();
    if (!name) return undefined;
    const suffix = ` | ${name}`;
    const apply = () => {
      const t = document.title || "";
      if (t && t !== name && !t.endsWith(suffix) && !t.includes(name)) document.title = t + suffix;
    };
    apply();
    const el = document.querySelector("title");
    if (!el) return undefined;
    const mo = new MutationObserver(apply);
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    return () => mo.disconnect();
  }, [b?.storeName]);

  // hide the platform credit line
  useEffect(() => {
    if (!b?.hidePlatformBranding) return undefined;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = 'footer p:has(> a[href*="jdinfotechsolutions.in"]){display:none !important}';
    document.head.appendChild(s);
    return () => s.remove();
  }, [b?.hidePlatformBranding]);

  return null;
}
