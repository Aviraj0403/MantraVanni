import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getLoyaltyPublicConfig, getMyLoyalty, pointsForPrice } from "./loyaltyApi";

/** "Earn N points on this purchase" under the product actions. Renders nothing when earning is off or anything fails. */
export default function EarnLine({ variant, soldOut }) {
  const auth = useAuth();
  const user = auth?.user;
  const [cfg, setCfg] = useState(null);
  const [mult, setMult] = useState(null);

  useEffect(() => {
    let live = true;
    getLoyaltyPublicConfig().then((c) => live && setCfg(c));
    return () => { live = false; };
  }, []);
  useEffect(() => {
    if (!user || !cfg?.earnEnabled) { setMult(null); return undefined; }
    let live = true;
    getMyLoyalty().then((r) => live && setMult(r?.tier?.earnMultiplier ?? null)).catch(() => {});
    return () => { live = false; };
  }, [user, cfg?.earnEnabled]);

  if (!cfg || !cfg.earnEnabled || soldOut) return null;
  const price = Number(variant?.price) || 0;
  const baseMult = mult ?? cfg.tiers?.[0]?.earnMultiplier ?? 1;
  const pts = pointsForPrice(price, baseMult, cfg.earnPerRupees);
  if (!(pts > 0)) return null;
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-brand-text">
      <Gift size={16} className="shrink-0 text-primary-600" aria-hidden="true" />
      <span>
        Earn <b>{pts.toLocaleString("en-IN")} points</b> on this purchase
        {cfg.pointsPerRupeeValue > 0 && <span className="text-brand-text/60"> (worth Rs {Math.floor(pts / cfg.pointsPerRupeeValue).toLocaleString("en-IN")})</span>}
        <span className="text-brand-text/60"> after delivery</span>
      </span>
    </div>
  );
}
