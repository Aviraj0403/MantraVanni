import Axios from '../utils/Axios';

export const getMenuCategories = async () => {
  try {
    const response = await Axios.get('/category/getMenuCategories');
    if (response.data.success) {
      return response.data.categories;
    } else {
      throw new Error('Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
export const getSearchSuggestions = async (query) => {
  try {
    const response = await Axios.get(`/products/suggestions`, {
      params: { search: query, limit: 30 },
    });
    if (response.data.success) {
      return response.data.suggestions;  // Return the suggestions list
    } else {
      throw new Error('Failed to fetch search suggestions');
    }
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
};
