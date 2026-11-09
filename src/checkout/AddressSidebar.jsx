import React, { useState, useEffect } from "react";
import axios from "../utils/Axios"; // Your Axios instance
import { addAddress, updateAddress } from "../services/userApi";
import { checkPincodeServiceability } from "../services/shippingApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import { useAuth } from "../context/AuthContext";

export default function AddressSidebar({ isOpen, onClose, refreshAddresses, userName, email, address: propAddress, embedded = false }) {

  const { user } = useAuth();
  const [address, setAddress] = useState({
    // name: user?.userName || "",  // Prefill with userName from context
    name:  "",
    email: user?.email || "",
    phone: "",
    street: "",
    flat: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    addressType: "Home",
  });

  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'


  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        // name: user.userName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // If parent passes an address (for edit), populate form
  useEffect(() => {
    if (propAddress) {
      setFormMode("edit");
      // map incoming address fields to our local state shape
      setAddress((prev) => ({
        ...prev,
        name: propAddress.name || propAddress.fullName || prev.name,
        email: propAddress.email || prev.email,
        phone: propAddress.phone || propAddress.phoneNumber || prev.phone,
        street: propAddress.street || propAddress.flat || prev.street,
        flat: propAddress.flat || "",
        landmark: propAddress.landmark || "",
        city: propAddress.city || prev.city,
        state: propAddress.state || prev.state,
        country: propAddress.country || prev.country || "India",
        pincode: propAddress.pincode || propAddress.postalCode || prev.pincode,
        addressType: propAddress.addressType || propAddress.type || prev.addressType,
      }));
      if (propAddress.location && propAddress.location.coordinates) {
        const [lng, lat] = propAddress.location.coordinates;
        setLocation({ lat, lng });
      }
    } else {
      setFormMode("add");
    }
  }, [propAddress]);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pincodeValidation, setPincodeValidation] = useState({
    isValidating: false,
    isValid: null,
    isServiceable: null,
    message: '',
    deliveryInfo: null
  });

  // Function to sync location
  const handleSyncLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            const res = await axios.get(`/map?lat=${latitude}&lon=${longitude}`);
            const data = res.data;
            const components = data.address;
            setAddress((prev) => ({
              ...prev,
              street: data.display_name,
              city: components.city || components.town,
              state: components.state || "",
              country: components.country || "India",
              pincode: components.postcode || "",
            }));
          } catch (err) {
            console.error(err);
            alert("Failed to fetch address from location.");
          }
        },
        (error) => {
          alert("Unable to fetch location. Please enable GPS.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  // Function to handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
    
    // Reset pincode validation when pincode changes
    if (name === 'pincode') {
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        isServiceable: null,
        message: '',
        deliveryInfo: null
      });
    }
  };

  // Function to validate pincode
  const validatePincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setPincodeValidation({
        isValidating: false,
        isValid: false,
        isServiceable: false,
        message: 'Please enter a valid 6-digit pincode',
        deliveryInfo: null
      });
      return;
    }

    setPincodeValidation(prev => ({ ...prev, isValidating: true }));

    try {
      const { data } = await checkPincodeServiceability(pincode);
      
      if (data.success) {
        setPincodeValidation({
          isValidating: false,
          isValid: true,
          isServiceable: data.serviceable,
          message: data.message,
          deliveryInfo: data.serviceable ? {
            courierCompanies: data.courier_companies?.length || 0,
            estimatedDelivery: '5-7 business days' // Default estimate
          } : null
        });
      } else {
        setPincodeValidation({
          isValidating: false,
          isValid: false,
          isServiceable: false,
          message: 'Unable to verify pincode',
          deliveryInfo: null
        });
      }
    } catch (error) {
      console.error('Pincode validation error:', error);
      setPincodeValidation({
        isValidating: false,
        isValid: false,
        isServiceable: false,
        message: 'Unable to verify pincode. Please try again.',
        deliveryInfo: null
      });
    }
  };

  // Handle pincode blur event
  const handlePincodeBlur = (e) => {
    const pincode = e.target.value.trim();
    if (pincode && pincode.length === 6) {
      validatePincode(pincode);
    }
  };

  // Function to save the address
  const saveAddress = async (e) => {
    e.preventDefault();
    // Client-side validation
    const newErrors = {};
    // required fields: phone, pincode, street, city
    if (!address.name) newErrors.name = "Name is required";
    if(!address.name) newErrors.name = "Name is required";

    if (!address.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(address.phone)) newErrors.phone = "Enter a valid 10-digit phone number";

    if (!address.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    else if (pincodeValidation.isValid === false) newErrors.pincode = "Invalid pincode";
    else if (pincodeValidation.isServiceable === false) newErrors.pincode = "Delivery not available to this pincode";

    if (!address.street) newErrors.street = "Street address is required";
    if (!address.city) newErrors.city = "Area is required";
    if (!address.state) newErrors.state = "State is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // focus first error field
      const firstField = Object.keys(newErrors)[0];
      const el = document.getElementsByName(firstField)[0];
      if (el) el.focus();
      return;
    }

    setIsLoading(true);

    const addressPayload = {
      ...address,
      location: { type: "Point", coordinates: [location.lng || 0, location.lat || 0] },
    };

    try {
      if (formMode === "edit" && propAddress) {
        const id = propAddress._id || propAddress.id;
        await updateAddress(id, addressPayload);
        toast.success("✅ Address updated!");
      } else {
        await addAddress(addressPayload);
        toast.success("✅ Address saved!");
      }
      setIsLoading(false);
      onClose(); // Automatically close the sidebar after successful save
      if (refreshAddresses) refreshAddresses();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save address.");
      setIsLoading(false);
    }
  };

  // Return if sidebar is closed
  if (!isOpen) return null;

  const fields = [
    { label: "Name", field: "name", type: "text" },
    { label: "Email", field: "email", type: "email" },
    { label: "Phone Number *", field: "phone", type: "tel", maxLength: 10, required: true },
    { label: "Area *", field: "city", type: "text", required: true },
    { label: "Address *", field: "street", type: "text", required: true },
    // { label: "Flat / House No.", field: "flat", type: "text" },
    // { label: "Landmark (optional)", field: "landmark", type: "text" },
    { label: "Pincode *", field: "pincode", type: "text", maxLength: 6, required: true },
    // { label: "City *", field: "city", type: "text", required: true },
    { label: "State", field: "state", type: "text" },
    // { label: "Country", field: "country", type: "text" },
    
  ];

  const panel = (
    <div className="w-full sm:w-[420px] bg-white h-full shadow-2xl p-0 overflow-y-auto relative">
        {/* Header Section */}
        <div className="sticky top-0 z-[10000] bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-text">Add New Address</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-brand-text text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Leaflet Map or Custom Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4 border">
            {location.lat ? (
              <MapContainer center={[location.lat, location.lng]} zoom={16} style={{ width: "100%", height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>{address.street}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <img src="/Logo.webp" alt="Nisha Sagar" className="w-full h-full object-cover" />
                <p>Map will appear here after syncing location</p>
              </div>
            )}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncLocation}
            className="w-full bg-blue-100 text-blue-700 font-medium py-2 rounded-lg mb-5 hover:bg-blue-200 transition"
          >
            📍 Sync My Location
          </button>

          {/* Address Form */}
          <form onSubmit={saveAddress} className="space-y-4">
            {fields.map(({ label, field, type, maxLength }) => (
              <div key={field}>
                <label className="block text-brand-text font-medium mb-1">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={type}
                    name={field}
                    value={address[field]}
                    maxLength={maxLength}
                    onChange={handleChange}
                    onBlur={field === 'pincode' ? handlePincodeBlur : undefined}
                    placeholder={label}
                    className={`w-full rounded-lg px-3 py-2 outline-none border ${errors[field] ? 'border-red-500 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-primary-400'}`}
                  />
                  
                  {/* Pincode validation indicator */}
                  {field === 'pincode' && address.pincode && address.pincode.length === 6 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {pincodeValidation.isValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                      ) : pincodeValidation.isValid === true ? (
                        pincodeValidation.isServiceable ? (
                          <span className="text-green-500 text-lg">✓</span>
                        ) : (
                          <span className="text-red-500 text-lg">✗</span>
                        )
                      ) : pincodeValidation.isValid === false ? (
                        <span className="text-red-500 text-lg">✗</span>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Pincode validation message */}
                {field === 'pincode' && pincodeValidation.message && (
                  <div className={`text-sm mt-1 ${pincodeValidation.isServiceable ? 'text-green-600' : 'text-red-500'}`}>
                    {pincodeValidation.message}
                    {pincodeValidation.deliveryInfo && (
                      <div className="text-xs text-gray-600 mt-1">
                        Estimated delivery: {pincodeValidation.deliveryInfo.estimatedDelivery}
                      </div>
                    )}
                  </div>
                )}
                
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            {/* Address Type */}
            <div>
              <label className="block text-brand-text font-medium mb-2">Address Type</label>
              <div className="flex gap-4">
                {["Home", "Work", "Other"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={address.addressType === type}
                      onChange={() => setAddress({ ...address, addressType: type })}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>
      </div>
  );

  if (embedded) {
    return panel;
  }

  return (
    <div className="fixed inset-0 flex justify-end z-[9999]">
      {panel}
    </div>
  );
}
