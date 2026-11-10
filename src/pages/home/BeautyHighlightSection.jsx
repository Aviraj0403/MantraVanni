import React from "react";
import { ArrowRight, BadgeCheck, Flame, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  { icon: BadgeCheck, text: "Authentic, carefully selected essentials" },
  { icon: Flame, text: "Crafted for peaceful everyday rituals" },
  { icon: Sparkles, text: "Sacred gifts for every meaningful moment" },
];

export default function BeautyHighlightSection() {
  return (
    <section className="overflow-hidden bg-brand-bg px-3 py-10 sm:px-6 sm:py-14 lg:px-5">
      <div className="mx-auto grid items-center gap-10 rounded-3xl border border-secondary-200 bg-brand-bg p-5 shadow-[0_14px_40px_rgba(139,30,30,0.08)] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-10">
        <div className="px-1 sm:px-3 lg:pl-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-accent sm:text-[11px]">
            <Sparkles size={14} /> Sacred Living
          </p>

          <h2 className="mt-5 text-[36px] font-bold leading-[1.08] text-brand-text sm:text-[45px] lg:text-[52px]">
            Make Every Prayer
            <br />
            <span className="text-accent">Feel Divine</span>
          </h2>

          <p className="mt-5 max-w-[540px] text-sm leading-6 text-brand-text/65 sm:text-base sm:leading-7">
            From the first diya at dawn to festive celebrations, discover pure,
            authentic essentials that honour tradition and elevate your home altar.
          </p>

          <div className="mt-7 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-medium text-brand-text/75">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary-50 text-primary-600">
                  <Icon size={16} />
                </span>
                {text}
              </div>
            ))}
          </div>

          <Link
            to="/new-products"
            className="mt-8 inline-flex h-12 items-center gap-6 rounded-lg bg-primary-500 px-7 text-sm font-semibold text-white shadow-lg shadow-primary-500/15 transition hover:-translate-y-0.5 hover:bg-accent"
          >
            Explore the Collection <ArrowRight size={17} />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-accent shadow-[0_18px_45px_rgba(139,30,30,0.25)]">
          <div className="aspect-video overflow-hidden">
            <video
              className="h-full w-full object-cover motion-safe:animate-[spiritualZoom_8s_ease-in-out_infinite_alternate]"
              src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Spiritual products and sacred home ritual"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:text-xs">
            A moment of peace, every day
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spiritualZoom {
          from { transform: scale(1.01); }
          to { transform: scale(1.07); }
        }
      `}</style>
    </section>
  );
}
