import React from "react";

/**
 * Shown when the platform reports this store as suspended (API code TENANT_SUSPENDED).
 * Self-contained: makes no API calls, so it can't bounce back into the interceptor.
 */
const StoreUnavailable = () => {
  const retry = () => window.location.replace("/");

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-12"
      aria-labelledby="store-unavailable-title"
    >
      <section className="w-full max-w-md rounded-3xl border border-amber-100 bg-white/90 p-8 text-center shadow-[0_20px_60px_-25px_rgba(120,53,15,0.35)] backdrop-blur">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200"
          aria-hidden="true"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l1.5-5h15L21 9" />
            <path d="M4 9v11h16V9" />
            <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
            <path d="M10 20v-5h4v5" />
          </svg>
        </div>

        <h1 id="store-unavailable-title" className="text-2xl font-semibold tracking-tight text-stone-900">
          We&apos;ll be back soon
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          This store is currently unavailable. Your account, orders and wallet are safe — please check back a little later.
        </p>

        <button
          type="button"
          onClick={retry}
          className="mt-8 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Try again
        </button>

        <p className="mt-5 text-xs text-stone-400">If you need help with an existing order, please contact the store directly.</p>
      </section>
    </main>
  );
};

export default StoreUnavailable;
