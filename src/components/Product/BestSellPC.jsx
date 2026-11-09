import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart, FaBolt, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../../hooks/useCartActions";

export default function BestSellPC({ product, onProductClick }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCartActions();
  const [isHovered, setIsHovered] = useState(false);
  const [wished, setWished] = useState(false);

  const activeVariant = product?.variants;
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

  const discount = product?.discount || 0;

  const handleProductClick = () => {
    if (onProductClick) onProductClick(product.slug);
    else navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    const result = await addToCart(product, size, color, 1);
    if (result.success) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }
  };

  const handleBuyNow = async (e) => {
    if (e) e.stopPropagation();
    const result = await addToCart(product, size, color, 1);
    if (result.success) navigate("/cart");
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden"
    >
      {/* 🖼 Image Area */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50/20 cursor-pointer"
        onClick={handleProductClick}
      >
        <motion.img
          src={product.pimage}
          alt={product.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-contain p-4"
        />

        {/* 🏷 Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <div className="bg-amber-400 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter shadow-amber-100">
              Bestseller
            </div>
          )}
          {discount > 0 && (
            <div className="bg-primary-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* ⭐️ Compact Rating Badge on Image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-amber-500 shadow-sm border border-gray-100/50">
          <FaStar size={10} />
          <span className="text-[11px] font-black text-brand-text leading-none">{product.rating || "4.8"}</span>
        </div>

        {/* ❤️ Wishlist Icon */}
        <button
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
        >
          {wished ? <FaHeart className="text-rose-500" /> : <FaRegHeart />}
        </button>

        {/* Quick Add Overlay */}
        <AnimatePresence>
          {isHovered && quantity === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent"
            >
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-brand-text text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-primary-600 hover:text-white transition-all shadow-primary-50"
              >
                <FaShoppingCart size={10} /> QUICK ADD
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
            <span className="text-lg font-black text-brand-text leading-none tracking-tight">₹{activeVariant?.price}</span>
            {activeVariant?.realPrice > activeVariant?.price && (
              <span className="text-[10px] text-gray-400 line-through mt-1 leading-none">₹{activeVariant?.realPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {quantity > 0 ? (
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-9 px-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); if(quantity <= 1) removeFromCart(product._id, size, color); else updateQuantity(product._id, size, color, quantity - 1); }} 
                  className="w-7 h-full flex items-center justify-center text-gray-400 font-bold"
                >-</button>
                <span className="text-xs font-black px-2">{quantity}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, size, color, quantity + 1); }} 
                  className="w-7 h-full flex items-center justify-center text-gray-400 font-bold"
                >+</button>
              </div>
            ) : (
              <button
                onClick={handleBuyNow}
                className="w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-10 shadow-2xl max-w-sm w-full text-center border border-primary-50"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">★</div>
              <h4 className="text-xl font-black text-brand-text mb-1 leading-none">High Demand!</h4>
              <p className="text-sm text-gray-500 mb-8 px-4">"{product.name}" has been added to your collection.</p>
              <div className="flex gap-3 px-4 w-full">
                <button onClick={() => navigate("/cart")} className="flex-1 bg-primary-600 text-white h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary-100">Bag</button>
                <button onClick={() => setShowPopup(false)} className="flex-1 border border-gray-100 text-brand-text h-14 rounded-xl font-bold uppercase text-[10px] tracking-widest">Later</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
