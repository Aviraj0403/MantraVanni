import Axios from '../utils/Axios';

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
