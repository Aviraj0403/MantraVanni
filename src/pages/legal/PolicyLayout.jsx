import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useStoreProfile from "../../hooks/useStoreProfile";

/**
 * Shared layout for the legal / trust pages (privacy, terms, refunds, shipping).
 *
 * LEGAL NOTE (developer-facing, intentionally not shown to shoppers): the policy text in these pages
 * is a generic template for an Indian e-commerce store (Consumer Protection (E-Commerce) Rules 2020,
 * IT Act 2000, DPDP Act 2023, Razorpay merchant requirements). It MUST be reviewed by a qualified
 * lawyer and adapted to the business (legal entity name, grievance officer, jurisdiction, actual
 * return window, shipping zones and data processors) before go-live. Store name, support email,
 * phone and address are read from the tenant's public settings (see hooks/useStoreProfile.js).
 */
export default function PolicyLayout({ title, summary, path, lastUpdated, sections, children }) {
  const store = useStoreProfile();
  usePageMeta({
    title: `${title} | ${store.name}`,
    description: summary,
    canonical: path,
  });

  const render = (s) => (typeof s === "function" ? s(store) : s);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page" className="text-brand-text">{title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary-600 md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{summary}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Last updated: {lastUpdated}</p>
        </header>

        <div className="rounded-2xl border border-primary-100 bg-brand-bg p-6 shadow-sm sm:p-9">
          {sections && sections.length > 0 && (
            <nav aria-label="On this page" className="mb-8 rounded-xl bg-primary-50/60 p-4 text-sm">
              <p className="mb-2 font-semibold text-brand-text">On this page</p>
              <ol className="list-decimal space-y-1 pl-5 text-primary-700">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:underline">{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-8">
            {(sections || []).map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
                <h2 id={`${s.id}-h`} className="mb-3 font-serif text-xl font-bold text-brand-text">{s.title}</h2>
                <div className="space-y-3 leading-relaxed text-gray-700">
                  {(s.body || []).map((block, i) => {
                    const b = render(block);
                    if (Array.isArray(b)) {
                      return (
                        <ul key={i} className="list-disc space-y-1.5 pl-5">
                          {b.map((li, j) => <li key={j}>{render(li)}</li>)}
                        </ul>
                      );
                    }
                    return <p key={i}>{b}</p>;
                  })}
                </div>
              </section>
            ))}
            {children}
          </div>

          <ContactBlock store={store} />
        </div>

        <nav aria-label="Other policies" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-700">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</Link>
          <Link to="/cancellation-refund-policy" className="hover:underline">Cancellation &amp; Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:underline">Shipping &amp; Delivery Policy</Link>
          <Link to="/contact-us" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </main>
  );
}

export function ContactBlock({ store }) {
  const hasAny = store.supportEmail || store.supportPhone || store.address;
  return (
    <aside className="mt-10 rounded-xl border border-primary-100 bg-primary-50/50 p-5 text-sm text-gray-700" aria-label="Contact details">
      <p className="mb-2 font-semibold text-brand-text">Questions about this policy?</p>
      {hasAny ? (
        <ul className="space-y-1.5">
          {store.supportEmail && (
            <li className="flex items-center gap-2">
              <Mail size={14} aria-hidden="true" />
              <a className="text-primary-700 hover:underline" href={`mailto:${store.supportEmail}`}>{store.supportEmail}</a>
            </li>
          )}
          {store.supportPhone && (
            <li className="flex items-center gap-2">
              <Phone size={14} aria-hidden="true" />
              <a className="text-primary-700 hover:underline" href={`tel:${store.supportPhone.replace(/\s+/g, "")}`}>{store.supportPhone}</a>
            </li>
          )}
          {store.address && (
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5" aria-hidden="true" />
              <span>{store.address}</span>
            </li>
          )}
        </ul>
      ) : (
        <p>
          Please reach us through our <Link to="/contact-us" className="text-primary-700 underline">Contact page</Link>.
        </p>
      )}
    </aside>
  );
}
