import { useEffect, useRef, useState } from "react";
import axios from "../utils/Axios";

export const isPincode = (v) => /^[1-9]\d{5}$/.test(String(v || ""));

/**
 * Debounced pincode -> city/state lookup. Only fires for a complete 6-digit pincode (never while typing),
 * is cancelled on change / unmount, and silently reports "notfound" on any failure so manual entry keeps working.
 * status: "idle" | "loading" | "found" | "notfound"
 */
export default function usePincodeLookup(pincode, enabled = true, delayMs = 350) {
  const [state, setState] = useState({ status: "idle", pincode: "", info: null });
  const cache = useRef(new Map());

  useEffect(() => {
    if (!enabled || !isPincode(pincode)) {
      setState((s) => (s.status === "idle" ? s : { status: "idle", pincode: "", info: null }));
      return undefined;
    }
    const hit = cache.current.get(pincode);
    if (hit) {
      setState({ status: hit.found ? "found" : "notfound", pincode, info: hit });
      return undefined;
    }
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading", pincode, info: null });
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/fast-checkout/pincode/${pincode}`, { signal: controller.signal, timeout: 8000 });
        if (!active) return;
        const d = res?.data || {};
        const info = { found: d.found === true, city: String(d.city || ""), district: String(d.district || ""), state: String(d.state || "") };
        if (info.found) cache.current.set(pincode, info);
        setState({ status: info.found ? "found" : "notfound", pincode, info });
      } catch {
        if (active) setState({ status: "notfound", pincode, info: null });
      }
    }, delayMs);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [pincode, enabled, delayMs]);

  return state;
}
