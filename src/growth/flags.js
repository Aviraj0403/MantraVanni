import { useEffect, useState } from "react";
import Axios from "../utils/Axios";

/**
 * Which growth add-ons are ON for this store (GET /growth/flags, booleans only). Fetched once per page load and shared.
 * Any failure => every flag false, so the storefront renders exactly as if no add-on existed.
 */
let promise = null;
let value = null;
const listeners = new Set();

export const loadGrowthFlags = () => {
  if (!promise) {
    promise = Axios.get("/growth/flags", { timeout: 8000 })
      .then((res) => (res?.data?.flags && typeof res.data.flags === "object" ? res.data.flags : {}))
      .catch(() => ({}))
      .then((flags) => { value = flags; listeners.forEach((l) => l(flags)); return flags; });
  }
  return promise;
};

export const useGrowthFlags = () => {
  const [flags, setFlags] = useState(value || {});
  useEffect(() => {
    const l = (f) => setFlags(f);
    listeners.add(l);
    if (value) setFlags(value); else loadGrowthFlags();
    return () => listeners.delete(l);
  }, []);
  return flags;
};
