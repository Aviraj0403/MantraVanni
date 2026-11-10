import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { getActiveOffers, applyDiscount } from "../services/offerApi";

export default function ApplyCouponPanel({ isOpen, onClose, onApply, appliedCoupon, totalAmount }) {
  const [coupon, setCoupon] = useState("");    
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
      className={`fixed right-0 top-0 z-[200] h-full w-full bg-[#fcfbf9] shadow-[-15px_0_45px_rgba(25,18,10,0.22)] sm:w-96 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#D35400] p-5 text-white">
        <div>
          <h2 className="text-lg font-bold">Coupons & Offers</h2>
          <p className="mt-0.5 text-[11px] text-white/65">Save more on your order</p>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full bg-brand-bg/10 transition hover:bg-brand-bg/20"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 overflow-y-auto p-5">
        {appliedCoupon ? (
          <div className="flex flex-col items-center gap-2">
            <Check className="text-green-500" size={32} />
            <p className="text-green-600 font-semibold text-center">
              Coupon "{appliedCoupon}" Applied Successfully!
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-[#D35400] px-5 py-2.5 text-white transition hover:bg-[#C45509]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <p className="mb-1 text-sm leading-5 text-[#71675c]">
              Enter your coupon code or choose one of our amazing offers:
            </p>

            {/* Custom Coupon Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="min-w-0 flex-1 rounded-xl border border-[#dcd3c7] bg-brand-bg p-3 text-sm outline-none transition focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/15"
              />
              <button
                onClick={() => handleApply(coupon)}
                className="rounded-xl bg-[#D35400] px-4 font-semibold text-white transition hover:bg-[#C45509]"
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
                    className="relative flex cursor-pointer items-center justify-between rounded-xl border border-[#e2d4bd] bg-brand-bg p-4 shadow-sm transition hover:border-[#c4a66f] hover:shadow-md"
                    onClick={() => handleApply(offer.code, offer.name)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-wide text-[#D35400] sm:text-base">
                        {offer.code}
                      </span>
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {offer.name} - {offer.discountPercentage}% off
                      </span>
                    </div>
                    <button className="rounded-lg bg-[#f3e5cd] px-3 py-1.5 text-xs font-semibold text-[#7b5b22] transition hover:bg-[#ead7b5] sm:text-sm">
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
