import React from "react";
import { ArrowRight, BadgeCheck, Gift, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import sacredSavingsImage from "../../image/banner/sacred-savings-banner.png";

export default function BeautyDiscountBanner() {
  return (
    <section className="bg-brand-bg px-3 py-6 sm:px-6 sm:py-8 lg:px-5">
      <div className="relative mx-auto min-h-[520px]  overflow-hidden rounded-3xl bg-accent shadow-[0_16px_45px_rgba(139,30,30,0.22)] sm:min-h-[470px] lg:min-h-[390px]">
        <img
          src={sacredSavingsImage}
          alt="Spiritual gift collection with Lord Ganesha, diya and prayer beads"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] lg:object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-text/95 via-accent/78 to-black/10 sm:via-accent/62 lg:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

        <div className="relative z-10 flex min-h-[520px] items-start px-6 py-8 sm:min-h-[470px] sm:px-10 sm:py-10 lg:min-h-[390px] lg:items-center lg:px-16 lg:py-12">
          <div className="max-w-[570px] text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-secondary-300/45 bg-black/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-200 backdrop-blur-sm sm:text-[11px]">
              <Gift size={14} /> Sacred Savings
            </p>

            <h2 className="mt-5 font-serif text-[36px] font-semibold leading-[1.08] text-white sm:text-[46px] lg:text-[52px]">
              Gifts of Faith,
              <br />
              <span className="text-secondary-300">Prices to Celebrate</span>
            </h2>

            <p className="mt-4 max-w-[500px] text-sm leading-6 text-[#f1ded7] sm:text-base sm:leading-7">
              Enjoy up to <strong className="text-white">20% off</strong> on selected spiritual essentials, sacred gifts and devotional decor.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-medium text-[#f3e5dc] sm:text-xs">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-secondary-300" /> 100% Authentic Products
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-secondary-300" /> Secure Shopping
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/new-products"
                className="inline-flex h-11 items-center gap-5 rounded-lg bg-secondary px-6 text-sm font-bold text-brand-text shadow-lg transition hover:-translate-y-0.5 hover:bg-secondary-300"
              >
                Shop the Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/new-products"
                className="inline-flex h-11 items-center rounded-lg border border-white/35 bg-brand-bg/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-brand-bg hover:text-accent"
              >
                Explore Offers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
