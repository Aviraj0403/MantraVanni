import React, { useCallback, useEffect, useRef, useState } from "react";
import { Gift, Copy, Check, Share2, Award, Hourglass } from "lucide-react";
import { toast } from "../../utils/toast";
import { getMyLoyalty, getMyLoyaltyHistory, redeemLoyaltyPoints, newKey } from "./loyaltyApi";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const dateFmt = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } };

/** "My account" > Rewards: balance, tier progress, redeem into wallet credit, history and the referral code. */
export default function RewardsTab() {
  const [me, setMe] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hist, setHist] = useState({ entries: [], total: 0, page: 1 });
  const [histLoading, setHistLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const keyRef = useRef(null);

  const loadMe = useCallback(() => getMyLoyalty().then((r) => { setMe(r); setFailed(false); }).catch(() => setFailed(true)), []);
  const loadHist = useCallback(async (page) => {
    setHistLoading(true);
    try {
      const r = await getMyLoyaltyHistory(page);
      setHist((h) => ({ entries: page === 1 ? r.entries : [...h.entries, ...r.entries], total: r.total, page }));
    } catch { /* history is optional */ } finally { setHistLoading(false); }
  }, []);
  useEffect(() => { loadMe(); loadHist(1); }, [loadMe, loadHist]);

  if (failed) return <p className="py-10 text-center text-sm text-brand-text/70">Rewards are not available right now.</p>;
  if (!me) return <div className="space-y-3" aria-busy="true"><div className="h-32 animate-pulse rounded-2xl bg-secondary-100" /><div className="h-24 animate-pulse rounded-2xl bg-secondary-100" /></div>;

  const cfg = me.config || {};
  const ppr = Math.max(1, cfg.pointsPerRupeeValue || 1);
  const n = /^\d{1,9}$/.test(amount) ? Number(amount) : 0;
  const rupees = Math.floor(n / ppr);
  const usable = rupees * ppr;
  const dailyLeft = me.redeem?.dailyLeft;
  const tooLow = n > 0 && usable < (cfg.minRedeemPoints || 0);
  const tooHigh = usable > me.balance;
  const overCap = dailyLeft != null && usable > dailyLeft;
  const canRedeem = cfg.redeemEnabled && usable > 0 && !tooLow && !tooHigh && !overCap && !busy;

  const redeem = async () => {
    if (!canRedeem) return;
    if (!keyRef.current) keyRef.current = newKey();
    setBusy(true);
    try {
      const r = await redeemLoyaltyPoints(usable, keyRef.current);
      toast.success(r.message || `Rs ${r.rupees} added to your wallet`);
      keyRef.current = null; setAmount("");
      await Promise.all([loadMe(), loadHist(1)]);
    } catch (e) {
      const st = e?.response?.status;
      if (st && st < 500 && st !== 409) keyRef.current = null; // definite refusal: next attempt is a new request
      toast.error(e?.response?.data?.message || "Could not redeem right now. Please try again.");
    } finally { setBusy(false); }
  };

  const code = me.referral?.code;
  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { toast.error("Could not copy"); }
  };
  const shareCode = async () => {
    const text = `Join me on ${window.location.hostname} and use my referral code ${code} to get a welcome reward!`;
    try {
      if (navigator.share) await navigator.share({ title: "My referral code", text, url: window.location.origin });
      else await copyCode();
    } catch { /* user dismissed the share sheet */ }
  };

  const bonusBits = [];
  if (cfg.referrerBonusPoints > 0) bonusBits.push(`you get ${fmt(cfg.referrerBonusPoints)} points`);
  if (cfg.refereeBonusPoints > 0) bonusBits.push(`your friend gets ${fmt(cfg.refereeBonusPoints)} points`);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-800 via-accent-700 to-accent-600 p-5 text-white shadow-lg sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Your points</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{fmt(me.balance)}</p>
            <p className="mt-1 text-sm text-white/80">Worth Rs {fmt(me.balanceValueRupees)} as wallet credit</p>
          </div>
          {me.tier && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold">
              <Award size={15} aria-hidden="true" /> {me.tier.name}
              {me.tier.earnMultiplier > 1 && <span className="text-white/75">{me.tier.earnMultiplier}x points</span>}
            </span>
          )}
        </div>
        {me.nextTier ? (
          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuenow={me.progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-secondary-200 transition-all" style={{ width: `${me.progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/80">Spend Rs {fmt(me.nextTier.remainingRupees)} more to reach <b>{me.nextTier.name}</b></p>
          </div>
        ) : me.tier ? <p className="mt-4 text-xs text-white/80">You are at our top tier. Thank you!</p> : null}
        {me.expiringSoon?.points > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-200"><Hourglass size={13} aria-hidden="true" />{fmt(me.expiringSoon.points)} points expire within {me.expiringSoon.withinDays} days{me.expiringSoon.soonest ? ` (from ${dateFmt(me.expiringSoon.soonest)})` : ""}</p>
        )}
      </div>

      {cfg.earnEnabled && (
        <p className="text-sm text-brand-text/70">Earn 1 point for every Rs {fmt(cfg.earnPerRupees)} you spend. Points are added after your order is delivered.</p>
      )}

      {cfg.redeemEnabled && (
        <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-brand-text"><Gift size={18} className="text-primary-600" aria-hidden="true" /> Redeem points</h3>
          <p className="mt-1 text-xs text-brand-text/70">{fmt(ppr)} points = Rs 1 in your wallet{cfg.minRedeemPoints > 0 ? `. Minimum ${fmt(cfg.minRedeemPoints)} points` : ""}{dailyLeft != null ? `. ${fmt(dailyLeft)} points left to redeem today` : ""}.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder={`Points (e.g. ${fmt(Math.max(cfg.minRedeemPoints || 0, ppr))})`} aria-label="Points to redeem"
              className="w-full flex-1 rounded-xl border border-secondary-200 px-4 py-2.5 text-sm font-semibold text-brand-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="button" onClick={redeem} disabled={!canRedeem}
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-primary-600 disabled:opacity-50">
              {busy ? "Redeeming..." : usable > 0 ? `Redeem for Rs ${fmt(rupees)}` : "Redeem"}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {me.balance >= Math.max(ppr, cfg.minRedeemPoints || 0) && (
              <button type="button" className="text-xs font-semibold text-primary-700 underline" onClick={() => setAmount(String(dailyLeft != null ? Math.min(me.balance, dailyLeft) : me.balance))}>Use maximum</button>
            )}
            {n > 0 && n !== usable && usable > 0 && <span className="text-xs text-brand-text/60">Rounded to {fmt(usable)} points (whole rupees only)</span>}
            {tooLow && <span className="text-xs text-rose-600">Below the minimum of {fmt(cfg.minRedeemPoints)} points</span>}
            {!tooLow && tooHigh && <span className="text-xs text-rose-600">You only have {fmt(me.balance)} points</span>}
            {!tooLow && !tooHigh && overCap && <span className="text-xs text-rose-600">Over today's limit ({fmt(dailyLeft)} points left)</span>}
          </div>
        </section>
      )}

      {code && (
        <section className="rounded-2xl border border-secondary-200 bg-brand-bg p-5 shadow-sm">
          <h3 className="text-base font-bold text-brand-text">Refer a friend</h3>
          <p className="mt-1 text-xs text-brand-text/70">
            Share your code. When your friend's first order is delivered
            {me.referral.walletRewardRupees > 0 ? `, you both get Rs ${fmt(me.referral.walletRewardRupees)} in your wallet` : ""}
            {bonusBits.length ? `${me.referral.walletRewardRupees > 0 ? " and" : ","} ${bonusBits.join(" and ")}` : ""}.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="rounded-xl border border-dashed border-primary-500 bg-secondary-50 px-4 py-2 text-base font-bold tracking-wider text-brand-text">{code}</code>
            <button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-xl border border-secondary-200 px-3 py-2 text-xs font-semibold text-brand-text hover:bg-secondary-50">
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={shareCode} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2 text-xs font-bold text-white hover:bg-primary-600">
              <Share2 size={14} aria-hidden="true" /> Share
            </button>
          </div>
          <p className="mt-3 text-xs text-brand-text/60">
            {fmt(me.referral.referredCount)} friend{me.referral.referredCount === 1 ? "" : "s"} joined, {fmt(me.referral.rewardedCount)} rewarded
            {me.referral.bonusPointsEarned > 0 ? `, ${fmt(me.referral.bonusPointsEarned)} bonus points earned` : ""}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-secondary-200 bg-brand-bg shadow-sm">
        <h3 className="border-b border-secondary-200 px-5 py-3 text-base font-bold text-brand-text">Points history</h3>
        {!hist.entries.length ? (
          <p className="px-5 py-8 text-center text-sm text-brand-text/60">{histLoading ? "Loading..." : "No points activity yet. Place an order to start earning!"}</p>
        ) : (
          <ul className="divide-y divide-secondary-100">
            {hist.entries.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-brand-text">{e.note || e.type}</p>
                  <p className="text-xs text-brand-text/60">{dateFmt(e.createdAt)}{e.expiresAt && e.points > 0 ? ` | expires ${dateFmt(e.expiresAt)}` : ""}</p>
                </div>
                <span className={`shrink-0 text-sm font-bold tabular-nums ${e.points >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{e.points > 0 ? "+" : ""}{fmt(e.points)}</span>
              </li>
            ))}
          </ul>
        )}
        {hist.entries.length < hist.total && (
          <div className="border-t border-secondary-100 p-3 text-center">
            <button type="button" disabled={histLoading} onClick={() => loadHist(hist.page + 1)} className="text-sm font-semibold text-primary-700 disabled:opacity-50">{histLoading ? "Loading..." : "Show more"}</button>
          </div>
        )}
      </section>
    </div>
  );
}
