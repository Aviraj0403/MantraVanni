import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, listQuotes, fmtDate } from "./api";

const QCLS = { new: "bg-amber-100 text-amber-800", responded: "bg-green-100 text-green-800", closed: "bg-gray-100 text-gray-600" };

/** "My account > Wholesale": application status, perks and quote requests with the store's replies. */
export default function WholesaleTab() {
  const [me, setMe] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    Promise.all([getMe().catch(() => null), listQuotes().catch(() => [])]).then(([m, q]) => { if (live) { setMe(m); setQuotes(q); setLoading(false); } });
    return () => { live = false; };
  }, []);
  if (loading) return <div className="h-32 animate-pulse rounded-2xl bg-gray-100" aria-busy="true" />;
  if (!me) return null;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
        {!me.applied ? (
          <p>Buy in bulk at business prices. <Link to="/wholesale" className="font-semibold text-primary-700 underline">Apply for a wholesale account</Link>.</p>
        ) : (
          <>
            <p className="font-bold text-gray-900">{me.businessName}{me.gstin ? <span className="ml-2 font-mono text-xs font-normal text-gray-500">{me.gstin}</span> : null}</p>
            <p className="mt-1">Status: <b className={me.status === "approved" ? "text-emerald-700" : me.status === "rejected" ? "text-rose-700" : "text-amber-700"}>{me.status}</b>{me.group?.name ? ` (${me.group.name})` : ""}</p>
            {me.status === "rejected" && <p className="mt-1 text-gray-600">{me.note || "Your application was not approved."} <Link to="/wholesale" className="font-semibold text-primary-700 underline">Apply again</Link></p>}
            {me.perks?.length > 0 && <ul className="mt-2 list-disc pl-5 text-gray-700">{me.perks.map((p) => <li key={p}>{p}</li>)}</ul>}
          </>
        )}
      </div>
      {me.status === "approved" && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-gray-900">My quote requests</h3>
          {!quotes.length ? <p className="text-sm text-gray-500">No quote requests yet. Open a product and tap "Request a quote".</p> : (
            <div className="space-y-3">{quotes.map((q) => (
              <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="text-xs text-gray-500">{fmtDate(q.createdAt)}</span><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${QCLS[q.status] || QCLS.closed}`}>{q.status}</span></div>
                <ul className="mt-2 space-y-0.5">{q.items.map((it, i) => <li key={i}>{it.qty} x {it.name || "Product"}{it.size ? ` (${it.size})` : ""}</li>)}</ul>
                {q.message && <p className="mt-2 text-gray-600">{q.message}</p>}
                {q.responseNote && <p className="mt-2 whitespace-pre-line rounded-xl bg-primary-50 p-3 text-gray-800"><b>Reply:</b> {q.responseNote}</p>}
              </div>
            ))}</div>
          )}
        </div>
      )}
    </div>
  );
}
