import React from "react";
import { Flame, Zap, Star, Coffee, Pizza, Cake } from "lucide-react";

const Marquee = () => {
  const trendingItems = [
    "Bestsellers",
    "New Arrivals",
    "Limited Offers",
    "Seasonal Specials",
    "Chef's Choice",
    "Customer Favorites"
  ];

  return (
    <>
      <style>
        {`
          @keyframes marquee-left-right {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="w-full overflow-hidden bg-gradient-to-r from-primary-500 via-red-500 to-primary-500 py-3 shadow-lg">
        <div className="flex w-max items-center" style={{ animation: "marquee-left-right 20s linear infinite" }}>
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 mx-6">
                <Flame className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  🔥 HOT DEALS
                </span>
                <span className="text-white/40">|</span>
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  FLASH SALE
                </span>
                <span className="text-white/40">|</span>
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  TOP RATED
                </span>
              </div>
              <div className="w-px h-6 bg-white/30 mx-2" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Marquee;