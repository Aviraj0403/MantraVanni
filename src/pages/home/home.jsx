import React from "react";
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
import SacredSlokaStrip from "./SacredSlokaStrip";

import BulkoRetailerBanner from "../../components/BulkoRetailerBanner";

function Home() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <FloatingNewArrival />
      <SacredSlokaStrip />
      <MobileCategorySection />
      <BannerSlider />
      <BulkoRetailerBanner />
      <CategorySlider />
      <ComboSection />
      <BestsellerSection />
      <HomeNewArrivals />
      <PromoBanner />
      <WhyChooseUs />
      <BeautyHighlightSection />
    </div>
  );
}

export default Home;

