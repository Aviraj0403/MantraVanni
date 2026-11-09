import React from "react";
import { Star, Users, ShieldCheck, Sparkles, CheckCircle2, Heart, Lock, Flame } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-bg px-3 sm:px-6 lg:px-5 pb-16 pt-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Dark Banner with 3D Metallic Gold Divine Metrics */}
        <div className="relative overflow-hidden rounded-t-3xl divine-gradient divine-3d-glow px-6 py-8 shimmer-gold-3d">
          <div className="relative z-10 grid grid-cols-2 gap-6 sm:grid-cols-4 md:items-center">
            <div className="flex items-center gap-3 floating-3d">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/30 to-amber-600/20 text-amber-300 border border-amber-300/40 shadow-lg backdrop-blur-md">
                <Users size={30} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-white drop-shadow-md">25,000+</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">Devoted Families</p>
              </div>
            </div>

            <div className="flex items-center gap-3 floating-3d" style={{ animationDelay: '1s' }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/30 to-amber-600/20 text-amber-300 border border-amber-300/40 shadow-lg backdrop-blur-md">
                <ShieldCheck size={30} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-white drop-shadow-md">100%</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">Vedic Authenticity</p>
              </div>
            </div>

            <div className="flex items-center gap-3 floating-3d" style={{ animationDelay: '2s' }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/30 to-amber-600/20 text-amber-300 border border-amber-300/40 shadow-lg backdrop-blur-md">
                <Star size={30} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-white drop-shadow-md">4.9 <Star className="inline text-amber-400" size={18} fill="currentColor" /></h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">User Rating</p>
              </div>
            </div>

            <div className="flex items-center gap-3 floating-3d" style={{ animationDelay: '3s' }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/30 to-amber-600/20 text-amber-300 border border-amber-300/40 shadow-lg backdrop-blur-md">
                <Sparkles size={30} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-white drop-shadow-md">Pure & Fresh</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">Sanctified Aura</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with 3D Depth */}
        <div className="flex flex-col overflow-hidden rounded-b-3xl border border-amber-200/80 bg-white/95 shadow-2xl backdrop-blur-md lg:flex-row">

          {/* Left Column - Why Choose Puja Samagri */}
          <div className="flex flex-1 flex-col p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-amber-100/80">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl filter drop-shadow">🕉️</span>
              <h2 className="font-serif text-3xl font-bold text-[#3E2723] gold-emboss-3d">Why Choose Puja Samagri?</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/20 border border-amber-200/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/80 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 shadow-md">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">100% Pure & Vedic Approved</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Every incense stick, dhoop, camphor, and samagri is handcrafted with traditional purity standards.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/20 border border-amber-200/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/80 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 shadow-md">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Divine Freshness & Aura</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Specially formulated natural aromatics that cleanse your home aura and invite positivity and peace.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/20 border border-amber-200/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/80 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 shadow-md">
                  <Flame size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Pure Cow Ghee & Sacred Herbs</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Our Hawan Samagri and Diya wicks use 100% pure ingredients without synthetic chemicals.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/20 border border-amber-200/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/80 bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 shadow-md">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Safe & Sanitize Delivery</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Eco-friendly, secure packaging directly from sacred artisans to your doorsteps.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sacred Ritual Advice */}
          <div className="flex flex-1 flex-col p-6 sm:p-10 bg-amber-50/30">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl filter drop-shadow">🪔</span>
              <h2 className="font-serif text-3xl font-bold text-[#3E2723] gold-emboss-3d">How to Cleanse Your Sacred Space</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-white border border-amber-200/50 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-amber-500 to-amber-700 font-serif font-bold text-white text-lg shadow-lg">
                  1
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Purify Your Home Corner</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Light natural Bhimseni camphor or Loban dhoop every morning to eliminate negative energy.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-white border border-amber-200/50 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-amber-500 to-amber-700 font-serif font-bold text-white text-lg shadow-lg">
                  2
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Set Divine Intentions</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Use pure brass diyas with pure cow ghee wicks to channel light, wisdom, and peace.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-white border border-amber-200/50 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-amber-500 to-amber-700 font-serif font-bold text-white text-lg shadow-lg">
                  3
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Daily Chanting & Incense</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Burn organic flora agarbatti during prayer to create a calming, meditative atmosphere.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start card-3d p-4 rounded-2xl bg-white border border-amber-200/50 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-amber-500 to-amber-700 font-serif font-bold text-white text-lg shadow-lg">
                  4
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#3E2723]">Experience Perpetual Bliss</h4>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">Feel divine bliss, clarity, and harmony surrounding your home and loved ones.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
