import React from "react";
import useStoreModule from "../../hooks/useStoreModule";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Wind } from "lucide-react";
import { getPromoBanners } from "../../services/promoBannerApi";
import ritualBanner from "../../image/banner/mantravanni-quiet-rituals.png";

const featuredBanner = {
  _id: "mantravanni-quiet-rituals",
  bannerImage: ritualBanner,
  title: "A little stillness. A deeper connection.",
  featured: true,
};

function PromoBannerInner() {
  const [promoBanners, setPromoBanners] = useState([featuredBanner]);
  const [current, setCurrent] = useState(0);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBanners = async () => {
      try {
        const data = await getPromoBanners();
        const banners = data?.promoBanners || data;
        if (active && Array.isArray(banners)) {
          setPromoBanners([featuredBanner, ...banners.filter((banner) => banner?.bannerImage && banner._id !== featuredBanner._id)]);
        }
      } catch {
        // The featured collection remains available when promotions cannot load.
      }
    };
    fetchBanners();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (promoBanners.length < 2 || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => setCurrent((previous) => (previous + 1) % promoBanners.length), 6500);
    return () => clearInterval(interval);
  }, [promoBanners.length, interacting]);

  const moveSlide = (direction) => setCurrent((previous) => (previous + direction + promoBanners.length) % promoBanners.length);

  return (
    <section id="promo-banner" className="bg-brand-bg px-3 py-5 sm:px-6 lg:px-5" aria-label="MantraVanni ritual collections">
      <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-[#b8976233] bg-[#102c2a] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#e8c48d]"
        role="region" aria-roledescription="carousel" aria-label="Featured promotions"
        onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
        <div className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none" style={{ transform: `translateX(-${current * 100}%)` }}>
          {promoBanners.map((banner, index) => (
            <div key={banner._id || index} className="relative h-[200px] w-full shrink-0 sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[340px]"
              role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${promoBanners.length}`} aria-hidden={index !== current} inert={index !== current ? true : undefined}>
              <img src={banner.bannerImage} alt={banner.featured ? "Bronze singing bowl, incense smoke and a glowing clay diya in a serene teal setting" : banner.title || `Promotion ${index + 1}`} className="h-full w-full object-cover object-[65%_center] sm:object-center" loading="lazy" />
              {banner.featured && (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b2525ed_0%,#0b2525c9_36%,#0b252540_64%,transparent_100%)]" />
                  <div className="absolute inset-y-0 left-[6%] flex w-[72%] flex-col justify-center py-5 sm:w-[56%] lg:left-[7%] lg:w-[48%]">
                    <p className="mb-2 flex items-center gap-2 text-[8px] font-medium tracking-[.2em] text-[#d7bb8d] sm:mb-3 sm:text-[10px]"><Wind className="size-3 sm:size-4" aria-hidden="true" />THE ART OF EVERYDAY RITUALS</p>
                    <h2 className="font-serif text-[25px] font-normal leading-[1.08] tracking-tight text-[#fbf1de] sm:text-4xl lg:text-[48px]">A little stillness.<br /><em className="font-normal text-[#e6bc7a]">A deeper connection.</em></h2>
                    <p className="mt-2 max-w-[290px] text-[10px] leading-relaxed text-[#e3e6d9cc] sm:mt-3 sm:max-w-[370px] sm:text-xs lg:text-sm">Bring warmth, fragrance and intention to your sacred everyday moments.</p>
                    <Link to="/#categories" className="mt-3 inline-flex w-fit items-center gap-4 border-b border-[#dab77b99] pb-1 text-[10px] font-medium text-[#f1d19e] transition-colors hover:border-[#fff1cf] hover:text-[#fff1cf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8c48d] sm:mt-4 sm:text-xs lg:mt-5">Find your ritual<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
                  </div>
                  <span className="absolute right-5 top-4 hidden text-[9px] tracking-[.22em] text-[#ead5b199] sm:block">MANTRAVANNI / MOMENTS OF CALM</span>
                </>
              )}
            </div>
          ))}
        </div>
        {promoBanners.length > 1 && (
          <>
            <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous promotion" className="absolute left-2 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-[#f1d19e] backdrop-blur transition hover:bg-black/50 md:flex"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => moveSlide(1)} aria-label="Next promotion" className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-[#f1d19e] backdrop-blur transition hover:bg-black/50"><ChevronRight size={18} /></button>
            <div className="absolute bottom-1.5 right-4 flex items-center gap-1.5 sm:bottom-3">
              {promoBanners.map((banner, index) => (
                <button key={banner._id || index} type="button" onClick={() => setCurrent(index)} aria-label={`Show promotion ${index + 1}`} aria-current={index === current ? "true" : undefined} className="grid h-5 min-w-5 cursor-pointer place-items-center">
                  <span className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${index === current ? "w-6 bg-[#e6bc7a]" : "w-1.5 bg-white/50"}`} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// The banners module may be switched off for a store: then nothing is fetched (the API would answer 403) or shown.
export default function PromoBanner() {
  const { enabled } = useStoreModule("banners");
  return enabled ? <PromoBannerInner /> : null;
}
