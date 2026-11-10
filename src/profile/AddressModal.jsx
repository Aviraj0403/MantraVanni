import React, { useState, useEffect } from "react";
import AddressSidebar from "../checkout/AddressSidebar";

export default function AddressModal({ isOpen, onClose, address, onSuccess }) {
  const [formMode, setFormMode] = useState("add");
  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    if (address) {
      setFormMode("edit");
      setCurrentAddress(address);
    } else {
      setFormMode("add");
      setCurrentAddress(null);
    }
  }, [address]);

  const handleSidebarSuccess = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

return (
  <div
    className="
      fixed left-0 right-0
      top-[150px] bottom-[40px]
      z-[9999]
      flex items-center justify-center
      bg-black/60
      px-2 sm:px-4
    "
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        bg-brand-bg w-full max-w-2xl
        rounded-lg shadow-lg
        max-h-full
        flex flex-col
      "
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Header */}
      <div className="sticky top-0 z-20 bg-brand-bg border-b px-5 py-3 flex justify-between">
        <h2 className="text-lg font-semibold text-brand-text">
          {formMode === "edit" ? "Edit Address" : "Add New Address"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-brand-text text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <AddressSidebar
          isOpen={true}
          onClose={onClose}
          address={currentAddress}
          refreshAddresses={handleSidebarSuccess}
          embedded={true}
        />
      </div>
    </div>
  </div>
);

}
