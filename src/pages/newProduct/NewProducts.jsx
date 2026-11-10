import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMiniProducts } from "../../services/productApi";
import NewArrivalPC from "../../components/Product/NewArrivalPC";

const NewProducts = () => {
  const navigate = useNavigate();

  // Fetch new products from API using React Query
  const { data: productsData, isLoading, isError, error } = useQuery({
    queryKey: ["miniProducts", { page: 1, limit: 1000, isBestSeller: false }],
    queryFn: () => getMiniProducts(1, 1000, "", "", "", false),
  });

  // Handle navigation to product details page
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#fbf7f1]">
        <div className="text-lg font-medium text-[#E67E22]">Awakening the Divine Collection...</div>
      </div>
    );
  }

  // Error handling state
  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#fbf7f1]">
        <div className="text-lg font-medium text-red-800">Unable to load products: {error.message}</div>
      </div>
    );
  }

  // Get the products list
  const products = productsData?.products || [];

  return (
    <section className="bg-[#fbf7f1] py-10 sm:py-14 min-h-screen">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#E67E22] sm:text-4xl">
            Our Divine Collection
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-[#E67E22]/40"></div>
            <div className="h-2 w-2 rotate-45 bg-[#E67E22]"></div>
            <div className="h-px w-12 bg-[#E67E22]/40"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-[#5c4a3d] max-w-2xl mx-auto">
            Explore our extensive range of authentic spiritual products carefully curated to bring peace, prosperity, and positive energy to your life.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {products.map((product) => (
            <NewArrivalPC
              key={product._id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-[#5c4a3d] font-medium">
            No products available at the moment.
          </div>
        )}

      </div>
    </section>
  );
};

export default NewProducts;
