import React from 'react';
import { getShippingAmount } from '../utils/shippingCalculator';

/**
 * Clean Customer-Facing Shipping Example
 * Shows how customers see shipping - simple and clean
 */
const CleanShippingExample = () => {
  // Example cart scenarios
  const scenarios = [
    {
      name: "Light Order",
      items: [
        { product: { name: "Lipstick", size: "4g" }, quantity: 2 },
        { product: { name: "Face Cream", size: "50ml" }, quantity: 1 }
      ]
    },
    {
      name: "Medium Order", 
      items: [
        { product: { name: "Shampoo", size: "500ml" }, quantity: 1 },
        { product: { name: "Conditioner", size: "300ml" }, quantity: 1 }
      ]
    },
    {
      name: "Heavy Order",
      items: [
        { product: { name: "Family Pack Shampoo", size: "1kg" }, quantity: 2 },
        { product: { name: "Body Lotion", size: "500ml" }, quantity: 1 }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-brand-text mb-8">
        Clean Customer Experience
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => {
          const shippingAmount = getShippingAmount(scenario.items);
          const itemTotal = scenario.items.reduce((sum, item) => sum + (item.quantity * 100), 0); // Mock price
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-brand-text mb-4">
                {scenario.name}
              </h3>
              
              {/* Items */}
              <div className="space-y-2 mb-4">
                {scenario.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.product.name} ({item.product.size})</span>
                    <span>×{item.quantity}</span>
                  </div>
                ))}
              </div>
              
              {/* Clean Pricing */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-brand-text">
                  <span>Items Total:</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Delivery Fee:</span>
                  <span>₹{shippingAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 border-t pt-2">
                  <span>Total:</span>
                  <span>₹{itemTotal + shippingAmount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Clean Customer Experience
        </h3>
        <p className="text-green-700">
          Customers see simple "Delivery Fee" without confusing weight breakdowns.
          The system calculates fair pricing automatically behind the scenes.
        </p>
      </div>
    </div>
  );
};

export default CleanShippingExample;
