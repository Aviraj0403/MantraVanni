import React, { useEffect, useRef, useState } from "react";
import { Gift, Ticket, CheckCircle2, AlertCircle, Loader2, Copy, Check, CreditCard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getGiftConfig, redeemGiftCard, checkGiftCard, startGiftPurchase, verifyGiftPurchase, getMyGiftPurchases, apiMessage } from "./giftCardsApi";

const rs = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const inputCls = "w-full rounded-xl border border-secondary-200 px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary-500";
const btnCls = "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-primary-600 disabled:opacity-50";
const Notice = ({ type, children }) => (
  <div role={type === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
    {type === "error" ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
    <span>{children}</span>
  </div>
);

/* ------------------------------ Redeem ------------------------------ */
function RedeemBox() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [info, setInfo] = useState(null);

  const check = async () => {
    if (busy || code.trim().length < 6) return;
    setBusy(true); setMsg(null); setInfo(null);
    try {
      const r = await checkGiftCard(code);
      if (r.state === "valid") setInfo(`This card is worth ${rs(r.amount)}${r.expiresAt ? ` and is valid until ${new Date(r.expiresAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}` : ""}.`);
      else setMsg({ type: "error", text: r.state === "redeemed" ? "This gift card has already been used." : "This gift card has expired." });
    } catch (e) { setMsg({ type: "error", text: apiMessage(e, "Could not check this code. Please try again.") }); }
    finally { setBusy(false); }
  };
  const redeem = async (e) => {
    e.preventDefault();
    if (busy || code.trim().length < 6) return;
    setBusy(true); setMsg(null); setInfo(null);
    try {
      const r = await redeemGiftCard(code);
      setCode("");
      setMsg({ type: "success", text: `${rs(r.amount)} has been added to your wallet. Your new wallet balance is ${rs(r.walletBalance)}.` });
    } catch (e2) { setMsg({ type: "error", text: apiMessage(e2, "Could not redeem this gift card. Please try again.") }); }
    finally { setBusy(false); }
  };
  return (
    <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-brand-text"><Ticket size={18} className="text-primary-600" /> Redeem a gift card</h2>
      <p className="mb-4 text-xs text-brand-text/60">Enter your code to add its full value to your wallet. You can use the wallet at checkout.</p>
      <form onSubmit={redeem} className="space-y-3">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 24))} placeholder="GC-XXXX-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false}
          aria-label="Gift card code" className={`${inputCls} font-mono tracking-wider`} />
        <div className="flex gap-2">
          <button type="button" onClick={check} disabled={busy || code.trim().length < 6} className="rounded-xl border border-secondary-200 px-4 py-2.5 text-sm font-semibold text-brand-text hover:bg-secondary-50 disabled:opacity-50">Check value</button>
          <button type="submit" disabled={busy || code.trim().length < 6} className={btnCls}>{busy ? <Loader2 size={16} className="animate-spin" /> : null} Add to wallet</button>
        </div>
      </form>
      <div className="mt-3 space-y-2">
        {info && <Notice type="success">{info}</Notice>}
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
      </div>
    </section>
  );
}

/* ------------------------------ Send a gift card ------------------------------ */
const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  let tries = 0;
  const t = setInterval(() => { if (window.Razorpay) { clearInterval(t); resolve(true); } else if (++tries > 20) { clearInterval(t); resolve(false); } }, 250);
});

function SendBox({ cfg, onDone }) {
  const { user } = useAuth() || {};
  const [amount, setAmount] = useState(cfg.allowedAmounts?.[1] || cfg.allowedAmounts?.[0] || 500);
  const [custom, setCustom] = useState("");
  const [design, setDesign] = useState(cfg.designs?.[0]?.key || "");
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(null);
  const [pendingVerify, setPendingVerify] = useState(null);
  const [copied, setCopied] = useState(false);
  const live = useRef(true);
  useEffect(() => () => { live.current = false; }, []);

  const finalAmount = custom !== "" ? Number(custom) : amount;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const verify = async (resp) => {
    setBusy(true);
    try {
      const r = await verifyGiftPurchase({ razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature });
      setPendingVerify(null); setMsg(null);
      setDone(r);
      onDone?.();
    } catch (e) {
      setPendingVerify(resp);
      setMsg({ type: "error", text: `${apiMessage(e, "We received your payment but could not finish creating the gift card yet.")} Your payment id is ${resp.razorpay_payment_id}. You can retry below; if money was deducted you will not be charged twice.` });
    } finally { setBusy(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setMsg(null);
    if (!f.name.trim()) return setMsg({ type: "error", text: "Please enter the recipient's name." });
    if (!f.email.trim() && !f.phone.trim()) return setMsg({ type: "error", text: "Please enter the recipient's email or phone number." });
    if (!(finalAmount > 0)) return setMsg({ type: "error", text: "Please choose an amount." });
    setBusy(true);
    let opened = false;
    try {
      if (!(await loadRazorpay())) throw new Error("gateway");
      const o = await startGiftPurchase({ amount: finalAmount, recipient: { name: f.name, email: f.email, phone: f.phone, message: f.message, design } });
      if (!o?.success || !o.orderId || !o.key) throw new Error("bad-order");
      const rzp = new window.Razorpay({
        key: o.key, amount: o.amount, currency: o.currency || "INR", order_id: o.orderId, name: "Gift card", description: `Gift card worth ${rs(finalAmount)} for ${f.name.trim()}`,
        handler: (resp) => { verify(resp); },
        modal: { ondismiss: () => { if (live.current) { setBusy(false); setMsg({ type: "error", text: "Payment window closed. You were not charged." }); } } },
        prefill: { name: user?.userName || "", email: user?.email || "", contact: user?.phoneNumber || "" },
        theme: { color: "#dc2626" },
      });
      rzp.on?.("payment.failed", (r) => { setBusy(false); setMsg({ type: "error", text: r?.error?.description || "Payment failed. Please try again." }); });
      opened = true;
      rzp.open();
    } catch (err) {
      setMsg({ type: "error", text: err?.message === "gateway" ? "The payment gateway is still loading. Please try again in a moment." : apiMessage(err, "Could not start the payment. Please try again.") });
    } finally { if (!opened) setBusy(false); }
  };

  if (done) {
    const copy = async () => { try { await navigator.clipboard.writeText(done.code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };
    return (
      <section className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-emerald-900"><CheckCircle2 size={18} /> Gift card purchased</h2>
        <p className="text-sm text-emerald-900">
          Your {rs(done.amount)} gift card for {f.name || "your recipient"} is ready.
          {done.sentToRecipient ? " We have sent the code to the recipient." : done.code ? " We could not send it automatically, so please share the code below yourself." : ""}
          {done.sentToBuyer ? " A copy has been sent to you." : ""}
        </p>
        {done.code ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-emerald-400 bg-white p-3">
            <span className="break-all font-mono text-lg font-bold tracking-wider text-brand-text">{done.code}</span>
            <button type="button" onClick={copy} aria-label="Copy code" className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50">{copied ? <Check size={18} /> : <Copy size={18} />}</button>
          </div>
        ) : <p className="text-xs text-emerald-800">The code was already delivered. Contact support if it did not arrive.</p>}
        {done.code && <p className="text-xs text-emerald-800">Save this code now. For your security we cannot show it again.</p>}
        <button type="button" className="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100" onClick={() => { setDone(null); setF({ name: "", email: "", phone: "", message: "" }); setCustom(""); }}>Send another</button>
      </section>
    );
  }

  const max = cfg.messageMaxLength ?? 200;
  return (
    <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-brand-text"><Gift size={18} className="text-primary-600" /> Send a gift card</h2>
      <p className="mb-4 text-xs text-brand-text/60">Pay securely with Razorpay. The code goes straight to your recipient.{cfg.expiryMonths ? ` Valid for ${cfg.expiryMonths} months.` : ""}</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-brand-text/70">Amount</span>
          <div className="flex flex-wrap gap-2">
            {(cfg.allowedAmounts || []).map((a) => (
              <button key={a} type="button" onClick={() => { setAmount(a); setCustom(""); }} aria-pressed={custom === "" && amount === a}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${custom === "" && amount === a ? "border-primary-500 bg-primary-50 text-primary-700" : "border-secondary-200 bg-secondary-50 text-brand-text hover:bg-primary-50"}`}>{rs(a)}</button>
            ))}
          </div>
          {cfg.customAmount?.enabled && (
            <input type="number" inputMode="numeric" min={cfg.customAmount.min} max={cfg.customAmount.max} value={custom} onChange={(e) => setCustom(e.target.value)}
              placeholder={`Or enter an amount (${rs(cfg.customAmount.min)} to ${rs(cfg.customAmount.max)})`} className={`${inputCls} mt-2`} aria-label="Custom amount" />
          )}
        </div>
        {(cfg.designs?.length || 0) > 1 && (
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-brand-text/70">Style</span>
            <div className="flex flex-wrap gap-2">
              {cfg.designs.map((d) => (
                <button key={d.key} type="button" onClick={() => setDesign(d.key)} aria-pressed={design === d.key}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${design === d.key ? "border-primary-500 bg-primary-50" : "border-secondary-200"}`}>
                  <span className="h-3 w-3 rounded-full" style={{ background: d.accent }} aria-hidden="true" />{d.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mb-1 block text-xs font-semibold text-brand-text/70">Recipient's name</label><input value={f.name} onChange={set("name")} maxLength={80} className={inputCls} autoComplete="off" /></div>
          <div><label className="mb-1 block text-xs font-semibold text-brand-text/70">Recipient's email</label><input type="email" value={f.email} onChange={set("email")} className={inputCls} autoComplete="off" /></div>
          <div><label className="mb-1 block text-xs font-semibold text-brand-text/70">Or phone (WhatsApp / SMS)</label><input type="tel" inputMode="tel" value={f.phone} onChange={set("phone")} className={inputCls} autoComplete="off" /></div>
        </div>
        {max > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-text/70">Message (optional)</label>
            <textarea rows={3} value={f.message} maxLength={max} onChange={set("message")} className={inputCls} placeholder="Happy birthday!" />
            <span className="block text-right text-[11px] text-brand-text/50">{f.message.length}/{max}</span>
          </div>
        )}
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
        {pendingVerify && <button type="button" disabled={busy} onClick={() => verify(pendingVerify)} className="w-full rounded-xl border border-primary-300 px-4 py-2.5 text-sm font-bold text-primary-700 hover:bg-primary-50 disabled:opacity-50">Retry confirming my payment</button>}
        <button type="submit" disabled={busy || !!pendingVerify} className={btnCls}>{busy ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />} Pay {finalAmount > 0 ? rs(finalAmount) : ""} and send</button>
      </form>
    </section>
  );
}

function History({ refreshKey }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { getMyGiftPurchases().then(setRows); }, [refreshKey]);
  if (!rows.length) return null;
  return (
    <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-brand-text">Gift cards you sent</h2>
      <ul className="divide-y divide-secondary-100">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span><b>{rs(r.amount)}</b> <span className="text-brand-text/60">to {r.recipientName || "recipient"} · ending {r.last4}</span>{r.code && <span className="mt-1 block break-all font-mono text-xs font-bold text-emerald-800">Your code (shown once, save it): {r.code}</span>}</span>
            <span className="rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-semibold capitalize text-brand-text/70">{r.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function GiftCardsTab() {
  const [cfg, setCfg] = useState(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => { let on = true; getGiftConfig().then((c) => on && setCfg(c)); return () => { on = false; }; }, []);
  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-black text-brand-text">Gift cards</h1>
        <p className="text-sm text-brand-text/60">Redeem a gift card you received, or send one to someone you care about.</p>
      </div>
      <RedeemBox />
      {cfg === undefined ? <div className="h-40 animate-pulse rounded-2xl bg-secondary-50" /> : cfg?.purchaseEnabled && cfg.allowedAmounts?.length ? <SendBox cfg={cfg} onDone={() => setRefreshKey((k) => k + 1)} /> : null}
      {cfg?.purchaseEnabled && <History refreshKey={refreshKey} />}
    </div>
  );
}
