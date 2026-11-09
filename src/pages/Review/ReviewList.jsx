import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { createReview } from "../../services/reviewApi";
import { useAuth } from "../../context/AuthContext";
const ReviewList = ({ reviews }) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (safeReviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Be the first to share your experience with this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-brand-text mb-4">
        Customer Reviews ({safeReviews.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeReviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-primary-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <img
                src={review.user.avatar || "/Logo.webp"}
                alt={review.user.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary-100"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-brand-text truncate">
                  {review.user.userName}
                </h5>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`${i < review.rating ? "text-yellow-400" : "text-gray-300"
                          } text-sm`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-brand-text text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
