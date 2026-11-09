import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";  // Use React Query for fetching
import { getMiniProducts } from "../services/productApi";  // Your dynamic API function
import NewArrivalPC from "../components/Product/NewArrivalPC";  // Import the reusable product card


export default function HomeNewArrivals() {
  const navigate = useNavigate();

const { data: productsData, isLoading, isError, error } = useQuery({
  queryKey: ["miniProducts", "home"],
  queryFn: () => getMiniProducts(1, 10),
});


  // Handle navigation to product details page
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  if (isLoading) {
    return <div className="text-center text-primary-600">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-600">Error: {error.message}</div>;
  }

  const products = productsData?.products || [];

  return (
    <section className="py-5 bg-white">
     <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
   

        <h2 className="text-2xl md:text-3xl font-bold text-primary-500 mb-6 text-center">
          Sacred arrivals for your home altar
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Map through the fetched products and display them */}
          {products.map((product) => (
            <NewArrivalPC
              key={product._id}
              product={product}
              onProductClick={handleProductClick}  // Pass custom click handler if needed
            />
          ))}
        </div>

        <div className="text-center mt-6">
         <button
  onClick={() => navigate("/new-products")}
  className="
    bg-primary-700 text-white font-semibold px-6 py-2 rounded-lg
    transform
    animate-[zoom_1.5s_ease-in-out_infinite]
  "
>
Explore all sacred essentials
</button>
<style>
{`
@keyframes zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
`}
</style>

        </div>
      </div>
    </section>
  );
}
