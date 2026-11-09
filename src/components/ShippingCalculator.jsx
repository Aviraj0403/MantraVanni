import React, { useMemo } from 'react';
import { calculateCartShipping } from '../utils/shippingCalculator';

/**
 * ShippingCalculator Component
 * Displays shipping charges based on cart items (Clean UI - no weight breakdown)
 */
const ShippingCalculator = ({ cartItems = [] }) => {
  const shippingResult = useMemo(() => {
    return calculateCartShipping(cartItems);
  }, [cartItems]);

  const { totalShipping } = shippingResult;

  if (!cartItems.length) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Add items to calculate shipping</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-brand-text">Delivery Fee:</span>
        <span className="font-bold text-lg text-green-600">₹{totalShipping}</span>
      </div>
    </div>
  );
};

export default ShippingCalculator;
