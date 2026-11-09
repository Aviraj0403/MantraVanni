import React from "react";
import { FaArrowRight } from "react-icons/fa";
import img from "../../image/category-thumb1_2.jpg";
import img2 from "../../image/category-thumb1_1.jpg";

export default function BeautyDiscountBanner() {
  return (
    <section className="w-full  py-4 px-3 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 items-stretch">
        
        {/* Left Card */}
        <div className="relative rounded-[24px] overflow-hidden h-[220px] md:h-[300px]">
          <img
            // src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
             src={img2}
            alt="Eye Lines"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f4c38a]/70"></div>

          <div className="relative z-10 h-full flex flex-col justify-right items-center text-center p-7">
            <p className="text-[#0b2239] text-sm md:text-base font-medium">
              Professional
            </p>
            <h3 className="mt-1 text-brand-text text-2xl md:text-4xl font-serif font-bold">
              Eye Lines
            </h3>
          </div>
        </div>

      {/* Center Card */}
<div className="relative rounded-[28px] overflow-hidden h-[250px] md:h-[300px]">
  
  {/* Background Image */}
  <img
    src={img}
    alt="Foundation"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Overlay (light shade for readability) */}
  <div className="absolute inset-0 bg-black/10"></div>

  {/* Discount Circle */}
  <div className="absolute top-4 left-4 w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full bg-black text-white flex items-center justify-center text-center shadow-lg z-10">
    <span className="text-xs md:text-sm font-semibold leading-tight">
      Up To
      <br />
      20%
    </span>
  </div>

  {/* RIGHT SIDE TEXT CONTENT */}
  <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 text-right z-10 max-w-[160px] md:max-w-[220px]">
    
    <p className="text-[#0b2239] text-sm md:text-base mb-1">
      Makeup
    </p>

    <h2 className="text-brand-text font-serif font-bold leading-tight text-lg md:text-3xl">
      Foundation
      <br />
      Collection
    </h2>

    <button className="mt-3 inline-flex items-center gap-3 bg-[#f52d84] hover:bg-[#e12476] transition rounded-full pl-4 pr-2 py-2 text-white text-sm font-semibold">
      <span>Shop</span>
      <span className="w-7 h-7 rounded-full bg-white text-brand-text flex items-center justify-center text-xs">
        <FaArrowRight />
      </span>
    </button>
  </div>
</div>

        {/* Right Card */}
        <div className="relative rounded-[24px] overflow-hidden h-[220px] md:h-[300px]">
          <img
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800"
            alt="Blush Brush"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f3dedd]/50"></div>

          <div className="relative z-10 h-full flex flex-col justify-center p-4">
            <p className="text-[#0b2239] text-sm md:text-base font-medium">
              Makeup Brush
            </p>
            <h3 className="mt-1 text-brand-text text-2xl md:text-4xl font-serif font-bold">
              Blush
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}