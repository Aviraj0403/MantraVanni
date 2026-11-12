import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { getMyBookings, cancelBooking, apiMessage, rs, fmtWhen } from "./bookingApi";

const LABEL = { pending_payment: "Awaiting payment", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", no_show: "Missed" };
const TONE = { pending_payment: "bg-amber-100 text-amber-800", confirmed: "bg-emerald-100 text-emerald-800", completed: "bg-sky-100 text-sky-800", cancelled: "bg-red-100 text-red-700", no_show: "bg-secondary-100 text-brand-text" };

/** "My account" tab: my bookings with cancel. */
export default function MyBookings() {
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);
  const load = useCallback(() => { getMyBookings().then(setRows).catch(() => setRows([])); }, []);
  useEffect(() => { load(); }, [load]);

  const cancel = async (b) => {
    if (!window.confirm("Cancel this booking?")) return;
    setBusy(b.id); setMsg(null);
    try { await cancelBooking(b.id); load(); } catch (e) { setMsg(apiMessage(e, "Could not cancel this booking.")); } finally { setBusy(""); }
  };

  if (rows === null) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary-500" /></div>;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-brand-text">My bookings</h2>
        <Link to="/book" className="text-sm font-semibold text-primary-600 underline">Book a service</Link>
      </div>
      {msg && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><AlertCircle size={16} className="mt-0.5 shrink-0" />{msg}</div>}
      {rows.length === 0 && <p className="text-sm text-brand-text/70">You have no bookings yet.</p>}
      {rows.map((b) => (
        <div key={b.id} className="space-y-1.5 rounded-2xl border border-secondary-200 bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-brand-text">{b.serviceName}</div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE[b.status] || ""}`}>{LABEL[b.status] || b.status}</span>
          </div>
          <div className="text-sm text-brand-text">{fmtWhen(b.startAt)} (IST)</div>
          <div className="text-xs text-brand-text/70">{b.amountRupees > 0 ? `${rs(b.amountRupees)}, ${b.paid ? "paid online" : b.paymentMode === "online" ? "payment pending" : "pay at venue"}` : "Free"}</div>
          {b.refundPending && <div className="text-xs font-medium text-amber-700">Your refund is being processed by the store.</div>}
          {b.status === "cancelled" && b.cancelReason === "hold_expired" && <div className="text-xs text-brand-text/70">The payment was not completed in time, so the slot was released.</div>}
          {b.cancellable && (
            <button type="button" disabled={busy === b.id} onClick={() => cancel(b)} className="rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
              {busy === b.id ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
