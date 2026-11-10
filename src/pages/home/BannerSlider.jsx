import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  WalletCards,
  RotateCcw,
  Headphones,
} from "lucide-react";
import banner1 from "../../image/banner3.png";
import banner2 from "../../image/banner2.png";
import banner3 from "../../image/banner1.png";

const banners = [banner1, banner2, banner3];

const serviceBenefits = [
  { icon: Truck, title: "Pan India Delivery", subtitle: "Fast & Reliable" },
  { icon: WalletCards, title: "Secure Payments", subtitle: "100% Safe & Secure" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle Free Returns" },
  { icon: Headphones, title: "24/7 Support", subtitle: "We're Here to Help" },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="w-full overflow-hidden bg-brand-bg text-brand-text">
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((src, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 bg-brand-bg flex justify-center items-start"
            >
              <img
                src={src}
                alt={`MantraVanni banner ${index + 1}`}
                className="w-full h-auto object-contain md:object-cover block align-top"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-brand-text/55 text-secondary-200 shadow-md backdrop-blur transition hover:bg-secondary hover:text-brand-text md:grid"
          aria-label="Previous banner"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-brand-text/55 text-secondary-200 shadow-md backdrop-blur transition hover:bg-secondary hover:text-brand-text md:grid"
          aria-label="Next banner"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {banners.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? "w-8 bg-secondary" : "w-2.5 bg-white/50 hover:bg-secondary"
              }`}
              aria-label={`Show banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Service benefits bar (desktop) */}
      <div className="hidden md:block border-t border-secondary-200 bg-brand-bg">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-y-6 px-5 py-6 sm:px-10 lg:grid-cols-4 lg:px-12 lg:py-5">
          {serviceBenefits.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left lg:border-r lg:border-secondary-200 lg:last:border-r-0"
            >
              <Icon className="h-7 w-7 sm:h-6 sm:w-6 shrink-0 text-accent" strokeWidth={1.8} />
              <div>
                <p className="text-[12px] sm:text-[11px] font-semibold leading-5 sm:leading-4 text-brand-text">{title}</p>
                <p className="text-[11px] sm:text-[10px] text-brand-text/65 mt-0.5 sm:mt-0">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
