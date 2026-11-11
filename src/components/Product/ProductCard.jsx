import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart, FaBolt, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../../hooks/useCartActions";
import useCombosEnabled from "../../hooks/useCombosEnabled";
import { useAuth } from "../../context/AuthContext";
import { toggleWishlistHelper, isProductInWishlist } from "../../utils/wishlistHelper";
import { isOutOfStock } from "../../utils/stock";

export default function ProductCard({ product, onProductClick }) {
  const navigate = useNavigate();
  const combosOn = useCombosEnabled();
  const { user } = useAuth();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCartActions();
  const [isHovered, setIsHovered] = useState(false);
  const [wished, setWished] = useState(false);

  const activeVariant = product?.variants;
  const soldOut = isOutOfStock(product, activeVariant);
  const size = activeVariant?.size || "default";
  const color = Array.isArray(activeVariant?.color) ? activeVariant.color[0] : (activeVariant?.color || "default");
  
  const [quantity, setQuantity] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const item = cartItems.find(
      (i) => i.id === product._id && i.size === size && i.color === color
    );
    setQuantity(item?.quantity || 0);
  }, [cartItems, size, color, product._id]);

  // Sync wishlist status
  useEffect(() => {
    if (product?._id) {
      setWished(isProductInWishlist(product._id));
    }

    const handleSync = () => {
      if (product?._id) {
        setWished(isProductInWishlist(product._id));
      }
    };

    window.addEventListener('wishlistUpdated', handleSync);
    return () => window.removeEventListener('wishlistUpdated', handleSync);
  }, [product?._id]);

  const discount = product?.discount || 0;

  const handleProductClick = () => {
    const identifier = product?.slug || product?._id;
    if (onProductClick) onProductClick(identifier);
    else navigate(`/product/${identifier}`);
  };


  const handleToggleWishlist = async (e) => {
    if (e) e.stopPropagation();
    const isAdded = await toggleWishlistHelper(product, !!user);
    setWished(isAdded);
  };

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    if (soldOut) return;
    const result = await addToCart(product, size, color, 1);
    if (result.success) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }
  };

  const handleBuyNow = async (e) => {
    if (e) e.stopPropagation();
    if (soldOut) return;
    const result = await addToCart(product, size, color, 1);
    if (result.success) navigate("/cart");
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-brand-bg/95 backdrop-blur-sm border border-primary-100 rounded-2xl shadow-[0_4px_20px_rgba(255,165,0,0.05)] hover:shadow-[0_8px_30px_rgba(255,165,0,0.15)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden"
    >
      {/* 🖼 Image Area */}
      <div 
        className="relative aspect-square overflow-hidden bg-secondary-50/40 cursor-pointer"
        onClick={handleProductClick}
      >
        <motion.img
          src={product.pimage || product.image?.[0] || product.thumbnail}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-contain p-4"
        />

        {/* 🏷 Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-accent to-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            {discount}% OFF
          </div>
        )}

        {soldOut && (
          <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 bg-brand-text/80 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white">
            Out of stock
          </div>
        )}

        {combosOn && product?.isCombo && (
          <div className="absolute bottom-3 right-3 z-20 rounded-md bg-primary-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-sm ring-1 ring-secondary/60">
            Combo
          </div>
        )}

        {/* ⭐️ Compact Rating Badge on Image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-amber-500 shadow-sm border border-gray-100/50">
          <FaStar size={10} />
          <span className="text-[11px] font-black text-brand-text leading-none">{product.rating || "4.5"}</span>
        </div>

        {/* ❤️ Wishlist Icon */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
            wished ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-white/80 text-gray-400 hover:text-rose-500'
          }`}
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
        >
          {wished ? <FaHeart className="text-rose-500 text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>


        {/* Add to Bag Reveal Overlay */}
        <AnimatePresence>
          {isHovered && quantity === 0 && !soldOut && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent"
            >
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-brand-text text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-primary-500 hover:text-white transition-colors"
              >
                <FaShoppingCart size={11} /> ADD TO BAG
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 📝 Compact Info Section */}
      <div className="p-3.5 flex flex-col flex-1 gap-1.5">
        <h3 
          className="text-[13px] font-bold text-brand-text line-clamp-2 leading-[1.4] h-[36px] hover:text-primary-600 transition-colors cursor-pointer tracking-tight"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-brand-text leading-none">₹{activeVariant?.price}</span>
            {activeVariant?.realPrice > activeVariant?.price && (
              <span className="text-xs text-gray-400 line-through mt-1 leading-none">₹{activeVariant?.realPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {quantity > 0 ? (
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-9 px-1">
                <button 
                  aria-label="Decrease quantity"
                  onClick={(e) => { e.stopPropagation(); if(quantity <= 1) removeFromCart(product._id, size, color); else updateQuantity(product._id, size, color, quantity - 1); }} 
                  className="w-7 h-full flex items-center justify-center text-gray-400 font-black hover:text-primary-600 transition-colors"
                >-</button>
                <span className="text-xs font-black px-2 tabular-nums">{quantity}</span>
                <button 
                  aria-label="Increase quantity"
                  onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, size, color, quantity + 1); }} 
                  className="w-7 h-full flex items-center justify-center text-gray-400 font-black hover:text-primary-600 transition-colors"
                >+</button>
              </div>
            ) : soldOut ? (
              <span className="rounded-lg bg-gray-100 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">Out of stock</span>
            ) : (
              <button
                onClick={handleBuyNow}
                className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-secondary hover:text-brand-text transition-colors shadow-sm"
                title="Instant Checkout"
                aria-label="Buy now"
              >
                <FaBolt size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          >
            <div className="bg-brand-bg rounded-[2rem] p-8 shadow-2xl max-w-sm w-full text-center border border-primary-50">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
              <h4 className="text-xl font-bold text-brand-text mb-1 leading-none">Added to Bag</h4>
              <p className="text-sm text-gray-500 mb-6 px-4">"{product.name}" is now in your collection bag.</p>
              <div className="flex gap-3 px-4 w-full">
                <button onClick={() => navigate("/cart")} className="flex-1 bg-primary-600 text-white h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">Bag</button>
                <button onClick={() => setShowPopup(false)} className="flex-1 border border-gray-100 text-brand-text h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">Later</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
