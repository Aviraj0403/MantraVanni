import React, { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import ApplyCouponPanel from "./ApplyCouponPanel";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../hooks/useCartActions";
import { useAuth } from "../context/AuthContext";
import { getShippingAmount } from "../utils/shippingCalculator";

const transformToSlug = (name) => {
  return name
    .toLowerCase()               
    .replace(/[^\w\s-]/g, '')     
    .replace(/\s+/g, '-')        
    .replace(/-+/g, '-');       
};

export default function CartPage() {
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState({
    applied: false,
    code: "",
    name: "",
    discountPercentage: null,
    maxDiscountAmount: null,
  });
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
    loading,
  } = useCartActions();

  // console.log("Cart Items:", cartItems); // Debugging
  const { cartSyncing, user } = useAuth();

  // Calculate dynamic shipping charges based on cart weight
  const shippingCharges = getShippingAmount(cartItems);

  // Calculate discount based on the coupon's discount percentage and max discount cap
  const calculateDiscount = () => {
    if (!coupon.discountPercentage) return 0;

    // Calculate the discount based on the totalAmount
    const discountAmount = (totalAmount * coupon.discountPercentage) / 100;

    // Cap the discount to the max discount allowed
    return Math.min(discountAmount, coupon.maxDiscountAmount);
  };

  // Calculate the final amount after applying the discount and shipping
  const finalAmount = totalAmount - calculateDiscount() + shippingCharges;

  const handleIncrement = (id, size, color) => {
    const item = cartItems.find((i) => i.id === id && i.size === size && i.color === color);
    // console.log("Incrementing item:", id, size, color, item);
    if (item) updateQuantity(id, size, color, item.quantity + 1);
  };

  // Handle decrementing item quantity
  const handleDecrement = (id, size, color) => {
    const item = cartItems.find((i) => i.id === id && i.size === size && i.color === color);
    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(id, size, color);
    } else {
      updateQuantity(id, size, color, item.quantity - 1);
    }
  };

  // Handle item removal from the cart
  const handleRemoveItem = (id, size, color) => {
    // console.log("Removing item:", id, size, color);
    removeFromCart(id, size, color);
  };

  // Handle clearing the cart
  const handleClearCart = () => {
    clearCart();
    handleCouponRemove();
  };

  // Handle applying a coupon
  const handleCouponApply = (response, code) => {
    const { discountAmount, finalAmount, offerDetails } = response;

    // Update coupon state with the offer details
    setCoupon({
      applied: true,
      code,
      name: offerDetails.name,
      discountPercentage: offerDetails.discountPercentage,
      maxDiscountAmount: offerDetails.maxDiscountAmount,
    });

    setCouponOpen(false); // Close panel after successful application
  };

  // Handle removing the applied coupon
  const handleCouponRemove = () => {
    setCoupon({
      applied: false,
      code: "",
      name: "",
      discountPercentage: null,
      maxDiscountAmount: null,
    });
  };

  // Use effect to ensure re-rendering when coupon is applied or removed
  useEffect(() => {
    // console.log("Updated finalAmount:", finalAmount); // Debugging
  }, [coupon, totalAmount]);

  // Render the loading or main content based on the cart syncing state
  const renderContent = () => {
    if (cartSyncing) {
      return (
        <div className="min-h-screen p-4 sm:p-8 flex justify-center relative bg-primary-50">
          <div className="w-full max-w-6xl flex flex-col gap-6">
            <div className="w-full md:w-80">
              <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                <h2>Loading cart...</h2>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-brand-text">
            Your Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            // <p>Your cart is empty.</p>
            <div className="flex justify-center items-center min-h-[300px]">
              {/* "Shop Now" Button shown only when cart is empty */}
              <button
                className="w-full sm:w-auto bg-primary-600 text-white font-bold text-lg sm:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:bg-primary-700 transition duration-300 transform hover:scale-105 max-w-md"
                onClick={() => navigate("/new-products")}
              >
                Shop Now
              </button>
            </div>

          ) : (
            cartItems.map((item) => (
              <div
                key={item.id + item.size + item.color} // Ensure that color is part of the key
                className="relative bg-white shadow-md rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  className="absolute top-2 right-2 md:hidden bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-200"
                  onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                    onClick={() => navigate(`/product/${transformToSlug(item.name)}`)} 
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-brand-text">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">{item.size}</p>
                    <p className="text-sm text-gray-500">{item.color}</p> {/* Display the color */}
                    <p className="text-primary-600 font-semibold mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <button
                      className="text-gray-600 hover:text-primary-600"
                      onClick={() => handleDecrement(item.id, item.size, item.color)}
                      disabled={loading}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 font-medium">{item.quantity}</span>
                    <button
                      className="text-gray-600 hover:text-primary-600"
                      onClick={() => handleIncrement(item.id, item.size, item.color)}
                      disabled={loading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-brand-text font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="hidden md:block bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-200"
                    onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-80">
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-brand-text mb-2">
              Order Summary
            </h2>

            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <p className="text-gray-600">Total Items</p>
              <p className="font-medium">{totalItems}</p>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 text-center mb-4">
              <p className="text-gray-600 text-sm">TOTAL AMOUNT</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                ₹{finalAmount.toFixed(2)}
              </p>
            </div>

            {/* Applied Coupon Display */}
            {coupon.applied && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applied Coupon</p>
                    <p className="font-semibold text-green-700 text-lg">{coupon.code}</p>
                    {coupon.name && coupon.name !== coupon.code && (
                      <p className="text-sm text-gray-600 mt-1">{coupon.name}</p>
                    )}
                  </div>
                  <button
                    onClick={handleCouponRemove}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Apply Coupon Button */}
            {!coupon.applied && (
              <button
                className="w-full bg-white-100  text-primary-500 font-medium py-2 rounded-lg transition mb-4"
                onClick={() => setCouponOpen(true)}
              >
                Apply Coupon
              </button>
            )}

            <div className="space-y-2 text-sm text-brand-text mb-6">
              <div className="flex justify-between">
                <p>Item Total</p>
                <p>₹{totalAmount.toFixed(2)}</p>
              </div>

              {coupon.applied && (
                <div className="flex justify-between text-green-600">
                  <p>Discount</p>
                  <p>
                    {/* Conditional display of the discount */}
                    -₹{
                      calculateDiscount().toFixed(2)
                    }
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <p>Delivery Fee</p>
                <p>₹{shippingCharges.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  // If the user is not logged in, redirect to login page
                  navigate("/signin", {
                    // Redirect back to cart after successful login
                    state: { from: "/cart" },
                  });
                } else {
                  // Proceed to checkout if the user is logged in
                  navigate("/checkout", {
                    state: {
                      cartItems, // Items in the cart
                      totalAmount, // Total amount before discount
                      totalQuantity: totalItems, // Total quantity of items
                      grandTotal: finalAmount.toFixed(2), // Final amount after coupon and shipping
                      shippingCharges, // Dynamic shipping charges
                      appliedCoupon: coupon.applied ? coupon : null, // Coupon details (if any)
                      finalAmount: totalAmount - calculateDiscount(), // Amount after discount, before shipping
                    },
                  });
                }
              }}
              className="w-full bg-gradient-to-r from-primary-500 to-rose-500 text-white font-bold py-3 rounded-xl mb-3 
             shadow-lg shadow-primary-300/40 
             hover:from-primary-600 hover:to-rose-600 
             hover:shadow-xl hover:shadow-primary-400/50 
             active:scale-95 transition-all duration-200"
>
PLACE ORDER
</button>



            <button
              className="w-full border border-primary-300 text-primary-600 font-medium py-2 rounded-lg hover:bg-primary-50 transition"
              onClick={handleClearCart}
              disabled={loading}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex justify-center relative bg-primary-50">
      {renderContent()}
      <ApplyCouponPanel
        isOpen={couponOpen}
        onClose={() => setCouponOpen(false)}
        onApply={handleCouponApply}
        appliedCoupon={coupon.applied ? coupon.code : null}
        totalAmount={totalAmount}
      />
    </div>
  );
}
