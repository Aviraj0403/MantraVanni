import React, { useRef } from "react";

const OtpInput = ({ length = 6, value, onChange }) => {
  const inputsRef = useRef([]);

const handleChange = (e, index) => {
  const digit = e.target.value.replace(/[^0-9]/g, "").slice(-1);
  const newValue = value.split("");

  newValue[index] = digit || "";
  onChange(newValue.join(""));

  if (digit && index < length - 1) {
    inputsRef.current[index + 1]?.focus();
  }
};


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length < length) return;
    e.preventDefault();

    onChange(pasted.slice(0, length));
    inputsRef.current[length - 1]?.focus();
  };

  return (
    <div className="flex gap-2 mt-4 justify-center flex-nowrap overflow-hidden">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          maxLength="1"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`OTP digit ${i + 1} of ${length}`}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="
            w-9 h-9 sm:w-11 sm:h-11 
            text-center text-lg sm:text-xl 
            font-bold border rounded-lg
            focus:ring-2 focus:ring-primary-400
          "
        />
      ))}
    </div>
  );
};

export default OtpInput;
