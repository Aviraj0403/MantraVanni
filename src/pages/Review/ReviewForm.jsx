import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { createReview } from "../../services/reviewApi";
import { useAuth } from "../../context/AuthContext";
const ReviewForm = ({ productId, setReviews }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const handleSignInClick = () => {
    window.location.href = "/signin";
  };
  if (!user) {
    return (
      <div className="mt-8 text-center py-12 bg-gradient-to-br from-brand-bg to-secondary-50 rounded-2xl border-2 border-dashed border-secondary-200">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-3xl text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-brand-text mb-2">Share Your Experience</h3>
          <p className="text-gray-600 mb-4">Sign in to write a review and help others make informed decisions</p>
          <button className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-all hover:shadow-lg"    onClick={handleSignInClick}>
            Sign In to Review
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!comment.trim() || comment.trim().length < 20) {
      toast.error("Please write at least 20 characters", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await createReview(productId, { rating, comment });
      if (newReview.success) {
        // Add the new review to the list immediately
        setReviews((prev) => [newReview.review, ...prev]);

        // Show success state
        setIsSubmitted(true);

        toast.success("Review submitted successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Reset form after 3 seconds
        setTimeout(() => {
          setRating(0);
          setComment("");
          setIsSubmitted(false);
        }, 3000);
      } else {
        toast.error("Failed to submit review", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 animate-fadeIn">
        <div className="text-center max-w-md mx-auto">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-75"></div>
          </div>
          <h3 className="text-2xl font-bold text-brand-text mb-2">Thank You!</h3>
          <p className="text-gray-600 text-lg mb-1">Your review has been submitted successfully</p>
          <p className="text-sm text-gray-500">Your feedback helps others make better choices</p>

          {/* Rating display */}
          <div className="mt-6 flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={`${i < rating ? "text-yellow-400" : "text-gray-300"} text-2xl`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="mt-8 bg-brand-bg rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-accent px-6 py-4">
        <h3 className="text-xl font-bold text-white">Write Your Review</h3>
        <p className="text-primary-100 text-sm mt-1">Share your thoughts with other customers</p>
      </div>

      <div className="p-6">
        {/* Rating Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-brand-text mb-3">
            How would you rate this product?
          </label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(i + 1)}
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-110 disabled:opacity-50"
              >
                <FaStar
                  className={`${i < (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                    } text-4xl transition-colors cursor-pointer`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-lg font-semibold text-brand-text">
                {rating} {rating === 1 ? "Star" : "Stars"}
              </span>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-brand-text mb-3">
            Share your experience
          </label>
          <textarea
            className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
            rows="5"
            placeholder="Tell us what you loved about this product, or what could be improved..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {comment.length} characters
            </span>
            {comment.length > 0 && comment.length < 20 && (
              <span className="text-xs text-primary-500">
                Please write at least 20 characters
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0 || comment.trim().length < 20}
            className="bg-gradient-to-r from-primary-500 to-accent text-white py-3 px-8 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 focus:ring-4 focus:ring-secondary-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReviewForm;
