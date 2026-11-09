import Axios from '../utils/Axios';

// Check if pincode is serviceable
export const checkPincodeServiceability = (pincode) => 
  Axios.get(`/shipping/check-serviceability/${pincode}`);

// Calculate shipping charges
export const calculateShippingCharges = (data) => 
  Axios.post('/shipping/calculate-charges', data);

// Calculate shipping for payment
export const calculateShippingForPayment = (data) => 
  Axios.post('/payment/calculate-shipping', data);
