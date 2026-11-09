import React from "react";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const wishlistItems = [
    { id: 1, name: "Glow Radiance Face Cream", price: "₹799" },
    { id: 2, name: "Hydrating Lip Balm", price: "₹299" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border border-primary-100 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-50 p-3 rounded-lg">
                <Heart className="text-primary-500" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-brand-text">{item.name}</h2>
                <p className="text-gray-500">{item.price}</p>
              </div>
            </div>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg transition">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
