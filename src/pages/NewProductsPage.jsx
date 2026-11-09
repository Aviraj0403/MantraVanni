  import React from "react";
  import { FaStar, FaHeart } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";

  const newArrivals = [
    {
      id: 1,
      name: "Rose Glow Toner",
      description: "Refreshes and tones your skin with a natural rose scent.",
      price: 699,
      originalPrice: 899,
      image:
        "https://www.gurmeetkaurstore.in/uploads/16495Mars_Magic_Shinw_Fix_Spray.jpg",
      rating: 4.6,
    },
    {
      id: 2,
      name: "Matte Perfection Foundation",
      description: "Gives flawless matte coverage for all-day wear.",
      price: 999,
      originalPrice: 1299,
      image:
        "https://www.gurmeetkaurstore.in/uploads/93366HR_Foundation_Nude_04.jpg",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Coconut Hair Serum",
      description: "Repairs and nourishes dry, frizzy hair instantly.",
      price: 599,
      originalPrice: 799,
      image:
        "https://www.gurmeetkaurstore.in/uploads/8147932435Untitled_design_(19).png",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Berry Bliss Lip Balm",
      description: "Soft, tinted balm for smooth and hydrated lips.",
      price: 349,
      originalPrice: 499,
      image:
        "https://www.gurmeetkaurstore.in/uploads/22793Dr_rashel_De-tan.png",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Charcoal Detox Face Mask",
      description: "Deep cleanses pores and gives a radiant glow.",
      price: 849,
      originalPrice: 1099,
      image:
        "https://www.gurmeetkaurstore.in/uploads/57161Nice_&_Naughty_Bombshell_Lipistick_Mix_Color_D.png",
      rating: 4.9,
    },
    {
      id: 1,
      name: "Rose Glow Toner",
      description: "Refreshes and tones your skin with a natural rose scent.",
      price: 699,
      originalPrice: 899,
      image:
        "https://www.gurmeetkaurstore.in/uploads/16495Mars_Magic_Shinw_Fix_Spray.jpg",
      rating: 4.6,
    },
    {
      id: 2,
      name: "Matte Perfection Foundation",
      description: "Gives flawless matte coverage for all-day wear.",
      price: 999,
      originalPrice: 1299,
      image:
        "https://www.gurmeetkaurstore.in/uploads/93366HR_Foundation_Nude_04.jpg",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Coconut Hair Serum",
      description: "Repairs and nourishes dry, frizzy hair instantly.",
      price: 599,
      originalPrice: 799,
      image:
        "https://www.gurmeetkaurstore.in/uploads/8147932435Untitled_design_(19).png",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Berry Bliss Lip Balm",
      description: "Soft, tinted balm for smooth and hydrated lips.",
      price: 349,
      originalPrice: 499,
      image:
        "https://www.gurmeetkaurstore.in/uploads/22793Dr_rashel_De-tan.png",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Charcoal Detox Face Mask",
      description: "Deep cleanses pores and gives a radiant glow.",
      price: 849,
      originalPrice: 1099,
      image:
        "https://www.gurmeetkaurstore.in/uploads/57161Nice_&_Naughty_Bombshell_Lipistick_Mix_Color_D.png",
      rating: 4.9,
    },
    {
      id: 1,
      name: "Rose Glow Toner",
      description: "Refreshes and tones your skin with a natural rose scent.",
      price: 699,
      originalPrice: 899,
      image:
        "https://www.gurmeetkaurstore.in/uploads/16495Mars_Magic_Shinw_Fix_Spray.jpg",
      rating: 4.6,
    },
    {
      id: 2,
      name: "Matte Perfection Foundation",
      description: "Gives flawless matte coverage for all-day wear.",
      price: 999,
      originalPrice: 1299,
      image:
        "https://www.gurmeetkaurstore.in/uploads/93366HR_Foundation_Nude_04.jpg",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Coconut Hair Serum",
      description: "Repairs and nourishes dry, frizzy hair instantly.",
      price: 599,
      originalPrice: 799,
      image:
        "https://www.gurmeetkaurstore.in/uploads/8147932435Untitled_design_(19).png",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Berry Bliss Lip Balm",
      description: "Soft, tinted balm for smooth and hydrated lips.",
      price: 349,
      originalPrice: 499,
      image:
        "https://www.gurmeetkaurstore.in/uploads/22793Dr_rashel_De-tan.png",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Charcoal Detox Face Mask",
      description: "Deep cleanses pores and gives a radiant glow.",
      price: 849,
      originalPrice: 1099,
      image:
        "https://www.gurmeetkaurstore.in/uploads/57161Nice_&_Naughty_Bombshell_Lipistick_Mix_Color_D.png",
      rating: 4.9,
    },
  ];



export default function NewProductsPage() {
  const navigate = useNavigate();

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-500 mb-8 text-center">
          New Arrivals
        </h2>

        {/* Full grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newArrivals.map((product) => {
            const discount = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 relative group p-3 flex flex-col justify-between"
              >
                <div className="absolute -top-3 right-3 z-30 bg-primary-500 text-white px-3 py-1 rounded-tl-xl rounded-bl-xl text-xs font-bold shadow">
                  New
                </div>

                {discount > 0 && (
                  <div className="absolute top-3 left-3 z-20 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                    {discount}% OFF
                  </div>
                )}

                <div
                  className="w-full h-24 md:h-36 flex justify-center items-center mb-2 cursor-pointer relative z-10"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain transition-transform duration-300 group-hover:scale-105 relative z-10"
                  />
                </div>

                <h3 className="text-sm md:text-base font-semibold text-brand-text mb-1 text-left">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2 text-left">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-2 px-1 text-sm">
                  <div className="flex items-center gap-1">
                    <p className="text-primary-500 font-medium text-sm">₹{product.price}</p>
                    <p className="text-gray-400 line-through text-xs">₹{product.originalPrice}</p>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="ml-1 text-gray-600 text-xs">{product.rating}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <button className="flex-1 bg-primary-500 text-white font-semibold py-1 rounded-lg hover:bg-primary-600 transition text-sm">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex-1 border border-primary-500 text-primary-500 font-semibold py-1 rounded-lg hover:bg-primary-50 transition text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
