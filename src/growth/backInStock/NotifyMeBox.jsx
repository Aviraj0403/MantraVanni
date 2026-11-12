import React, { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import Axios from "../../utils/Axios";
import { useAuth } from "../../context/AuthContext";
import { isOutOfStock } from "../../utils/stock";

// India mobile (10 digits starting 6-9, optional +91 / 91 / 0 prefix) or a basic email.
const normPhone = (raw) => {
  let d = String(raw || "").replace(/[\s\-().]/g, "");
  if (/[^\d+]/.test(d)) return null;
  d = d.replace(/^\+/, "").replace(/^0{1,2}/, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  return /^[6-9]\d{9}$/.test(d) && !/^(\d)\1+$/.test(d) ? d : null;
};
const EMAIL_RE = /^[^\s@<>()",;:]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;

let cfgPromise = null;
const loadCfg = () => {
  if (!cfgPromise) {
    cfgPromise = Axios.get("/back-in-stock/config", { timeout: 8000 })
      .then((r) => r?.data?.config || null)
      .catch(() => null);
  }
  return cfgPromise;
};

export default function NotifyMeBox({ product, variant, soldOut }) {
  const { user } = useAuth() || {};
  const [cfg, setCfg] = useState(null);
  const [value, setValue] = useState("");
  const [state, setState] = useState("idle"); // idle | busy | done | error
  const [msg, setMsg] = useState("");

  useEffect(() => { let live = true; loadCfg().then((c) => live && setCfg(c)); return () => { live = false; }; }, []);

  // prefill from the logged-in account (never stored anywhere by this component)
  useEffect(() => {
    if (!user || value) return;
    const p = normPhone(user.phoneNumber || user.phone);
    setValue(p || user.email || "");
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // reset the outcome when the shopper switches variant
  const size = variant && !Array.isArray(variant) ? variant.size || "" : "";
  useEffect(() => { setState("idle"); setMsg(""); }, [size, product?._id, product?.id]);

  const pid = product?._id || product?.id;
  const unavailable = soldOut === true || (variant && isOutOfStock(product, variant));
  if (!unavailable || !cfg || cfg.enabled === false || !pid) return null;

  if (cfg.requireLoginToJoin && !user) {
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <div className="flex items-center gap-2 font-medium"><Bell size={16} /> Get notified when available</div>
        <p className="mt-1 text-gray-500">Please log in to ask for a back-in-stock alert.</p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (state === "busy") return;
    const v = value.trim();
    const phone = normPhone(v);
    const email = !phone && EMAIL_RE.test(v) ? v : null;
    if (!phone && !email) { setState("error"); setMsg("Enter a valid 10-digit mobile number or an email address."); return; }
    setState("busy"); setMsg("");
    try {
      await Axios.post("/back-in-stock/subscribe", { productId: pid, size: size || undefined, ...(phone ? { phone } : { email }) }, { timeout: 12000 });
      setState("done");
    } catch (err) {
      const code = err?.response?.data?.code;
      setState("error");
      setMsg(code === "LOGIN_REQUIRED" ? "Please log in first." : code === "INVALID_CONTACT" ? "That number or email does not look right." : err?.response?.status === 429 ? "Too many tries. Please wait a few minutes." : "Could not save your request. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <div role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <Check size={18} className="mt-0.5 shrink-0" />
        <span>Done! We will let you know as soon as it is back in stock.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4" noValidate>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800"><Bell size={16} /> Notify me when available</div>
      <p className="mt-1 text-xs text-gray-500">Enter your mobile number (preferred) or email. We will send you one alert.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text" inputMode="email" autoComplete="tel email" value={value} onChange={(e) => setValue(e.target.value)}
          placeholder="Mobile number or email" maxLength={254} aria-label="Mobile number or email"
          className="min-h-[44px] w-full flex-1 rounded-lg border border-gray-300 bg-white px-3 text-base outline-none focus:border-gray-500"
        />
        <button type="submit" disabled={state === "busy"} className="min-h-[44px] rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white disabled:opacity-60">
          {state === "busy" ? "Saving..." : "Notify me"}
        </button>
      </div>
      {state === "error" && <p role="alert" className="mt-2 text-xs text-red-600">{msg}</p>}
    </form>
  );
}
