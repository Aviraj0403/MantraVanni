import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  merged: false,
};

// Normalize cart item
const normalizeItem = (item) => ({
  id: item.id || item.productId,
  name: item.name,
  image: item.image,
  price: Number(item.price),
  quantity: Number(item.quantity),
  color: item.color,
  size: item.size,
});

// Calculate totals for cart
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ FINAL FIX: Add item - REPLACE quantity for both local and backend
    addItem(state, action) {
      const newItem = normalizeItem(action.payload);
      
      // console.log("📦 CartSlice addItem:", {
      //   newItem,
      //   currentItems: state.items.map(i => ({
      //     id: i.id,
      //     size: i.size,
      //     color: i.color,
      //     qty: i.quantity
      //   }))
      // });

      const existing = state.items.find(
        (i) => i.id === newItem.id && i.size === newItem.size && i.color === newItem.color
      );

      if (existing) {
        // ✅ CRITICAL FIX: REPLACE quantity (don't add)
        // This ensures consistency between local and backend cart
        existing.quantity = newItem.quantity;
        // console.log(`✅ Updated: ${newItem.color} - Qty: ${existing.quantity}`);
      } else {
        state.items.push(newItem);
        // console.log(`✅ Added NEW: ${newItem.color} - Qty: ${newItem.quantity}`);
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    // Update item quantity
    updateItemQuantity(state, action) {
      const { id, size, color, quantity } = action.payload;
      
      // console.log("📝 CartSlice updateItemQuantity:", { id, size, color, quantity });
      
      const item = state.items.find(
        (i) => i.id === id && i.size === size && i.color === color
      );
      
      if (item) {
        item.quantity = quantity;
        // console.log(`✅ Updated quantity: ${color} - Qty: ${quantity}`);
      } else {
        console.log(`❌ Item not found: ${id}, ${size}, ${color}`);
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    // Remove item
    removeItem(state, action) {
      const { id, size, color } = action.payload;
      
      // console.log("🗑️ CartSlice removeItem:", { id, size, color });
      
      state.items = state.items.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      );

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
    },

    // Set cart items (overwrite with backend data)
    setCart(state, action) {
      const incoming = action.payload.items || [];
      state.items = incoming.map(normalizeItem);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.merged = true;
    },

    // Merge cart (merge guest cart with backend)
    mergeCart(state, action) {
      const backendItems = (action.payload.items || []).map(normalizeItem);

      backendItems.forEach((backendItem) => {
        const existing = state.items.find(
          (i) => i.id === backendItem.id && i.size === backendItem.size && i.color === backendItem.color
        );

        if (existing) {
          // Update quantity with backend value (backend is source of truth after login)
          existing.quantity = backendItem.quantity;
        } else {
          state.items.push(backendItem);
        }
      });

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.merged = true;
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.merged = false;
    },
  },
});

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  setCart,
  mergeCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
