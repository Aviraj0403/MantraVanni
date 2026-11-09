import Axios from '../utils/Axios';

// Fetch all offers
export const getAllOffers = async () => {
  try {
    const response = await Axios.get('/offers');
    if (response.data.success) {
      return response.data.offers;
    } else {
      throw new Error('Failed to fetch offers');
    }
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};

export const getActiveOffers = async () => {
  try {
    const response = await Axios.get('/offers/active');
    // console.log("Response from /offers/active:", response.data.data); // Debugging the response
    // Directly return the 'data' array, no need to check for 'success'
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching active offers:', error);
    return []; // Return empty array in case of error
  }
};


// Fetch active promo code-based offers
export const getActivePromoCodeOffers = async () => {
  try {
    const response = await Axios.get('/offers/active/promos');
    if (response.data.success) {
      return response.data.offers;
    } else {
      throw new Error('Failed to fetch active promo code offers');
    }
  } catch (error) {
    console.error('Error fetching active promo code offers:', error);
    return [];
  }
};

// Fetch a single offer by ID
export const getOfferById = async (id) => {
  try {
    const response = await Axios.get(`/offers/${id}`);
    if (response.data.success) {
      return response.data.offer;
    } else {
      throw new Error('Failed to fetch offer');
    }
  } catch (error) {
    console.error('Error fetching offer by ID:', error);
    return null;
  }
};

// Validate promo code
export const validatePromoCode = async (code) => {
  try {
    const response = await Axios.get(`/offers/validate/${code}`);
    if (response.data.success) {
      return response.data.validationResult;
    } else {
      throw new Error('Failed to validate promo code');
    }
  } catch (error) {
    console.error('Error validating promo code:', error);
    return null;
  }
};

export const applyDiscount = async (totalAmount, promoCode) => {
  try {
    const response = await Axios.post('/offers/apply-discount', {
      promoCode: promoCode,
      totalAmount: totalAmount
    });
    return response.data.data || response.data; // Return the data object
  } catch (error) {
    console.error('Error applying discount:', error);
    throw error;
  }
};
