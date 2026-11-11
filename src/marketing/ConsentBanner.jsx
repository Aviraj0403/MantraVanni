import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function ConsentBanner({ current, onAccept, onDecline, onDismiss }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      role="region"
      aria-label="Cookie and ad preferences"
      aria-describedby="mv-consent-text"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-primary-100 bg-brand-bg p-4 text-brand-text shadow-xl sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <p id="mv-consent-text" className="flex-1 text-[13px] leading-relaxed text-gray-700">
          We use cookies and the Meta Pixel to measure our ads and show you relevant offers. Essential cookies always stay on.
          {current ? ` Your current choice: ${current === "accept" ? "accepted" : "declined"}.` : ""}{" "}
          <Link to="/privacy-policy#marketing" className="font-medium text-primary-700 underline underline-offset-2">Learn more</Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onDecline} className="rounded-full border border-primary-200 px-4 py-2 text-xs font-semibold text-brand-text transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Decline</button>
          <button type="button" onClick={onAccept} className="rounded-full bg-primary-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Accept</button>
          <button type="button" onClick={onDismiss} aria-label="Close without choosing" className="rounded-full p-1.5 text-gray-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-600"><X size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
