import React, { useState, useEffect } from 'react';
import { productPath } from "../utils/productPath";
import { Heart, Trash2, ShoppingBag, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { getWishlist } from '../services/walletWishlistApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartThunk } from '../features/cart/cartThunk';
import { getLocalWishlist, toggleWishlistHelper } from '../utils/wishlistHelper';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      let apiItems = [];
      if (user) {
        try {
          const res = await getWishlist();
          if (res?.success && Array.isArray(res.data?.products)) {
            apiItems = res.data.products;
          }
        } catch (e) {
          console.warn("API Wishlist fetch failed:", e);
        }
      }
      
      const localItems = getLocalWishlist();
      
      // Merge and deduplicate by _id
      const itemMap = new Map();
      [...localItems, ...apiItems].forEach((item) => {
        if (item && typeof item === 'object' && item._id) {
          itemMap.set(item._id, item);
        }
      });

      setWishlist(Array.from(itemMap.values()));
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();

    const handleSync = () => {
      fetchWishlistData();
    };

    window.addEventListener('wishlistUpdated', handleSync);
    return () => window.removeEventListener('wishlistUpdated', handleSync);
  }, [user]);

  const handleRemove = async (product) => {
    try {
      await toggleWishlistHelper(product, !!user);
      fetchWishlistData();
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const handleAddToCart = (product) => {
    const variant = product.variants;
    dispatch(addToCartThunk({
      productId: product._id,
      size: variant?.size || 'Standard',
      color: Array.isArray(variant?.color) ? variant.color[0] : (variant?.color || 'Standard'),
      quantity: 1,
      product
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex justify-center items-center bg-brand-bg">
        <div className="flex items-center gap-3 text-primary-600 font-semibold">
          <RefreshCw className="animate-spin text-primary-500" size={24} />
          Loading Wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-secondary-200/60">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-text gold-emboss-3d flex items-center gap-2.5">
              <Heart className="text-accent fill-accent" size={26} /> My Sacred Wishlist
            </h1>
            <p className="text-brand-text/70 text-sm mt-1">Saved divine essentials for daily prayers and upcoming festivals.</p>
          </div>
          <span className="bg-secondary-100 text-brand-text px-4 py-1.5 rounded-full text-xs font-bold border border-secondary-300 shadow-sm">
            {wishlist.length} Saved Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-brand-bg/90 rounded-3xl p-12 text-center shadow-lg border border-secondary-200/70 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-secondary-50 text-accent rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-200 shadow-inner">
              <Heart size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-text">Your Wishlist is Empty</h2>
            <p className="text-brand-text/70 text-sm max-w-md mx-auto mt-2 mb-6">Explore our spiritual products, sacred idols, and divine essentials to save them for later.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition-all"
            >
              Explore Sacred Essentials <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              if (!item || typeof item !== 'object') return null;
              const variant = item.variants;
              const price = variant?.price || item.wholesalePrice || item.price || 0;
              const realPrice = variant?.realPrice || item.mrp;
              const imageUrl = item.pimage || item.image?.[0] || item.thumbnail || 'https://via.placeholder.com/200';

              return (
                <div key={item._id} className="bg-brand-bg rounded-3xl border border-secondary-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group card-3d">
                  <div>
                    <div className="relative h-48 bg-secondary-50/30 p-4 flex items-center justify-center cursor-pointer" onClick={() => navigate(productPath(item))}>
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                      loading="lazy" decoding="async" />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                        className="absolute top-3 right-3 p-2 bg-brand-bg/90 text-brand-text/40 hover:text-accent rounded-full shadow-sm border border-secondary-100 transition"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="absolute bottom-3 left-3 bg-accent-800/90 backdrop-blur-md text-secondary-200 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Sparkles size={10} className="text-secondary-400" /> Vedic Pure
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-brand-text text-sm line-clamp-2 mb-2 cursor-pointer" onClick={() => navigate(productPath(item))}>{item.name || item.title}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-black text-brand-text">₹{price}</span>
                        {realPrice > price && <span className="text-xs text-brand-text/40 line-through">₹{realPrice}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

