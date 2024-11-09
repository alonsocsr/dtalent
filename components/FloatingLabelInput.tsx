import React, { useState } from "react";
import clsx from "clsx";

interface FloatingLabelInputProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  hasError?: boolean;
  errorMessage?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  type,
  id,
  value,
  onChange,
  placeholder,
  hasError = false,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(
          "w-full px-4 py-2 bg-black text-white rounded-lg border transition-all duration-300",
          isFocused ? "border-blue-700" : "border-gray-500",
          hasError && "border-red-500"
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={clsx(
          "absolute left-3 top-2 px-1 text-gray-400 transition-all duration-300",
          "pointer-events-none transform",
          (isFocused || value) ? "text-xs -translate-y-4 bg-black text-blue-700" : "text-sm text-gray-400"
        )}
      >
        {placeholder}
      </label>
      {hasError && (
        <p className="text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
