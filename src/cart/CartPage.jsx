import React, { useState } from "react";
import { ArrowLeft, LoaderCircle, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import ApplyCouponPanel from "./ApplyCouponPanel";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../hooks/useCartActions";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import { formatINR } from "../utils/money";

const transformToSlug = (name) => {
  return name
    .toLowerCase()               
    .replace(/[^\w\s-]/g, '')     
    .replace(/\s+/g, '-')        
    .replace(/-+/g, '-');       
};

export default function CartPage() {
  usePageMeta({ title: "Your Cart | MantraVanni", description: "Review the items in your MantraVanni cart.", noindex: true });
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
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
    loading,
    error: cartError,
  } = useCartActions();

  // console.log("Cart Items:", cartItems); // Debugging
  const { cartSyncing, user } = useAuth();

  // Shipping is priced by the server (product weight + address) at checkout; no estimate is shown here.

  // Calculate discount based on the coupon's discount percentage and max discount cap
  const calculateDiscount = () => {
    if (!coupon.discountPercentage) return 0;

    // Calculate the discount based on the totalAmount
    const discountAmount = (totalAmount * coupon.discountPercentage) / 100;

    // Cap the discount to the max discount allowed
    const cap = Number(coupon.maxDiscountAmount);
    // A null/0 cap means "no cap".
    return cap > 0 ? Math.min(discountAmount, cap) : discountAmount;
  };

  // Calculate the final amount after applying the discount and shipping
  const finalAmount = totalAmount - calculateDiscount();

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
    const { offerDetails } = response;

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

  // Render the loading or main content based on the cart syncing state
  const renderContent = () => {
    if (cartSyncing) {
      return (
        <div className="min-h-[70vh] bg-[#f7f5f1] p-4 sm:p-8 flex justify-center relative">
          <div className="w-full max-w-6xl flex flex-col gap-6">
            <div className="w-full">
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#e7ded1] bg-brand-bg p-6 text-center shadow-sm">
                <LoaderCircle size={28} className="animate-spin text-[#E67E22]" />
                <h2 className="mt-4 font-semibold text-[#332c24]">Preparing your cart...</h2>
                <p className="mt-1 text-xs text-[#81776c]">Please wait while we sync your items.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
        {/* Left Section */}
        <div className="flex-1">
          {/* Live region: announces cart update failures / progress to assistive tech */}
          <p className={cartError ? "mb-2 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-700" : "sr-only"} role="status" aria-live="polite">
            {cartError ? String(cartError) : loading ? "Updating your cart" : ""}
          </p>
          <button
            type="button"
            onClick={() => navigate("/new-products")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#766b5e] hover:text-[#D35400]"
          >
            <ArrowLeft size={15} /> Continue shopping
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28231e]">Shopping Cart</h1>
          <p className="mb-5 mt-1 text-xs text-[#7c7369] sm:mb-6 sm:text-sm">
            {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? "item" : "items"} in your cart` : "Your selected products will appear here"}
          </p>

          {cartItems.length === 0 ? (
            // <p>Your cart is empty.</p>
            <div className="flex min-h-[390px] flex-col items-center justify-center rounded-2xl border border-[#e7ded1] bg-brand-bg px-6 text-center shadow-sm">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f8efe2] text-[#E67E22]">
                <ShoppingBag size={34} strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 text-xl font-bold text-[#312b24]">Your cart is empty</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#7c7369]">Explore our spiritual essentials and add something meaningful to your journey.</p>
              <button
                className="mt-6 rounded-xl bg-[#D35400] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(105,3,12,0.2)] transition hover:bg-[#C45509] active:scale-[0.98]"
                onClick={() => navigate("/new-products")}
              >
                Explore Products
              </button>
            </div>

          ) : (
            cartItems.map((item) => (
              <div
                key={item.id + item.size + item.color} // Ensure that color is part of the key
                className="group relative mb-3 flex flex-col rounded-2xl border border-[#e7ded1] bg-brand-bg p-3 shadow-sm transition hover:border-[#d9c7a9] hover:shadow-[0_10px_26px_rgba(61,45,25,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-4"
              >
                <button
                  aria-label={`Remove ${item.name} from cart`}
                  className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#fff5f4] text-[#a13a40] transition hover:bg-[#f9e5e3] md:hidden"
                  onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                >
                  <X size={16} />
                </button>

                <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-0 sm:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="112"
                    height="112"
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-24 cursor-pointer rounded-xl border border-[#eee7de] bg-[#faf8f4] object-contain p-1.5 transition group-hover:scale-[1.02] sm:h-28 sm:w-28"
                    onClick={() => navigate(`/product/${transformToSlug(item.name)}`)} 
                  />
                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-sm font-semibold text-[#312b24] sm:text-base">
                      {item.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.size && <span className="rounded-md bg-[#f4f1ec] px-2 py-1 text-[10px] text-[#756b60]">Size: {item.size}</span>}
                      {item.color && <span className="rounded-md bg-[#f4f1ec] px-2 py-1 text-[10px] text-[#756b60]">Color: {item.color}</span>}
                    </div>
                    <p className="mt-2 font-bold text-[#D35400]">
                      {formatINR(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#f0ebe4] pt-3 sm:justify-end sm:border-0 sm:pt-0">
                  <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[#dcd3c7] bg-brand-bg shadow-sm">
                    <button
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="grid h-full w-9 place-items-center text-[#6e6459] transition hover:bg-[#f5eee3] hover:text-[#D35400] disabled:opacity-40"
                      onClick={() => handleDecrement(item.id, item.size, item.color)}
                      disabled={loading}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="grid h-full min-w-9 place-items-center border-x border-[#e7e0d7] px-2 text-sm font-bold">{item.quantity}</span>
                    <button
                      aria-label={`Increase quantity of ${item.name}`}
                      className="grid h-full w-9 place-items-center text-[#6e6459] transition hover:bg-[#f5eee3] hover:text-[#D35400] disabled:opacity-40"
                      onClick={() => handleIncrement(item.id, item.size, item.color)}
                      disabled={loading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-[#312b24]">
                    {formatINR(item.price * item.quantity)}
                  </p>
                  <button
                    aria-label={`Remove ${item.name} from cart`}
                    className="hidden h-9 w-9 place-items-center rounded-full text-[#9a8d7c] transition hover:bg-[#fff0f0] hover:text-[#a2262f] md:grid"
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
        <div className="w-full md:sticky md:top-5 md:w-[350px] md:shrink-0">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd1] bg-brand-bg p-5 shadow-[0_8px_30px_rgba(61,45,25,0.08)] sm:p-6">
            <h2 className="text-lg font-bold text-[#302a23]">
              Order Summary
            </h2>
            <p className="mb-5 mt-0.5 text-xs text-[#81776c]">Review your order before checkout</p>

            {/* Applied Coupon Display */}
            {coupon.applied && (
              <div className="mb-4 rounded-xl border border-[#bcdcc7] bg-[#f1faf4] p-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#568267]">Coupon applied</p>
                    <p className="text-sm font-bold text-[#245e3b]">{coupon.code}</p>
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
                className="mb-5 flex w-full items-center justify-between rounded-xl border border-dashed border-[#cdb78f] bg-[#fffbf4] p-3 text-sm font-semibold text-[#5b4a30] transition hover:border-[#8d692c] hover:bg-[#fff7e8]"
                onClick={() => setCouponOpen(true)}
              >
                <span className="inline-flex items-center gap-2"><Tag size={17} className="text-[#E67E22]" /> Apply Coupon</span>
                <span className="text-xs text-[#E67E22]">View offers</span>
              </button>
            )}

            <div className="mb-5 space-y-3 text-sm text-[#6e655b]">
              <div className="flex justify-between">
                <p>Item Total</p>
                <p>{formatINR(totalAmount)}</p>
              </div>

              {coupon.applied && (
                <div className="flex justify-between text-green-600">
                  <p>Discount</p>
                  <p>
                    {/* Conditional display of the discount */}
                    -{formatINR(calculateDiscount())}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <p>Delivery Fee</p>
                <p className="text-xs">Calculated at checkout</p>
              </div>
            </div>
            <div className="mb-5 border-t border-dashed border-[#ddd3c6] pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold text-[#302a23]">Total Amount</p>
                  <p className="text-[10px] text-[#8a8075]">Excludes delivery. Final price, discount and delivery are confirmed at checkout.</p>
                </div>
                <p className="text-xl font-extrabold text-[#D35400]">{formatINR(finalAmount)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  // If the user is not logged in, redirect to login page
                  navigate("/signin?redirect=/cart", {
                    // Redirect back to cart after successful login
                    state: { from: "/cart" },
                  });
                } else {
                  // Proceed to checkout if the user is logged in
                  // Checkout re-prices the cart on the server; only the coupon code and the
                  // cart-page estimate (used for the "prices updated" notice) are passed along.
                  navigate("/checkout", {
                    state: {
                      appliedCoupon: coupon.applied ? coupon : null,
                    },
                  });
                }
              }}
              disabled={cartItems.length === 0 || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D35400] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(105,3,12,0.22)] transition hover:bg-[#C45509] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c8bbb5] disabled:shadow-none"
>
<ShieldCheck size={18} /> Proceed to Checkout
</button>



            <button
              className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#8a625e] transition hover:text-[#a2262f] disabled:opacity-40"
              onClick={handleClearCart}
              disabled={loading}
            >
              <Trash2 size={14} /> Clear Cart
            </button>

            <div className="mt-4 grid grid-cols-2 border-t border-[#eee7de] pt-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6f665c]"><ShieldCheck size={14} className="text-[#548164]" /> Secure Payment</span>
              <span className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-[#6f665c]"><Truck size={15} className="text-[#E67E22]" /> Reliable Delivery</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen justify-center bg-[#f7f5f1] px-3 pb-28 pt-5 sm:px-6 sm:py-8 md:pb-10">
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
