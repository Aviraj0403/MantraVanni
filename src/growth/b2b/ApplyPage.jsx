import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loadB2bConfig, getMe, apply, apiMessage, money } from "./api";

const cls = "w-full rounded-xl border border-secondary-200 px-4 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary-500";
const Shell = ({ children }) => (
  <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
    <h1 className="text-2xl font-bold text-brand-text sm:text-3xl">Wholesale</h1>
    <div className="mt-5 space-y-5">{children}</div>
  </div>
);

/** /wholesale: apply for a business (wholesale) account. Shows status once applied. */
export default function ApplyPage() {
  const { user } = useAuth() || {};
  const [cfg, setCfg] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ businessName: "", gstin: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    Promise.all([loadB2bConfig(), user ? getMe().catch(() => null) : Promise.resolve(null)]).then(([c, m]) => { if (live) { setCfg(c); setMe(m); setLoading(false); } });
    return () => { live = false; };
  }, [user]);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr("");
    try { await apply({ ...f, gstin: f.gstin.replace(/\s/g, "").toUpperCase() }); setMe(await getMe()); }
    catch (x) { setErr(apiMessage(x)); } finally { setBusy(false); }
  };

  if (loading) return <Shell><div className="h-40 animate-pulse rounded-2xl bg-secondary-100" aria-busy="true" /></Shell>;
  if (!cfg) return <Shell><p className="text-sm text-brand-text/70">Wholesale buying is not available on this store.</p></Shell>;
  if (!user) return <Shell><p className="text-sm text-brand-text/80">Log in or create an account first, then come back here to apply for wholesale pricing.</p><Link to="/login" className="inline-block rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white">Log in</Link></Shell>;

  if (me?.status === "approved") return (
    <Shell>
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900" role="status">
        <p className="font-bold">You are a wholesale customer{me.group?.name ? ` (${me.group.name})` : ""}.</p>
        <p className="mt-1">Your wholesale prices apply automatically in your cart and at checkout. Open a product to see your quantity price tiers.</p>
        {me.perks?.length > 0 && <ul className="mt-2 list-disc pl-5">{me.perks.map((p) => <li key={p}>{p}</li>)}</ul>}
      </section>
      <Link to="/" className="inline-block text-sm font-semibold text-primary-700 underline">Start shopping</Link>
    </Shell>
  );
  if (me?.status === "pending") return <Shell><section className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-900" role="status"><p className="font-bold">Application under review</p><p className="mt-1">{me.businessName}{me.gstin ? ` (${me.gstin})` : ""}. We will approve it soon.</p></section></Shell>;
  if (!cfg.applicationsOpen) return <Shell><p className="text-sm text-brand-text/70">Wholesale applications are closed right now.</p></Shell>;

  return (
    <Shell>
      {me?.status === "rejected" && <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800" role="status">Your last application was not approved{me.note ? `: ${me.note}` : "."} You can apply again with corrected details.</div>}
      <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 text-sm text-brand-text/80 shadow-sm">
        Buy in bulk at business prices. Apply with your business details{cfg.requireGstin ? " and GSTIN" : ""}.{cfg.minOrderValueRupees > 0 ? ` Wholesale orders have a minimum value of ${money(cfg.minOrderValueRupees)}.` : ""}
        {cfg.autoApprove ? " Approval is instant." : " We review every application."}
      </section>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <input className={cls} placeholder="Business name" aria-label="Business name" value={f.businessName} onChange={set("businessName")} maxLength={120} required />
        <input className={`${cls} font-mono uppercase`} placeholder={cfg.requireGstin ? "GSTIN (15 characters)" : "GSTIN (optional)"} aria-label="GSTIN" value={f.gstin} onChange={set("gstin")} maxLength={15} required={cfg.requireGstin} />
        <input className={cls} placeholder="Contact phone (optional)" aria-label="Contact phone" inputMode="tel" value={f.phone} onChange={set("phone")} maxLength={16} />
        {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-primary-600 disabled:opacity-50 sm:w-auto">{busy ? "Submitting..." : "Apply for wholesale"}</button>
      </form>
    </Shell>
  );
}
