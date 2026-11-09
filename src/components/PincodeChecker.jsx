import React, { useState } from 'react';
import { checkPincodeServiceability } from '../services/shippingApi';
import { toast } from 'react-toastify';

export default function PincodeChecker({ onPincodeValidated }) {
  const [pincode, setPincode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validatePincode = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsValidating(true);
    try {
      const { data } = await checkPincodeServiceability(pincode);
      
      setValidationResult({
        pincode,
        serviceable: data.serviceable,
        message: data.message,
        courierCompanies: data.courier_companies?.length || 0
      });

      if (onPincodeValidated) {
        onPincodeValidated(data);
      }

      if (data.serviceable) {
        toast.success(`✅ Delivery available to ${pincode}`);
      } else {
        toast.error(`❌ Delivery not available to ${pincode}`);
      }
    } catch (error) {
      console.error('Pincode validation error:', error);
      toast.error('Unable to validate pincode. Please try again.');
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && pincode.length === 6) {
      validatePincode();
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-brand-text">Check Delivery Availability</h3>
      
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={pincode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter 6-digit pincode"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
            maxLength={6}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <button
          onClick={validatePincode}
          disabled={pincode.length !== 6 || isValidating}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Check
        </button>
      </div>

      {validationResult && (
        <div className={`p-3 rounded-lg text-sm ${
          validationResult.serviceable 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {validationResult.serviceable ? '✅' : '❌'}
            </span>
            <span className="font-medium">{validationResult.message}</span>
          </div>
          
          {validationResult.serviceable && (
            <div className="text-xs text-gray-600 mt-1">
              Estimated delivery: 5-7 business days
              {validationResult.courierCompanies > 0 && (
                <span> • {validationResult.courierCompanies} delivery partners available</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
