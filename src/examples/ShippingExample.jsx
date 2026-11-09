import React from 'react';
import { calculateCartShipping, runShippingTests } from '../utils/shippingCalculatorTest';

/**
 * Example component showing how shipping calculator works
 * This is for demonstration purposes
 */
const ShippingExample = () => {
  // Example cart items with different weight formats
  const exampleCart = [
    {
      product: {
        name: "Face Cream",
        size: "50ml"
      },
      quantity: 2
    },
    {
      product: {
        name: "Body Lotion", 
        size: "200gm"
      },
      quantity: 1
    },
    {
      product: {
        name: "Shampoo",
        size: "1kg"
      },
      quantity: 1
    }
  ];

  const shippingResult = calculateCartShipping(exampleCart);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-brand-text">Shipping Calculator Example</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Sample Cart Items:</h3>
        {exampleCart.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b">
            <span>{item.product.name} ({item.product.size})</span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-3">Shipping Calculation:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Weight:</span>
            <span>{shippingResult.weightBreakdown.totalWeightKg}kg</span>
          </div>
          <div className="flex justify-between">
            <span>Base Shipping:</span>
            <span>₹{shippingResult.baseCharge}</span>
          </div>
          {shippingResult.additionalCharge > 0 && (
            <div className="flex justify-between">
              <span>Additional Weight Charge:</span>
              <span>₹{shippingResult.additionalCharge}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Shipping:</span>
            <span>₹{shippingResult.totalShipping}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Weight Breakdown:</h3>
        {shippingResult.weightSources.map((item, index) => (
          <div key={index} className="text-sm text-gray-600 mb-1">
            {item.productName}: {item.sizeString} → {item.calculatedWeight}g each × {item.quantity}
          </div>
        ))}
      </div>

      <button 
        onClick={() => runShippingTests()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Tests in Console
      </button>
    </div>
  );
};

export default ShippingExample;
