import Axios from '../utils/Axios';

// API call to fetch products by category slug
export const getProductsByCategorySlug = async (slug, page = 1, limit = 100) => {
  try {
    // Send GET request to the server to fetch products by category slug
    const response = await Axios.get(`/products/${slug}`, {
      params: { page, limit },
    });

    // Check if the response is successful
    if (response.data && response.data.success) {
      return response.data;
    } else {
      // If not successful, throw an error
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    // Log the error and provide fallback data
    console.error('Error fetching products by category slug:', error);
    return { success: false, products: [], pagination: {} };
  }
};

export const getProductsByCategoryAndSubCategorySlug = async (categorySlug, subCategorySlug, page = 1, limit = 20) => {
  try {
    // Send GET request to the server to fetch products by category and sub-category slug
    const response = await Axios.get(`/products/${categorySlug}/${subCategorySlug}`, {
      params: { page, limit },
    });
    // Check if the response is successful
    if (response.data && response.data.success) {
      return response.data;
    } else {
      // If not successful, throw an error
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    // Log the error and provide fallback data
    console.error('Error fetching products by category and sub-category slug:', error);
    return { success: false, products: [], pagination: {} };
  }
};

export const getMiniProducts = async (
  page = 1, 
  limit = 1000, 
  search = '', 
  category = '', 
  isHotProduct = '', 
  isBestSeller = '', // Default isBestSeller to 'true'
  isFeatured = '',
  isCombo = '' // Ensure isCombo is passed in the request
) => {
  try {
    // Send GET request to fetch mini products with filters and pagination
    const response = await Axios.get('/products/getminiversion', {
      params: { 
        page, 
        limit, 
        search, 
        category, 
        isHotProduct, 
        isBestSeller, // Filter by Best Seller by default
        isFeatured,
        isCombo // Make sure isCombo is included in the request params
      },
    });

    // Check if the response is successful
    if (response.data && response.data.success) {
      return response.data;
    } else {
      // If not successful, throw an error
      throw new Error('Failed to fetch mini products');
    }
  } catch (error) {
    // Log the error and provide fallback data
    console.error('Error fetching mini products:', error);
    return { success: false, products: [], pagination: {} };
  }
};

export const getProductBySlug = async (slug) => {
  try {
    // Send GET request to fetch product by slug
    const response = await Axios.get(`/products/getSingleProduct/${slug}`);
    
    // Check if the response is successful
    if (response.data && response.data.success) {
      return response.data;  // Return the product data if successful
    } else {
      throw new Error('Failed to fetch product');
    }
  } catch (error) {
    // Log the error and return fallback data
    console.error('Error fetching product by slug:', error);
    return { success: false, product: null };  // Returning null product in case of error
  }
};

