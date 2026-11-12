import { useEffect, useState } from "react";
import axios from "../../utils/Axios";

const KNOWN = ["cashfree", "payu"];

// One shared in-flight request (React StrictMode double effects, several mounts).
let inflight = null;

const fetchConfig = () => {
  if (!inflight) {
    inflight = axios
      .get("/multi-gateway/config")
      .then((res) => {
        const d = res?.data;
        if (!d || d.success !== true || !Array.isArray(d.gateways)) return null;
        const gateways = d.gateways
          .filter((g) => g && KNOWN.includes(g.key) && typeof g.title === "string")
          .slice(0, 2)
          .map((g) => ({ key: g.key, title: String(g.title).slice(0, 40), subtitle: typeof g.subtitle === "string" ? String(g.subtitle).slice(0, 100) : "" }));
        const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);
        return { gateways, min: num(d.showForAmountMin), max: num(d.showForAmountMax) };
      })
      .catch(() => null) // 403 / 404 / network error => module off or unreachable: checkout behaves exactly as before
      .finally(() => {
        setTimeout(() => { inflight = null; }, 0);
      });
  }
  return inflight;
};

/**
 * Extra payment gateways (Cashfree / PayU) offered by the store. `gateways` is [] while loading and whenever the add-on is off,
 * misconfigured or unreachable, so the classic checkout renders unchanged. `total` (rupees) applies the store's amount window.
 */
export default function useMultiGateway(total) {
  const [cfg, setCfg] = useState(null);
  useEffect(() => {
    let active = true;
    fetchConfig().then((c) => { if (active) setCfg(c); });
    return () => { active = false; };
  }, []);
  if (!cfg) return { gateways: [] };
  const t = Number(total);
  const inWindow = !Number.isFinite(t) || ((cfg.min <= 0 || t + 1e-9 >= cfg.min) && (cfg.max <= 0 || t - 1e-9 <= cfg.max));
  return { gateways: inWindow ? cfg.gateways : [] };
}
