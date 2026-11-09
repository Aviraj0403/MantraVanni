import { calculateCartShipping, parseWeightFromString, convertToGrams } from './shippingCalculator';

/**
 * Test examples for shipping calculator
 * Run this in console to see how it works
 */

// Example cart items with different weight formats
const testCartItems = [
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
  },
  {
    product: {
      name: "Hair Oil",
      size: "100 ml"
    },
    quantity: 3
  },
  {
    product: {
      name: "Face Wash",
      weight: "150g"
    },
    quantity: 1
  }
];

// Test the calculator
export const runShippingTests = () => {
  console.log("🧪 Testing Shipping Calculator\n");
  
  // Test 1: Parse different weight formats
  console.log("📏 Testing Weight Parsing:");
  const testSizes = ["50ml", "200gm", "1kg", "100 ml", "150g", "2.5 liters", "1.5kg"];
  
  testSizes.forEach(size => {
    const parsed = parseWeightFromString(size);
    const grams = convertToGrams(parsed.weight, parsed.unit);
    console.log(`${size} → ${parsed.weight}${parsed.unit} → ${grams}g`);
  });
  
  console.log("\n💰 Testing Shipping Calculation:");
  
  // Test 2: Calculate shipping for different scenarios
  const scenarios = [
    // Scenario 1: Light items (under 1kg)
    [
      { product: { name: "Lipstick", size: "4g" }, quantity: 5 },
      { product: { name: "Face Cream", size: "50ml" }, quantity: 2 }
    ],
    
    // Scenario 2: Exactly 1kg
    [
      { product: { name: "Body Lotion", size: "500gm" }, quantity: 2 }
    ],
    
    // Scenario 3: Over 1kg (should add extra charges)
    [
      { product: { name: "Shampoo", size: "1kg" }, quantity: 1 },
      { product: { name: "Conditioner", size: "500ml" }, quantity: 1 }
    ],
    
    // Scenario 4: Heavy order (multiple kg)
    [
      { product: { name: "Family Pack Shampoo", size: "2kg" }, quantity: 2 },
      { product: { name: "Body Wash", size: "1 liter" }, quantity: 1 }
    ]
  ];
  
  scenarios.forEach((cartItems, index) => {
    const result = calculateCartShipping(cartItems);
    console.log(`\nScenario ${index + 1}:`);
    console.log(`Items: ${cartItems.length}`);
    console.log(`Total Weight: ${result.weightBreakdown.totalWeightKg}kg`);
    console.log(`Base Shipping: ₹${result.baseCharge}`);
    console.log(`Additional Charges: ₹${result.additionalCharge}`);
    console.log(`Total Shipping: ₹${result.totalShipping}`);
    
    // Show item breakdown
    result.weightSources.forEach(item => {
      console.log(`  - ${item.productName} (${item.quantity}x): ${item.sizeString} → ${item.calculatedWeight}g each`);
    });
  });
  
  return "Tests completed! Check console for results.";
};

// Export for easy testing
export { testCartItems };

// Uncomment the line below to run tests automatically
// runShippingTests();
