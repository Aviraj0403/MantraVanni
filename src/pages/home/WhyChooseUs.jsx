import React from "react";
import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Flower2, Gift, HandHeart, Sun } from "lucide-react";
import ritualCraftImage from "../../image/banner/mantravanni-ritual-craft.png";

const reasons = [
  {
    icon: Flower2,
    title: "Rooted in tradition",
    text: "Pooja essentials inspired by the rituals, symbols and stories we carry through generations.",
  },
  {
    icon: Sun,
    title: "Made for your everyday",
    text: "From a quiet morning prayer to an evening diya, make a little space for devotion each day.",
  },
  {
    icon: HandHeart,
    title: "Details with meaning",
    text: "Discover the textures, gentle fragrances and warm glow that make your sacred corner feel yours.",
  },
  {
    icon: Gift,
    title: "Thoughtful to give",
    text: "Mark a new home, a celebration or a fresh beginning with a gift that carries a little more meaning.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-3 pb-10 sm:px-6 lg:px-5" aria-labelledby="why-mantravanni-heading">
      <div className="relative mx-auto overflow-hidden rounded-[24px] border border-[#e8ddcd] bg-[#f5f0e7] px-5 py-7 sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
        <div className="mb-7 flex items-center gap-4 sm:mb-10">
          <span className="size-1.5 shrink-0 rounded-full bg-[#a75735]" aria-hidden="true" />
          <p className="text-[9px] font-medium tracking-[.2em] text-[#795d49] sm:text-[10px]">THE MANTRAVANNI WAY</p>
          <span className="h-px flex-1 bg-[#d8cbbc]" aria-hidden="true" />
          <span className="hidden text-[10px] tracking-[.12em] text-[#947d66] sm:block">A LITTLE CLOSER TO WHAT MATTERS</span>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-9 lg:gap-14 xl:gap-20">
          <figure className="relative mx-auto min-w-0 w-full max-w-[460px] md:mx-0">
            <div className="absolute -inset-2 rounded-t-[220px] rounded-b-[20px] border border-[#c9af8c]/60 sm:-inset-3" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[210px] rounded-b-xl bg-[#dfcbb4]">
              <img src={ritualCraftImage} alt="Hands gently arranging terracotta diyas beside cotton wicks and marigold petals on a sunlit worktable" className="h-full w-full object-cover" loading="lazy" width="1024" height="1280" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#352419]/65 to-transparent" aria-hidden="true" />
              <figcaption className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 text-[#fff5e5] sm:bottom-8 sm:left-8 sm:right-8">
                <span className="font-serif text-2xl leading-tight sm:text-3xl">Small rituals.<br /><em>Beautiful beginnings.</em></span>
                <Flower2 className="size-8 shrink-0 opacity-80" strokeWidth={1} aria-hidden="true" />
              </figcaption>
            </div>
          </figure>

          <div className="min-w-0">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#a45837]">Why choose MantraVanni</p>
            <h2 id="why-mantravanni-heading" className="max-w-[600px] font-serif text-[34px] font-normal leading-[1.12] tracking-[-.035em] text-[#3f3027] sm:text-[42px] xl:text-[52px]">More meaning.<br /><em className="font-normal text-[#a45837]">In every little ritual.</em></h2>
            <p className="mt-4 max-w-[490px] text-[13px] leading-7 text-[#7b6b5c] sm:text-sm">A diya at dusk. A familiar fragrance. A moment of gratitude. We believe the things you bring home should help you feel connected to what matters.</p>

            <div className="mt-7 grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:mt-8 lg:gap-y-8">
              {reasons.map(({ icon, title, text }, index) => (
                <div key={title} className="group border-t border-[#d9cbbc] pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    {createElement(icon, { className: "size-5 text-[#a45837] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none", strokeWidth: 1.4, "aria-hidden": true })}
                    <span className="font-serif text-sm italic text-[#ad9980]">0{index + 1}</span>
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-[#49382d] lg:text-[15px]">{title}</h3>
                  <p className="mt-1.5 text-xs leading-[1.8] text-[#817061] lg:text-[13px]">{text}</p>
                </div>
              ))}
            </div>

            <Link to="/#categories" className="mt-7 inline-flex items-center gap-5 rounded-full bg-[#85452f] px-6 py-3.5 text-xs font-medium text-[#fff5e7] transition-colors hover:bg-[#683320] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85452f] lg:mt-8">
              Find something meaningful<ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#d9cbbc] pt-5 text-[9px] tracking-[.16em] text-[#8c715b] sm:mt-12 sm:gap-x-9 sm:text-[10px]">
          <span>FOR YOUR SPACE</span><span aria-hidden="true" className="text-[#b48457]">✦</span>
          <span>FOR YOUR RITUALS</span><span aria-hidden="true" className="text-[#b48457]">✦</span>
          <span>FOR YOUR LOVED ONES</span>
        </div>
      </div>
    </section>
  );
}
