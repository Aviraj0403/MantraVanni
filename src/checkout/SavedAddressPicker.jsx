import React from "react";

import { addressKey } from "./addressKey";

/** Saved-address cards plus a "use a new address" choice (fast checkout). Purely presentational. */
export default function SavedAddressPicker({ addresses, selectedId, mode, onPick, onNew }) {
  const cardCls = (active) =>
    `block border-2 rounded-xl p-3 cursor-pointer transition focus-within:ring-2 focus-within:ring-primary-400 ${
      active ? "border-primary-500 bg-primary-50" : "border-secondary-200 hover:bg-secondary-50"
    }`;
  return (
    <fieldset className="space-y-3 mb-4">
      <legend className="sr-only">Delivery address</legend>
      {addresses.map((addr) => {
        const key = addressKey(addr);
        const active = mode === "saved" && selectedId === key;
        return (
          <label key={key} className={cardCls(active)}>
            <div className="flex items-start gap-3">
              <input type="radio" name="address" checked={active} onChange={() => onPick(addr)} className="mt-1 text-primary-500" />
              <div className="min-w-0">
                <p className="font-semibold text-brand-text">
                  {addr.label || addr.type || "Address"} ({addr.phoneNumber})
                  {addr.isDefault && <span className="text-xs text-gray-500 ml-2">Default</span>}
                </p>
                <p className="text-sm text-gray-600 break-words">
                  {addr.street || addr.flat}, {addr.city}, {addr.state} - {addr.pincode || addr.postalCode}
                </p>
              </div>
            </div>
          </label>
        );
      })}
      <label className={cardCls(mode === "new")}>
        <div className="flex items-center gap-3">
          <input type="radio" name="address" checked={mode === "new"} onChange={onNew} className="text-primary-500" />
          <p className="font-semibold text-brand-text">Use a new address</p>
        </div>
      </label>
    </fieldset>
  );
}
