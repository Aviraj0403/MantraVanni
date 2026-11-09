import React from "react";
import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    { id: 1, product: "Glow Radiance Face Cream", rating: 5, comment: "Amazing results!" },
    { id: 2, product: "Hydrating Lip Balm", rating: 4, comment: "Very smooth and soft." },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">My Reviews</h1>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 border border-primary-100 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="font-semibold text-brand-text">{rev.product}</h2>
            <div className="flex items-center gap-2 mt-1">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="text-primary-500" size={18} />
              ))}
            </div>
            <p className="text-gray-500 mt-2">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
