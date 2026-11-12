import { useEffect, useState } from "react";
import axios from "../utils/Axios";

const KEYS = ["pincodeAutofill", "savedAddresses", "otpLoginAtCheckout", "upiFirst", "minimalFields"];

// Share one in-flight request between components mounted at the same time (and React StrictMode double effects).
let inflight = null;

const fetchConfig = () => {
  if (!inflight) {
    inflight = axios
      .get("/fast-checkout/config")
      .then((res) => {
        const c = res?.data?.config;
        if (!c || typeof c !== "object") return null;
        const out = {};
        for (const k of KEYS) out[k] = c[k] === true;
        return out;
      })
      .catch(() => null) // 403 / 404 / network error => the module is off for this store
      .finally(() => {
        setTimeout(() => { inflight = null; }, 0);
      });
  }
  return inflight;
};

/**
 * Fast checkout storefront config. Calls GET /fast-checkout/config once per page mount.
 * `config` is null while loading and whenever the feature is off / unreachable (render the classic checkout).
 */
export default function useFastCheckoutConfig() {
  const [state, setState] = useState({ config: null, ready: false });
  useEffect(() => {
    let active = true;
    fetchConfig().then((config) => {
      if (active) setState({ config, ready: true });
    });
    return () => {
      active = false;
    };
  }, []);
  return state;
}
