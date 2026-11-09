import React from 'react';
import PincodeChecker from '../components/PincodeChecker';

export default function TestPincode() {
  const handlePincodeValidated = (result) => {
    console.log('Pincode validation result:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-brand-text">
          Pincode Validation Test
        </h1>
        
        <div className="max-w-md mx-auto">
          <PincodeChecker onPincodeValidated={handlePincodeValidated} />
        </div>

        <div className="mt-8 max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-brand-text">
            <li>Enter a 6-digit pincode (e.g., 110001 for Delhi)</li>
            <li>Click "Check" or press Enter</li>
            <li>The system will validate against Shiprocket API</li>
            <li>You'll see delivery availability and estimated time</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Sample Pincodes to Test:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>110001</strong> - New Delhi (Usually serviceable)</li>
              <li><strong>400001</strong> - Mumbai (Usually serviceable)</li>
              <li><strong>560001</strong> - Bangalore (Usually serviceable)</li>
              <li><strong>600001</strong> - Chennai (Usually serviceable)</li>
              <li><strong>123456</strong> - Invalid pincode (Should fail)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
