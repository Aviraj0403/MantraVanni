import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import Axios from "../../utils/Axios";

/** "Instant download after payment" note for digital products. Renders nothing for other products or on any failure. */
export default function DigitalBadge({ product }) {
  const id = product?._id ? String(product._id) : "";
  const [digital, setDigital] = useState(false);
  useEffect(() => {
    if (!/^[a-f0-9]{24}$/i.test(id)) return undefined;
    let live = true;
    Axios.get(`/digital-products/is-digital/${id}`, { timeout: 6000 }).then((r) => live && setDigital(!!r.data?.digital)).catch(() => undefined);
    return () => { live = false; };
  }, [id]);
  if (!digital) return null;
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
      <Zap size={16} /> Instant download after payment
    </div>
  );
}
