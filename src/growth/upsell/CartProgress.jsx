import React from "react";
import { Truck, Gift } from "lucide-react";
import { formatINR } from "../../utils/money";
import { useUpsellConfig, fill } from "./api";

/** Free-shipping progress bar + next spend tier hint for the cart. Renders nothing when there is nothing configured. */
export default function CartProgress({ totalAmount }) {
  const cfg = useUpsellConfig();
  if (!cfg) return null;
  const total = Number(totalAmount) || 0;
  if (total <= 0) return null;

  const fs = cfg.freeShipping || {};
  const thr = Number(fs.thresholdRupees) || 0;
  const shipOn = !!fs.enabled && thr > 0;
  const tiers = (cfg.tiers || []).filter((t) => t.minRupees > 0 && t.percent > 0).sort((a, b) => a.minRupees - b.minRupees);
  const next = tiers.find((t) => total < t.minRupees);
  const reached = [...tiers].reverse().find((t) => total >= t.minRupees);
  if (!shipOn && !next && !reached) return null;

  const m = cfg.messages || {};
  const pct = shipOn ? Math.min(100, Math.round((total / thr) * 100)) : 0;
  const unlocked = shipOn && total >= thr;

  return (
    <section className="mb-4 space-y-3 rounded-2xl border border-primary-100 bg-white/70 p-3 sm:p-4" aria-live="polite">
      {shipOn && (
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Truck size={16} className={unlocked ? "text-emerald-600" : "text-primary-600"} />
            <span>{unlocked ? m.freeShippingUnlocked : fill(m.freeShippingProgress, { amount: formatINR(Math.max(0, thr - total)) })}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-emerald-500" : "bg-primary-500"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {reached && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          {reached.percent}% off on orders above {formatINR(reached.minRupees)} is applied at checkout
        </p>
      )}
      {next && (
        <p className="flex items-center gap-2 text-sm text-gray-800">
          <Gift size={15} className="shrink-0 text-primary-600" />
          {fill(m.tierHint, { amount: formatINR(next.minRupees - total), percent: next.percent })}
        </p>
      )}
    </section>
  );
}
