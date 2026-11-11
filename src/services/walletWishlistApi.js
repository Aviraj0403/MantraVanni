import Axios from '../utils/Axios';

// Wallet APIs
export const getMyWallet = async () => {
  const res = await Axios.get('/wallet/my-wallet');
  return res.data;
};

export const addWalletFunds = async (amount, description, paymentId, source = 'RAZORPAY', razorpayOrderId = null, razorpayPaymentId = null, razorpaySignature = null) => {
  const res = await Axios.post('/wallet/add-funds', { amount, description, paymentId, source, razorpayOrderId, razorpayPaymentId, razorpaySignature });
  return res.data;
};

export const payWithWallet = async (amount, description, referenceId) => {
  const res = await Axios.post('/wallet/pay', { amount, description, referenceId });
  return res.data;
};

export const claimSignupBonus = async () => {
  const res = await Axios.post('/wallet/claim-signup-bonus');
  return res.data;
};

export const claimReferralCode = async (referralCode) => {
  const res = await Axios.post('/wallet/claim-referral', { referralCode });
  return res.data;
};

// Admin Wallet APIs
export const getAdminUserWallet = async (userId) => {
  const res = await Axios.get(`/wallet/admin/user/${userId}`);
  return res.data;
};

export const adminAdjustWallet = async (userId, type, amount, description) => {
  const res = await Axios.post('/wallet/admin/adjust', { userId, type, amount, description });
  return res.data;
};

// Wishlist APIs
export const getWishlist = async () => {
  const res = await Axios.get('/wishlist');
  return res.data;
};

export const toggleWishlist = async (productId) => {
  const res = await Axios.post('/wishlist/toggle', { productId });
  return res.data;
};
