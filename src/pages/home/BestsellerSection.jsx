import React, { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BestSellPC from "../../components/Product/ProductCard"; // Import the reusable ProductCard component
import { getMiniProducts } from "../../services/productApi"; // Import your product API

export default function BestsellerSection({ categorySlug }) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // Fetch products using React Query with the correct object signature
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bestsellers", categorySlug],
    queryFn: () =>
      getMiniProducts(1, 100, "", categorySlug, "", "true", "", "" ,""), // Fetch bestseller products with category filter
  });

  // Scroll functions
  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth / 2, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth / 2, behavior: "smooth" });
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        if (carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >= carouselRef.current.scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth / 2, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
   <section className="bg-brand-bg relative py-8">
  <div className="relative max-w-8xl mx-auto px-4 sm:px-6"> 
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text gold-emboss-3d">
        🌟 Bestseller Sacred Products
      </h2>
      <p className="text-stone-600 text-sm md:text-base mt-1">Devotee favorites for daily prayers and festive celebrations</p>
    </div>

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
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2 px-2"
      >
        {data.products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-1/2 sm:w-60 md:w-52 lg:w-60">
            <BestSellPC
              product={product}
              onProductClick={(productId) => navigate(`/product/${productId}`)}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

  );
}
