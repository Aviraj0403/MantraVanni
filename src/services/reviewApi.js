import Axios from '../utils/Axios';

// Get all reviews for a specific product (paginated)
export const getProductReviews = (productId, page = 1, limit = 10) => {
  return Axios.get(`/reviews/${productId}/getProductReviews`, {
    params: { page, limit },
  });
};

// Create a new review for a product
export const createReview = (productId, reviewData) => {
  return Axios.post(`/reviews/cr/${productId}/createReview`, reviewData);
};

// Update an existing review
export const updateReview = (reviewId, reviewData) => {
  return Axios.patch(`/reviews/updateReview/${reviewId}`, reviewData);
};

// Delete a review
export const deleteReview = (reviewId) => {
  return Axios.delete(`/reviews/deleteReview/${reviewId}`);
};
// Get all reviews made by the logged-in user (paginated)
export const getUserReviews = (page = 1, limit = 10) => {
  return Axios.get('/reviews/getUserReviews', {
    params: { page, limit },
  });
};
