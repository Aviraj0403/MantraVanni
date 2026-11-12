import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import { getOverride, getRedirects, reportRedirectHit } from "./seoApi";

const norm = (p) => {
  let s = String(p || "/").split("#")[0].split("?")[0];
  if (s.length > 1) s = s.replace(/\/+$/g, "");
  return (s || "/").toLowerCase();
};
const HOP_KEY = "seo_redir_hops";

/**
 * Applies the store's redirects in the browser (replace navigation, so Back does not bounce) and the home-page SEO override.
 * NOTE: this runs in JavaScript. Crawlers that do not execute JS will not follow these redirects.
 */
function Redirects() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let live = true;
    getRedirects().then((map) => {
      if (!live) return;
      const hit = map[norm(pathname)];
      if (!hit || !hit.to) return;
      let hops = 0;
      try { hops = parseInt(sessionStorage.getItem(HOP_KEY) || "0", 10) || 0; } catch { /* ignore */ }
      if (hops >= 5) return; // loop guard across hops
      try { sessionStorage.setItem(HOP_KEY, String(hops + 1)); } catch { /* ignore */ }
      reportRedirectHit(norm(pathname));
      if (hit.to.startsWith("/") && !hit.to.startsWith("//")) navigate(hit.to, { replace: true });
      else if (/^https:\/\//i.test(hit.to)) window.location.replace(hit.to);
    });
    return () => { live = false; };
  }, [pathname, navigate]);

  // the hop counter only guards a chain of immediate redirects: clear it once a normal page settles
  useEffect(() => {
    const h = setTimeout(() => { try { sessionStorage.removeItem(HOP_KEY); } catch { /* ignore */ } }, 1500);
    return () => clearTimeout(h);
  }, [pathname]);
  return null;
}

function HomeSeo() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [o, setO] = useState(null);
  useEffect(() => {
    let live = true;
    if (isHome) getOverride("home").then((x) => live && setO(x));
    return () => { live = false; };
  }, [isHome]);
  const on = isHome && !!o;
  usePageMeta({
    title: on ? o.title || undefined : undefined,
    description: on ? o.description || undefined : undefined,
    image: on ? o.ogImage || undefined : undefined,
    canonical: on ? "/" : undefined,
    noindex: on && !!o.noindex,
  });
  return null;
}

export default function LayoutTop() {
  return (
    <>
      <Redirects />
      <HomeSeo />
    </>
  );
}
