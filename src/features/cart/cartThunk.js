import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserCart, addToCart, updateCartItem, removeCartItem, clearCart as clearCartApi } from "../../services/cartApi";
import { setCart, mergeCart, clearCart } from "./cartSlice";

// Sync cart after login (Only push missing guest items to the backend)
export const syncCartOnLogin = createAsyncThunk(
  "cart/syncOnLogin",
  async (_, { dispatch, getState }) => {
    const localCart = getState().cart.items;

    try {
      // STEP 1: Fetch backend cart
      const backend = await getUserCart();
      const backendItems = backend.data.cartItems;

      if (localCart.length === 0) {
        dispatch(setCart({ items: backendItems }));
        return;
      }

      // STEP 2: Push local items to backend (only missing ones)
      const promises = [];
      for (const item of localCart) {
        const { id: productId, size, color, quantity } = item;

        const exists = backendItems.find(
          (i) => i.productId === productId && i.size === size && i.color === color
        );

        if (!exists) {
          promises.push(
            addToCart({
              productId,
              size,
              color,
              quantity: item.quantity,
            })
          );
        }
      }

      await Promise.all(promises);

      // STEP 3: Fetch final cart from backend and merge
      const finalCart = await getUserCart();
      dispatch(setCart({ items: finalCart.data.cartItems }));
    } catch (err) {
      console.error("❌ Failed to sync cart on login:", err);
    }
  }
);

// Fetch backend cart (on refresh or token restore)
export const fetchBackendCart = createAsyncThunk(
  "cart/fetchBackendCart",
  async (_, { dispatch }) => {
    try {
      const response = await getUserCart();
      // console.log("📦 Fetched Backend Cart:", response.data.cartItems);
      dispatch(setCart({ items: response.data.cartItems }));
    } catch (err) {
      console.error("❌ Fetch backend cart error:", err);
    }
  }
);

// Add item to cart (backend sync after local update)
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, size, color, quantity }, { dispatch }) => {
    try {
      // console.log("🛒 Adding to backend:", { productId, size, color, quantity });
      
      await addToCart({ productId, size, color, quantity });

      // Fetch updated cart from backend
      const updatedCart = await getUserCart();
      // console.log("✅ Backend response after add:", updatedCart.data.cartItems);
      
      dispatch(setCart({ items: updatedCart.data.cartItems }));
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      throw err;
    }
  }
);

// 🔧 CRITICAL FIX: Update item quantity in cart
export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, size, color, quantity }, { dispatch }) => {
    try {
      // console.log("📝 Updating backend:", { productId, size, color, quantity });
      
      // Update backend
      await updateCartItem({ productId, size, color, quantity });

      // Fetch updated cart from backend
      const updatedCart = await getUserCart();
      // console.log("✅ Backend response after update:", updatedCart.data.cartItems);
      
      // Update Redux state with backend data
      dispatch(setCart({ items: updatedCart.data.cartItems }));
      
      return { success: true };
    } catch (err) {
      console.error("❌ Update cart item failed:", err);
      throw err;
    }
  }
);

// Remove item from backend and update Redux
export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color }, { dispatch }) => {
    try {
      // console.log("🗑️ Removing from backend:", { productId, size, color });
      
      await removeCartItem({ productId, size, color });

      // Fetch updated cart from backend
      const updatedCart = await getUserCart();
      // console.log("✅ Backend response after remove:", updatedCart.data.cartItems);
      
      dispatch(setCart({ items: updatedCart.data.cartItems }));
    } catch (err) {
      console.error("❌ Remove from cart failed:", err);
    }
  }
);

// Clear the entire cart from both Redux and backend
export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch }) => {
    try {
      await clearCartApi();
      dispatch(clearCart());
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
    }
  }
);
