import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "../../image/banner3.png";
import banner2 from "../../image/banner2.png";
import banner3 from "../../image/banner1.png";

const banners = [banner1, banner2, banner3];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden m-0 p-0">
      {/* ✅ Image Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out m-0 p-0"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((src, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 bg-white flex justify-center items-start m-0 p-0"
          >
            <img
              src={src}
              alt={`banner-${index}`}
              className="w-full h-auto object-contain md:object-cover block m-0 p-0 align-top"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* ⬅️➡️ Navigation Buttons (❌ hidden on mobile, ✅ visible on md+) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* ⚪ Dots Indicator */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {banners.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
              i === current ? "bg-white scale-110" : "bg-white/40"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
