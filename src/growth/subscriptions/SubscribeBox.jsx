import React, { useEffect, useState } from "react";
import { Repeat, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loadSubsConfig, isEligible, subscribe, getAddresses, apiMessage } from "./api";

/** "Subscribe & save N%" box under the product's Add to Cart. Renders nothing when the product is not eligible or the module is off. */
export default function SubscribeBox({ product, variant, soldOut }) {
  const { user } = useAuth() || {};
  const [cfg, setCfg] = useState(null);
  const [freq, setFreq] = useState(30);
  const [qty, setQty] = useState(1);
  const [pay, setPay] = useState("cod");
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle | busy | done | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let live = true;
    loadSubsConfig().then((c) => {
      if (!live || !c) return;
      setCfg(c);
      if (c.allowedFrequencies?.length) setFreq(c.allowedFrequencies.includes(30) ? 30 : c.allowedFrequencies[0]);
      setPay(c.allowCod ? "cod" : "wallet");
    });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!open || !user) return undefined;
    let live = true;
    getAddresses().then((a) => {
      if (!live) return;
      const list = Array.isArray(a) ? a : [];
      setAddresses(list);
      const def = list.find((x) => x.isDefault) || list[0];
      if (def) setAddressId(String(def.id || def._id || ""));
    }).catch(() => {});
    return () => { live = false; };
  }, [open, user]);

  const pid = product?._id || product?.id;
  if (!cfg || !pid || soldOut === true || product?.status === "Inactive") return null;
  if (!cfg.allowedFrequencies?.length || (!cfg.allowCod && !cfg.allowWallet)) return null;
  if (!isEligible(cfg, pid)) return null;

  const size = variant && !Array.isArray(variant) ? variant.size || "" : "";
  const pct = Number(cfg.discountPercent) || 0;
  const unit = Number(variant?.price ?? product?.variants?.[0]?.price) || 0;
  const perDelivery = unit * qty * (1 - pct / 100);

  if (!user) {
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <div className="flex items-center gap-2 font-medium"><Repeat size={16} /> {pct > 0 ? `Subscribe & save ${pct}%` : "Subscribe for repeat delivery"}</div>
        <p className="mt-1 text-gray-500">Get this delivered automatically. <a href="/profile" className="font-medium underline">Sign in</a> to subscribe.</p>
      </div>
    );
  }

  const submit = async () => {
    if (state === "busy") return;
    if (!addressId) { setState("error"); setMsg("Please choose a delivery address (add one in My Account > Addresses)."); return; }
    setState("busy"); setMsg("");
    try {
      await subscribe({ items: [{ product: String(pid), variantSize: size, quantity: qty }], frequencyDays: freq, paymentMethod: pay, addressId });
      setState("done");
    } catch (e) {
      setState("error"); setMsg(apiMessage(e));
    }
  };

  if (state === "done") {
    return (
      <div role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <Check size={18} className="mt-0.5 shrink-0" />
        <div>Subscription started. Place this first order as usual; your next deliveries will follow every {freq} days. Manage it in My Account &gt; Subscriptions.</div>
      </div>
    );
  }

  const fieldCls = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm";
  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-2 text-left font-medium text-gray-800">
        <span className="flex items-center gap-2"><Repeat size={16} /> {pct > 0 ? `Subscribe & save ${pct}%` : "Subscribe for repeat delivery"}</span>
        <span className="text-xs text-gray-500">{open ? "Hide" : "Details"}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-xs text-gray-500">Deliver every</span>
              <select className={fieldCls} value={freq} onChange={(e) => setFreq(Number(e.target.value))}>
                {cfg.allowedFrequencies.map((f) => <option key={f} value={f}>{f} days</option>)}
              </select></label>
            <label className="block"><span className="mb-1 block text-xs text-gray-500">Quantity</span>
              <select className={fieldCls} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select></label>
          </div>
          <label className="block"><span className="mb-1 block text-xs text-gray-500">Payment</span>
            <select className={fieldCls} value={pay} onChange={(e) => setPay(e.target.value)}>
              {cfg.allowCod && <option value="cod">Cash on Delivery</option>}
              {cfg.allowWallet && <option value="wallet">Wallet (needs enough balance on the day)</option>}
            </select></label>
          <label className="block"><span className="mb-1 block text-xs text-gray-500">Delivery address</span>
            {addresses.length ? (
              <select className={fieldCls} value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                {addresses.map((a) => { const id = String(a.id || a._id || ""); return <option key={id} value={id}>{[a.label, a.street, a.city, a.postalCode].filter(Boolean).join(", ")}</option>; })}
              </select>
            ) : <p className="text-xs text-gray-500">No saved address yet. Add one in My Account &gt; Addresses, then come back.</p>}
          </label>
          {unit > 0 && <p className="text-xs text-gray-600">Each delivery: about Rs {perDelivery.toFixed(2)} (before shipping){pct > 0 ? `, ${pct}% off` : ""}. You can pause, skip or cancel any time.</p>}
          <p className="text-xs text-gray-500">Your first delivery is the order you place now. Later orders are placed automatically; online payment is not charged automatically.</p>
          {state === "error" && <p role="alert" className="text-xs text-red-600">{msg}</p>}
          <button type="button" onClick={submit} disabled={state === "busy"} className="w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {state === "busy" ? "Please wait..." : "Start subscription"}
          </button>
        </div>
      )}
    </div>
  );
}
