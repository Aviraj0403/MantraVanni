import { toggleWishlist as toggleWishlistApi } from '../services/walletWishlistApi';
import { toast } from 'react-hot-toast';

const WISHLIST_KEY = 'local_wishlist_items';

// Get all wishlist items from local storage
export const getLocalWishlist = () => {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading local wishlist:", err);
    return [];
  }
};

// Check if a product ID is in local wishlist
export const isProductInWishlist = (productId) => {
  const list = getLocalWishlist();
  return list.some(item => (typeof item === 'object' ? item._id === productId : item === productId));
};

// Toggle product in wishlist (both local storage & API)
export const toggleWishlistHelper = async (product, userLoggedIn = false) => {
  if (!product || !product._id) return false;

  let currentList = getLocalWishlist();
  const existsIndex = currentList.findIndex(item => (typeof item === 'object' ? item._id === product._id : item === product._id));
  
  let isAdded = false;

  if (existsIndex >= 0) {
    // Remove from local storage
    currentList.splice(existsIndex, 1);
    toast.success(`Removed ${product.name || 'Item'} from Wishlist`);
    isAdded = false;
  } else {
    // Add to local storage
    currentList.push(product);
    toast.success(`Added ${product.name || 'Item'} to Wishlist! ❤️`);
    isAdded = true;
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(currentList));

  // Notify all components in the app
  window.dispatchEvent(new Event('wishlistUpdated'));

  // If user is logged in, also sync with Backend API
  if (userLoggedIn) {
    try {
      await toggleWishlistApi(product._id);
    } catch (err) {
      console.warn("Backend wishlist sync failed, kept in local storage:", err);
    }
  }

  return isAdded;
};
