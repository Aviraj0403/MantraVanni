import React, { createElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Truck, WalletCards, RotateCcw, MessageCircle } from "lucide-react";
import "swiper/css";

// Existing review copy: no ratings, dates or purchase verification are supplied.
const testimonials = [
  {
    id: 1, name: "Ankit Sharma", location: "Delhi", initials: "AS",
    topic: "Rudraksha", title: "A meaningful addition.",
    feedback: "The quality of products is amazing. I felt positive energy after wearing Rudraksha. Thank you MantraVanni!",
    avatar: "bg-[#e8dccb] text-[#795437]",
  },
  {
    id: 2, name: "Pooja Verma", location: "Jaipur", initials: "PV",
    topic: "The shopping experience", title: "It's the little details.",
    feedback: "Very authentic and pure products. Fast delivery and beautiful packaging. Highly recommended!",
    avatar: "bg-[#e2e7d9] text-[#586346]",
  },
  {
    id: 3, name: "Rohit Mehta", location: "Mumbai", initials: "RM",
    topic: "Pooja essentials", title: "A place to come back to.",
    feedback: "MantraVanni has a wide range of spiritual products. My go-to store for all puja needs.",
    avatar: "bg-[#eadcd7] text-[#925c4a]",
  },
  {
    id: 4, name: "Sneha Patel", location: "Ahmedabad", initials: "SP",
    topic: "Incense sticks", title: "A fragrance to remember.",
    feedback: "Loved the quality of the incense sticks. The fragrance is divine and long-lasting.",
    avatar: "bg-[#e3dfe9] text-[#766080]",
  },
];

const shoppingHelp = [
  { icon: Truck, title: "Shipping & delivery", subtitle: "Plan your order", to: "/shipping-info" },
  { icon: WalletCards, title: "Payments & orders", subtitle: "Find your answers", to: "/faq" },
  { icon: RotateCcw, title: "Returns & exchanges", subtitle: "Read our policy", to: "/retun-exchnage-policy" },
  { icon: MessageCircle, title: "A little help?", subtitle: "Talk to our team", to: "/contact-us" },
];

export default function CosmeticTestimonials() {
  const swiperRef = useRef(null);
  const [slider, setSlider] = useState({ start: 0, visible: 1, beginning: true, end: false });

  const updateSlider = (swiper) => {
    setSlider({
      start: swiper.activeIndex,
      visible: Math.min(Number(swiper.params.slidesPerView) || 1, testimonials.length),
      beginning: swiper.isBeginning,
      end: swiper.isEnd,
    });
  };

  return (
    <section className="px-3 pb-3 pt-8 sm:px-6 sm:pt-12 lg:px-5" aria-labelledby="customer-stories-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-7 flex flex-col justify-between gap-6 sm:mb-9 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[.22em] text-[#9b6140] sm:text-[10px]"><span className="h-px w-7 bg-[#b38562]" aria-hidden="true" />THE COMMUNITY JOURNAL</p>
            <h2 id="customer-stories-heading" className="font-serif text-[34px] font-normal leading-[1.15] tracking-[-.035em] text-[#40342a] sm:text-[42px] lg:text-[48px]">Little moments.<br /><em className="font-normal text-[#9b6140]">Lasting impressions.</em></h2>
          </div>
          <div className="flex items-end justify-between gap-5 sm:max-w-[340px] sm:flex-col sm:items-end">
            <p className="max-w-[260px] text-xs leading-6 text-[#887564] sm:text-right sm:text-[13px]">Notes on the products, the little details and the rituals that bring us together.</p>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => swiperRef.current?.slidePrev()} disabled={slider.beginning} aria-label="Previous customer reviews" aria-controls="mantravanni-customer-reviews" className="grid size-10 cursor-pointer place-items-center rounded-full border border-[#d8c5b0] bg-transparent text-[#795437] transition-colors hover:bg-[#f0e4d4] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9b6140] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"><ChevronLeft size={17} /></button>
              <button type="button" onClick={() => swiperRef.current?.slideNext()} disabled={slider.end} aria-label="Next customer reviews" aria-controls="mantravanni-customer-reviews" className="grid size-10 cursor-pointer place-items-center rounded-full border border-[#d8c5b0] bg-transparent text-[#795437] transition-colors hover:bg-[#f0e4d4] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9b6140] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"><ChevronRight size={17} /></button>
            </div>
          </div>
        </div>

        <Swiper id="mantravanni-customer-reviews" modules={[A11y, Keyboard]} keyboard={{ enabled: true, onlyInViewport: true }}
          slidesPerView={1} spaceBetween={18} speed={450} watchOverflow
          breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 20 }, 1280: { slidesPerView: 3, spaceBetween: 24 } }}
          onSwiper={(swiper) => { swiperRef.current = swiper; updateSlider(swiper); }}
          onSlideChange={updateSlider} onResize={updateSlider} onBreakpoint={updateSlider}
          a11y={{ containerMessage: "Customer reviews", slideLabelMessage: "Review {{index}} of {{slidesLength}}" }}
          className="[&_.swiper-wrapper]:items-stretch motion-reduce:[&_.swiper-wrapper]:duration-0!">
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.id} className="h-auto!">
              <article className={`flex h-full min-h-[330px] flex-col rounded-[20px] border p-6 sm:min-h-[360px] sm:p-7 lg:p-8 ${index === 0 ? "border-[#dcc3a4] bg-[#f1e5d4]" : "border-[#e7ddcf] bg-[#fffcf7]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="max-w-[80%] rounded-full border border-[#b3926c]/25 px-3 py-1.5 text-[9px] font-medium tracking-[.04em] text-[#866348]">{testimonial.topic}</span>
                  <Quote className="mt-1 size-6 shrink-0 text-[#b8966e]" strokeWidth={1.1} aria-hidden="true" />
                </div>
                <h3 className="mb-3 mt-7 font-serif text-[23px] font-normal leading-tight tracking-[-.02em] text-[#503c2c]">{testimonial.title}</h3>
                <blockquote className="m-0 flex-1 text-[13px] leading-[1.9] text-[#7c6856]"><p>“{testimonial.feedback}”</p></blockquote>
                <footer className="mt-7 flex items-center gap-3 border-t border-[#bda387]/25 pt-5">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full text-[11px] font-semibold tracking-wide ${testimonial.avatar}`} aria-hidden="true">{testimonial.initials}</span>
                  <div><p className="text-xs font-semibold text-[#4c3a2d]">{testimonial.name}</p><p className="mt-1 text-[10px] text-[#97816d]">{testimonial.location}</p></div>
                </footer>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-5 flex items-center justify-between gap-5">
          <div className="h-px flex-1 bg-[#e4d7c5]" aria-hidden="true" />
          <p className="shrink-0 text-[10px] tracking-wide text-[#9c846c]" role="status" aria-live="polite">{slider.visible === 1 ? slider.start + 1 : `${slider.start + 1}–${Math.min(slider.start + slider.visible, testimonials.length)}`} of {testimonials.length} stories</p>
        </div>

        <div className="mt-9 grid grid-cols-1 overflow-hidden rounded-2xl border border-[#e5d9c8] bg-[#f7f1e7] sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {shoppingHelp.map(({ icon, title, subtitle, to }, index) => (
            <Link key={title} to={to} className={`group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-[#eee3d2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9b6140] sm:px-6 ${index > 0 ? "border-t border-[#e5d9c8]" : ""} ${index === 1 ? "sm:border-l sm:border-t-0" : ""} ${index === 2 ? "lg:border-l lg:border-t-0" : ""} ${index === 3 ? "sm:border-l lg:border-t-0" : ""}`}>
              {createElement(icon, { className: "size-5 shrink-0 text-[#9b7756]", strokeWidth: 1.4, "aria-hidden": true })}
              <div className="flex-1"><p className="text-[11px] font-medium text-[#594534]">{title}</p><p className="mt-1 text-[10px] text-[#9b846d]">{subtitle}</p></div>
              <ArrowUpRight className="size-3.5 text-[#a88b6a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
