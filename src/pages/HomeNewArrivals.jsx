import React, { useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMiniProducts } from "../services/productApi";
import NewArrivalPC from "../components/Product/NewArrivalPC";

export default function HomeNewArrivals() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const isCarouselPaused = useRef(false);

  const { data: productsData, isLoading, isError, error } = useQuery({
    queryKey: ["miniProducts", "home"],
    queryFn: () => getMiniProducts(1, 10),
  });

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction === "left" ? -carousel.offsetWidth / 2 : carousel.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel || isCarouselPaused.current) return;
      const reachedEnd = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 2;
      if (reachedEnd) carousel.scrollTo({ left: 0, behavior: "smooth" });
      else carousel.scrollBy({ left: carousel.offsetWidth / 2, behavior: "smooth" });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const products = productsData?.products || [];

  return (
    <section
      id="new-arrivals"
      className="scroll-mt-28 overflow-x-hidden bg-brand-bg px-3 py-6 sm:px-6 sm:py-8 lg:px-5"
    >
      <div className="relative mx-auto min-w-0 max-w-full">
        <div className="mb-4 flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-[26px] font-bold leading-tight text-brand-text sm:text-[36px]">
              Sacred <span className="text-primary-600">Arrivals</span>
            </h2>
            <p className="mt-1 text-[13px] font-medium text-primary-600 sm:text-sm">
              Fresh arrivals for your home altar
            </p>
          </div>

          <Link
            to="/new-products"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-primary-500 px-3 text-[10px] font-semibold text-white transition hover:bg-secondary hover:text-brand-text sm:px-4 sm:text-[11px]"
          >
            <span className="sm:hidden">View All</span>
            <span className="hidden sm:inline">View All New Arrivals</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous new arrivals"
            className="absolute left-0 top-[40%] z-20 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-primary-500/20 bg-brand-bg text-primary-600 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={carouselRef}
            className="scrollbar-hide flex max-w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-3 pt-1 sm:gap-5"
            onMouseEnter={() => {
              isCarouselPaused.current = true;
            }}
            onMouseLeave={() => {
              isCarouselPaused.current = false;
            }}
            onTouchStart={() => {
              isCarouselPaused.current = true;
            }}
            onTouchEnd={() => {
              isCarouselPaused.current = false;
            }}
          >
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="basis-[calc((100%_-_12px)/2)] shrink-0 animate-pulse snap-start sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%_-_80px)/5)]"
                >
                  <div className="aspect-[1.25/1] rounded-xl bg-black/5" />
                  <div className="mt-3 h-3.5 w-3/4 rounded bg-black/5" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-black/5" />
                </div>
              ))}

            {isError && (
              <p className="w-full py-12 text-center text-sm text-primary-600">
                {error?.message || "Unable to load new arrivals."}
              </p>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <p className="w-full py-12 text-center text-sm text-brand-text/60">No new arrivals available.</p>
            )}

            {!isLoading &&
              !isError &&
              products.map((product) => (
                <div
                  key={product._id}
                  className="min-w-0 basis-[calc((100%_-_12px)/2)] shrink-0 snap-start sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%_-_80px)/5)]"
                >
                  <NewArrivalPC product={product} onProductClick={handleProductClick} />
                </div>
              ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next new arrivals"
            className="absolute right-0 top-[40%] z-20 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-primary-500/20 bg-brand-bg text-primary-600 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
