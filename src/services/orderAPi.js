import Axios from '../utils/Axios';

// Map cart lines to the order/quote item shape. Prices are intentionally NOT sent: the server
// computes prices, discount, shipping and total from its own catalogue.
export const toOrderItems = (cartItems = []) =>
  cartItems.map((item) => ({
    product: item.id,
    selectedVariant: {
      size: item.size,
      ...(item.color ? { color: item.color } : {}),
    },
    quantity: item.quantity,
  }));

// Server-side price quote: lines, subtotal, discount, shipping, total and stock/validation issues.
export const quoteOrder = async ({ items, discountCode, shippingAddress }) => {
  const res = await Axios.post('/orders/quote', {
    items,
    ...(discountCode ? { discountCode } : {}),
    ...(shippingAddress ? { shippingAddress } : {}),
  });
  return res.data;
};

// Create new order
export const createOrder = async (orderData) => {
  const res = await Axios.post('/orders/createOrder', orderData);
  return res.data;
};

// Get all orders for the current user
export const getUserOrders = async () => {
  const res = await Axios.get('/orders/myorders');
  return res.data;
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
  const res = await Axios.get(`/orders/getOrderById/${orderId}`);
  return res.data;
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  const res = await Axios.put(`/orders/cancelOrder/${orderId}`);
  return res.data;
};

// Create manual order (Admin)
export const createOrderManual = async (orderData) => {
  const res = await Axios.post('/orders/createOrderManual', orderData);
  return res.data;
};
