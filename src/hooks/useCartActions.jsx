import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";

import {
  syncCartOnLogin,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from "../features/cart/cartThunk";

import {
  addItem,
  updateItemQuantity,
  removeItem,
} from "../features/cart/cartSlice";

import { useAuth } from "../context/AuthContext";

export const useCartActions = () => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔧 FIX: Include color parameter in findCartItem
  const findCartItem = (productId, size, color) =>
    cartItems.find(
      (item) =>
        item.id === productId &&
        item.size === size &&
        item.color === color
    );

  const handleAction = async (actionCallback) => {
    setLoading(true);
    setError(null);
    try {
      const result = await actionCallback();
      return result;
    } catch (err) {
      setError(err.message || err);
      return { success: false, error: err.message || err };
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async () => {
    await handleAction(() => dispatch(syncCartOnLogin()).unwrap());
  };

  // ⭐ Add to Cart - FIXED
  const addToCart = async (product, size, color, quantity = 1) => {
    const existingItem = findCartItem(product._id, size, color);
    const newQty = (existingItem?.quantity || 0) + quantity;

    // console.log("🛒 Add to Cart:", {
    //   productId: product._id,
    //   size,
    //   color,
    //   quantity,
    //   existingQty: existingItem?.quantity,
    //   newQty
    // });

    const addItemAction = async () => {
      // Optimistically update local cart
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          image: product.pimage,
          size,
          color,
          price: product.variants?.price || 0,
          quantity: newQty,
        })
      );

      // If authenticated, sync with backend
      if (isAuthenticated) {
        await dispatch(
          addToCartThunk({
            productId: product._id,
            size,
            color,
            quantity: newQty
          })
        ).unwrap();
      }

      return { success: true, newQuantity: newQty };
    };

    return handleAction(addItemAction);
  };

  // ⭐ Update Quantity - FIXED
  const updateQuantity = async (productId, size, color, quantity) => {
    if (quantity < 1) return;

    console.log("📝 Update Quantity:", { productId, size, color, quantity });

    const updateQtyAction = async () => {
      // Optimistically update local cart
      dispatch(updateItemQuantity({ id: productId, size, color, quantity }));

      // If authenticated, sync with backend
      if (isAuthenticated) {
        await dispatch(
          updateCartItemThunk({ productId, size, color, quantity })
        ).unwrap();
      }

      return { success: true };
    };

    return handleAction(updateQtyAction);
  };

  // 🔧 FIX: Debounced version now includes color
  const updateQuantityDebounced = useCallback(
    debounce(
      (productId, size, color, qty) => updateQuantity(productId, size, color, qty),
      500
    ),
    []
  );

  // ⭐ Remove Item - FIXED
  const removeFromCart = async (productId, size, color) => {
    console.log("🗑️ Remove from Cart:", { productId, size, color });

    const removeItemAction = async () => {
      // Optimistically remove item from local cart
      dispatch(removeItem({ id: productId, size, color }));

      // If authenticated, remove from backend
      if (isAuthenticated) {
        await dispatch(
          removeFromCartThunk({ productId, size, color })
        ).unwrap();
      }

      return { success: true };
    };

    return handleAction(removeItemAction);
  };

  // ⭐ Clear Cart - FIXED
  const clearCart = async () => {
    const clearAction = async () => {
      // Optimistically clear local cart with color
      cartItems.forEach((item) =>
        dispatch(removeItem({ id: item.id, size: item.size, color: item.color }))
      );

      // If authenticated, clear from backend
      if (isAuthenticated) {
        await dispatch(clearCartThunk()).unwrap();
      }

      return { success: true };
    };

    return handleAction(clearAction);
  };

  // Calculate totals
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return {
    cartItems,
    syncCart,
    addToCart,
    updateQuantity,
    updateQuantityDebounced,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
    loading,
    error,
  };
};
