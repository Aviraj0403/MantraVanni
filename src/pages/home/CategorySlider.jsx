import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories } from "../../services/categoryApi";

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  let isDown = false;
  let startX;
  let scrollLeft;

  const { data: menuItems, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
    onError: (err) => {
      console.error("Error fetching categories:", err);
    },
  });

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`);
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    if (direction === "left") current.scrollBy({ left: -250, behavior: "smooth" });
    else current.scrollBy({ left: 250, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDown = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };
  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      id="categories"
      className="relative w-full overflow-hidden bg-brand-bg px-4 py-10 sm:px-8"
    >
      <div className="mx-auto">
        <div className="mb-8 text-center sm:mb-9">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-secondary-700 sm:text-[14px]">
            Shop by Category
          </p>
          <h2 className="mt-1 text-[25px] font-bold leading-tight text-brand-text sm:text-[36px]">
            Find What Your Soul Needs
          </h2>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-secondary">
            <span className="h-px w-8 bg-secondary-300" />
            <span className="text-[11px] leading-none">◆</span>
            <span className="h-px w-8 bg-secondary-300" />
          </div>
        </div>

        <div className="relative px-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous categories"
            className="absolute left-0 top-1/2 z-20 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-secondary-200 bg-brand-bg text-accent shadow-sm transition hover:border-secondary hover:text-primary-600 sm:flex"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex cursor-grab select-none gap-3 overflow-x-auto scroll-smooth pb-1 sm:gap-4 lg:gap-5"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[150px] w-[125px] shrink-0 animate-pulse rounded-xl bg-secondary-50 sm:h-[172px] sm:w-[160px]"
                />
              ))}

            {isError && (
              <p className="w-full py-10 text-center text-sm text-brand-text/70">
                {error?.message || "Unable to load categories."}
              </p>
            )}

            {!isLoading &&
              !isError &&
              menuItems?.map((cat) => (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group flex h-[150px] w-[125px] shrink-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-secondary-100 bg-secondary-50/45 px-3 pb-3 pt-4 text-center transition duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_10px_25px_rgba(139,30,30,0.10)] sm:h-[172px] sm:w-[160px] sm:px-4 sm:pb-4 sm:pt-5"
                >
                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    <img
                      src={cat.image?.[0]}
                      alt={cat.name}
                      className="h-[92px] w-[98px] object-contain transition duration-300 group-hover:scale-105 sm:h-[112px] sm:w-[126px]"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-[10px] font-semibold text-brand-text transition group-hover:text-accent sm:text-[11px]">
                    {cat.name}
                  </h3>
                </button>
              ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next categories"
            className="absolute right-0 top-1/2 z-20 flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-secondary-200 bg-brand-bg text-accent shadow-sm transition hover:border-secondary hover:text-primary-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-secondary hover:text-brand-text"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
}
