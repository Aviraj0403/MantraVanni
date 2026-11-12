import React, { useEffect, useRef, useState } from "react";
import usePincodeLookup, { isPincode } from "./usePincodeLookup";

const last10 = (v) => String(v || "").replace(/\D/g, "").slice(-10);

const inputCls = (bad) =>
  `w-full rounded-lg px-3 py-2.5 outline-none border bg-brand-bg focus:ring-2 ${
    bad ? "border-red-500 focus:ring-red-400" : "border-secondary-200 focus:ring-primary-400"
  }`;

/**
 * Inline new-address form for fast checkout.
 *  - minimalFields: only phone + pincode + street are asked; name / city / state / label sit under "add more details"
 *    (they open automatically when the pincode could not fill city + state).
 *  - pincodeAutofill: city + state are filled from the 6-digit pincode (debounced); never overwrites a value the shopper typed.
 * It reports a COMPLETE, valid address upward (debounced) or null.
 */
export default function QuickAddressForm({ config, user, onChange, saveable, saveChecked, onSaveChange }) {
  const minimal = !!config?.minimalFields;
  const autofill = !!config?.pincodeAutofill;

  const [phone, setPhone] = useState(() => last10(user?.phoneNumber || user?.phone));
  const [pincode, setPincode] = useState("");
  const [street, setStreet] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [label, setLabel] = useState("Home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [touched, setTouched] = useState({});
  const edited = useRef({ city: false, state: false }); // shopper typed this value themselves

  const lookup = usePincodeLookup(pincode, autofill);

  // Fill city/state from the lookup unless the shopper already typed their own value.
  useEffect(() => {
    if (lookup.status !== "found" || !lookup.info) return;
    if (!edited.current.city && lookup.info.city) setCity(lookup.info.city);
    if (!edited.current.state && lookup.info.state) setState(lookup.info.state);
  }, [lookup.status, lookup.info]);

  const pinReady = isPincode(pincode);
  const lookupSettled = !autofill || !pinReady || lookup.status === "found" || lookup.status === "notfound";
  const needsDetails = pinReady && lookupSettled && (!city.trim() || !state.trim());
  const detailsVisible = !minimal || moreOpen || needsDetails;

  const phoneOk = /^[6-9]\d{9}$/.test(phone);
  const streetOk = street.trim().length >= 3;
  const complete = phoneOk && pinReady && streetOk && !!city.trim() && !!state.trim();

  // Debounced hand-off so the parent (and its price quote) is not re-run on every keystroke.
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!complete) return cb.current(null);
      cb.current({
        label,
        name: name.trim() || user?.userName || "Customer",
        phoneNumber: phone,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode,
        country: "India",
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [complete, label, name, phone, street, city, state, pincode, user?.userName]);

  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }));
  const phoneBad = touched.phone && !phoneOk;
  const pinBad = touched.pincode && !pinReady;
  const streetBad = touched.street && !streetOk;

  return (
    <div className="space-y-4 mb-4">
      <div>
        <label htmlFor="fc-phone" className="block text-sm font-medium text-brand-text mb-1">Mobile number *</label>
        <input
          id="fc-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          onBlur={() => touch("phone")}
          aria-invalid={phoneBad ? "true" : undefined}
          className={inputCls(phoneBad)}
          placeholder="10 digit mobile number"
        />
        {phoneBad && <p role="alert" className="text-xs text-red-600 mt-1">Enter a valid 10-digit mobile number</p>}
      </div>

      <div>
        <label htmlFor="fc-pincode" className="block text-sm font-medium text-brand-text mb-1">Pincode *</label>
        <input
          id="fc-pincode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            // a previous autofill must not linger for a different pincode (typed values are kept)
            if (!edited.current.city) setCity("");
            if (!edited.current.state) setState("");
          }}
          onBlur={() => touch("pincode")}
          aria-invalid={pinBad ? "true" : undefined}
          className={inputCls(pinBad)}
          placeholder="6 digit pincode"
        />
        {pinBad && <p role="alert" className="text-xs text-red-600 mt-1">Enter a valid 6-digit pincode</p>}
        <div aria-live="polite" className="min-h-[1rem]">
          {autofill && lookup.status === "loading" && <p className="text-xs text-gray-500 mt-1">Checking pincode...</p>}
          {autofill && lookup.status === "found" && (city || state) && (
            <p className="text-xs text-green-700 mt-1">Delivering to {[city, state].filter(Boolean).join(", ")}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="fc-street" className="block text-sm font-medium text-brand-text mb-1">House no., street, area *</label>
        <input
          id="fc-street"
          type="text"
          autoComplete="street-address"
          maxLength={300}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          onBlur={() => touch("street")}
          aria-invalid={streetBad ? "true" : undefined}
          className={inputCls(streetBad)}
          placeholder="Flat / house no., street, landmark"
        />
        {streetBad && <p role="alert" className="text-xs text-red-600 mt-1">Please enter your street address</p>}
      </div>

      {minimal && !detailsVisible && (
        <button type="button" onClick={() => setMoreOpen(true)} className="text-sm font-semibold text-primary-600 underline">
          + Add more details (name, city, state)
        </button>
      )}

      {detailsVisible && (
        <div className="space-y-4">
          <div>
            <label htmlFor="fc-name" className="block text-sm font-medium text-brand-text mb-1">Full name</label>
            <input
              id="fc-name"
              type="text"
              autoComplete="name"
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls(false)}
              placeholder={user?.userName ? `${user.userName} (default)` : "Name for delivery"}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fc-city" className="block text-sm font-medium text-brand-text mb-1">City / area *</label>
              <input
                id="fc-city"
                type="text"
                autoComplete="address-level2"
                maxLength={100}
                value={city}
                onChange={(e) => { edited.current.city = e.target.value !== ""; setCity(e.target.value); }}
                className={inputCls(needsDetails && !city.trim())}
              />
            </div>
            <div>
              <label htmlFor="fc-state" className="block text-sm font-medium text-brand-text mb-1">State *</label>
              <input
                id="fc-state"
                type="text"
                autoComplete="address-level1"
                maxLength={100}
                value={state}
                onChange={(e) => { edited.current.state = e.target.value !== ""; setState(e.target.value); }}
                className={inputCls(needsDetails && !state.trim())}
              />
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-brand-text mb-1">Address type</span>
            <div className="flex gap-4">
              {["Home", "Work", "Other"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="fc-label" checked={label === t} onChange={() => setLabel(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {saveable && (
        <label className="flex items-center gap-2 text-sm text-brand-text cursor-pointer">
          <input type="checkbox" checked={!!saveChecked} onChange={(e) => onSaveChange(e.target.checked)} className="text-primary-500" />
          Save this address for next time
        </label>
      )}
    </div>
  );
}
