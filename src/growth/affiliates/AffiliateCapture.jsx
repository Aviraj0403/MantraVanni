import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAffiliateConfig, codeFromSearch, storeAffiliateCode, readAffiliateCode, attachAffiliateCode } from "./affiliatesApi";

/**
 * layout.top slot: renders nothing. Remembers ?aff=CODE (also ?ref= and utm_source=affiliate&utm_campaign=CODE) in localStorage
 * for the program's cookie window, and tells the backend once the visitor is signed in. Every failure is silent.
 */
let cookieDays = null;
const loadDays = () => (cookieDays !== null ? Promise.resolve(cookieDays)
  : getAffiliateConfig().then((r) => { cookieDays = Number(r?.config?.cookieDays) || 30; return cookieDays; }).catch(() => 30));

export default function AffiliateCapture() {
  const { search } = useLocation();
  const auth = useAuth();
  const userId = auth?.user?._id || auth?.user?.id || null;

  useEffect(() => {
    const code = codeFromSearch(search);
    if (!code) return;
    loadDays().then((d) => storeAffiliateCode(code, d));
  }, [search]);

  useEffect(() => {
    if (!userId) return undefined;
    let live = true;
    loadDays().then(async (d) => {
      const v = readAffiliateCode(d);
      if (!v || !live) return;
      const sentKey = `aff_sent_${userId}_${v.code}_${v.at}`;
      try { if (sessionStorage.getItem(sentKey)) return; } catch { /* ignore */ }
      try {
        await attachAffiliateCode(v.code);
        try { sessionStorage.setItem(sentKey, "1"); } catch { /* ignore */ }
      } catch { /* retry on next page load */ }
    });
    return () => { live = false; };
  }, [userId, search]);

  return null;
}
