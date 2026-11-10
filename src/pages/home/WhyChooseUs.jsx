import React from "react";
import { Star, Users, ShieldCheck, Sparkles, CheckCircle2, Heart, Lock } from "lucide-react";
import leftImage from "../../image/banner/why-choose-left.png";
import rightImage from "../../image/banner/why-choose-right.png";

const stats = [
  { icon: Users, value: "25,000+", label: "Devoted Families" },
  { icon: ShieldCheck, value: "100%", label: "Vedic Authenticity" },
  { icon: Star, value: "4.9", label: "User Rating", star: true },
  { icon: Sparkles, value: "Pure & Fresh", label: "Sanctified Aura" },
];

const reasons = [
  { icon: CheckCircle2, title: "100% Pure & Vedic Approved", text: "Every incense stick, dhoop, camphor, and sacred offering is handcrafted with traditional purity standards." },
  { icon: Heart, title: "Divine Freshness & Aura", text: "Specially formulated natural aromatics that cleanse your home aura and invite positivity and peace." },
  { icon: Users, title: "Pure Cow Ghee & Sacred Herbs", text: "Our hawan essentials and diya wicks use 100% pure ingredients without synthetic chemicals." },
  { icon: Lock, title: "Safe & Sanitized Delivery", text: "Eco-friendly, secure packaging directly from sacred artisans to your doorsteps." },
];

const steps = [
  { title: "Purify Your Home Corner", text: "Light natural Bhimseni camphor or Loban dhoop every morning to eliminate negative energy." },
  { title: "Set Divine Intentions", text: "Use pure brass diyas with pure cow ghee wicks to channel light, wisdom, and peace." },
  { title: "Daily Chanting & Incense", text: "Burn organic flora agarbatti during prayer to create a calming, meditative atmosphere." },
  { title: "Experience Perpetual Bliss", text: "Feel divine bliss, clarity, and harmony surrounding your home and loved ones." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-bg px-3 sm:px-6 lg:px-5 pb-10">
      <div className="mx-auto">
        {/* Top banner */}
        <div className="relative overflow-hidden rounded-t-xl bg-accent px-6 py-5 shadow-md">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 md:flex-nowrap">
            {stats.map(({ icon: Icon, value, label, star }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="hidden h-10 w-px bg-brand-bg/20 md:block"></div>}
                <div className="flex items-center gap-3">
                  <Icon className="text-secondary-300" size={36} strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {value}
                      {star && <Star className="ml-1 inline" size={14} fill="currentColor" />}
                    </h3>
                    <p className="text-xs font-medium text-secondary-300">{label}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col overflow-hidden rounded-b-xl border border-secondary-100 bg-brand-bg shadow-sm lg:flex-row">
          {/* Left column */}
          <div className="flex flex-1 flex-col-reverse lg:flex-row">
            <div className="h-64 w-full lg:h-auto lg:w-1/3">
              <img src={leftImage} alt="Pooja setup" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 p-6 lg:p-8">
              <h2 className="mb-6 font-serif text-2xl font-bold text-[#3E2723]">Why Choose MantraVanni?</h2>

              <div className="space-y-6">
                {reasons.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary text-accent">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3E2723]">{title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden w-px bg-gray-200 lg:block"></div>

          {/* Right column */}
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex-1 p-6 lg:p-8">
              <h2 className="mb-6 font-serif text-2xl font-bold text-[#3E2723]">How to Cleanse Your Sacred Space</h2>

              <div className="space-y-6">
                {steps.map(({ title, text }, i) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary font-bold text-accent">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3E2723]">{title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64 w-full lg:h-auto lg:w-1/3">
              <img src={rightImage} alt="Brass plate with diya" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
