import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "../utils/Axios";

/** Public COD confirmation page (/cod-confirm/<orderId>.<token>). No login needed. */
export default function CodConfirm() {
  const { token: param } = useParams();
  const [orderId, token] = String(param || "").split(".");
  const linkOk = /^[a-f0-9]{24}$/i.test(orderId || "") && /^[a-f0-9]{64}$/.test(token || "");
  const [state, setState] = useState(linkOk ? "ask" : "invalid"); // ask | busy | confirmed | cancelled | expired | invalid | error
  const [confirmCancel, setConfirmCancel] = useState(false);

  const send = async (action) => {
    setState("busy");
    try {
      await Axios.post("/cod-shield/confirm", { orderId, token, action });
      setState(action === "confirm" ? "confirmed" : "cancelled");
    } catch (e) {
      const s = e?.response?.status;
      setState(s === 410 ? "expired" : s === 400 || s === 403 || s === 404 ? "invalid" : "error");
    }
  };

  const view = {
    confirmed: { icon: "✅", title: "Order confirmed", text: "Thank you! We are getting your order ready for dispatch." },
    cancelled: { icon: "🛑", title: "Order cancelled", text: "Your order has been cancelled. You can place a new order any time." },
    expired: { icon: "⌛", title: "Link no longer active", text: "This order was already confirmed, cancelled or has closed, so nothing more is needed." },
    invalid: { icon: "⚠️", title: "This link is not valid", text: "Please check the link in your message, or contact the store for help." },
    error: { icon: "⚠️", title: "Something went wrong", text: "We could not reach the store. Please check your connection and try again." },
  }[state];

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        {view ? (
          <>
            <div className="text-4xl" aria-hidden="true">{view.icon}</div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">{view.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{view.text}</p>
            {state === "error" && <button type="button" onClick={() => setState("ask")} className="mt-5 h-11 w-full rounded-xl bg-gray-900 text-sm font-medium text-white">Try again</button>}
            <Link to="/" className="mt-5 inline-block text-sm font-medium text-gray-700 underline">Continue shopping</Link>
          </>
        ) : (
          <>
            <div className="text-4xl" aria-hidden="true">📦</div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">Confirm your Cash on Delivery order</h1>
            <p className="mt-2 text-sm text-gray-600">Please confirm that you want this order. Unconfirmed orders may be cancelled automatically.</p>
            {!confirmCancel ? (
              <div className="mt-6 flex flex-col gap-3">
                <button type="button" disabled={state === "busy"} onClick={() => send("confirm")} className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white disabled:opacity-60">
                  {state === "busy" ? "Please wait..." : "Yes, confirm my order"}
                </button>
                <button type="button" disabled={state === "busy"} onClick={() => setConfirmCancel(true)} className="h-12 w-full rounded-xl border border-gray-300 bg-white text-base font-medium text-gray-800 disabled:opacity-60">
                  Cancel my order
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-800">Are you sure you want to cancel?</p>
                <button type="button" disabled={state === "busy"} onClick={() => send("reject")} className="h-12 w-full rounded-xl bg-rose-600 text-base font-semibold text-white disabled:opacity-60">
                  {state === "busy" ? "Please wait..." : "Yes, cancel my order"}
                </button>
                <button type="button" disabled={state === "busy"} onClick={() => setConfirmCancel(false)} className="h-12 w-full rounded-xl border border-gray-300 bg-white text-base font-medium text-gray-800">
                  Go back
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
