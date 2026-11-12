import React from "react";

/**
 * Extra online-payment choices (Cashfree / PayU), rendered next to the existing "Pay Online" option.
 * Renders nothing when the store offers none (module off / failed call), so the classic checkout is unchanged.
 */
export default function GatewayOptions({ gateways, paymentMethod, onChoose, methodCls }) {
  if (!Array.isArray(gateways) || gateways.length === 0) return null;
  return (
    <>
      {gateways.map((g) => {
        const value = `gw:${g.key}`;
        return (
          <label key={g.key} className={methodCls(paymentMethod === value)}>
            <input
              type="radio"
              name="payment_method"
              checked={paymentMethod === value}
              onChange={() => onChoose(value)}
              className="text-primary-500"
            />
            <div>
              <p className="font-semibold text-brand-text">{g.title}</p>
              {g.subtitle && <p className="text-xs text-gray-500">{g.subtitle}</p>}
            </div>
          </label>
        );
      })}
    </>
  );
}
