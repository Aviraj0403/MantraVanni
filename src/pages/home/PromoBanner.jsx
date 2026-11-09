import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPromoBanners } from "../../services/promoBannerApi";
import banner1 from "../../image/banner/banner2.png";

export default function PromoBanner() {
  const [promoBanners, setPromoBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoBanners = async () => {
      try {
        setLoading(true);
        const data = await getPromoBanners();
        
        // Extract banners array from response
        const banners = data?.promoBanners || data || [];
        
        // If no banners from backend, use default banner
        if (!banners || banners.length === 0) {
          setPromoBanners([{
            _id: 'default-banner',
            bannerImage: banner1,
            title: 'Special Offers',
            description: 'Discover amazing deals on beauty products'
          }]);
        } else {
          // Use banners directly - API already returns only active banners with images
          setPromoBanners(banners);
        }
      } catch (error) {
        console.error('Error fetching promo banners:', error);
        // On error, show default banner
        setPromoBanners([{
          _id: 'default-banner',
          bannerImage: banner1,
          title: 'Special Offers',
          description: 'Discover amazing deals on beauty products'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoBanners();
  }, []);

  useEffect(() => {
    if (promoBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % promoBanners.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [promoBanners.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? promoBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % promoBanners.length);
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading promo banners...</div>
      </div>
    );
  }

return (
  <div className="relative w-full overflow-hidden">
    {/* Slider Container with Responsive Height */}
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${current * 100}%)` }}
    >
      {promoBanners.map((banner, index) => (
        <div
          key={banner._id || index}
          className="
            relative w-full flex-shrink-0
         h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[340px]

          "
        >
          {/* Banner Image */}
          <img
            src={banner.bannerImage}
            alt={banner.title || `Promo Banner ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          Overlay
          {(banner.title || banner.description) &&
            banner._id !== "default-banner" && (
              <div className="absolute inset-0  flex items-end">
                {/* <div className="p-4 md:p-8 text-white max-w-2xl">
                  {banner.title && (
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2">
                      {banner.title}
                    </h3>
                  )}
                  {banner.description && (
                    <p className="text-sm md:text-lg opacity-90">
                      {banner.description}
                    </p>
                  )}
                </div> */}
              </div>
            )}
        </div>
      ))}
    </div>

    {/* Navigation Arrows */}
    {promoBanners.length > 1 && (
      <>
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full"
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {promoBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? "bg-white scale-110" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </>
    )}
  </div>
);

}
