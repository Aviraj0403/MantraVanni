import React from 'react';
import { ShieldCheck, Truck, Percent, Award, BadgePercent, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Percent, title: "Wholesale Margins", text: "Get up to 60-70% retail profit margin on SKUs." },
  { icon: ShieldCheck, title: "GST Invoice", text: "Claim 18% GST input credit on all purchases." },
  { icon: Award, title: "Direct Factory Imports", text: "Sourced straight from verified manufacturers." },
  { icon: Truck, title: "Fast Dispatch", text: "Priority dispatch to pan-India PIN codes." },
];

export default function BulkoRetailerBanner() {
  return (
    <section className="bg-brand-bg px-3 py-5 sm:px-6 lg:px-5">
      <div className="relative mx-auto overflow-hidden rounded-3xl border border-secondary/40 bg-gradient-to-r from-brand-text via-accent to-brand-text p-6 text-white shadow-[0_14px_40px_rgba(139,30,30,0.18)] sm:p-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-12 -translate-y-12 rounded-full bg-secondary/20 blur-3xl"></div>

        <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary-300/40 bg-brand-text/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary-200 backdrop-blur sm:text-xs">
              <Store size={14} /> INDIA'S #1 TECH & MOBILE WHOLESALE MARKETPLACE
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              Built for India's Retailers, Resellers & <span className="text-secondary-300">Dukandars</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              Bulko cuts out 4–5 layers of middlemen between the factory and your shop shelf. Direct factory import pricing, 100% GST Invoice on every order, and 1-click business wallet restock.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/wallet"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary-500 px-6 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-brand-text"
              >
                <BadgePercent size={18} /> Open Business Wallet
              </Link>

              <Link
                to="/wishlist"
                className="inline-flex h-12 items-center rounded-lg border border-secondary-300/50 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:border-secondary hover:bg-secondary/20"
              >
                Saved Inventory
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:-translate-y-1 hover:border-secondary/60"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary-300">
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="mt-1 text-xs text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
