import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Clock, CheckCircle2, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getService, getSlots, createBooking, verifyBooking, getBookingConfig, apiMessage, rs, fmtWhen, istDayOffset, loadRazorpay, inputCls, btnCls } from "./bookingApi";

const Notice = ({ type, children }) => (
  <div role={type === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
    {type === "error" ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
    <span>{children}</span>
  </div>
);

const dayLabel = (d) => {
  const dt = new Date(`${d}T00:00:00Z`);
  return { wd: dt.toLocaleDateString("en-IN", { timeZone: "UTC", weekday: "short" }), dm: dt.toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short" }) };
};

/** /book/:serviceId : date picker (next N days), slot buttons, details, pay at venue / online. */
export default function BookService() {
  const { serviceId } = useParams();
  const location = useLocation();
  const { user } = useAuth() || {};
  const [svc, setSvc] = useState(undefined);
  const [cfg, setCfg] = useState(null);
  const [date, setDate] = useState(istDayOffset(0));
  const [slots, setSlots] = useState(null);
  const [slotErr, setSlotErr] = useState("");
  const [time, setTime] = useState("");
  const [f, setF] = useState({ name: "", phone: "", email: "", notes: "" });
  const [mode, setMode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(null);
  const [pendingVerify, setPendingVerify] = useState(null);
  const live = useRef(true);
  useEffect(() => () => { live.current = false; }, []);

  useEffect(() => {
    let on = true;
    getService(serviceId).then((s) => { if (on) setSvc(s); }).catch(() => { if (on) setSvc(null); });
    getBookingConfig().then((c) => on && setCfg(c));
    return () => { on = false; };
  }, [serviceId]);
  useEffect(() => { if (svc) { document.title = `Book ${svc.name}`; setMode(svc.paymentModes?.[0] || "venue"); } }, [svc]);
  useEffect(() => { if (user) setF((x) => ({ name: x.name || user.firstName || user.userName || "", phone: x.phone || user.phoneNumber || "", email: x.email || user.email || "", notes: x.notes })); }, [user]);

  const loadSlots = (d) => {
    setSlots(null); setSlotErr(""); setTime("");
    getSlots(serviceId, d).then(setSlots).catch((e) => { setSlots([]); setSlotErr(apiMessage(e, "Could not load time slots. Please try again.")); });
  };
  useEffect(() => { if (svc) loadSlots(date); }, [svc, date]); // eslint-disable-line react-hooks/exhaustive-deps

  if (svc === undefined) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;
  if (svc === null) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><p className="mb-4 text-brand-text">This service is not available.</p><Link to="/book" className="font-semibold text-primary-600 underline">See all services</Link></div>;

  const days = Array.from({ length: Math.min(svc.advanceDaysMax + 1, 31) }, (_, i) => istDayOffset(i));
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const chosen = (slots || []).find((s) => s.time === time);
  const modes = svc.paymentModes || ["venue"];

  const verify = async (resp) => {
    setBusy(true);
    try {
      const r = await verifyBooking({ razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature });
      setPendingVerify(null); setMsg(null); setDone(r.booking);
    } catch (e) {
      setPendingVerify(resp);
      setMsg({ type: "error", text: `${apiMessage(e, "We received your payment but could not confirm the booking yet.")} Your payment id is ${resp.razorpay_payment_id}. You can retry below; you will not be charged twice.` });
    } finally { if (live.current) setBusy(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setMsg(null);
    if (!time) return setMsg({ type: "error", text: "Please pick a time slot." });
    if (!f.name.trim()) return setMsg({ type: "error", text: "Please enter your name." });
    if (!f.phone.trim()) return setMsg({ type: "error", text: "Please enter your mobile number." });
    setBusy(true);
    let opened = false;
    try {
      if (mode === "online" && !(await loadRazorpay())) { setMsg({ type: "error", text: "The payment gateway is still loading. Please try again in a moment." }); return; }
      const r = await createBooking({ serviceId: svc.id, date, time, paymentMode: mode, customer: { name: f.name, phone: f.phone, email: f.email, notes: f.notes } });
      if (!r?.success) throw new Error("bad");
      if (mode !== "online" || !r.payment) { setDone(r.booking); return; }
      const o = r.payment;
      const rzp = new window.Razorpay({
        key: o.key, amount: o.amount, currency: o.currency || "INR", order_id: o.orderId, name: svc.name, description: `Booking on ${fmtWhen(r.booking.startAt)}`,
        handler: (resp) => { verify(resp); },
        modal: { ondismiss: () => { if (live.current) { setBusy(false); setMsg({ type: "error", text: `Payment window closed. Your slot is held for ${cfg?.holdMinutes || 15} minutes; you can pay again after it is released.` }); } } },
        prefill: { name: f.name, email: f.email || user?.email || "", contact: f.phone },
        theme: { color: "#dc2626" },
      });
      rzp.on?.("payment.failed", (resp) => { setBusy(false); setMsg({ type: "error", text: resp?.error?.description || "Payment failed. Please try again." }); });
      opened = true;
      rzp.open();
    } catch (err) {
      setMsg({ type: "error", text: apiMessage(err, "Could not complete the booking. Please try again.") });
      if (err?.response?.status === 409) loadSlots(date);
    } finally { if (!opened && live.current) setBusy(false); }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <section className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h1 className="flex items-center gap-2 text-lg font-bold text-emerald-900"><CheckCircle2 size={20} /> Booking confirmed</h1>
          <p className="text-sm text-emerald-900"><b>{done.serviceName}</b><br />{fmtWhen(done.startAt)} (IST)</p>
          <p className="text-sm text-emerald-900">{done.paid ? `Paid ${rs(done.amountRupees)} online.` : done.amountRupees > 0 ? `Please pay ${rs(done.amountRupees)} at the venue.` : "No payment needed."} We will send you a reminder before your booking.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link to="/profile" className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900">My account, My bookings</Link>
            <Link to="/book" className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900">Book another</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link to="/book" className="mb-3 inline-flex items-center gap-1 text-sm text-brand-text/70 hover:text-primary-600"><ChevronLeft size={16} /> All services</Link>
      <h1 className="text-2xl font-bold text-brand-text">{svc.name}</h1>
      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-text/70"><span className="flex items-center gap-1"><Clock size={14} />{svc.durationMinutes} min</span><span className="font-bold text-primary-600">{svc.priceRupees > 0 ? rs(svc.priceRupees) : "Free"}</span></p>
      {svc.description && <p className="mt-3 whitespace-pre-line text-sm text-brand-text/80">{svc.description}</p>}

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section>
          <h2 className="mb-2 text-sm font-bold text-brand-text">1. Pick a date</h2>
          <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
            {days.map((d) => { const l = dayLabel(d); const on = d === date; return (
              <button key={d} type="button" onClick={() => setDate(d)} aria-pressed={on} className={`flex w-16 shrink-0 snap-start flex-col items-center rounded-xl border px-2 py-2 text-xs transition ${on ? "border-primary-500 bg-primary-500 text-white" : "border-secondary-200 bg-white text-brand-text hover:border-primary-300"}`}>
                <span className="font-medium">{l.wd}</span><span className="font-bold">{l.dm}</span>
              </button>); })}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold text-brand-text">2. Pick a time (IST)</h2>
          {slots === null && <div className="flex items-center gap-2 text-sm text-brand-text/70"><Loader2 size={16} className="animate-spin" /> Loading slots...</div>}
          {slotErr && <Notice type="error">{slotErr}</Notice>}
          {slots && !slotErr && slots.length === 0 && <p className="text-sm text-brand-text/70">No slots on this day. Please try another date.</p>}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {(slots || []).map((s) => (
              <button key={s.time} type="button" disabled={!s.available} onClick={() => setTime(s.time)} aria-pressed={time === s.time}
                className={`rounded-xl border px-2 py-2 text-sm transition ${time === s.time ? "border-primary-500 bg-primary-500 font-bold text-white" : s.available ? "border-secondary-200 bg-white text-brand-text hover:border-primary-300" : "cursor-not-allowed border-secondary-100 bg-secondary-50 text-brand-text/30 line-through"}`}>
                {new Date(`2000-01-01T${s.time}:00Z`).toLocaleTimeString("en-IN", { timeZone: "UTC", hour: "numeric", minute: "2-digit", hour12: true })}
                {s.available && svc.capacityPerSlot > 1 && <span className="block text-[10px] font-normal opacity-80">{s.remaining} left</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-brand-text">3. Your details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputCls} placeholder="Your name" value={f.name} onChange={set("name")} maxLength={80} autoComplete="name" />
            <input className={inputCls} placeholder="Mobile number" value={f.phone} onChange={set("phone")} maxLength={20} inputMode="tel" autoComplete="tel" />
            <input className={`${inputCls} sm:col-span-2`} placeholder="Email (optional)" value={f.email} onChange={set("email")} maxLength={254} inputMode="email" autoComplete="email" />
            <textarea className={`${inputCls} sm:col-span-2`} rows={2} placeholder="Anything we should know? (optional)" value={f.notes} onChange={set("notes")} maxLength={500} />
          </div>
        </section>

        {svc.priceRupees > 0 && modes.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-brand-text">4. Payment</h2>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${mode === m ? "border-primary-500 bg-primary-50" : "border-secondary-200 bg-white"}`}>
                  <input type="radio" name="paymode" checked={mode === m} onChange={() => setMode(m)} />
                  {m === "online" ? `Pay online ${rs(svc.priceRupees)}` : "Pay at venue"}
                </label>
              ))}
            </div>
          </section>
        )}

        {chosen && <p className="rounded-xl bg-primary-50 px-3 py-2 text-sm text-brand-text">Your booking: <b>{fmtWhen(chosen.startAt)}</b></p>}
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
        {!user ? (
          <Link to="/signin" state={{ from: location }} className={`${btnCls} w-full`}>Sign in to book</Link>
        ) : pendingVerify ? (
          <button type="button" disabled={busy} onClick={() => verify(pendingVerify)} className={`${btnCls} w-full`}>{busy ? <Loader2 size={16} className="animate-spin" /> : null} Confirm my booking</button>
        ) : (
          <button type="submit" disabled={busy || !time} className={`${btnCls} w-full`}>{busy ? <Loader2 size={16} className="animate-spin" /> : null}{mode === "online" ? `Pay ${rs(svc.priceRupees)} and book` : "Confirm booking"}</button>
        )}
      </form>
    </div>
  );
}
