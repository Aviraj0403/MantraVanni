import React, { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BestSellPC from "../../components/Product/ProductCard";
import { getMiniProducts } from "../../services/productApi";

export default function ComboSection({ categorySlug }) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["isCombo", categorySlug],
    queryFn: () =>
      getMiniProducts(1, 100, "", categorySlug, "", "", "", "true"),
  });

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -carouselRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: carouselRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        if (
          carouselRef.current.scrollLeft +
            carouselRef.current.offsetWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({
            left: carouselRef.current.offsetWidth / 2,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <section className="bg-white relative">
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-500 mb-6 text-center">
          Beauty Kits
        </h2>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-primary-50 transition"
          >
            <FaChevronLeft className="text-primary-500" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-primary-50 transition"
          >
            <FaChevronRight className="text-primary-500" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2 px-2"
          >
            {data.products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-1/2 sm:w-60 md:w-52 lg:w-60"
              >
                <BestSellPC
                  product={product}
                  onProductClick={(id) => navigate(`/product/${id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
