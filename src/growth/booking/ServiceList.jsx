import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CalendarCheck } from "lucide-react";
import { getServices, rs } from "./bookingApi";

/** /book : the services a customer can book. */
export default function ServiceList() {
  const [list, setList] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    document.title = "Book a service";
    getServices().then(setList).catch(() => { setFailed(true); setList([]); });
  }, []);
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-brand-text">Book a service</h1>
      <p className="mb-6 text-sm text-brand-text/70">Choose a service, pick a date and a time that suits you.</p>
      {list === null && <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>}
      {failed && <p className="text-sm text-red-600">We could not load the services right now. Please try again in a moment.</p>}
      {list && !failed && list.length === 0 && <p className="text-sm text-brand-text/70">No services are open for booking at the moment.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(list || []).map((s) => (
          <Link key={s.id} to={`/book/${s.slug || s.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm transition hover:shadow-md">
            {s.image ? <img src={s.image} alt={s.name} loading="lazy" className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-primary-50 text-primary-500"><CalendarCheck size={40} /></div>}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h2 className="text-base font-bold text-brand-text">{s.name}</h2>
              {s.description && <p className="line-clamp-3 text-sm text-brand-text/70">{s.description}</p>}
              <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                <span className="flex items-center gap-1 text-brand-text/70"><Clock size={14} />{s.durationMinutes} min</span>
                <span className="font-bold text-primary-600">{s.priceRupees > 0 ? rs(s.priceRupees) : "Free"}</span>
              </div>
              <span className="mt-2 rounded-xl bg-primary-500 py-2 text-center text-sm font-bold text-white group-hover:bg-primary-600">Book now</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
