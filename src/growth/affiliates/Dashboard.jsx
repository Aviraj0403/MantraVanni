import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Share2, Wallet, Clock, BadgeCheck, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../utils/toast";
import { getAffiliateConfig, getMyAffiliate, applyAffiliate } from "./affiliatesApi";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const dateFmt = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } };
const STATUS = { pending: "bg-amber-100 text-amber-800", approved: "bg-sky-100 text-sky-800", paid: "bg-emerald-100 text-emerald-800", reversed: "bg-rose-100 text-rose-700" };

const Shell = ({ children }) => (
  <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
    <h1 className="text-2xl font-bold text-brand-text sm:text-3xl">Affiliate program</h1>
    <div className="mt-5 space-y-5">{children}</div>
  </div>
);
const Skeleton = () => <div className="space-y-3" aria-busy="true"><div className="h-28 animate-pulse rounded-2xl bg-secondary-100" /><div className="h-40 animate-pulse rounded-2xl bg-secondary-100" /></div>;

function ApplyForm({ cfg, user, onDone }) {
  const [f, setF] = useState({ name: user?.name || "", phone: (user?.phoneNumber || user?.phone || "").replace(/^\+?91/, ""), email: user?.email || "", upiId: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const cls = "w-full rounded-xl border border-secondary-200 px-4 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary-500";
  const submit = async (e) => {
    e.preventDefault();
    if (!agree || busy) return;
    setBusy(true);
    try {
      const r = await applyAffiliate({ ...f, phone: f.phone.replace(/[\s-]/g, "") });
      toast.success(r?.partner?.status === "active" ? "You are in! Your link is ready." : "Application sent. We will review it soon.");
      onDone(r);
    } catch (err) { toast.error(err?.response?.data?.message || "Could not submit. Please try again."); } finally { setBusy(false); }
  };
  return (
    <>
      <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <p className="text-sm text-brand-text/80">Share our store and earn <b>{fmt(cfg?.defaultCommissionPercent)}%</b> commission on every delivered order you bring.</p>
        {cfg?.programTerms && <p className="mt-3 whitespace-pre-line rounded-xl bg-secondary-50 p-3 text-xs text-brand-text/70">{cfg.programTerms}</p>}
      </section>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <h2 className="text-base font-bold text-brand-text">Apply to join</h2>
        <input className={cls} placeholder="Your name" aria-label="Your name" value={f.name} onChange={set("name")} maxLength={80} required />
        <input className={cls} placeholder="Mobile number" aria-label="Mobile number" inputMode="tel" value={f.phone} onChange={set("phone")} maxLength={16} required />
        <input className={cls} placeholder="Email (optional)" aria-label="Email" type="email" value={f.email} onChange={set("email")} maxLength={120} />
        <input className={cls} placeholder="UPI id for payouts (optional)" aria-label="UPI id" value={f.upiId} onChange={set("upiId")} maxLength={80} />
        <label className="flex items-start gap-2 text-xs text-brand-text/80">
          <input type="checkbox" className="mt-0.5" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I have read and agree to the program terms above.
        </label>
        <button type="submit" disabled={!agree || busy} className="w-full rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-primary-600 disabled:opacity-50 sm:w-auto">
          {busy ? "Submitting..." : "Apply"}
        </button>
      </form>
    </>
  );
}

function PartnerView({ me }) {
  const { partner, stats, commissions = [], payouts = [] } = me;
  const [copied, setCopied] = useState("");
  const link = `${window.location.origin}/?aff=${partner.code}`;
  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1800); } catch { toast.error("Could not copy"); }
  };
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: "Shop with my link", text: `Shop at ${window.location.hostname}`, url: link }); else await copy(link, "link"); } catch { /* dismissed */ }
  };
  const cards = [
    { label: "Referred orders", value: fmt(stats.referredOrders), icon: ShoppingBag },
    { label: "Pending", value: `Rs ${fmt(stats.pending)}`, icon: Clock, hint: "Until delivery + hold period" },
    { label: "Ready to be paid", value: `Rs ${fmt(stats.approved)}`, icon: BadgeCheck, hint: stats.minPayoutRupees ? `Paid from Rs ${fmt(stats.minPayoutRupees)}` : undefined },
    { label: "Paid to you", value: `Rs ${fmt(stats.paid)}`, icon: Wallet },
  ];
  return (
    <>
      {partner.status !== "active" && (
        <div className={`rounded-2xl p-4 text-sm ${partner.status === "pending" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-800"}`} role="status">
          {partner.status === "pending" ? "Your application is under review. Your link will start earning once it is approved." : "Your partner account is suspended. New orders do not earn commission. Please contact the store."}
        </div>
      )}
      <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-text/60">Your code</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-secondary-100 px-3 py-1.5 font-mono text-lg font-bold tracking-widest text-brand-text">{partner.code}</span>
          <button type="button" onClick={() => copy(partner.code, "code")} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
            {copied === "code" ? <Check size={14} /> : <Copy size={14} />} {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-text/60">Your link ({fmt(me.percent)}% commission)</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input readOnly value={link} aria-label="Your affiliate link" onFocus={(e) => e.target.select()} className="w-full flex-1 rounded-xl border border-secondary-200 bg-secondary-50 px-3 py-2.5 text-sm text-brand-text" />
          <div className="flex gap-2">
            <button type="button" onClick={() => copy(link, "link")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-600 sm:flex-none">
              {copied === "link" ? <Check size={15} /> : <Copy size={15} />} {copied === "link" ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={share} aria-label="Share link" className="inline-flex items-center justify-center rounded-xl border border-secondary-200 px-3 py-2.5 text-brand-text"><Share2 size={16} /></button>
          </div>
        </div>
        <p className="mt-3 text-xs text-brand-text/60">Visitors who arrive through your link are linked to you once they sign in, for a limited time.</p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-secondary-200 bg-brand-bg p-4 shadow-sm">
            <c.icon size={16} className="text-primary-600" aria-hidden="true" />
            <p className="mt-2 text-lg font-bold tabular-nums text-brand-text">{c.value}</p>
            <p className="text-xs text-brand-text/70">{c.label}</p>
            {c.hint && <p className="mt-1 text-[11px] text-brand-text/50">{c.hint}</p>}
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <h2 className="text-base font-bold text-brand-text">Recent commissions</h2>
        {!commissions.length ? <p className="mt-2 text-sm text-brand-text/60">No orders yet. Share your link to get started.</p> : (
          <ul className="mt-3 divide-y divide-secondary-100">
            {commissions.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><p className="truncate font-medium text-brand-text">{c.orderCode || "Order"}</p><p className="text-xs text-brand-text/60">{dateFmt(c.createdAt)} | {fmt(c.percent)}% of Rs {fmt(c.baseAmount)}</p></div>
                <div className="text-right"><p className="font-bold tabular-nums text-brand-text">Rs {fmt(c.amount)}</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[c.status] || ""}`}>{c.status}</span></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
        <h2 className="text-base font-bold text-brand-text">Payouts</h2>
        {!payouts.length ? <p className="mt-2 text-sm text-brand-text/60">No payouts yet.</p> : (
          <ul className="mt-3 divide-y divide-secondary-100">
            {payouts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><p className="font-medium text-brand-text">{dateFmt(p.paidAt)}</p><p className="truncate text-xs text-brand-text/60">Ref {p.reference}</p></div>
                <p className="font-bold tabular-nums text-brand-text">Rs {fmt(p.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** /affiliate: sign-in prompt, apply form, or the partner dashboard. */
export default function Dashboard() {
  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.loading;
  const [cfg, setCfg] = useState(null);
  const [me, setMe] = useState(undefined); // undefined = loading, {partner:null} = not a partner
  const [failed, setFailed] = useState(false);

  useEffect(() => { getAffiliateConfig().then((r) => setCfg(r?.config || null)).catch(() => undefined); }, []);
  const load = useCallback(() => getMyAffiliate().then((r) => { setMe(r); setFailed(false); }).catch(() => setFailed(true)), []);
  useEffect(() => { if (user) load(); }, [user, load]);

  if (authLoading) return <Shell><Skeleton /></Shell>;
  if (!user) {
    return (
      <Shell>
        <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-6 text-center shadow-sm">
          <p className="text-sm text-brand-text/80">Sign in to join our affiliate program or to see your earnings.</p>
          {cfg?.programTerms && <p className="mx-auto mt-3 max-w-xl whitespace-pre-line text-xs text-brand-text/60">{cfg.programTerms}</p>}
          <Link to="/signin?redirect=/affiliate" className="mt-4 inline-block rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-600">Sign in</Link>
        </section>
      </Shell>
    );
  }
  if (failed) return <Shell><p className="py-10 text-center text-sm text-brand-text/70">The affiliate program is not available right now.</p></Shell>;
  if (me === undefined) return <Shell><Skeleton /></Shell>;
  return <Shell>{me.partner ? <PartnerView me={me} /> : <ApplyForm cfg={cfg} user={user} onDone={(r) => setMe(r)} />}</Shell>;
}
