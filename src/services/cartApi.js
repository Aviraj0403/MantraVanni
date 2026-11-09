import Axios from '../utils/Axios'; // Ensure this instance handles tokens

export const getUserCart = () => {
  return Axios.get('/cart/getUserCart');
};

export const addToCart = (payload) => {
  return Axios.post('/cart/addToCart', payload); // Token required (verifyToken)
};

export const updateCartItem = (payload) => {
  return Axios.put('/cart/updateCartItem', payload);
};

export const removeCartItem = ({ productId, size,color }) => {
  return Axios.delete('/cart/removeCartItem', {
    params: { productId, size ,color} // ✅ send via query string
  });
};

export const clearCart = () => {
  return Axios.delete('/cart/clearCart');
};
