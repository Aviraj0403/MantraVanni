import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { getActiveOffers, applyDiscount } from "../services/offerApi";

export default function ApplyCouponPanel({ isOpen, onClose, onApply, appliedCoupon, totalAmount }) {
  const [coupon, setCoupon] = useState(""); // Coupon code input
  const [error, setError] = useState(null); // Error handling
  const [offers, setOffers] = useState([]); // List of active offers
  const [loading, setLoading] = useState(true); // Loading state for fetching offers

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const activeOffers = await getActiveOffers(); // Fetch active offers
        setOffers(activeOffers);
      } catch (error) {
        console.error("Failed to fetch offers", error);
        setError("Failed to load offers.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchOffers();
      setError(null); // Clear any previous errors when panel opens
    }
  }, [isOpen]);

  const handleApply = async (code, offerName = "") => {
    if (code.trim() !== "") {
      setLoading(true);  // Show loading state

      try {
        const discountResult = await applyDiscount(totalAmount, code);
        // console.log("Discount Result:", discountResult); // Debugging the result
        if (discountResult) {
          onApply(discountResult, code, offerName || code);
        } else {
          setError("Invalid coupon code or error applying discount.");
        }
      } catch (error) {
        console.error("Error applying discount:", error);
        setError("An error occurred while applying the coupon.");
      } finally {
        setLoading(false);  // Hide loading state after the request
      }
    } else {
      setError("Please enter a coupon code.");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-[200] transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-brand-text">Apply Coupon</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-primary-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {appliedCoupon ? (
          <div className="flex flex-col items-center gap-2">
            <Check className="text-green-500" size={32} />
            <p className="text-green-600 font-semibold text-center">
              Coupon "{appliedCoupon}" Applied Successfully!
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-100 p-4 rounded-lg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <p className="text-gray-600 mb-2">
              Enter your coupon code or choose one of our amazing offers:
            </p>

            {/* Custom Coupon Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
              <button
                onClick={() => handleApply(coupon)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 rounded-lg transition"
              >
                Apply
              </button>
            </div>

            {/* Loading State */}
            {loading && <p className="text-gray-500 mt-4">Loading offers...</p>}

            {/* Active Offers Section */}
            <div className="mt-4 flex flex-col gap-3">
              {!loading && offers.length === 0 ? (
                <p className="text-gray-600">No active offers available.</p>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="relative bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 border-l-4 border-primary-500 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition cursor-pointer"
                    onClick={() => handleApply(offer.code, offer.name)}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary-600 text-sm sm:text-base">
                        {offer.code}
                      </span>
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {offer.name} - {offer.discountPercentage}% off
                      </span>
                    </div>
                    <button className="bg-primary-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-primary-600 transition">
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
