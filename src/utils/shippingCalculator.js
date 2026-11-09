/**
 * Shipping Calculator Utility
 * Base shipping: ₹80
 * Additional ₹80 for every 1kg above the first kg
 */

// Weight conversion constants
const WEIGHT_CONVERSIONS = {
  // Convert to grams as base unit
  'g': 1,
  'gm': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'kilograms': 1000,
  // For liquids, approximate density (1ml ≈ 1g for most cosmetics)
  'ml': 1,
  'milliliter': 1,
  'milliliters': 1,
  'l': 1000,
  'liter': 1000,
  'liters': 1000,
  // Common cosmetic units
  'oz': 28.35, // 1 oz ≈ 28.35g
  'fl oz': 29.57, // 1 fl oz ≈ 29.57g (for liquids)
};

/**
 * Extract weight and unit from product size/weight string
 * @param {string} sizeString - e.g., "50ml", "100gm", "1.5kg", "2 liters"
 * @returns {object} - {weight: number, unit: string, originalString: string}
 */
export const parseWeightFromString = (sizeString) => {
  if (!sizeString || typeof sizeString !== 'string') {
    return { weight: 0, unit: 'g', originalString: sizeString || '' };
  }

  // Clean the string and make it lowercase
  const cleanString = sizeString.toLowerCase().trim();
  
  // Regular expression to match number and unit
  const weightRegex = /(\d+(?:\.\d+)?)\s*(g|gm|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|oz|fl\s*oz)s?/i;
  
  const match = cleanString.match(weightRegex);
  
  if (match) {
    const weight = parseFloat(match[1]);
    const unit = match[2].replace(/\s+/g, '').toLowerCase(); // Remove spaces from "fl oz"
    
    return {
      weight,
      unit,
      originalString: sizeString
    };
  }
  
  // If no match found, try to extract just numbers (assume grams)
  const numberMatch = cleanString.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return {
      weight: parseFloat(numberMatch[1]),
      unit: 'g', // Default to grams
      originalString: sizeString
    };
  }
  
  return { weight: 0, unit: 'g', originalString: sizeString };
};

/**
 * Convert weight to grams
 * @param {number} weight - Weight value
 * @param {string} unit - Unit of weight
 * @returns {number} - Weight in grams
 */
export const convertToGrams = (weight, unit) => {
  const cleanUnit = unit.toLowerCase().replace(/\s+/g, '');
  const conversionFactor = WEIGHT_CONVERSIONS[cleanUnit] || 1;
  return weight * conversionFactor;
};

/**
 * Calculate total weight of cart items in grams
 * @param {Array} cartItems - Array of cart items with product info
 * @returns {number} - Total weight in grams
 */
export const calculateTotalWeight = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }

  return cartItems.reduce((totalWeight, item) => {
    const quantity = item.quantity || 1;
    
    // Try to get weight from different possible product properties
    const sizeString = item.product?.size || 
                      item.product?.weight || 
                      item.product?.volume || 
                      item.size || 
                      item.weight || 
                      item.volume || 
                      '';

    const { weight, unit } = parseWeightFromString(sizeString);
    const weightInGrams = convertToGrams(weight, unit);
    
    return totalWeight + (weightInGrams * quantity);
  }, 0);
};

/**
 * Calculate shipping charges based on total weight
 * @param {number} totalWeightInGrams - Total weight in grams
 * @returns {object} - {baseCharge: number, additionalCharge: number, totalShipping: number, weightBreakdown: object}
 */
export const calculateShippingCharges = (totalWeightInGrams) => {
  const BASE_SHIPPING = 80; // ₹80 base shipping
  const ADDITIONAL_CHARGE_PER_KG = 80; // ₹80 per additional kg
  const WEIGHT_THRESHOLD_GRAMS = 1000; // 1kg in grams

  if (totalWeightInGrams <= 0) {
    return {
      baseCharge: 0,
      additionalCharge: 0,
      totalShipping: 0,
      weightBreakdown: {
        totalWeightGrams: 0,
        totalWeightKg: 0,
        additionalKg: 0
      }
    };
  }

  const totalWeightKg = totalWeightInGrams / 1000;
  
  let additionalCharge = 0;
  let additionalKg = 0;

  if (totalWeightInGrams > WEIGHT_THRESHOLD_GRAMS) {
    additionalKg = Math.ceil(totalWeightKg - 1); // Round up additional kg
    additionalCharge = additionalKg * ADDITIONAL_CHARGE_PER_KG;
  }

  const totalShipping = BASE_SHIPPING + additionalCharge;

  return {
    baseCharge: BASE_SHIPPING,
    additionalCharge,
    totalShipping,
    weightBreakdown: {
      totalWeightGrams: Math.round(totalWeightInGrams),
      totalWeightKg: Math.round(totalWeightKg * 100) / 100, // Round to 2 decimal places
      additionalKg
    }
  };
};

/**
 * Calculate shipping for cart items (main function)
 * @param {Array} cartItems - Array of cart items
 * @returns {object} - Complete shipping calculation result
 */
export const calculateCartShipping = (cartItems) => {
  const totalWeight = calculateTotalWeight(cartItems);
  const shippingResult = calculateShippingCharges(totalWeight);
  
  return {
    ...shippingResult,
    itemsAnalyzed: cartItems.length,
    weightSources: cartItems.map(item => ({
      productName: item.product?.name || item.name || 'Unknown Product',
      quantity: item.quantity || 1,
      sizeString: item.product?.size || item.product?.weight || item.size || 'Not specified',
      calculatedWeight: (() => {
        const sizeString = item.product?.size || item.product?.weight || item.size || '';
        const { weight, unit } = parseWeightFromString(sizeString);
        return convertToGrams(weight, unit);
      })()
    }))
  };
};

/**
 * Format shipping breakdown for display
 * @param {object} shippingResult - Result from calculateCartShipping
 * @returns {string} - Formatted string for display
 */
export const formatShippingBreakdown = (shippingResult) => {
  const { baseCharge, additionalCharge, totalShipping, weightBreakdown } = shippingResult;
  
  let breakdown = `Base Shipping: ₹${baseCharge}`;
  
  if (additionalCharge > 0) {
    breakdown += `\nAdditional Weight (${weightBreakdown.additionalKg}kg): ₹${additionalCharge}`;
  }
  
  breakdown += `\nTotal Weight: ${weightBreakdown.totalWeightKg}kg`;
  breakdown += `\nTotal Shipping: ₹${totalShipping}`;
  
  return breakdown;
};

/**
 * Simple customer-facing shipping calculation (no breakdown details)
 * @param {Array} cartItems - Array of cart items
 * @returns {number} - Total shipping amount
 */
export const getShippingAmount = (cartItems) => {
  const result = calculateCartShipping(cartItems);
  return result.totalShipping;
};

// Export default object with all functions
export default {
  parseWeightFromString,
  convertToGrams,
  calculateTotalWeight,
  calculateShippingCharges,
  calculateCartShipping,
  formatShippingBreakdown,
  getShippingAmount // Simple customer-facing function
};
