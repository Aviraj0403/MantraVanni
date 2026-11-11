import React from "react";
import { useLocation } from "react-router-dom";
import BannerSlider from "./BannerSlider";
import CategorySlider from "./CategorySlider";
import BestsellerSection from "./BestsellerSection";
import PromoBanner from "./PromoBanner";
import HomeNewArrivals from "../HomeNewArrivals";

import MobileCategorySection from "../category/MobileCategorySection";
import ComboSection from "./ComboSection";
import BeautyHighlightSection from "./BeautyHighlightSection";
import FloatingNewArrival from "./FloatingNewArrival";
import WhyChooseUs from "./WhyChooseUs";
// import BeautyBanner from "./BeautyDiscountBanner";
import CosmeticTestimonials from "./CosmeticTestimonials";


function Home() {
  const location = useLocation();

  React.useEffect(() => {
    if (!location.hash) return;
    let target = null;
    try {
      target = document.querySelector(location.hash);
    } catch {
      return;
    }
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <div className="bg-brand-bg min-h-screen">
      <FloatingNewArrival />
      <MobileCategorySection />
      <div className="max-w-[1920px] mx-auto shadow-sm">
        <BannerSlider />
      </div>
      <div className="px-0 sm:px-4 md:px-8 space-y-4 md:space-y-8 pb-12">
        <CategorySlider />
        <ComboSection />
        <BestsellerSection />
        <HomeNewArrivals />
        <PromoBanner />
        {/* <BeautyBanner /> */}
        <WhyChooseUs />
        <BeautyHighlightSection />
        <CosmeticTestimonials />
      </div>
    </div>
  );
}

export default Home;
