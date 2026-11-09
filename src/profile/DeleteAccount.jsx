import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteAccount() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">Delete Account</h1>
      <p className="text-brand-text mb-6">
        Permanently delete your account and all related data. This action cannot be undone.
      </p>

      <div className="p-6 border border-primary-100 rounded-xl shadow hover:shadow-lg transition duration-300 bg-primary-50 flex flex-col items-center">
        <Trash2 className="text-primary-500 mb-4" size={36} />
        <p className="text-brand-text mb-4 text-center">
          Are you sure you want to delete your account?
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}
