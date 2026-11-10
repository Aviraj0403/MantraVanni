import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "../utils/Axios"; // Your axios instance

import { getAddress, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../services/userApi"; // Your API helpers

import AddressModal from "./AddressModal"; // We'll create this next

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch addresses on mount
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/users/getaddresses", { withCredentials: true });
      setAddresses(data.data || []); // Ensure correct response structure
    } catch (err) {
      toast.error("Failed to load addresses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null); // Reset the editing address for adding a new one
    setIsModalOpen(true); // Open modal for adding a new address
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr); // Set the address to be edited
    setIsModalOpen(true); // Open modal for editing the address
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      fetchAddresses(); // Re-fetch the addresses after deletion
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated!");
      fetchAddresses(); // Re-fetch the addresses after setting a new default
    } catch (err) {
      toast.error("Failed to set default address");
    }
  };

  const handleSaveSuccess = () => {
    setIsModalOpen(false); // Close modal on successful save
    fetchAddresses(); // Re-fetch the addresses to reflect changes
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">My Addresses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 border rounded-xl bg-gray-50">
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-600">My Addresses</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-lg font-medium transition shadow-md"
        >
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No addresses saved yet.</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-primary-600 font-semibold hover:underline"
          >
            + Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id || addr.id}
              className={`relative p-6 border-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
                addr.isDefault
                  ? "border-primary-500 bg-primary-50"
                  : "border-primary-100 bg-brand-bg"
              }`}
            >
              {/* Default Badge */}
              {addr.isDefault && (
                <div className="absolute -top-3 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={14} />
                  Default
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary-500 mt-1" size={28} />
                  <div>
                    <h2 className="font-bold text-xl text-brand-text flex items-center gap-2">
                      {addr.addressType || addr.name}
                      {addr.isDefault && (
                        <span className="text-xs bg-primary-200 text-primary-800 px-2 py-0.5 rounded">Default</span>
                      )}
                    </h2>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      {addr.flat && `${addr.flat}, `}
                      {addr.street || addr.flat},<br />
                      {addr.landmark && `${addr.landmark}, `}
                      {addr.city}, {addr.state} - {addr.pincode || addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                    {(addr.phone || addr.phoneNumber) && (
                      <p className="text-gray-500 text-sm mt-2">📞 {addr.phone || addr.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleEdit(addr)}
                  className="flex items-center gap-1 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg border border-primary-200 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id || addr.id)}
                    className="text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg border border-green-200 transition text-sm"
                  >
                    Set Default
                  </button>
                )}

                <button
                  onClick={() => handleDelete(addr._id || addr.id)}
                  className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={editingAddress}
        onSuccess={handleSaveSuccess}
      />
    </div>
  );
}
